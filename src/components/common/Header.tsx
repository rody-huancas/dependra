import Image from "next/image";
import { BsSun } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";

export const Header = () => {
  return (
    <header className="w-[80%] fixed top-5 left-1/2 -translate-x-1/2 z-10 rounded-2xl h-24 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
      <div className="container mx-auto h-full px-8 flex items-center justify-between">
        <div className="relative w-40 h-16 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Image
            src="/logo-dependra.jpeg"
            alt="logo"
            fill
            className="object-cover rounded-xl"
          />
        </div>
        
        <nav className="flex items-center space-x-3">
          <a 
            href="https://github.com/rody-huancas/dependra" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/90 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <FaGithub className="w-6 h-6" />
          </a>
          <button 
            className="text-white/90 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <BsSun className="w-6 h-6" />
          </button>
        </nav>
      </div>
    </header>
  );
};
