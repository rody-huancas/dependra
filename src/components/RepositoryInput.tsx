"use client";

import { toast } from "sonner";
import { ChangeEvent, FormEvent, useState } from "react";
import { cn } from "@/utils/functions";
import { REPO_DEFAULT } from "@/config/env.config";
import useStore from "@/store/useStore";
import { useRepositoryAnalysis } from "@/hooks/useRepositoryAnalysis";
import { useVisibilityWarning } from "@/hooks/useVisibilityWarning";
import { isValidUrlInput, validateGithubUrl } from "@/utils/url-validation.utils";
import ActionButtons from "./repository/ActionButtons";
import VisibilityWarning from "./repository/VisibilityWarning";
import ProgressIndicator from "./repository/ProgressIndicator";
import RepositoryUrlInput from "./repository/RepositoryUrlInput";
import LastRepositoryButton from "./repository/LastRepositoryButton";

interface RepositoryInputProps {
  loadRepository: boolean;
}

const RepositoryInput: React.FC<RepositoryInputProps> = ({ loadRepository }) => {
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
    <div className="w-full max-w-5xl mx-auto mb-12 px-4">
      {showVisibilityWarning && (
        <div className="mb-8 animate-in slide-in-from-top-2 duration-500">
          <VisibilityWarning analysisProgress={analysisProgress} />
        </div>
      )}
      <div
        className={cn(
          "relative overflow-hidden",
          "bg-gradient-to-br from-white/95 to-gray-100/90 dark:from-gray-900/95 dark:to-gray-800/90",
          "backdrop-blur-2xl",
          "border border-gray-200/70 dark:border-white/10",
          "shadow-2xl shadow-blue-100/30 dark:shadow-black/30",
          "rounded-3xl p-8 sm:p-12",
          "transition-all duration-500 ease-out",
          "hover:shadow-2xl hover:shadow-blue-200/40 dark:hover:shadow-black/40",
          "hover:border-blue-300/80 dark:hover:border-white/20",
          "hover:scale-[1.01]"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-transparent to-purple-50/60 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10 rounded-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/40 to-transparent dark:from-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-400/40 to-transparent dark:from-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-10 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-3">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent leading-tight drop-shadow">
              Analiza tu repositorio
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Ingresa la URL de tu repositorio de <span className="font-semibold text-blue-600 dark:text-blue-400">GitHub</span> para visualizar su estructura de manera interactiva y explorar el contenido de los archivos.
            </p>
          </div>
          <div className="mb-8">
            <ProgressIndicator analysisProgress={analysisProgress} />
          </div>
          <div className="space-y-8">
            <form onSubmit={handleAnalyzeRepository} className="space-y-6">
              <div className="relative">
                <RepositoryUrlInput
                  url={url}
                  isValidUrl={isValidUrl}
                  isAnalyzing={isAnalyzing}
                  onUrlChange={handleUrlChange}
                />
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <ActionButtons
                  isAnalyzing={isAnalyzing}
                  isValidUrl={isValidUrl}
                  url={url}
                  loadRepository={loadRepository}
                  onAnalyze={handleAnalyzeRepository}
                  onDemo={handleDemoRepository}
                />
              </div>
            </form>
            {!!visualizationData && !isOpenModal && (
              <div className="pt-6 border-t border-gray-200/50 dark:border-white/10">
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 flex justify-center">
                  <LastRepositoryButton onClick={handleViewLastRepository} />
                </div>
              </div>
            )}
          </div>
          <div className="mt-10 pt-8 border-t border-gray-200/30 dark:border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center space-y-2 p-5 rounded-xl bg-gradient-to-br from-green-50/80 to-green-100/60 dark:from-green-900/20 dark:to-green-900/10 backdrop-blur-md shadow">
                <div className="w-10 h-10 bg-green-200 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-700 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-base font-semibold text-green-900 dark:text-green-200">Análisis rápido</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-5 rounded-xl bg-gradient-to-br from-blue-50/80 to-blue-100/60 dark:from-blue-900/20 dark:to-blue-900/10 backdrop-blur-md shadow">
                <div className="w-10 h-10 bg-blue-200 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-700 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-base font-semibold text-blue-900 dark:text-blue-200">Vista interactiva</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-5 rounded-xl bg-gradient-to-br from-purple-50/80 to-purple-100/60 dark:from-purple-900/20 dark:to-purple-900/10 backdrop-blur-md shadow">
                <div className="w-10 h-10 bg-purple-200 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-700 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-base font-semibold text-purple-900 dark:text-purple-200">Explorar archivos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryInput;
