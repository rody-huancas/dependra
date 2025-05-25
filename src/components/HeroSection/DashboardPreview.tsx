import StatsPanel from "./StatsPanel";
import RepoMetrics from "./RepoMetrics";
import RepoSummary from "./RepoSummary";
import RecentActivity from "./RecentActivity";
import FloatingCodeSnippet from "./FloatingCodeSnippet";
import { FaGithub, FaCodeBranch, FaStar } from "react-icons/fa";

const DashboardPreview = () => (
  <div className="relative w-full max-w-7xl mx-auto perspective-1000">
    
    <FloatingCodeSnippet />

    <div className="relative transform rotate-x-12 rotate-y-2">
      <div className="bg-gray-900/95 backdrop-blur-xl rounded-t-2xl p-4 md:p-8 shadow-2xl border border-gray-700/50">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex space-x-1 md:space-x-2">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
              <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-gray-300 text-xs md:text-sm flex items-center space-x-1 md:space-x-2">
              <FaGithub className="w-3 h-3 md:w-4 md:h-4" />
              <span>rody-huancas/dependra</span>
            </span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4 text-gray-300 text-xs md:text-sm">
            <div className="flex items-center space-x-1">
              <FaStar className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
              <span>2.5k</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaCodeBranch className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
              <span>47</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          <RepoMetrics />
          <RepoSummary />
          <StatsPanel />
        </div>

        <RecentActivity />
      </div>
      
      <div className="bg-gray-800 h-2 md:h-4 rounded-b-2xl border border-t-0 border-gray-700/50"></div>
    </div>
  </div>
);

export default DashboardPreview;