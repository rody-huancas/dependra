"use client";

import { ChangeEvent, FormEvent, useState, useEffect, useRef } from "react";
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
import { HiMiniViewfinderCircle } from "react-icons/hi2";

class KeepAliveManager {
  private keepAliveInterval: NodeJS.Timeout | null = null;
  private wakeLock: WakeLockSentinel | null = null;
  private audioContext: AudioContext | null = null;
  private heartbeatWorker: Worker | null = null;
  private visibilityChangeHandler: (() => void) | null = null;
  private isActive = false;

  async start() {
    if (this.isActive) return;
    this.isActive = true;

    await this.requestWakeLock();

    this.createSilentAudio();

    this.createHeartbeatWorker();

    this.keepAliveInterval = setInterval(() => {
      this.performKeepAliveOperations();
    }, 5);

    this.setupVisibilityHandler();

    console.log("KeepAlive iniciado");
  }

  async stop() {
    if (!this.isActive) return;
    this.isActive = false;

    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }

    if (this.wakeLock) {
      try {
        await this.wakeLock.release();
      } catch (e) {}
      this.wakeLock = null;
    }

    if (this.audioContext) {
      try {
        await this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }

    if (this.heartbeatWorker) {
      this.heartbeatWorker.terminate();
      this.heartbeatWorker = null;
    }

    if (this.visibilityChangeHandler) {
      document.removeEventListener(
        "visibilitychange",
        this.visibilityChangeHandler
      );
      this.visibilityChangeHandler = null;
    }

    console.log("KeepAlive detenido");
  }

  private async requestWakeLock() {
    try {
      if ("wakeLock" in navigator) {
        this.wakeLock = await navigator.wakeLock.request("screen");

        this.wakeLock.addEventListener("release", () => {
          if (this.isActive && !document.hidden) {
            setTimeout(() => this.requestWakeLock(), 100);
          }
        });
      }
    } catch (error) {
      console.log("Wake Lock no disponible:", error);
    }
  }

  private createSilentAudio() {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      gainNode.gain.setValueAtTime(0.001, this.audioContext.currentTime);
      oscillator.frequency.setValueAtTime(20000, this.audioContext.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      oscillator.start();
    } catch (error) {
      console.log("AudioContext no disponible:", error);
    }
  }

  private createHeartbeatWorker() {
    try {
      const workerCode = `
        let interval;
        self.onmessage = function(e) {
          if (e.data === 'start') {
            interval = setInterval(() => {
              
              const now = Date.now();
              const random = Math.random();
              self.postMessage({ type: 'heartbeat', timestamp: now, random });
            }, 100);
          } else if (e.data === 'stop') {
            if (interval) {
              clearInterval(interval);
              interval = null;
            }
          }
        };
      `;

      const blob = new Blob([workerCode], { type: "application/javascript" });
      this.heartbeatWorker = new Worker(URL.createObjectURL(blob));

      this.heartbeatWorker.onmessage = (e) => {
        if (e.data.type === "heartbeat") {
          performance.now();
        }
      };

      this.heartbeatWorker.postMessage("start");
    } catch (error) {
      console.log("Worker no disponible:", error);
    }
  }

  private performKeepAliveOperations() {
    performance.now();
    Date.now();
    Math.random();

    if (document.body) {
      document.body.getAttribute("class");
    }

    if (navigator.onLine && Math.random() > 0.99) {
      fetch("data:text/plain,ping", {
        method: "HEAD",
        cache: "no-cache",
      }).catch(() => {});
    }

    if (Math.random() > 0.9) {
      const temp = new ArrayBuffer(1024);
    }
  }

  private setupVisibilityHandler() {
    this.visibilityChangeHandler = async () => {
      if (!document.hidden && this.isActive) {
        await this.requestWakeLock();

        const intensiveInterval = setInterval(() => {
          this.performKeepAliveOperations();
        }, 1);

        setTimeout(() => {
          clearInterval(intensiveInterval);
        }, 1000);
      }
    };

    document.addEventListener("visibilitychange", this.visibilityChangeHandler);
  }
}

