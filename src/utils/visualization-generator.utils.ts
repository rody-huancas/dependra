import { FileNode, VisualizationData, VisualizationSettings, NodeData } from "@/types";

export function generateVisualizationData(fileStructure: FileNode, settings: VisualizationSettings): VisualizationData {
  const nodes: VisualizationData["nodes"] = [];
  const edges: VisualizationData["edges"] = [];

  const processedNodes = new Set<string>();

  const densityPreset = {
    compact : { levelHeight: 70,  nodeWidth: 140, radialGap: 140, stackGap: 60 },
    balanced: { levelHeight: 100, nodeWidth: 180, radialGap: 200, stackGap: 80 },
    spacious: { levelHeight: 150, nodeWidth: 240, radialGap: 260, stackGap: 110 },
  } as const;

  const activeDensity = settings.density ?? "balanced";
  const { levelHeight, nodeWidth, radialGap, stackGap } = densityPreset[activeDensity];

  const levelOffsets: Record<number, number> = {};

  function processNode(
    node    : FileNode,
    level   : number,
    parentId: string | null = null
  ): string {
    if (
      node.type === "file" &&
      settings.hideNodeTypes.includes(getNodeTypeFromFilename(node.name))
    ) {
      return "";
    }

    const nodeId = node.path || node.name;

    if (processedNodes.has(nodeId) && settings.groupByFolder) {
      if (parentId) {
        const edgeId = `${parentId}-${nodeId}`;
        edges.push({
          id    : edgeId,
          source: parentId,
          target: nodeId,
          type  : "default",
        });
      }
      return nodeId;
    }

    processedNodes.add(nodeId);

    let nodeType = node.type === "directory" ? "directory" : "file";
    if (node.type === "file") {
      nodeType = getNodeTypeFromFilename(node.name);
    }

    const nodeData: NodeData = {
      label       : node.name,
      type        : node.type,
      path        : node.path,
      language    : node.language,
      dependencies: node.dependencies,
      content     : node.content,
      encoding    : node.encoding,
      mimeType    : node.mimeType,
    };

    let position;
    if (settings.layout === "horizontal") {
      const offset = levelOffsets[level] ?? 0;
      position = { x: level * nodeWidth, y: offset * stackGap };
      levelOffsets[level] = offset + 1;
    } else if (settings.layout === "vertical") {
      const offset = levelOffsets[level] ?? 0;
      position = { x: offset * stackGap, y: level * levelHeight };
      levelOffsets[level] = offset + 1;
    } else {
      const angle  = (nodes.length / 10) * Math.PI * 2;
      const radius = level * radialGap;
      position = {
        x: Math.cos(angle) * radius + 500,
        y: Math.sin(angle) * radius + 500,
      };
    }

    nodes.push({
      id  : nodeId,
      type: nodeType === "directory" ? "directory": nodeType,
      position,
      data: nodeData,
    });

    if (parentId) {
      const edgeId = `${parentId}-${nodeId}`;
      edges.push({
        id    : edgeId,
        source: parentId,
        target: nodeId,
        type  : "default",
      });
    }

    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        processNode(child, level + 1, nodeId);
      });
    }

    if (
      settings.showDependencies &&
      node.dependencies &&
      node.dependencies.length > 0
    ) {
      node.dependencies.forEach((dep) => {
        const depEdgeId = `${nodeId}-dep-${dep}`;
        edges.push({
          id    : depEdgeId,
          source: nodeId,
          target: dep,
          type  : "dependency",
          data  : {
            type : "import",
            label: "imports",
          },
        });
      });
    }

    return nodeId;
  }

  processNode(fileStructure, 0);

  return { nodes, edges };
}

function getNodeTypeFromFilename(filename: string): "component" | "service" | "module" | "file" {
  const ext = filename.split(".").pop()?.toLowerCase() || "";

  if (["jsx", "tsx", "vue", "svelte"].includes(ext)) {
    return "component";
  }

  if (filename.includes("service") || filename.includes("provider")) {
    return "service";
  }

  if (
    filename.includes("module") ||
    filename === "package.json" ||
    filename === "composer.json"
  ) {
    return "module";
  }

  return "file";
}
