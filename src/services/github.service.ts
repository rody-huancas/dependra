import { Octokit } from "octokit";
import { GITHUB_TOKEN } from "@/config/env.config";
import { fileExtensionMap } from "@/utils/fileExtensionMap";
import { binaryExtensions } from "@/utils/binaryExtensions";
import { Repository, FileNode } from "@/types";

const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

export async function getRepositoryInfo(url: string): Promise<Repository> {
  try {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      throw new Error("URL del repositorio inválida");
    }

    const [, owner, name] = match;

    const { data } = await octokit.rest.repos.get({ owner, repo: name });

    return {
      name         : data.name,
      owner        : data.owner.login,
      url          : data.html_url,
      description  : data.description,
      defaultBranch: data.default_branch,
    };
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

    const rootNode: FileNode = {
      path    : "",
      name    : name,
      type    : "directory",
      children: [],
    };

    await getDirectoryContents(owner, name, "", defaultBranch, rootNode);

    return rootNode;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Ocurrió un error al obtener la estructura del repositorio: ${error.message}`);
    }
    throw new Error("Ocurrió un error al obtener la estructura del repositorio");
  }
}

async function getDirectoryContents(
  owner     : string,
  repo      : string,
  path      : string,
  branch    : string,
  parentNode: FileNode
): Promise<void> {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    const contents = Array.isArray(data) ? data : [data];

    for (const item of contents) {
      const nodePath = item.path;
      const nodeName = item.name;

      if (item.type === "dir") {
        const dirNode: FileNode = {
          path    : nodePath,
          name    : nodeName,
          type    : "directory",
          children: [],
        };

        parentNode.children = parentNode.children || [];
        parentNode.children.push(dirNode);

        await getDirectoryContents(owner, repo, nodePath, branch, dirNode);
      } else if (item.type === "file") {
        const fileNode: FileNode = {
          path    : nodePath,
          name    : nodeName,
          type    : "file",
          size    : item.size,
          language: getLanguageFromFilename(nodeName),
        };

        if (!isBinaryFile(nodeName) && item.size < 500000) {
          await getFileContent(owner, repo, nodePath, branch, fileNode);
        }

        parentNode.children = parentNode.children || [];
        parentNode.children.push(fileNode);
      }
    }
  } catch (error) {
    console.error(`Ocurrió un error al obtener el contenido del repositorio ${path}:`, error);
  }
}

async function getFileContent(
  owner   : string,
  repo    : string,
  path    : string,
  branch  : string,
  fileNode: FileNode
): Promise<void> {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    if ("content" in data && "encoding" in data) {
      if (data.encoding === "base64" && data.content) {
        fileNode.content = atob(data.content.replace(/\n/g, ""));

        if (path.endsWith("package.json")) {
          try {
            const packageJson = JSON.parse(fileNode.content);
            fileNode.dependencies = [
              ...Object.keys(packageJson.dependencies || {}),
              ...Object.keys(packageJson.devDependencies || {}),
            ];
          } catch (e) {
            console.error("Ocurrió un error al analizar el archivo package.json:", e);
          }
        }
      }
    }
  } catch (error) {
    console.error(`Ocurrió un error al obtener el contenido del archivo ${path}:`, error);
  }
}

function getLanguageFromFilename(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return fileExtensionMap[ext] || "Plain Text";
}

function isBinaryFile(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return binaryExtensions.includes(ext);
}
