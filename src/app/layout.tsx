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
      <body className={cn("antialiased", poppins.className)}>{children}</body>
    </html>
  );
}
