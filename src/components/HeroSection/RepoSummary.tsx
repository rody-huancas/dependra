import { FaGithub, FaFileCode, FaUsers, FaFolder } from "react-icons/fa";

const RepoSummary = () => (
  <div className="col-span-1 md:col-span-6 bg-gray-800/50 rounded-xl p-4">
    <div className="text-white text-sm font-semibold mb-4 flex items-center space-x-2">
      <FaGithub className="w-4 h-4" />
      <span>Resumen del Repositorio</span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <div className="bg-gray-800/70 rounded-lg p-3 flex items-center">
        <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
          <FaFileCode className="text-blue-400 w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-gray-300">Archivos</div>
          <div className="text-white font-bold">142</div>
        </div>
      </div>

      <div className="bg-gray-800/70 rounded-lg p-3 flex items-center">
        <div className="bg-green-500/20 p-2 rounded-lg mr-3">
          <FaUsers className="text-green-400 w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-gray-300">Contribuidores</div>
          <div className="text-white font-bold">8</div>
        </div>
      </div>
    </div>

    <div className="bg-gray-800/70 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="text-xs font-medium text-gray-300">
          Estructura del Proyecto
        </div>
        <div className="text-xs text-blue-400">main</div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <FaFolder className="text-blue-400 mr-2 w-4 h-4" />
          <span className="text-white">src/</span>
        </div>

        <div className="ml-4 space-y-1">
          <div className="flex items-center text-sm">
            <FaFolder className="text-blue-400 mr-2 w-4 h-4" />
            <span className="text-white">components/</span>
          </div>
          <div className="ml-4 space-y-1">
            <div className="flex items-center text-sm">
              <FaFileCode className="text-green-400 mr-2 w-4 h-4" />
              <span className="text-gray-300">Button.tsx</span>
            </div>
            <div className="flex items-center text-sm">
              <FaFileCode className="text-green-400 mr-2 w-4 h-4" />
              <span className="text-gray-300">Card.tsx</span>
            </div>
          </div>

          <div className="flex items-center text-sm">
            <FaFolder className="text-blue-400 mr-2 w-4 h-4" />
            <span className="text-white">pages/</span>
          </div>
        </div>

        <div className="flex items-center text-sm">
          <FaFileCode className="text-green-400 mr-2 w-4 h-4" />
          <span className="text-gray-300">package.json</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Distribución de archivos</span>
          <span>100%</span>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden">
          <div className="bg-blue-500 w-3/12" title="TypeScript"></div>
          <div className="bg-green-500 w-4/12" title="JavaScript"></div>
          <div className="bg-purple-500 w-3/12" title="CSS"></div>
          <div className="bg-gray-600 w-2/12" title="Otros"></div>
        </div>
        <div className="flex justify-between mt-1 text-xxs text-gray-400">
          <span>.tsx</span>
          <span>.js</span>
          <span>.css</span>
          <span>otros</span>
        </div>
      </div>
    </div>
  </div>
);

export default RepoSummary;
