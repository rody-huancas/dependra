import Link from "next/link";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  return (
    <header className="w-[80%] fixed top-5 left-1/2 -translate-x-1/2 z-30 rounded-2xl h-24 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
      <div className="h-full px-8 flex items-center justify-between">
        <Link href="/" className="relative w-16 h-16 sm:w-40 sm:h-16 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 group">
          <Image
            src="/logo-dependra.jpeg"
            alt="logo"
            fill
            className="object-cover rounded-xl hidden sm:block"
          />
          <Image
            src="/og-image.png"
            alt="logo"
            fill
            className="rounded-xl sm:hidden"
          />
        </Link>
        
        <nav className="flex items-center space-x-3">
          <a 
            href="https://github.com/rody-huancas/dependra" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/90 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer"
          >
            <FaGithub className="w-6 h-6 dark:text-white text-gray-700" />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};
