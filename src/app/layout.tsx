import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import { cn } from "@/utils/functions";
import "@/styles/globals.css";

const poppins = Poppins({
  weight  : ["400", "500", "600", "700"],
  subsets : ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Dependra",
  description: "Visualiza automáticamente la arquitectura de tus proyectos de software. Analiza dependencias, módulos y capas generando diagramas interactivos para entender la estructura del sistema."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={cn("antialiased relative overflow-x-hidden", poppins.className)}>
        <div className="absolute top-0 z-[-2] h-full w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        {children}
      </body>
    </html>
  );
}
