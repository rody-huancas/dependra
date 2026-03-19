import { ReactFlowProvider } from "reactflow";
/* Components */
import Diagram from "@/components/Diagram";
import useStore from "@/store/useStore";
/* Types */
import { VisualizationData } from "@/types";
/* Icons */
import { FaWindowClose } from "react-icons/fa";

interface Props {
  data: VisualizationData;
}

const DiagramModal = ({ data }: Props) => {
  const setIsOpenModal = useStore(state => state.setIsOpenModal);
  const repository = useStore((state) => state.repository);
  const visualizationSettings = useStore((state) => state.visualizationSettings);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[90vw] h-[90vh] flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Diagrama de Dependencias</h3>
            {repository && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {repository.owner}/{repository.name} · {repository.defaultBranch} · {data.nodes.length} nodos · {data.edges.length} conexiones · vista {visualizationSettings.layout} · espaciado {visualizationSettings.density ?? "balanced"}
              </p>
            )}
          </div>
          <button
            onClick={() => setIsOpenModal(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <FaWindowClose size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <ReactFlowProvider>
            <Diagram data={data} />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
};

export default DiagramModal; 
