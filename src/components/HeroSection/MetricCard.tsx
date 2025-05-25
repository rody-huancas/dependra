import { ReactNode } from "react";

interface Props {
  value: string;
  label: string;
  icon : ReactNode;
}

const MetricCard = ({ value, label, icon }: Props) => (
  <div className="bg-gray-800/40 rounded p-2 flex flex-col items-center justify-center hover:bg-gray-700/30 transition-all">
    <div className="text-white text-sm font-medium">{value}</div>
    <div className="flex items-center mt-1 space-x-1">
      <div className="text-xs w-3 h-3 flex items-center">{icon}</div>
      <span className="text-[0.6rem] text-gray-400">{label}</span>
    </div>
  </div>
);

export default MetricCard;
