import { cn } from "@/utils/functions";
import { HiMiniViewfinderCircle } from "react-icons/hi2";

interface Props {
  onClick: () => void;
}

const LastRepositoryButton = ({ onClick }: Props) => {
  return (
    <div className="flex w-full mt-5">
      <button
        type="button"
        onClick={onClick}
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
  );
};

export default LastRepositoryButton;