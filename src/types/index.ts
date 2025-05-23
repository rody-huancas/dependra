export interface Repository {
  name         : string;
  owner        : string;
  url          : string;
  description  : string | null;
  defaultBranch: string;
}

export interface FileNode {
  path         : string;
  name         : string;
  type         : "file" | "directory";
  size        ?: number;
  content     ?: string;
  children    ?: FileNode[];
  dependencies?: string[];
  language    ?: string;
}

export interface NodeData {
  label        : string;
  type         : "file" | "directory" | "module" | "component" | "service";
  path         : string;
  language    ?: string;
  dependencies?: string[];
}

export interface EdgeData {
  label?: string;
  type  : "import" | "export" | "uses" | "implements" | "extends";
}

export interface VisualizationSettings {
  layout          : "horizontal" | "vertical" | "radial";
  theme           : "light" | "dark";
  showDependencies: boolean;
  groupByFolder   : boolean;
  hideNodeTypes   : string[];
}

export interface VisualizationData {
  nodes: Array<{
    id       : string;
    type    ?: string;
    position : { x: number; y: number };
    data     : NodeData;
  }>;
  edges: Array<{
    id     : string;
    source : string;
    target : string;
    type  ?: string;
    data  ?: EdgeData;
  }>;
}
