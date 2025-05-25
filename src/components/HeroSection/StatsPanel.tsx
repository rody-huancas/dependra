const StatsPanel = () => (
  <div className="col-span-1 md:col-span-3 space-y-2 md:space-y-4">
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-3 md:p-4">
      <div className="text-white text-xxs md:text-xs mb-1 md:mb-2">
        Total de Archivos
      </div>
      <div className="text-white text-xl md:text-2xl font-bold mb-1 md:mb-2">
        156
      </div>
      <div className="text-blue-200 text-xxs md:text-xs">+12 esta semana</div>
    </div>

    <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-3 md:p-4">
      <div className="text-white text-xxs md:text-xs mb-1 md:mb-2">
        Tamaño del Proyecto
      </div>
      <div className="text-white text-xl md:text-2xl font-bold mb-1 md:mb-2">
        89 MB
      </div>
      <div className="w-full bg-green-200 rounded-full h-1 md:h-2">
        <div
          className="bg-white h-1 md:h-2 rounded-full"
          style={{ width: "89%" }}
        ></div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-blue-800 to-indigo-800 rounded-xl p-3 md:p-4">
      <div className="text-white text-xxs md:text-xs mb-1 md:mb-2">
        Lenguajes Detectados
      </div>
      <div className="text-white text-xl md:text-2xl font-bold mb-1 md:mb-2">
        4
      </div>
      <div className="flex flex-wrap gap-1">
        <span className="text-[10px] px-2 py-0.5 bg-white/20 rounded-full text-white">
          JavaScript
        </span>
        <span className="text-[10px] px-2 py-0.5 bg-white/20 rounded-full text-white">
          TypeScript
        </span>
        <span className="text-[10px] px-2 py-0.5 bg-white/20 rounded-full text-white">
          CSS
        </span>
        <span className="text-[10px] px-2 py-0.5 bg-white/20 rounded-full text-white">
          JSON
        </span>
      </div>
    </div>
  </div>
);

export default StatsPanel;
