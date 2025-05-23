import { useCallback, useRef, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  NodeTypes,
  Panel,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
/* Utils */
import { cn } from '@/utils/functions';
/* Types */
import { VisualizationData } from '@/types';
/* Store */
import useStore from '@/store/useStore';
/* Components */
import FilePreview from '@/components/FilePreview';
import FileNodeComponent from '@/components/nodes/FileNode';
import DirectoryNodeComponent from '@/components/nodes/DirectoryNode';
/* Styles */
import 'reactflow/dist/style.css';

const nodeTypes: NodeTypes = {
  file     : FileNodeComponent,
  module   : FileNodeComponent,
  service  : FileNodeComponent,
  component: FileNodeComponent,
  directory: DirectoryNodeComponent,
};

interface DiagramProps {
  data: VisualizationData;
}

const Diagram: React.FC<DiagramProps> = ({ data }) => {
  const { visualizationSettings } = useStore();
  
  const reactFlowInstance = useReactFlow();
  const reactFlowWrapper  = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(data.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data.edges);
  
  const [selectedFile, setSelectedFile] = useState<{
    name    : string;
    content : string;
    language: string;
  } | null>(null);

  useEffect(() => {
    if (data) {
      setNodes(data.nodes.map(node => ({ ...node, type: getNodeTypeFromData(node.data) })));
      setEdges(data.edges);
    }
  }, [data, setNodes, setEdges]);

  const getNodeTypeFromData = (nodeData: any): string => {
    if (nodeData.type === 'directory') return 'directory';
    if (nodeData.type === 'component') return 'component';
    if (nodeData.type === 'service')   return 'service';
    if (nodeData.type === 'module')    return 'module';
    return 'file';
  };

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.data.type !== 'directory' && node.data.content) {
      setSelectedFile({
        name    : node.data.label,
        content : node.data.content,
        language: node.data.language || 'plaintext'
      });
    }
  }, []);

  useEffect(() => {
    if (reactFlowInstance && nodes.length > 0) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 });
      }, 200);
    }
  }, [reactFlowInstance, nodes.length]);

  const isDarkTheme = visualizationSettings.theme === 'dark';

  return (
    <div className="w-full h-full relative" ref={reactFlowWrapper}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          proOptions={{ hideAttribution: true }}
          className={cn(
            isDarkTheme ? 'dark-theme' : 'light-theme',
            'transition-colors duration-300'
          )}
        >
          <Background
            variant={BackgroundVariant.Dots}
            color={isDarkTheme ? '#4a5568' : '#e2e8f0'}
            size={1}
            gap={16}
          />

          <Controls position="bottom-right" showInteractive={false} />

          <MiniMap
            nodeStrokeWidth={3}
            zoomable
            pannable
            position="top-right"
            nodeColor={isDarkTheme ? '#e2e8f0' : '#4a5568'}
            maskColor={isDarkTheme ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'}
          />

          <Panel position="top-left" className="bg-white dark:bg-gray-800 rounded-md shadow-md p-2 transition-colors duration-300">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Nodes:</span> {nodes.length} | 
              <span className="font-medium ml-2">Connections:</span> {edges.length}
            </div>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
      
      {selectedFile && (
        <FilePreview
          fileName={selectedFile.name}
          content={selectedFile.content}
          language={selectedFile.language}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
};

export default Diagram;