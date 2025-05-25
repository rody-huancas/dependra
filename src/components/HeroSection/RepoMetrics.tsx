import MetricCard from "./MetricCard";
import ActivityItem from "./ActivityItem";
import { FaCode, FaFileCode, FaUsers, FaExclamationCircle, FaChartLine, FaClock, FaExpand, FaCodeBranch } from "react-icons/fa";

const RepoMetrics = () => (
  <div className="col-span-1 md:col-span-3 bg-gray-800/20 rounded-xl p-4 border border-gray-700/30 flex flex-col">
    <div className="flex items-center justify-between mb-4 group">
      <div className="flex items-center space-x-2">
        <div className="p-1.5 rounded-md bg-blue-500/10 group-hover:bg-blue-500/20 transition-all">
          <FaCode className="text-blue-400 w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-white">Repositorio</span>
      </div>
      <span className="text-xs px-2 py-1 bg-gray-800/50 text-gray-300 rounded-full border border-gray-700">
        LIVE
      </span>
    </div>

    <div className="flex-1 space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-gray-300">
            Distribución de código
          </span>
          <span className="text-xs text-blue-400">TypeScript 68%</span>
        </div>
        <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
            style={{ width: "68%" }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <MetricCard
          value="142"
          label="Archivos"
          icon={<FaFileCode className="text-green-400" />}
        />
        <MetricCard
          value="8"
          label="Contrib."
          icon={<FaUsers className="text-purple-400" />}
        />
        <MetricCard
          value="14"
          label="Issues"
          icon={<FaExclamationCircle className="text-yellow-400" />}
        />
        <MetricCard
          value="4"
          label="PRs"
          icon={<FaCodeBranch className="text-blue-400" />}
        />
        <MetricCard
          value="92%"
          label="Active"
          icon={<FaChartLine className="text-teal-400" />}
        />
        <MetricCard
          value="2d"
          label="Actualizado"
          icon={<FaClock className="text-gray-400" />}
        />
      </div>

      <div className="pt-2">
        <div className="text-xs text-gray-400 mb-2">
          Actividad Reciente
        </div>
        <div className="space-y-2">
          <ActivityItem
            action="push"
            message="Actualizar archivos de configuración"
            time="2h ago"
            author="novtiq"
          />
          <ActivityItem
            action="merge"
            message="Feature/auth"
            time="5h ago"
            author="rody-huancas"
          />
        </div>
      </div>
    </div>

    <div className="mt-4 pt-3 border-t border-gray-700/30">
      <button className="w-full text-xs py-1.5 px-3 rounded-md bg-gray-800/50 hover:bg-gray-700/40 text-gray-300 transition-all flex items-center justify-center space-x-1">
        <FaExpand className="w-3 h-3" />
        <span>Ver Detalles</span>
      </button>
    </div>
  </div>
);

export default RepoMetrics;
