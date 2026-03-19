import type { ReactNode } from "react";
import type { VisualizationSettings } from "@/types";
import useStore from "../store/useStore";
import { cn } from "@/utils/functions";
import { BiLayout, BiSun, BiMoon } from "react-icons/bi";
import { FiRefreshCw } from "react-icons/fi";
import { BsLayers } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";

const layoutOptions: Array<{ id: "horizontal" | "vertical" | "radial"; label: string; icon: ReactNode }> = [
  { id: "horizontal", label: "Horizontal", icon: <BiLayout className="h-4 w-4" /> },
  { id: "vertical", label: "Vertical", icon: <BiLayout className="h-4 w-4 rotate-90" /> },
  { id: "radial", label: "Radial", icon: <FiRefreshCw className="h-4 w-4" /> },
];

const densityOptions: Array<{ id: "compact" | "balanced" | "spacious"; label: string }> = [
  { id: "compact", label: "Compacto" },
  { id: "balanced", label: "Balanceado" },
  { id: "spacious", label: "Amplio" },
];

const Controls: React.FC = () => {
  const {
    visualizationSettings,
    updateVisualizationSettings,
    visualizationData,
    fileStructure,
    setVisualizationData,
  } = useStore();

  const applySetting = (partial: Partial<VisualizationSettings>) => {
    const nextSettings = { ...visualizationSettings, ...partial };
    updateVisualizationSettings(partial);
    if (!fileStructure) return;
    import("../utils/visualization-generator.utils").then(({ generateVisualizationData }) => {
      const newData = generateVisualizationData(fileStructure, nextSettings);
      setVisualizationData(newData);
    });
  };

  const handleLayoutChange = (layout: "horizontal" | "vertical" | "radial") => {
    applySetting({ layout });
  };

  const handleDensityChange = (density: "compact" | "balanced" | "spacious") => {
    applySetting({ density });
  };

  const handleThemeChange = () => {
    const newTheme = visualizationSettings.theme === "light" ? "dark" : "light";
    updateVisualizationSettings({ theme: newTheme });
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleDependencies = () => {
    applySetting({ showDependencies: !visualizationSettings.showDependencies });
  };

  const toggleGrouping = () => {
    applySetting({ groupByFolder: !visualizationSettings.groupByFolder });
  };

  if (!visualizationData) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-4xl px-4">
      <div className="rounded-[28px] border border-white/70 dark:border-white/10 bg-white/95 dark:bg-slate-950/85 backdrop-blur-2xl shadow-[0_20px_60px_rgba(15,23,42,0.25)] p-4 flex flex-wrap items-center justify-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {layoutOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleLayoutChange(option.id)}
              className={cn(
                "rounded-2xl border px-3 py-2 text-xs font-semibold flex items-center gap-1 transition",
                visualizationSettings.layout === option.id
                  ? "border-blue-500 bg-blue-50/80 text-blue-700 dark:bg-blue-500/20 dark:text-blue-100"
                  : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-blue-300"
              )}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={toggleDependencies}
            className={cn(
              "rounded-2xl border px-3 py-2 text-xs font-semibold transition",
              visualizationSettings.showDependencies
                ? "border-emerald-500 bg-emerald-50/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100"
                : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-emerald-300"
            )}
          >
            Dependencias
          </button>
          <button
            onClick={toggleGrouping}
            className={cn(
              "rounded-2xl border px-3 py-2 text-xs font-semibold transition",
              visualizationSettings.groupByFolder
                ? "border-purple-500 bg-purple-50/80 text-purple-700 dark:bg-purple-500/20 dark:text-purple-100"
                : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-purple-300"
            )}
          >
            Agrupar carpetas
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {densityOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleDensityChange(option.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition",
                visualizationSettings.density === option.id
                  ? "border-indigo-500 bg-indigo-50/90 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
                  : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-indigo-300"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleThemeChange}
          className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/10 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-200 hover:border-blue-300"
        >
          {visualizationSettings.theme === "light" ? (
            <>
              <BiMoon className="h-4 w-4" /> Oscuro
            </>
          ) : (
            <>
              <BiSun className="h-4 w-4" /> Claro
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Controls;
