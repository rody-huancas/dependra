interface Props {
  analysisProgress: string;
}

const ProgressIndicator = ({ analysisProgress }: Props) => {
  if (!analysisProgress) return null;

  return (
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
  );
};

export default ProgressIndicator;
