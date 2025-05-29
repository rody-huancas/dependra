import { ChangeEvent } from "react";
import { cn } from "@/utils/functions";
import { BsSearch } from "react-icons/bs";

interface Props {
  url        : string;
  isValidUrl : boolean;
  isAnalyzing: boolean;
  onUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const RepositoryUrlInput = (props: Props) => {
  const { url, isValidUrl, isAnalyzing, onUrlChange } = props;

  return (
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
          onChange={onUrlChange}
          disabled={isAnalyzing}
        />
      </div>
      {!isValidUrl && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400">
          Por favor, ingresa una URL válida de GitHub
        </p>
      )}
    </div>
  );
};

export default RepositoryUrlInput;
