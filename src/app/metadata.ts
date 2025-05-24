import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dependra - Visualizador de Dependencias de Repositorios',
  description: 'Analiza y visualiza la estructura de dependencias de tu repositorio de GitHub de manera interactiva. Explora la arquitectura de tu proyecto con nuestro visualizador intuitivo.',
  keywords: 'dependencias, github, visualizador, repositorio, arquitectura, código, análisis, diagrama',
  authors: [{ name: 'Novtiq' }],
  creator: 'Novtiq',
  publisher: 'Novtiq',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://dependra.novtiq.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Dependra - Visualizador de Dependencias de Repositorios',
    description: 'Analiza y visualiza la estructura de dependencias de tu repositorio de GitHub de manera interactiva.',
    url: 'https://dependra.novtiq.com',
    siteName: 'Dependra',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dependra - Visualizador de Dependencias',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dependra - Visualizador de Dependencias de Repositorios',
    description: 'Analiza y visualiza la estructura de dependencias de tu repositorio de GitHub de manera interactiva.',
    images: ['/logo-dependra.jpeg'],
    creator: '@rodyhuancas',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
}; 