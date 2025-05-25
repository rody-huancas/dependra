import { cn } from "@/utils/functions";
import Link from "next/link";

interface Props {
  isHovered      : boolean;
  setIsHovered   : (hovered: boolean) => void;
}

const MainHeader = ({ isHovered, setIsHovered }: Props) => (
  <>
    <div className="inline-flex items-center px-4 py-2 mb-4 md:mb-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
      <span className="text-white text-xs md:text-sm font-bold">
        Visualiza la estructura de tu proyecto
      </span>
    </div>

    <h1
      className={cn(
        "text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 md:mb-6 leading-tight tracking-tight transition-all duration-500",
        isHovered && "scale-105"
      )}
    >
      VISUALIZA REPOSITORIOS
      <br />
      <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
        COMO NUNCA ANTES
      </span>
    </h1>

    <Link
      href="/analyze-repository"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="mb-8 md:mb-16 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-full font-bold text-base md:text-lg text-white transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-blue-500/25 cursor-pointer"
    >
      Iniciar Análisis
    </Link>
  </>
);

export default MainHeader;
