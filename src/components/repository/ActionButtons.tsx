import { cn } from "@/utils/functions";
import { FaGithub } from "react-icons/fa";
import { BsDatabase } from "react-icons/bs";
import { FormEvent } from "react";

interface Props {
  isAnalyzing   : boolean;
  isValidUrl    : boolean;
  url           : string;
  loadRepository: boolean;
  onAnalyze     : (e: FormEvent) => Promise<void>;
  onDemo        : () => void;
}

const ActionButtons = (props: Props) => {
  const { isAnalyzing, isValidUrl, url, loadRepository, onAnalyze, onDemo } = props;
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        type="submit"
        onClick={onAnalyze}
        className={cn(
          "flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium",
          "py-3 px-6 rounded-lg shadow-sm",
          "flex items-center justify-center",
          "transition-colors duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "cursor-pointer text-sm sm:text-base"
        )}
        disabled={!isValidUrl || url === "" || loadRepository || isAnalyzing}
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
        onClick={onDemo}
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
  );
};

export default ActionButtons;
