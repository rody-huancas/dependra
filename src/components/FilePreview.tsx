import { CgClose } from "react-icons/cg";

interface Props {
  fileName: string;
  content : string;
  language: string;
  onClose : () => void;
}

const FilePreview= ({ fileName, content, language, onClose }: Props) => {

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {fileName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {language}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <CgClose size={20} />
          </button>
        </div>
        <div className="p-4 overflow-auto max-h-[calc(80vh-80px)]">
          <pre className="text-sm font-mono bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
            <code>{content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