const RepositoryInput = ({ loadRepository }: { loadRepository: boolean }) => {
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState("");
  const [showVisibilityWarning, setShowVisibilityWarning] = useState(false);

  const keepAliveManagerRef = useRef<KeepAliveManager | null>(null);
  const analysisAbortControllerRef = useRef<AbortController | null>(null);

  const setError = useStore((state) => state.setError);
  const setIsLoading = useStore((state) => state.setIsLoading);
  const setRepository = useStore((state) => state.setRepository);
  const setIsOpenModal = useStore((state) => state.setIsOpenModal);
  const setFileStructure = useStore((state) => state.setFileStructure);
  const setVisualizationData = useStore((state) => state.setVisualizationData);

  const isOpenModal = useStore((state) => state.isOpenModal);
  const visualizationData = useStore((state) => state.visualizationData);
  const visualizationSettings = useStore(
    (state) => state.visualizationSettings
  );

  useEffect(() => {
    keepAliveManagerRef.current = new KeepAliveManager();

    return () => {
      if (keepAliveManagerRef.current) {
        keepAliveManagerRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    let warningTimeout: NodeJS.Timeout;

    const handleVisibilityChange = () => {
      if (document.hidden && isAnalyzing) {
        warningTimeout = setTimeout(() => {
          setShowVisibilityWarning(true);
        }, 2000);
      } else {
        setShowVisibilityWarning(false);
        if (warningTimeout) {
          clearTimeout(warningTimeout);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (warningTimeout) {
        clearTimeout(warningTimeout);
      }
    };
  }, [isAnalyzing]);

  const validateUrl = (input: string): boolean => {
    return REGEX_GITHUB_URL.test(input);
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUrl(input);
    setIsValidUrl(input === "" || validateUrl(input));
  };

  const performAnalysis = async (repoUrl: string) => {
    const abortController = new AbortController();
    analysisAbortControllerRef.current = abortController;

    try {
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
    } finally {
      analysisAbortControllerRef.current = null;
      setAnalysisProgress("");
    }
  };

  const handleAnalyzeRepository = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateUrl(url)) {
      setIsValidUrl(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsAnalyzing(true);
      setError(null);
      setShowVisibilityWarning(false);
      setAnalysisProgress("🚀 Iniciando análisis...");

      if (keepAliveManagerRef.current) {
        await keepAliveManagerRef.current.start();
      }

      await performAnalysis(url);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ha ocurrido un error al analizar el repositorio");
      }
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
      setAnalysisProgress("");

      if (keepAliveManagerRef.current) {
        await keepAliveManagerRef.current.stop();
      }
    }
  };

  const handleDemoRepository = async () => {
    setUrl(REPO_DEFAULT);

    try {
      setIsLoading(true);
      setIsAnalyzing(true);
      setError(null);
      setShowVisibilityWarning(false);
      setAnalysisProgress("🎯 Iniciando análisis del repositorio demo...");

      if (keepAliveManagerRef.current) {
        await keepAliveManagerRef.current.start();
      }

      await performAnalysis(REPO_DEFAULT);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocurrió un error al analizar el repositorio de ejemplo");
      }
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
      setAnalysisProgress("");

      if (keepAliveManagerRef.current) {
        await keepAliveManagerRef.current.stop();
      }
    }
  };

  const handleViewLastRepository = () => {
    if (!visualizationData) return;
    setIsOpenModal(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-10">
      {showVisibilityWarning && (
        <div className="mb-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 rounded-lg animate-pulse shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-400 border-t-transparent"></div>
                <div className="absolute inset-0 rounded-full h-6 w-6 border-2 border-amber-200 animate-ping"></div>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm text-amber-800 dark:text-amber-200 font-semibold">
                🔄 <strong>Procesando en segundo plano</strong>
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                El análisis continúa ejecutándose de forma optimizada. La
                pestaña se mantiene activa automáticamente.
              </p>
              <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                Progreso:{" "}
                <span className="font-mono">
                  {analysisProgress || "Procesando..."}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={cn(
          "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(26, 25, 25, 0.123)]",
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

          {analysisProgress && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    {analysisProgress}
                  </p>
                  <div className="mt-1 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full animate-pulse"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                    "text-sm sm:text-base",
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
                  disabled={isAnalyzing}
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
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "cursor-pointer text-sm sm:text-base"
                )}
                disabled={
                  !isValidUrl || url === "" || loadRepository || isAnalyzing
                }
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analizando...
                  </>
                ) : (
                  <>
                    <BsDatabase className="mr-2 h-5 w-5" />
                    Analizar
                  </>
                )}
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
                  "border border-gray-200 dark:border-gray-700",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "cursor-pointer text-sm sm:text-base"
                )}
                disabled={loadRepository || isAnalyzing}
              >
                <FaGithub className="mr-2 h-5 w-5" />
                Ver ejemplo
              </button>
            </div>
          </form>

          {!!visualizationData && !isOpenModal && (
            <div className="flex w-full mt-5">
              <button
                type="button"
                onClick={handleViewLastRepository}
                className={cn(
                  "flex-1 bg-white dark:bg-gray-800",
                  "hover:bg-gray-50 dark:hover:bg-gray-700",
                  "text-gray-800 dark:text-white font-medium",
                  "py-3 px-6 rounded-lg shadow-sm",
                  "flex items-center justify-center",
                  "transition-colors duration-200",
                  "border border-gray-200 dark:border-gray-700",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "cursor-pointer text-sm sm:text-base"
                )}
              >
                <HiMiniViewfinderCircle className="mr-2 h-5 w-5" />
                Ver último repositorio analizado
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepositoryInput;
