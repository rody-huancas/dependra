import { FaGithub } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer
      className="w-full py-6 mt-auto border-t border-gray-800"
      aria-label="Footer de la aplicación Dependra"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      <div className="w-[90%] md:w-[80%] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm mb-4">
          <p className="text-gray-700 dark:text-gray-400 z-20">
            © {new Date().getFullYear()}{" "}
            <span itemProp="name">
              <strong>Dependra</strong>
            </span>
            . Desarrollado por{" "}
            <a
              href="https://github.com/rody-huancas"
              target="_blank"
              rel="noopener noreferrer author"
              className="text-blue-500 hover:text-blue-600 cursor-pointer font-semibold"
              itemProp="creator"
              itemScope
              itemType="https://schema.org/Person"
            >
              <span itemProp="name">Rody Huancas</span>
            </a>
            {" "}| Full Stack Developer | Novtiq
          </p>

          <div
            className="flex items-center gap-6 z-20"
            aria-label="Enlaces profesionales y redes sociales"
          >
            <a
              href="https://github.com/rody-huancas"
              target="_blank"
              rel="noopener noreferrer author"
              className="hover:text-white transition-colors cursor-pointer text-gray-700 dark:text-gray-400"
              aria-label="Perfil de GitHub de Rody Huancas - Full Stack Developer"
              title="Ver perfil de GitHub - Rody Huancas | Proyectos de desarrollo web"
              itemProp="sameAs"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://github.com/rody-huancas/dependra"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-400 hover:text-blue-500 transition-colors text-xs font-medium"
              title="Repositorio de Dependra en GitHub"
            >
              Repositorio
            </a>
          </div>
        </div>
        
        <div className="text-xs text-center text-gray-600 dark:text-gray-500 z-20">
          <p>
            <strong>Dependra</strong> - Herramienta profesional de análisis y visualización de repositorios GitHub.
            Especializado en arquitectura de software, análisis de dependencias y desarrollo web full stack.
          </p>
        </div>
      </div>
    </footer>
  );
};
