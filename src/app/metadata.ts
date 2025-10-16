import { Metadata } from 'next';

export const metadata: Metadata = {
  title      : 'Dependra - Visualizador de Dependencias GitHub | Desarrollo Web por Rody Huancas',
  description: 'Herramienta profesional de análisis y visualización de repositorios GitHub desarrollada por Rody Huancas. Analiza dependencias, arquitectura de software, estructura de código y proyectos full stack. Optimiza tu desarrollo web con diagramas interactivos y visualización de datos en tiempo real.',
  keywords   : 'dependra, rody huancas, desarrollo web, full stack developer, arquitectura de software, análisis de código, visualización de dependencias, github, repositorio, herramientas de desarrollo, innovación tecnológica, novtiq, programación, typescript, react, next.js, diagramas interactivos, análisis de proyectos, software engineering, web development tools',
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
    title      : 'Dependra - Visualizador de Dependencias GitHub | Desarrollo Web por Rody Huancas',
    description: 'Herramienta profesional de análisis y visualización de repositorios GitHub desarrollada por Rody Huancas. Analiza dependencias, arquitectura de software y estructura de código. Optimiza tu desarrollo web con diagramas interactivos.',
    url        : 'https://dependra.novtiq.com',
    siteName   : 'Dependra by Rody Huancas',
    locale     : 'es_ES',
    type       : 'website',
    images     : [
      {
        url   : '/og-image.png',
        width : 1200,
        height: 630,
        alt   : 'Dependra - Visualizador de Dependencias GitHub creado por Rody Huancas - Análisis de arquitectura de software',
      },
    ],
  },
  twitter: {
    card       : 'summary_large_image',
    title      : 'Dependra - Visualizador de Dependencias GitHub | Rody Huancas',
    description: 'Herramienta profesional de análisis y visualización de repositorios GitHub. Desarrollada por Rody Huancas para analizar dependencias, arquitectura de software y estructura de código.',
    images     : ['/og-image.png'],
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
  themeColor    : '#3b82f6',
  viewport      : {
    width                 : 'device-width',
    initialScale          : 1,
    maximumScale          : 5,
    userScalable          : true,
    viewportFit           : 'cover',
  },
  applicationName: 'Dependra',
  appleWebApp    : {
    capable       : true,
    statusBarStyle: 'black-translucent',
    title         : 'Dependra',
  },
  manifest: '/manifest.json',
  verification: {
    google: '',
    yandex: '',
    bing  : '',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Dependra',
    'application-name': 'Dependra',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#3b82f6',
  },
}; 