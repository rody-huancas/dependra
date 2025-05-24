import { Poppins } from 'next/font/google';
import { metadata } from './metadata';
import "@/styles/globals.css";
import { cn } from '@/utils/functions';

const poppins = Poppins({
  weight  : ["400", "500", "600", "700"],
  subsets : ["latin"],
  variable: "--font-poppins",
});

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/og-image.png" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={cn("antialiased relative h-dvh overflow-x-hidden", poppins.className)}  cz-shortcut-listen="true">
        <div className="absolute top-0 z-[-2] h-full w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        {children}
      </body>
    </html>
  );
}
