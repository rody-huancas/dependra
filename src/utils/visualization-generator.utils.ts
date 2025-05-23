import { FileNode, VisualizationData, VisualizationSettings, NodeData } from "@/types";

export function generateVisualizationData(fileStructure: FileNode, settings: VisualizationSettings): VisualizationData {
  const nodes: VisualizationData["nodes"] = [];
  const edges: VisualizationData["edges"] = [];

  const processedNodes = new Set<string>();

  let   currentX    = 0;
  let   currentY    = 0;
  const levelHeight = 100;
  const nodeWidth   = 180;

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
    };

    let position;
    if (settings.layout === "horizontal") {
      position =  { x: level * nodeWidth, y: currentY };
      currentY += levelHeight;
    } else if (settings.layout === "vertical") {
      position =  { x: currentX, y: level * levelHeight };
      currentX += nodeWidth;
    } else {
      const angle  = (nodes.length / 10) * Math.PI * 2;
      const radius = level * 200;
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

  if (settings.layout === "horizontal" || settings.layout === "vertical") {
    nodes.forEach((node, i) => {
      if (settings.layout === "horizontal") {
        node.position.y = i * 80;
      } else {
        node.position.x = i * 180;
      }
    });
  }

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
