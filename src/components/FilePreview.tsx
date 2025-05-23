import Editor from '@monaco-editor/react';
import { CgClose } from "react-icons/cg";

interface Props {
  fileName: string;
  content : string;
  language: string;
  onClose : () => void;
}


const FilePreview = ({ fileName, content, language, onClose }: Props) => {
  const getMonacoLanguage = (lang: string): string => {
    const languageMap: Record<string, string> = {
      'JavaScript'        : 'javascript',
      'JavaScript (React)': 'javascript',
      'TypeScript'        : 'typescript',
      'TypeScript (React)': 'typescript',
      'Python'            : 'python',
      'Java'              : 'java',
      'HTML'              : 'html',
      'CSS'               : 'css',
      'SCSS'              : 'scss',
      'JSON'              : 'json',
      'Markdown'          : 'markdown',
      'YAML'              : 'yaml',
      'XML'               : 'xml',
      'SQL'               : 'sql',
      'Shell'             : 'shell',
      'Bash'              : 'shell',
    };
    return languageMap[lang] || 'plaintext';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{fileName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{language}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <CgClose size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage={getMonacoLanguage(language)}
            defaultValue={content}
            theme={'vs-dark'}
            options={{
              readOnly: true,
              minimap: { enabled: true },
              fontSize: 14,
              wordWrap: 'on',
              lineNumbers: 'on',
              folding: true,
              renderWhitespace: 'none',
              scrollBeyondLastLine: false,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default FilePreview;