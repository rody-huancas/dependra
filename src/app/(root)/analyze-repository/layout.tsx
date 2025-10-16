import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analizar Repositorio GitHub - Dependra | Herramienta de Visualización',
  description: 'Analiza y visualiza repositorios GitHub en tiempo real. Descubre la arquitectura de software, dependencias y estructura de código con diagramas interactivos. Herramienta profesional de desarrollo web por Rody Huancas.',
  keywords: 'analizar repositorio github, visualización de código, arquitectura de software, análisis de dependencias, desarrollo web, full stack, rody huancas, dependra',
  openGraph: {
    title: 'Analizar Repositorio GitHub - Dependra',
    description: 'Analiza y visualiza repositorios GitHub con diagramas interactivos',
    url: 'https://dependra.novtiq.com/analyze-repository',
  },
  alternates: {
    canonical: '/analyze-repository',
  },
};

export default function AnalyzeRepositoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
