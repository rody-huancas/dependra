"use client"

import { ReactFlowProvider } from "reactflow";
/* Components */
import Diagram from "@/components/Diagram";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import RepositoryInput from "@/components/RepositoryInput";
/* Store */
import useStore from "@/store/useStore";

const HomePage = () => {
  const { isLoading,  error,  visualizationData } = useStore();

  return (
    <div className="py-2">
      <RepositoryInput />
              
      {error && <ErrorMessage message={error} />}
        
      {isLoading && <LoadingSpinner />}

      {!isLoading && visualizationData && (
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300" style={{ height: 'calc(100vh - 180px)' }}>
            <ReactFlowProvider>
              <Diagram data={visualizationData} />
            </ReactFlowProvider>
          </div>
        )}
    </div>
  )
}

export default HomePage