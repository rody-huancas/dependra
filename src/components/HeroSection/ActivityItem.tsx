import { FaArrowUp, FaCodeBranch, FaCircle } from "react-icons/fa";

interface Props {
  action : string;
  message: string;
  time   : string;
  author : string;
}

const ActivityItem = ({ action, message, time, author }: Props) => {
  const getActionIcon = () => {
    switch (action) {
      case "push":
        return <FaArrowUp className="text-green-400 w-2.5 h-2.5" />;
      case "merge":
        return <FaCodeBranch className="text-blue-400 w-2.5 h-2.5" />;
      default:
        return <FaCircle className="text-gray-400 w-2.5 h-2.5" />;
    }
  };

  return (
    <div className="flex items-start">
      <div className="mt-0.5 mr-2">{getActionIcon()}</div>
      <div className="flex-1">
        <div className="text-xs text-white leading-tight">{message}</div>
        <div className="flex justify-between">
          <span className="text-[0.6rem] text-gray-500">@{author}</span>
          <span className="text-[0.6rem] text-gray-500">{time}</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
