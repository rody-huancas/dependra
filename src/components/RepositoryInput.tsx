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
    <section className="relative w-full px-4 py-12 lg:py-4 overflow-visible">
      {showVisibilityWarning && (
        <div className="relative z-10 mb-8 animate-in slide-in-from-top-2 duration-500">
          <VisibilityWarning analysisProgress={analysisProgress} />
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto">
        <div
          className={cn(
            "relative overflow-hidden rounded-[28px]",
            "p-6 sm:p-8",
          )}
        >
          <div className="relative z-10 space-y-8">
            <div className="space-y-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500 dark:text-blue-300">
                Paso único
              </p>
              <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight text-gray-900 dark:text-white">
                Pega la URL del repositorio
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Dependrá valida la dirección, mantiene vivo el análisis y abre
                el diagrama automáticamente.
              </p>
            </div>

            <ProgressIndicator analysisProgress={analysisProgress} />

            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Validación instantánea",
                "Keep-alive activo",
                "Último análisis listo",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-gray-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200"
                >
                  {item}
                </span>
              ))}
            </div>

            <form onSubmit={handleAnalyzeRepository} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                  URL de GitHub
                </label>
                <RepositoryUrlInput
                  url={url}
                  isValidUrl={isValidUrl}
                  isAnalyzing={isAnalyzing}
                  onUrlChange={handleUrlChange}
                />
                {!isValidUrl && (
                  <p className="text-sm text-rose-500">
                    Ejemplo: https://github.com/organización/proyecto
                  </p>
                )}
              </div>

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
              <div className="pt-4 border-t border-white/30 dark:border-white/10">
                <LastRepositoryButton onClick={handleViewLastRepository} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RepositoryInput;
