import { Octokit } from "octokit";
import { GITHUB_TOKEN } from "@/config/env.config";
import { fileExtensionMap } from "@/utils/fileExtensionMap";
import { binaryExtensions } from "@/utils/binaryExtensions";
import { Repository, FileNode } from "@/types";

const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

const MAX_FILE_CONTENTS = 40;
const MAX_FILE_SIZE_BYTES = 200000;
const CONCURRENT_FILE_REQUESTS = 6;

interface RepositoryTreeEntry {
  path?: string;
  type?: "blob" | "tree";
  size?: number;
  sha?: string;
}

interface HydrationTarget {
  node: FileNode;
  path: string;
  size: number;
}

export interface FileContentPayload {
  content: string;
  dependencies?: string[];
  encoding: "text" | "base64";
  mimeType?: string;
}

interface GetRepositoryFileContentParams {
  owner : string;
  repo  : string;
  branch: string;
  path  : string;
}

export async function getRepositoryInfo(url: string): Promise<Repository> {
  try {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      throw new Error("URL del repositorio inválida");
    }

    const [, owner, name] = match;

    try {
      const { data } = await octokit.rest.repos.get({ owner, repo: name });

      return {
        name         : data.name,
        owner        : data.owner.login,
        url          : data.html_url,
        description  : data.description,
        defaultBranch: data.default_branch,
      };
    } catch (error: any) {
      if (error.status === 404) {
        throw new Error("El repositorio no existe o no se encuentra disponible");
      } else if (error.status === 403) {
        throw new Error("No tienes acceso a este repositorio. Puede ser privado o requerir autenticación");
      } else {
        throw error;
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Ocurrió un error al obtener la información del repositorio: ${error.message}`);
    }
    throw new Error("Ocurrió un error al obtener la información del repositorio");
  }
}

export async function getFileStructure(repository: Repository): Promise<FileNode> {
  try {
    const { owner, name, defaultBranch } = repository;

    const treeEntries = await fetchRepositoryTree(owner, name, defaultBranch);

    const rootNode: FileNode = {
      path    : "",
      name,
      type    : "directory",
      children: [],
    };

    const directoryMap = new Map<string, FileNode>();
    directoryMap.set("", rootNode);

    const hydrationCandidates: HydrationTarget[] = [];

    const directories = treeEntries
      .filter((entry) => entry.type === "tree" && entry.path)
      .sort((a, b) => (a.path!.split("/").length - b.path!.split("/").length));

    directories.forEach((dirEntry) => {
      ensureDirectoryNode(dirEntry.path!, directoryMap);
    });

    treeEntries
      .filter((entry) => entry.type === "blob" && entry.path)
      .forEach((fileEntry) => {
        const filePath = fileEntry.path!;
        const fileName = filePath.split("/").pop() || filePath;
        const parentPath = getParentPath(filePath);
        const parentNode = ensureDirectoryNode(parentPath, directoryMap);
        const isBinary = isBinaryFile(fileName);
        const mimeType = getMimeTypeFromFilename(fileName);

        const fileNode: FileNode = {
          path    : filePath,
          name    : fileName,
          type    : "file",
          size    : fileEntry.size,
          language: getLanguageFromFilename(fileName),
          isBinary,
          mimeType,
        };

        parentNode.children = parentNode.children || [];
        parentNode.children.push(fileNode);

        hydrationCandidates.push({
          node: fileNode,
          path: filePath,
          size: fileEntry.size || 0,
        });
      });

    const hydrationTargets = rankHydrationTargets(hydrationCandidates);
    await hydrateFileContents(owner, name, defaultBranch, hydrationTargets);

    return rootNode;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Ocurrió un error al obtener la estructura del repositorio: ${error.message}`);
    }
    throw new Error("Ocurrió un error al obtener la estructura del repositorio");
  }
}

export async function getRepositoryFileContent({
  owner,
  repo,
  branch,
  path,
}: GetRepositoryFileContentParams): Promise<FileContentPayload> {
  return downloadFileContent(owner, repo, branch, path);
}

async function fetchRepositoryTree(owner: string, repo: string, branch: string): Promise<RepositoryTreeEntry[]> {
  const { data } = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha : branch,
    recursive: "true",
  });

  return data.tree as RepositoryTreeEntry[];
}

function ensureDirectoryNode(path: string, directoryMap: Map<string, FileNode>): FileNode {
  if (path === "") {
    return directoryMap.get("")!;
  }

  if (directoryMap.has(path)) {
    return directoryMap.get(path)!;
  }

  const segments = path.split("/");
  let currentPath = "";
  let parentNode = directoryMap.get("")!;

  segments.forEach((segment) => {
    currentPath = currentPath ? `${currentPath}/${segment}` : segment;

    let node = directoryMap.get(currentPath);
    if (!node) {
      node = {
        path    : currentPath,
        name    : segment,
        type    : "directory",
        children: [],
      };

      parentNode.children = parentNode.children || [];
      parentNode.children.push(node);
      directoryMap.set(currentPath, node);
    }
    parentNode = node;
  });

  return directoryMap.get(path)!;
}

