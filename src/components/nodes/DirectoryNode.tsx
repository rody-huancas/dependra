import { memo } from 'react';
import { BiFolder } from 'react-icons/bi';
import { Handle, Position, NodeProps } from 'reactflow';

const DirectoryNode= ({ data }: NodeProps) => {
  return (
    <div className="rounded-md shadow-md border border-gray-200 dark:border-gray-700 bg-amber-50 dark:bg-amber-900/20 p-2 min-w-40 transition-all duration-200 hover:shadow-lg transform hover:scale-105 hover:bg-amber-100 dark:hover:bg-amber-900/30">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-amber-400 dark:!bg-amber-600 !w-3 !h-1.5 !rounded-sm !border-0"
      />
      
      <div className="flex items-center space-x-2">
        <BiFolder className="text-amber-500 dark:text-amber-400" size={16} />
        <span className="font-medium text-gray-700 dark:text-gray-200 truncate" title={data.label}>
          {data.label}
        </span>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-amber-400 dark:!bg-amber-600 !w-3 !h-1.5 !rounded-sm !border-0"
      />
    </div>
  );
};

export default memo(DirectoryNode);