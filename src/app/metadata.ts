import { Metadata } from 'next';

export const metadata: Metadata = {
  title      : 'Dependra - Visualizador de Dependencias de Repositorios GitHub',
  description: 'Herramienta gratuita para analizar y visualizar la estructura de dependencias de repositorios GitHub. Crea diagramas interactivos, identifica dependencias obsoletas y optimiza tu código con nuestro visualizador intuitivo.',
  keywords   : 'dependencias, github, visualizador, repositorio, arquitectura, código, análisis, diagrama, desarrollo web, programación, herramientas de desarrollo, análisis de código, visualización de datos',
  authors    : [
    { 
      name: 'Rody Huancas',
      url : 'https://github.com/rody-huancas'
    }
  ],
  creator        : 'Rody Huancas',
  publisher      : 'Rody Huancas',
  formatDetection: {
    email    : false,
    address  : false,
    telephone: false,
  },
  metadataBase: new URL('https://dependra.novtiq.com'),
  alternates  : {
    canonical: '/',
  },
  openGraph: {
    title      : 'Dependra - Visualizador de Dependencias de Repositorios GitHub',
    description: 'Herramienta gratuita para analizar y visualizar la estructura de dependencias de repositorios GitHub. Crea diagramas interactivos y optimiza tu código.',
    url        : 'https://dependra.novtiq.com',
    siteName   : 'Dependra',
    locale     : 'es_ES',
    type       : 'website',
    images     : [
      {
        url   : '/og-image.png',
        width : 1200,
        height: 630,
        alt   : 'Dependra - Visualizador de Dependencias de Repositorios GitHub',
      },
    ],
  },
  twitter: {
    card       : 'summary_large_image',
    title      : 'Dependra - Visualizador de Dependencias de Repositorios GitHub',
    description: 'Herramienta gratuita para analizar y visualizar la estructura de dependencias de repositorios GitHub. Crea diagramas interactivos y optimiza tu código.',
    images     : ['/logo-dependra.jpeg'],
    creator    : '@rodyhuancas',
    site       : '@dependra',
  },
  robots: {
    index    : true,
    follow   : true,
    googleBot: {
      index              : true,
      follow             : true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet'      : -1,
    },
  },
  category      : 'technology',
  classification: 'Web Development Tools',
  referrer      : 'origin-when-cross-origin',
  themeColor    : '#ffffff',
  viewport      : {
    width       : 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  applicationName: 'Dependra',
  appleWebApp    : {
    capable       : true,
    statusBarStyle: 'default',
    title         : 'Dependra',
  },
  manifest: '/manifest.json',
}; 