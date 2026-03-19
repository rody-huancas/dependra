import { useState } from "react";
import Editor from '@monaco-editor/react';
import { CgClose } from "react-icons/cg";
import { languageMap } from '@/utils/languageMap';

interface Props {
  fileName: string;
  content : string;
  language: string;
  encoding?: "text" | "base64";
  mimeType?: string;
  onClose : () => void;
}


const FilePreview = ({ fileName, content, language, encoding, mimeType, onClose }: Props) => {
  const getMonacoLanguage = (lang: string): string => {
    return languageMap[lang] || 'plaintext';
  };

  const isImagePreview = encoding === 'base64' && mimeType?.startsWith('image/');
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "vs-light" | "hc-black">("vs-dark");
  const [presentationMode, setPresentationMode] = useState<"editor" | "focus">("editor");
  const [wrapLines, setWrapLines] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  const themeOptions = [
    { id: "vs-dark" as const, label: "Nocturno" },
    { id: "vs-light" as const, label: "Claro" },
    { id: "hc-black" as const, label: "Neón" },
  ];

  const viewModes = [
    { id: "editor" as const, label: "Editor" },
    { id: "focus" as const, label: "Presentación" },
  ];

  const editorFontSize = presentationMode === "focus" ? 16 : 14;
  const minimapEnabled = presentationMode !== "focus";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{fileName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isImagePreview ? mimeType : language}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <CgClose size={20} />
          </button>
        </div>
        {!isImagePreview && (
          <div className="border-b border-gray-100 dark:border-gray-700 px-4 py-3 space-y-3">
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
                  Tema
                </p>
                <div className="flex gap-1">
                  {themeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setEditorTheme(option.id)}
                      className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                        editorTheme === option.id
                          ? "border-indigo-500 bg-indigo-50/80 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-100"
                          : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-indigo-300"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
                  Vista
                </p>
                <div className="flex gap-1">
                  {viewModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setPresentationMode(mode.id)}
                      className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                        presentationMode === mode.id
                          ? "border-emerald-500 bg-emerald-50/90 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100"
                          : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-emerald-300"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => setWrapLines((prev) => !prev)}
                className={`rounded-full border px-3 py-1 font-semibold transition ${
                  wrapLines
                    ? "border-blue-500 bg-blue-50/80 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100"
                    : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300"
                }`}
              >
                {wrapLines ? "Wrap activo" : "Wrap inactivo"}
              </button>
              <button
                onClick={() => setShowLineNumbers((prev) => !prev)}
                className={`rounded-full border px-3 py-1 font-semibold transition ${
                  showLineNumbers
                    ? "border-purple-500 bg-purple-50/80 text-purple-600 dark:bg-purple-500/20 dark:text-purple-100"
                    : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300"
                }`}
              >
                {showLineNumbers ? "Números ON" : "Números OFF"}
              </button>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          {isImagePreview ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <img
                src={`data:${mimeType};base64,${content}`}
                alt={fileName}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <Editor
              height="100%"
              defaultLanguage={getMonacoLanguage(language)}
              defaultValue={content}
              theme={editorTheme}
              options={{
                readOnly: true,
                minimap: { enabled: minimapEnabled },
                fontSize: editorFontSize,
                wordWrap: wrapLines ? 'on' : 'off',
                lineNumbers: showLineNumbers ? 'on' : 'off',
                folding: presentationMode !== 'focus',
                renderWhitespace: 'none',
                scrollBeyondLastLine: false,
                smoothScrolling: true,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default FilePreview;
