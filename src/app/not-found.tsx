import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Página No Encontrada | Dependra",
  description: "La página que buscas no existe. Vuelve a la página principal de Dependra para analizar repositorios GitHub.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-900 text-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="space-y-6 px-4 relative z-10">
        <div className="relative">
          <h1 className="text-8xl font-bold text-blue-500 animate-bounce">
            404
          </h1>
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-ping"></div>
        </div>

        <h2 className="text-2xl font-light text-gray-300 animate-fade-in">
          Página no encontrada
        </h2>

        <p className="text-gray-400 max-w-md animate-fade-in delay-200">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>

        <div className="flex items-center justify-center space-x-4 mt-8">
          <Link
            href="/"
            className="group relative inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10">Volver al inicio</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>

        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
