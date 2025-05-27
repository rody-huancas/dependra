import { Octokit } from "octokit";
import { GITHUB_TOKEN } from "@/config/env.config";
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

  const languageMap: Record<string, string> = {
    js  : "JavaScript",
    jsx : "JavaScript (React)",
    ts  : "TypeScript",
    tsx : "TypeScript (React)",
    py  : "Python",
    java: "Java",
    rb  : "Ruby",
    php : "PHP",
    go  : "Go",
    rs  : "Rust",
    c   : "C",
    cpp : "C++",
    cs  : "C#",
    html: "HTML",
    css : "CSS",
    scss: "SCSS",
    json: "JSON",
    md  : "Markdown",
    yml : "YAML",
    yaml: "YAML",
    xml : "XML",
    sql : "SQL",
    sh  : "Shell",
    bash: "Bash",
    bat : "Batch",
    ps1 : "PowerShell",
    swift: "Swift",
    kt  : "Kotlin",
    scala: "Scala",
    groovy: "Groovy",
    dart : "Dart",
    r    : "R",
    matlab: "MATLAB",
    julia: "Julia",
    lua : "Lua",
    perl: "Perl",
    pl  : "Perl",
    ex  : "Elixir",
    exs : "Elixir",
    elm : "Elm",
    clj : "Clojure",
    cljs: "ClojureScript",
    hs  : "Haskell",
    fs  : "F#",
    fsx : "F#",
    vb  : "Visual Basic",
    vbs : "VBScript",
    asm : "Assembly",
    s   : "Assembly",
    sass: "SASS",
    less: "LESS",
    vue : "Vue",
    svelte: "Svelte",
    graphql: "GraphQL",
    proto: "Protocol Buffers",
    toml : "TOML",
    ini  : "INI",
    env  : "Environment",
    lock : "Lock File",
    log  : "Log File",
    txt  : "Text",
    csv  : "CSV",
    tsv  : "TSV",
    conf : "Configuration",
    config: "Configuration",
    h    : "C Header",
    hpp  : "C++ Header",
    hxx  : "C++ Header",
    hh   : "C++ Header",
    m    : "Objective-C",
    mm   : "Objective-C++",
    pch  : "Precompiled Header",
    pdb  : "Program Database",
    lib  : "Library",
    a    : "Static Library",
    so   : "Shared Library",
    dylib: "Dynamic Library",
    dll  : "Dynamic Link Library",
    exe  : "Executable",
    bin  : "Binary",
    dat  : "Data",
    db   : "Database",
    sqlite: "SQLite",
    mdb  : "Microsoft Access",
    accdb: "Microsoft Access",
    xls  : "Excel",
    xlsx : "Excel",
    xlsm : "Excel",
    xlsb : "Excel",
    doc  : "Word",
    docx : "Word",
    ppt  : "PowerPoint",
    pptx : "PowerPoint",
    odt  : "OpenDocument Text",
    ods  : "OpenDocument Spreadsheet",
    odp  : "OpenDocument Presentation",
    rtf  : "Rich Text Format",
    epub : "EPUB",
    mobi : "Mobi",
    azw3 : "Kindle",
    fb2  : "FictionBook",
    lit  : "Microsoft Reader",
    lrf  : "Sony Reader",
    prc  : "Mobipocket",
    tcr  : "Psion",
    chm  : "Compiled HTML",
    djvu : "DjVu",
    xps  : "XML Paper Specification",
    oxps : "Open XML Paper Specification",
    ps   : "PostScript",
    eps  : "Encapsulated PostScript",
    ai   : "Adobe Illustrator",
    indd : "Adobe InDesign",
    psd  : "Adobe Photoshop",
    cdr  : "CorelDRAW",
    svg  : "Scalable Vector Graphics",
    webp : "WebP",
    ico  : "Icon",
    cur  : "Cursor",
    ani  : "Animated Cursor",
    wav  : "Waveform Audio",
    mp3  : "MP3",
    ogg  : "Ogg",
    flac : "FLAC",
    aac  : "AAC",
    wma  : "Windows Media Audio",
    mid  : "MIDI",
    midi : "MIDI",
    mp4  : "MP4",
    avi  : "AVI",
    mkv  : "Matroska",
    mov  : "QuickTime",
    wmv  : "Windows Media Video",
    flv  : "Flash Video",
    webm : "WebM",
    m4v  : "iTunes Video",
    mpg  : "MPEG",
    mpeg : "MPEG",
    vob  : "DVD Video",
    iso  : "Disc Image",
    img  : "Disc Image",
    dmg  : "Apple Disk Image",
    vhd  : "Virtual Hard Disk",
    vmdk : "VMware Virtual Disk",
    vdi  : "VirtualBox Virtual Disk",
    qcow2: "QEMU Copy On Write",
    raw  : "Raw Disk Image",
    hex  : "Hexadecimal",
    rom  : "ROM",
    bios : "BIOS",
    efi  : "EFI",
    uefi : "UEFI",
    boot : "Boot",
    sys  : "System",
    drv  : "Driver",
    inf  : "Driver Information",
    cat  : "Security Catalog",
    msi  : "Windows Installer",
    msp  : "Windows Installer Patch",
    mst  : "Windows Installer Transform",
    pkg  : "Package",
    deb  : "Debian Package",
    rpm  : "RPM Package",
    apk  : "Android Package",
    ipa  : "iOS App",
    xapk : "Android App Bundle",
    aab  : "Android App Bundle",
    appx : "Windows App Package",
    appxbundle: "Windows App Bundle",
    msix : "MSIX Package",
    msixbundle: "MSIX Bundle",
    vsix : "Visual Studio Extension",
    crx  : "Chrome Extension",
    xpi  : "Firefox Extension",
    safariextz: "Safari Extension",
    theme: "Theme",
    skin : "Skin",
    ttf  : "TrueType Font",
    otf  : "OpenType Font",
    woff : "Web Open Font Format",
    woff2: "Web Open Font Format 2",
    eot  : "Embedded OpenType",
    pfb  : "PostScript Font Binary",
    pfm  : "PostScript Font Metrics",
    afm  : "Adobe Font Metrics",
    bdf  : "Bitmap Distribution Format",
    pcf  : "Portable Compiled Font",
    psf  : "PC Screen Font",
    fon  : "Font",
    fnt  : "Font",
    ttc  : "TrueType Collection",
    otc  : "OpenType Collection",
    dfont: "Data Fork Font",
    pfa  : "PostScript Font ASCII",
    pfr  : "Portable Font Resource",
    ttx  : "TrueType XML",
    ufo  : "UFO Font",
    vfb  : "FontLab Font",
    vf  : "FontLab Font",
    gdl  : "Glyph Definition",
    gft  : "Glyph Font",
    gsf  : "Ghostscript Font",
  };

  return languageMap[ext] || "Plain Text";
}

function isBinaryFile(filename: string): boolean {
  const binaryExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "ico",
    "svg",
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "zip",
    "tar",
    "gz",
    "rar",
    "7z",
    "exe",
    "dll",
    "so",
    "dylib",
    "ttf",
    "otf",
    "woff",
    "woff2",
    "mp3",
    "mp4",
    "avi",
    "mov",
  ];

  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return binaryExtensions.includes(ext);
}
