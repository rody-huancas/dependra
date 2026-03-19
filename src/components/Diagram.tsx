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
import { toast } from 'sonner';
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
/* Services */
import { getRepositoryFileContent } from '@/services/github.service';
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
  const visualizationSettings = useStore((state) => state.visualizationSettings);
  const repository = useStore((state) => state.repository);
  const setError = useStore((state) => state.setError);
  
  const reactFlowInstance = useReactFlow();
  const reactFlowWrapper  = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(data.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data.edges);
  
  const [selectedFile, setSelectedFile] = useState<{
    name    : string;
    content : string;
    language: string;
    encoding?: "text" | "base64";
    mimeType?: string;
  } | null>(null);
  const [loadingNodeId, setLoadingNodeId] = useState<string | null>(null);

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

  const updateNodeContent = useCallback(
    (
      nodeId: string,
      content: string,
      dependencies?: string[] ,
      encoding?: "text" | "base64",
      mimeType?: string,
    ) => {
      setNodes((currentNodes) =>
        currentNodes.map((currentNode) =>
          currentNode.id === nodeId
            ? {
                ...currentNode,
                data: {
                  ...currentNode.data,
                  content,
                  dependencies: dependencies ?? currentNode.data.dependencies,
                  encoding: encoding ?? currentNode.data.encoding,
                  mimeType : mimeType ?? currentNode.data.mimeType,
                },
              }
            : currentNode
        )
      );
    },
    [setNodes]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (node.data.type === 'directory') {
        return;
      }

      if (node.data.content) {
        setSelectedFile({
          name    : node.data.label,
          content : node.data.content,
          language: node.data.language || 'plaintext',
          encoding: node.data.encoding,
          mimeType: node.data.mimeType,
        });
        return;
      }

      if (!repository) {
        toast.error('No se pudo obtener información del repositorio actual');
        setError('No se pudo obtener información del repositorio actual');
        return;
      }

      if (!node.data.path || loadingNodeId === node.id) {
        return;
      }

      setLoadingNodeId(node.id);

      (async () => {
        try {
          const payload = await getRepositoryFileContent({
            owner : repository.owner,
            repo  : repository.name,
            branch: repository.defaultBranch,
            path  : node.data.path as string,
          });

          updateNodeContent(
            node.id,
            payload.content,
            payload.dependencies,
            payload.encoding,
            payload.mimeType,
          );

          setSelectedFile({
            name    : node.data.label,
            content : payload.content,
            language: node.data.language || 'plaintext',
            encoding: payload.encoding,
            mimeType: payload.mimeType,
          });
        } catch (error) {
          toast.error('No se pudo cargar el archivo seleccionado');
          setError('No se pudo cargar el archivo seleccionado');
        } finally {
          setLoadingNodeId(null);
        }
      })();
    },
    [repository, setError, updateNodeContent, loadingNodeId, setSelectedFile]
  );

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
              <span className="font-medium">Nodos:</span> {nodes.length} | 
              <span className="font-medium ml-2">Conexiones:</span> {edges.length}
            </div>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>

      {loadingNodeId && (
        <div className="absolute bottom-4 left-4 z-10 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Cargando archivo...
        </div>
      )}

      {selectedFile && (
        <FilePreview
          fileName={selectedFile.name}
          content={selectedFile.content}
          language={selectedFile.language}
          encoding={selectedFile.encoding}
          mimeType={selectedFile.mimeType}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
};

export default Diagram;
