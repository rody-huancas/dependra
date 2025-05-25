import { FiGitCommit } from "react-icons/fi";

const RecentActivity = () => (
  <div className="mt-4 md:mt-6 bg-gray-800/50 rounded-xl p-3 md:p-4">
    <div className="text-white text-xs md:text-sm font-semibold mb-2 md:mb-3 flex items-center space-x-1 md:space-x-2">
      <FiGitCommit className="w-3 h-3 md:w-4 md:h-4" />
      <span>Actividad Reciente</span>
    </div>
    <div className="space-y-1 md:space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1 md:space-x-2">
          <div className="w-4 h-4 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">+</span>
          </div>
          <span className="text-gray-300 text-xs sm:text-base">Se agregó un nuevo componente</span>
        </div>
        <span className="text-gray-400">Hace 2h</span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1 md:space-x-2">
          <div className="w-4 h-4 md:w-6 md:h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">M</span>
          </div>
          <span className="text-gray-300 text-xs sm:text-base">Refactorización de la capa API</span>
        </div>
        <span className="text-gray-400">Hace 5h</span>
      </div>
    </div>
  </div>
);

export default RecentActivity;
