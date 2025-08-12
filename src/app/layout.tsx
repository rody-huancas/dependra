import { Poppins } from 'next/font/google';
import { cn } from '@/utils/functions';
import { metadata } from './metadata';
import "@/styles/globals.css";
import { ProgressBarProvider } from '@/components/common/ProgressBarProvider';

const poppins = Poppins({
  weight  : ["400", "500", "600", "700"],
  subsets : ["latin"],
  variable: "--font-poppins",
});

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={cn("antialiased relative overflow-x-hidden", poppins.className)}  cz-shortcut-listen="true">
        <ProgressBarProvider />
        
        <div className="absolute top-0 z-[-2] h-full w-full bg-light dark:bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0V0zm20 20v20h20V20H20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        {children}
      </body>
    </html>
  );
}
