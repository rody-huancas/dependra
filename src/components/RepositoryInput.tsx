"use client";

import { toast } from "sonner";
import { ChangeEvent, FormEvent, useState } from "react";
import { cn } from "@/utils/functions";
import { REPO_DEFAULT } from "@/config/env.config";
// Store
import useStore from "@/store/useStore";
// Hooks
import { useRepositoryAnalysis } from "@/hooks/useRepositoryAnalysis";
import { useVisibilityWarning } from "@/hooks/useVisibilityWarning";
// Utils
import { isValidUrlInput, validateGithubUrl } from "@/utils/url-validation.utils";
// Components
import ActionButtons from "./repository/ActionButtons";
import VisibilityWarning from "./repository/VisibilityWarning";
import ProgressIndicator from "./repository/ProgressIndicator";
import RepositoryUrlInput from "./repository/RepositoryUrlInput";
import LastRepositoryButton from "./repository/LastRepositoryButton";

interface RepositoryInputProps {
  loadRepository: boolean;
}

const RepositoryInput: React.FC<RepositoryInputProps> = ({ loadRepository, }) => {
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);

  const setIsLoading      = useStore((state) => state.setIsLoading);
  const setError          = useStore((state) => state.setError);
  const setIsOpenModal    = useStore((state) => state.setIsOpenModal);
  const isOpenModal       = useStore((state) => state.isOpenModal);
  const visualizationData = useStore((state) => state.visualizationData);

  const { isAnalyzing, analysisProgress, performAnalysis, startKeepAlive, stopKeepAlive } = useRepositoryAnalysis();

  const { showVisibilityWarning } = useVisibilityWarning(isAnalyzing);

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUrl(input);
    setIsValidUrl(isValidUrlInput(input));
  };

  const handleAnalyzeRepository = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateGithubUrl(url)) {
      setIsValidUrl(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await startKeepAlive();
      await performAnalysis(url);
      
      toast.success("Repositorio analizado correctamente");
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        if (errorMessage.includes("no existe") || errorMessage.includes("no se encuentra disponible")) {
          setError("El repositorio no existe o no se encuentra disponible");
        } else if (errorMessage.includes("No tienes acceso")) {
          setError("No tienes acceso a este repositorio. Puede ser privado o requerir autenticación");
        } else {
          setError(errorMessage);
        }
      } else {
        setError("Ha ocurrido un error al analizar el repositorio");
      }
    } finally {
      setIsLoading(false);
      await stopKeepAlive();
    }
  };

  const handleDemoRepository = async () => {
    setUrl(REPO_DEFAULT);

    try {
      setIsLoading(true);
      setError(null);

      await startKeepAlive();
      await performAnalysis(REPO_DEFAULT);

      toast.success("Repositorio analizado correctamente");
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        if (errorMessage.includes("no existe") || errorMessage.includes("no se encuentra disponible")) {
          setError("El repositorio de ejemplo no existe o no se encuentra disponible");
        } else if (errorMessage.includes("No tienes acceso")) {
          setError("No tienes acceso al repositorio de ejemplo. Puede ser privado o requerir autenticación");
        } else {
          setError(errorMessage);
        }
      } else {
        setError("Ocurrió un error al analizar el repositorio de ejemplo");
      }
    } finally {
      setIsLoading(false);
      await stopKeepAlive();
    }
  };

  const handleViewLastRepository = () => {
    if (!visualizationData) return;
    setIsOpenModal(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-10">
      {showVisibilityWarning && (
        <VisibilityWarning analysisProgress={analysisProgress} />
      )}

      <div
        className={cn(
          "bg-gray-200 dark:bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(26, 25, 25, 0.123)]",
          "rounded-2xl shadow-sm p-8 transition-all duration-300"
        )}
      >
        <div className="w-full">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-7 flex items-center justify-center">
            Analiza tu repositorio
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base">
            Ingresa la URL de tu repositorio de GitHub para visualizar su
            estructura de manera interactiva y ver el contenido de los archivos.
          </p>

          <ProgressIndicator analysisProgress={analysisProgress} />

          <form onSubmit={handleAnalyzeRepository} className="space-y-4">
            <RepositoryUrlInput
              url={url}
              isValidUrl={isValidUrl}
              isAnalyzing={isAnalyzing}
              onUrlChange={handleUrlChange}
            />

            <ActionButtons
              isAnalyzing={isAnalyzing}
              isValidUrl={isValidUrl}
              url={url}
              loadRepository={loadRepository}
              onAnalyze={handleAnalyzeRepository}
              onDemo={handleDemoRepository}
            />
          </form>

          {!!visualizationData && !isOpenModal && (
            <LastRepositoryButton onClick={handleViewLastRepository} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RepositoryInput;
