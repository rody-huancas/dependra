"use client";

import { ChangeEvent, FormEvent, useState } from "react";
/* Store */
import useStore from "@/store/useStore";
/* Services */
import { getFileStructure, getRepositoryInfo } from "@/services/github.service";
/* Utils */
import { cn } from "@/utils/functions";
import { generateVisualizationData } from "@/utils/visualization-generator.utils";
/* Config */
import { REPO_DEFAULT } from "@/config/env.config";
import { REGEX_GITHUB_URL } from "@/config/constants";
/* Icons */
import { FaGithub } from "react-icons/fa";
import { BsDatabase, BsSearch } from "react-icons/bs";

const RepositoryInput = () => {
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const {
    setRepository, setIsLoading, setError, setFileStructure, setVisualizationData, visualizationSettings
  } = useStore();

  const validateUrl = (input: string): boolean => {
    return REGEX_GITHUB_URL.test(input);
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUrl(input);
    setIsValidUrl(input === "" || validateUrl(input));
  };

  const handleAnalyzeRepository = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateUrl(url)) {
      setIsValidUrl(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const repository = await getRepositoryInfo(url);
      setRepository(repository);
    
      const fileStructure = await getFileStructure(repository);
      setFileStructure(fileStructure);

      const visualizationData = generateVisualizationData(fileStructure, visualizationSettings);
      setVisualizationData(visualizationData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ha ocurrido un error al analizar el repositorio");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoRepository = async () => {
    setUrl(REPO_DEFAULT);

    try {
      setIsLoading(true);
      setError(null);

      const repository = await getRepositoryInfo(REPO_DEFAULT);
      setRepository(repository);

      const fileStructure = await getFileStructure(repository);
      setFileStructure(fileStructure);

      const visualizationData = generateVisualizationData(
        fileStructure,
        visualizationSettings
      );
      setVisualizationData(visualizationData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocurrió un error al analizar el repositorio de ejemplo");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-10">
      <div className={cn(
        "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(26, 25, 25, 0.123)]",
        "rounded-2xl shadow-sm p-8 transition-all duration-300"
      )}>
        <div className="w-full">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-7 flex items-center justify-center">
            Analiza tu repositorio
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Ingresa la URL de tu repositorio de GitHub para visualizar su estructura de manera interactiva y ver el contenido de los archivos.
          </p>

          <form onSubmit={handleAnalyzeRepository} className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BsSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="repository-url"
                  className={cn(
                    "block w-full pl-10 pr-12 py-3 rounded-lg border",
                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
                    "placeholder-gray-400 dark:placeholder-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                    "transition-colors",
                    isValidUrl
                      ? "border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                      : "border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500"
                  )}
                  placeholder="https://github.com/usuario/repositorio"
                  value={url}
                  onChange={handleUrlChange}
                />
              </div>
              {!isValidUrl && (
                <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                  Por favor, ingresa una URL válida de GitHub
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className={cn(
                  "flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium",
                  "py-3 px-6 rounded-lg shadow-sm",
                  "flex items-center justify-center",
                  "transition-colors duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                disabled={!isValidUrl || url === ""}
              >
                <BsDatabase className="mr-2 h-5 w-5" />
                Analizar
              </button>

              <button
                type="button"
                onClick={handleDemoRepository}
                className={cn(
                  "flex-1 bg-white dark:bg-gray-800",
                  "hover:bg-gray-50 dark:hover:bg-gray-700",
                  "text-gray-800 dark:text-white font-medium",
                  "py-3 px-6 rounded-lg shadow-sm",
                  "flex items-center justify-center",
                  "transition-colors duration-200",
                  "border border-gray-200 dark:border-gray-700"
                )}
              >
                <FaGithub className="mr-2 h-5 w-5" />
                Ver ejemplo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RepositoryInput;
