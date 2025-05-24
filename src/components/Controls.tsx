import useStore from "../store/useStore";
import { BsLayers } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import { FiRefreshCw } from "react-icons/fi";
import { BiLayout, BiMoon, BiSun } from "react-icons/bi";

const Controls: React.FC = () => {
  const {
    visualizationSettings,
    updateVisualizationSettings,
    visualizationData,
    fileStructure,
    setVisualizationData,
    isLoading,
  } = useStore();

  const handleLayoutChange = (layout: "horizontal" | "vertical" | "radial") => {
    updateVisualizationSettings({ layout });
    regenerateVisualization();
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

  const handleToggleDependencies = () => {
    updateVisualizationSettings({
      showDependencies: !visualizationSettings.showDependencies,
    });
    regenerateVisualization();
  };

  const handleToggleGrouping = () => {
    updateVisualizationSettings({
      groupByFolder: !visualizationSettings.groupByFolder,
    });
    regenerateVisualization();
  };

  const regenerateVisualization = () => {
    if (fileStructure) {
      import("../utils/visualization-generator.utils").then(
        ({ generateVisualizationData }) => {
          const newData = generateVisualizationData(
            fileStructure,
            visualizationSettings
          );
          setVisualizationData(newData);
        }
      );
    }
  };

  if (!visualizationData) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 z-10 transition-all duration-300">
      <div className="flex items-center space-x-1">
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors relative group"
          onClick={() => handleLayoutChange("horizontal")}
          title="Horizontal Layout"
        >
          <BiLayout className="h-5 w-5" />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Horizontal
          </span>
        </button>

        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors relative group"
          onClick={() => handleLayoutChange("vertical")}
          title="Vertical Layout"
        >
          <BiLayout className="h-5 w-5 transform rotate-90" />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Vertical
          </span>
        </button>

        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors relative group"
          onClick={() => handleLayoutChange("radial")}
          title="Radial Layout"
        >
          <FiRefreshCw className="h-5 w-5" />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Radial
          </span>
        </button>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors relative group"
          onClick={handleToggleDependencies}
          title={
            visualizationSettings.showDependencies
              ? "Ocultar Dependencias"
              : "Mostrar Dependencias"
          }
        >
          <BsLayers className="h-5 w-5" />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {visualizationSettings.showDependencies
              ? "Ocultar Dependencias"
              : "Mostrar Dependencias"}
          </span>
        </button>

        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors relative group"
          onClick={handleToggleGrouping}
          title={
            visualizationSettings.groupByFolder
              ? "Desagrupar Archivos"
              : "Agrupar por folder"
          }
        >
          <CiSettings className="h-5 w-5" />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {visualizationSettings.groupByFolder
              ? "Desagrupar Archivos"
              : "Agrupar por folder"}
          </span>
        </button>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors relative group"
          onClick={handleThemeChange}
          title={
            visualizationSettings.theme === "light"
              ? "Modo Oscuro"
              : "Modo Claro"
          }
        >
          {visualizationSettings.theme === "light" ? (
            <BiMoon className="h-5 w-5" />
          ) : (
            <BiSun className="h-5 w-5" />
          )}
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {visualizationSettings.theme === "light"
              ? "Modo Oscuro"
              : "Modo Claro"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Controls;