function getParentPath(path: string): string {
  const lastSlash = path.lastIndexOf("/");
  if (lastSlash === -1) {
    return "";
  }
  return path.slice(0, lastSlash);
}

function rankHydrationTargets(candidates: HydrationTarget[]): HydrationTarget[] {
  if (!candidates.length) {
    return [];
  }

  const prioritized = candidates.filter((candidate) =>
    candidate.node.name.toLowerCase() === "package.json"
  );

  const rest = candidates
    .filter((candidate) => candidate.node.name.toLowerCase() !== "package.json")
    .sort((a, b) => a.size - b.size);

  const filtered = [...prioritized, ...rest].filter((candidate) =>
    shouldHydrateFile(candidate)
  );

  return filtered.slice(0, MAX_FILE_CONTENTS);
}

function shouldHydrateFile(target: HydrationTarget): boolean {
  const isBinary = target.node.isBinary ?? isBinaryFile(target.node.name);
  return (
    !isBinary &&
    (target.size === 0 || target.size <= MAX_FILE_SIZE_BYTES)
  );
}

async function hydrateFileContents(
  owner: string,
  repo: string,
  branch: string,
  targets: HydrationTarget[]
): Promise<void> {
  if (!targets.length) {
    return;
  }

  let index = 0;
  const worker = async () => {
    while (index < targets.length) {
      const currentIndex = index++;
      const target = targets[currentIndex];
      await hydrateFileNode(owner, repo, branch, target.node);
    }
  };

  const workers = Array.from(
    { length: Math.min(CONCURRENT_FILE_REQUESTS, targets.length) },
    () => worker()
  );

  await Promise.all(workers);
}

async function hydrateFileNode(
  owner: string,
  repo: string,
  branch: string,
  fileNode: FileNode
): Promise<void> {
  try {
    const payload = await downloadFileContent(owner, repo, branch, fileNode.path);
    fileNode.content = payload.content;
    if (payload.dependencies) {
      fileNode.dependencies = payload.dependencies;
    }
    fileNode.encoding = payload.encoding;
    fileNode.mimeType = payload.mimeType ?? fileNode.mimeType;
  } catch (error) {
    console.error(`Ocurrió un error al obtener el contenido del archivo ${fileNode.path}:`, error);
  }
}

async function downloadFileContent(
  owner: string,
  repo: string,
  branch: string,
  path: string
): Promise<FileContentPayload> {
  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
    ref: branch,
  });

  if ("content" in data && "encoding" in data) {
    if (data.encoding === "base64" && data.content) {
      const normalizedContent = data.content.replace(/\n/g, "");
      const isBinary = isBinaryFile(path);
      const mimeType = getMimeTypeFromFilename(path);

      if (isBinary) {
        return {
          content : normalizedContent,
          encoding: "base64",
          mimeType,
        };
      }

      const decodedContent = atob(normalizedContent);
      const payload: FileContentPayload = {
        content : decodedContent,
        encoding: "text",
        mimeType,
      };

      if (path.endsWith("package.json")) {
        try {
          const packageJson = JSON.parse(decodedContent);
          payload.dependencies = [
            ...Object.keys(packageJson.dependencies || {}),
            ...Object.keys(packageJson.devDependencies || {}),
          ];
        } catch (error) {
          console.error("Ocurrió un error al analizar el archivo package.json:", error);
        }
      }

      return payload;
    }
  }

  throw new Error(`El archivo ${path} no contiene datos descargables`);
}

function getLanguageFromFilename(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return fileExtensionMap[ext] || "Plain Text";
}

function isBinaryFile(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return binaryExtensions.includes(ext);
}

function getMimeTypeFromFilename(filename: string): string | undefined {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const mimeTypeMap: Record<string, string> = {
    jpg  : "image/jpeg",
    jpeg : "image/jpeg",
    png  : "image/png",
    gif  : "image/gif",
    bmp  : "image/bmp",
    svg  : "image/svg+xml",
    ico  : "image/x-icon",
    webp : "image/webp",
    avif : "image/avif",
    pdf  : "application/pdf",
    mp3  : "audio/mpeg",
    mp4  : "video/mp4",
    mov  : "video/quicktime",
    txt  : "text/plain",
    md   : "text/markdown",
    json : "application/json",
    css  : "text/css",
    js   : "text/javascript",
    ts   : "text/typescript",
    tsx  : "text/typescript",
    jsx  : "text/javascript",
    html : "text/html",
  };

  return mimeTypeMap[ext];
}
