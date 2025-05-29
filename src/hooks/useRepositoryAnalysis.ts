import { useState, useRef } from "react";
/* Store */
import useStore from "@/store/useStore";
/* Utils */
import { KeepAliveManager } from "@/utils/keep-alive-manager.utils";
import { generateVisualizationData } from "@/utils/visualization-generator.utils";
/* Services */
import { getFileStructure, getRepositoryInfo } from "@/services/github.service";

export interface UseRepositoryAnalysisReturn {
  isAnalyzing     : boolean;
  analysisProgress: string;
  performAnalysis : (repoUrl: string) => Promise<void>;
  startKeepAlive  : () => Promise<void>;
  stopKeepAlive   : () => Promise<void>;
}

export const useRepositoryAnalysis = (): UseRepositoryAnalysisReturn => {
  const [isAnalyzing, setIsAnalyzing]           = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState("");

  const keepAliveManagerRef        = useRef<KeepAliveManager | null>(null);
  const analysisAbortControllerRef = useRef<AbortController | null>(null);

  const setError              = useStore((state) => state.setError);
  const setRepository         = useStore((state) => state.setRepository);
  const setFileStructure      = useStore((state) => state.setFileStructure);
  const setVisualizationData  = useStore((state) => state.setVisualizationData);
  const setIsOpenModal        = useStore((state) => state.setIsOpenModal);
  const visualizationSettings = useStore((state) => state.visualizationSettings);

  if (!keepAliveManagerRef.current) {
    keepAliveManagerRef.current = new KeepAliveManager();
  }

  const startKeepAlive = async (): Promise<void> => {
    if (keepAliveManagerRef.current) {
      await keepAliveManagerRef.current.start();
    }
  };

  const stopKeepAlive = async (): Promise<void> => {
    if (keepAliveManagerRef.current) {
      await keepAliveManagerRef.current.stop();
    }
  };

  const performAnalysis = async (repoUrl: string): Promise<void> => {
    const abortController = new AbortController();
    analysisAbortControllerRef.current = abortController;

    try {
      setIsAnalyzing(true);
      setError(null);

      setAnalysisProgress("🔍 Obteniendo información del repositorio...");

      const repositoryPromise = getRepositoryInfo(repoUrl);
      const repository = (await Promise.race([
        repositoryPromise,
        new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error("Timeout al obtener información del repositorio")
              ),
            30000
          )
        ),
      ])) as any;

      if (abortController.signal.aborted) return;
      setRepository(repository);

      setAnalysisProgress("📁 Analizando estructura de archivos...");

      const fileStructurePromise = getFileStructure(repository);
      const fileStructure = (await Promise.race([
        fileStructurePromise,
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Timeout al analizar estructura")),
            45000
          )
        ),
      ])) as any;

      if (abortController.signal.aborted) return;
      setFileStructure(fileStructure);

      setAnalysisProgress("🎨 Generando visualización...");

      const visualizationData = generateVisualizationData(
        fileStructure,
        visualizationSettings
      );

      if (abortController.signal.aborted) return;
      setVisualizationData(visualizationData);

      setAnalysisProgress("✅ ¡Análisis completado!");

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (abortController.signal.aborted) return;
      setIsOpenModal(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ha ocurrido un error al analizar el repositorio");
      }
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress("");
      analysisAbortControllerRef.current = null;
    }
  };

  return {
    isAnalyzing,
    analysisProgress,
    performAnalysis,
    startKeepAlive,
    stopKeepAlive,
  };
};
