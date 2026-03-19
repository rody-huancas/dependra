"use client";

import { useEffect, useMemo, useRef } from "react";
import cytoscape from "cytoscape";
import type { FileNode } from "@/types";

interface RepositoryNetworkViewProps {
  root: FileNode | null;
  density: "compact" | "balanced" | "spacious";
  onOpenFile: (node: FileNode) => void;
}

const spacingFactorMap: Record<"compact" | "balanced" | "spacious", number> = {
  compact : 0.8,
  balanced: 1,
  spacious: 1.25,
};

const RepositoryNetworkView = ({ root, density, onOpenFile }: RepositoryNetworkViewProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const elements = useMemo(() => {
    if (!root) return [];

    const result: cytoscape.ElementDefinition[] = [];

    const traverse = (node: FileNode, parentId?: string) => {
      const nodeId = node.path || `${parentId ?? "root"}-${node.name}`;

      result.push({
        data: {
          id     : nodeId,
          label  : node.name,
          type   : node.type,
          fileNode: node,
        },
      });

      if (parentId) {
        result.push({
          data: {
            id    : `${parentId}-${nodeId}`,
            source: parentId,
            target: nodeId,
          },
        });
      }

      node.children?.forEach((child) => traverse(child, nodeId));
    };

    traverse(root);
    return result;
  }, [root]);

  useEffect(() => {
    if (!containerRef.current || !elements.length) {
      return;
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style    : [
        {
          selector: 'node',
          style: {
            'background-color': '#1d4ed8',
            'label'           : 'data(label)',
            'font-size'       : '10px',
            'text-valign'     : 'center',
            'text-halign'     : 'center',
            color             : '#f8fafc',
            'text-wrap'       : 'ellipsis',
            'text-max-width'  : '120px',
            width             : '24px',
            height            : '24px',
          },
        },
        {
          selector: 'node[type = "directory"]',
          style: {
            'background-color': '#f59e0b',
            'text-valign'     : 'bottom',
            'text-margin-y'   : 6,
            width             : '28px',
            height            : '28px',
          },
        },
        {
          selector: 'edge',
          style: {
            width          : 1.8,
            'line-color'   : '#94a3b8',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#94a3b8',
            'curve-style'  : 'bezier',
          },
        },
      ],
      layout: {
        name          : 'breadthfirst',
        directed      : true,
        spacingFactor : spacingFactorMap[density] ?? 1,
        padding       : 30,
        animate       : false,
      },
      wheelSensitivity: 0.2,
      minZoom         : 0.2,
      maxZoom         : 2.5,
    });

    const handleTap = (event: cytoscape.EventObject) => {
      const data = event.target.data();
      if (data?.fileNode && data.type === 'file') {
        onOpenFile(data.fileNode as FileNode);
      }
    };

    cy.on('tap', 'node', handleTap);

    return () => {
      cy.removeListener('tap', undefined, handleTap);
      cy.destroy();
    };
  }, [density, elements, onOpenFile]);

  if (!root || !elements.length) {
    return (
      <div className="h-full w-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        No hay información disponible para mostrar.
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full bg-white dark:bg-slate-950" />;
};

export default RepositoryNetworkView;
