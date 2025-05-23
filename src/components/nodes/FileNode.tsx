"use client"

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
/* Utils */
import { cn } from '@/utils/functions';
/* Icons */
import { BsDatabase } from 'react-icons/bs';
import { FiFileText } from 'react-icons/fi';
import { LuComponent } from 'react-icons/lu';
import { BiCode, BiFile, BiPackage } from 'react-icons/bi';

const FileNode: React.FC<NodeProps> = ({ data }) => {
  const getIcon = () => {
    switch (data.type) {
      case 'component':
        return <LuComponent className="text-purple-500 dark:text-purple-400" size={16} />;
      case 'service':
        return <BsDatabase className="text-green-500 dark:text-green-400" size={16} />;
      case 'module':
        return <BiPackage className="text-blue-500 dark:text-blue-400" size={16} />;
      default:
        if (data.language === 'JavaScript' || data.language === 'TypeScript') {
          return <BiCode className="text-yellow-500 dark:text-yellow-400" size={16} />;
        } else if (data.content) {
          return <FiFileText className="text-blue-500 dark:text-blue-400" size={16} />;
        }
        return <BiFile className="text-gray-500 dark:text-gray-400" size={16} />;
    }
  };

  const getNodeColorClass = () => {
    switch (data.type) {
      case 'component':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30';
      case 'service':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30';
      case 'module':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30';
      default: {
        if (data.language) {
          switch (data.language) {
            case 'JavaScript':
            case 'JavaScript (React)':
              return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/30';
            case 'TypeScript':
            case 'TypeScript (React)':
              return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30';
            case 'Python':
              return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30';
            case 'Java':
              return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/30';
            case 'CSS':
            case 'SCSS':
              return 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-700 hover:bg-pink-100 dark:hover:bg-pink-900/30';
            case 'HTML':
              return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30';
            default:
              return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800';
          }
        }
        return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800';
      }
    }
  };

  const hasContent = Boolean(data.content);

  return (
    <div 
      className={cn(
        'rounded-md shadow-md border',
        getNodeColorClass(),
        'p-2 min-w-40 transition-all duration-200 cursor-pointer transform hover:scale-105',
        hasContent ? 'hover:ring-2 hover:ring-blue-400 dark:hover:ring-blue-500' : ''
      )}
      title={hasContent ? "Haga click para ver el contenido" : undefined}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-400 dark:!bg-gray-600 !w-3 !h-1.5 !rounded-sm !border-0"
      />
      
      <div className="flex items-center space-x-2">
        {getIcon()}
        <span className="font-medium text-gray-700 dark:text-gray-200 truncate" title={data.label}>
          {data.label}
        </span>
      </div>
      
      {data.language && (
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
          <span className="truncate">{data.language}</span>
          {hasContent && (
            <span className="ml-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-[10px]">
              Visualizar
            </span>
          )}
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-400 dark:!bg-gray-600 !w-3 !h-1.5 !rounded-sm !border-0"
      />
    </div>
  );
};

export default memo(FileNode);