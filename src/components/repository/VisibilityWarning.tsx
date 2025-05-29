interface Props {
  analysisProgress: string;
}

const VisibilityWarning = ({ analysisProgress }: Props) => {
  return (
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
            El análisis continúa ejecutándose de forma optimizada. La pestaña se
            mantiene activa automáticamente.
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
  );
};

export default VisibilityWarning;
