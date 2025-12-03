"use client"

/* Components */
import DiagramModal from "@/components/DiagramModal";
import ErrorMessage from "@/components/ErrorMessage";
import RepositoryInput from "@/components/RepositoryInput";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
/* Store */
import useStore from "@/store/useStore";

const AnalyzeRepository = () => {
  const error             = useStore(state => state.error);
  const isLoading         = useStore(state => state.isLoading);
  const isOpenModal       = useStore(state => state.isOpenModal);
  const visualizationData = useStore(state => state.visualizationData);

  return (
    <div className="h-full">
      <Breadcrumbs items={[{ name: "Analizar Repositorio" }]} />
      
      <section className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Analizar Repositorio GitHub
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Introduce la URL de un repositorio de GitHub para visualizar su{" "}
          <strong>arquitectura de software</strong> y analizar las{" "}
          <strong>dependencias del proyecto</strong>.
        </p>
      </section>

      <RepositoryInput loadRepository={isLoading} />
              
      {error && <ErrorMessage message={error} />}

      {!isLoading && visualizationData && isOpenModal && (
        <DiagramModal data={visualizationData} />
      )}
    </div>
  );
};

export default AnalyzeRepository;
