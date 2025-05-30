import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center bg-[var(--background)] text-[var(--foreground)]">
      <h1 className="text-6xl mb-4">404</h1>
      <h2 className="text-3xl mb-4">Página no encontrada</h2>
      <p className="mb-8">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <Link href="/">
        <span className="text-blue-500 underline cursor-pointer">
          Volver al inicio
        </span>
      </Link>
    </div>
  );
}
