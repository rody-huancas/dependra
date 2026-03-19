import { useCallback, useRef, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls as ReactFlowControls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  NodeTypes,
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
import FlowOptionsPanel from '@/components/Controls';
import RepositoryNetworkView from '@/components/RepositoryNetworkView';
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
  const fileStructure = useStore((state) => state.fileStructure);
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
  const [viewMode, setViewMode] = useState<'flow' | 'network'>('flow');

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

  const openFilePreview = useCallback(
    async ({
      nodeId,
      label,
      path,
      language,
      content,
      encoding,
      mimeType,
    }: {
      nodeId?: string;
      label : string;
      path ?: string;
      language?: string;
      content ?: string;
      encoding?: "text" | "base64";
      mimeType?: string;
    }) => {
      if (!path) {
        toast.error('No se encontró la ruta del archivo seleccionado');
        return;
      }

      if (content) {
        setSelectedFile({
          name    : label,
          content,
          language: language || 'plaintext',
          encoding,
          mimeType,
        });
        return;
      }

      if (!repository) {
        toast.error('No se pudo obtener información del repositorio actual');
        setError('No se pudo obtener información del repositorio actual');
        return;
      }

      const loadingId = nodeId ?? path;
      setLoadingNodeId(loadingId);

      try {
        const payload = await getRepositoryFileContent({
          owner : repository.owner,
          repo  : repository.name,
          branch: repository.defaultBranch,
          path,
        });

        if (nodeId) {
          updateNodeContent(
            nodeId,
            payload.content,
            payload.dependencies,
            payload.encoding,
            payload.mimeType,
          );
        }

        setSelectedFile({
          name    : label,
          content : payload.content,
          language: language || 'plaintext',
          encoding: payload.encoding,
          mimeType: payload.mimeType,
        });
      } catch (error) {
        toast.error('No se pudo cargar el archivo seleccionado');
        setError('No se pudo cargar el archivo seleccionado');
      } finally {
        setLoadingNodeId(null);
      }
    },
    [repository, setError, updateNodeContent]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (node.data.type === 'directory') {
        return;
      }
      if (!node.data.path || loadingNodeId === node.id) {
        return;
      }

      openFilePreview({
        nodeId: node.id,
        label : node.data.label,
        path  : node.data.path,
        language: node.data.language,
        content : node.data.content,
        encoding: node.data.encoding,
        mimeType: node.data.mimeType,
      });
    },
    [openFilePreview, loadingNodeId]
  );

  useEffect(() => {
    if (reactFlowInstance && nodes.length > 0) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 });
      }, 200);
    }
  }, [reactFlowInstance, nodes.length]);

  const isDarkTheme = visualizationSettings.theme === 'dark';
  const viewTabs: Array<{ id: 'flow' | 'network'; label: string }> = [
    { id: 'flow', label: 'Vista interactiva' },
    { id: 'network', label: 'Red jerárquica' },
  ];

  return (
    <div className="w-full h-full relative" ref={reactFlowWrapper}>
      <div className="absolute top-6 left-6 z-20 flex gap-2">
        {viewTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setViewMode(tab.id)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-xs font-semibold transition',
              viewMode === tab.id
                ? 'border-blue-500 bg-blue-50/90 text-blue-700 dark:bg-blue-500/20 dark:text-blue-100'
                : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-blue-300'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {viewMode === 'flow' ? (
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

            <ReactFlowControls position="bottom-right" showInteractive={false} />

            <MiniMap
              nodeStrokeWidth={3}
              zoomable
              pannable
              position="top-right"
              nodeColor={isDarkTheme ? '#e2e8f0' : '#4a5568'}
              maskColor={isDarkTheme ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'}
            />
          </ReactFlow>
        </ReactFlowProvider>
      ) : (
        <RepositoryNetworkView
          root={fileStructure}
          density={visualizationSettings.density ?? 'balanced'}
          onOpenFile={(node) =>
            openFilePreview({
              nodeId  : node.path || node.name,
              label   : node.name,
              path    : node.path,
              language: node.language,
              content : node.content,
              encoding: node.encoding,
              mimeType: node.mimeType,
            })
          }
        />
      )}

      {viewMode === 'flow' && <FlowOptionsPanel />}

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
