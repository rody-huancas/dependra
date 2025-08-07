import { FaGithub } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer
      className="w-full py-6 mt-auto border-t border-gray-800"
      aria-label="Footer de la aplicación Dependra"
    >
      <div className="w-[90%] md:w-[80%] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <p className="text-gray-700 dark:text-gray-400 z-20">
          © {new Date().getFullYear()} Dependra. Desarrollado por{" "}
          <a
            href="https://github.com/rody-huancas"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 cursor-pointer"
          >
            Rody Huancas
          </a>
          .
        </p>

        <div
          className="flex items-center gap-6 z-20"
          aria-label="Redes sociales del desarrollador"
        >
          <a
            href="https://github.com/rody-huancas "
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors cursor-pointer text-gray-700 dark:text-gray-400"
            aria-label="Perfil de GitHub de Rody Huancas"
            title="Ver perfil de GitHub - Rody Huancas"
            itemProp="sameAs"
          >
            <FaGithub size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};
