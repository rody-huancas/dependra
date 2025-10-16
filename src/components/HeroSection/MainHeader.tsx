import Link from "next/link";
import { cn } from "@/utils/functions";
import { GiBranchArrow } from "react-icons/gi";
import { HiOutlineArrowRight } from "react-icons/hi";
import { VscGithub, VscEye, VscCode } from "react-icons/vsc";

interface Props {
  isHovered   : boolean;
  setIsHovered: (hovered: boolean) => void;
}

const MainHeader = ({ isHovered, setIsHovered }: Props) => (
  <>
    <div className="group relative inline-flex items-center gap-2 px-4 py-2 mb-6 md:mb-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm transition-all duration-300 hover:border-blue-500/40 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20">
      <div className="flex items-center gap-2">
        <div className="p-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
          <VscEye className="w-3 h-3 text-white" />
        </div>
        <span className="text-blue-600 dark:text-blue-400 text-xs md:text-sm font-semibold">
          Explora • Analiza • Visualiza
        </span>
      </div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
    </div>

    <header className="relative mb-6 md:mb-8">
      <h1
        className={cn(
          "text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-tight tracking-tight transition-all duration-500",
          isHovered && "scale-105"
        )}
      >
        DEPENDRA
        <br />
        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-gradient-x">
          VISUALIZA TU CÓDIGO
        </span>
      </h1>

      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
    </header>

    <section className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 md:mb-10 max-w-4xl mx-auto leading-relaxed">
      <p>
        Convierte cualquier repositorio de GitHub en una
        <span className="text-blue-600 dark:text-blue-400 font-semibold">
          {" "}
          experiencia visual interactiva
        </span>
        . Descubre dependencias, analiza la{" "}
        <strong>arquitectura de software</strong> y comprende tu código de forma sencilla e intuitiva.
      </p>
      <p className="mt-4 text-base md:text-lg">
        Desarrollado por{" "}
        <a 
          href="https://github.com/rody-huancas" 
          target="_blank" 
          rel="noopener noreferrer author"
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          title="Rody Huancas - Full Stack Developer"
        >
          Rody Huancas
        </a>
        , especialista en{" "}
        <strong>desarrollo web full stack</strong> e{" "}
        <strong>innovación tecnológica</strong>.
      </p>
    </section>

    <nav className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 md:mb-12" aria-label="Características principales">
      <div className="flex items-center gap-2 px-3 py-2 bg-white/50 dark:bg-gray-800/50 rounded-full backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        <VscGithub className="w-4 h-4 text-blue-500" aria-hidden="true" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Integración con GitHub
        </span>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 bg-white/50 dark:bg-gray-800/50 rounded-full backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        <GiBranchArrow className="w-4 h-4 text-purple-500" aria-hidden="true" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Análisis de dependencias
        </span>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 bg-white/50 dark:bg-gray-800/50 rounded-full backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        <VscCode className="w-4 h-4 text-cyan-500" aria-hidden="true" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Visualización interactiva
        </span>
      </div>
    </nav>

    <div className="relative group mb-20">
      <Link
        href="/analyze-repository"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative inline-flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-full font-bold text-base md:text-lg text-white transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 cursor-pointer overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <VscGithub className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
        <span>Analizar repositorio</span>
        <HiOutlineArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />

        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-ping" />
      </Link>
    </div>
  </>
);

export default MainHeader;
