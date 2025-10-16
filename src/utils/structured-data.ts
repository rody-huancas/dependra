/**
 * JSON-LD Structured Data for SEO
 * Implements Schema.org markup for Person, Organization, and WebApplication
 */

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Rody Huancas",
  "url": "https://github.com/rody-huancas",
  "image": "https://dependra.novtiq.com/logo-dependra.jpeg",
  "sameAs": [
    "https://github.com/rody-huancas",
    "https://dependra.novtiq.com"
  ],
  "jobTitle": "Full Stack Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "Novtiq"
  },
  "knowsAbout": [
    "Web Development",
    "Software Architecture",
    "Full Stack Development",
    "TypeScript",
    "React",
    "Next.js",
    "Software Engineering",
    "Code Analysis",
    "Technology Innovation"
  ],
  "description": "Full Stack Developer especializado en desarrollo web, arquitectura de software e innovación tecnológica. Creador de Dependra, herramienta de análisis y visualización de repositorios GitHub."
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Dependra",
  "url": "https://dependra.novtiq.com",
  "logo": "https://dependra.novtiq.com/logo-dependra.jpeg",
  "description": "Plataforma profesional de análisis y visualización de repositorios GitHub desarrollada por Rody Huancas",
  "founder": {
    "@type": "Person",
    "name": "Rody Huancas",
    "url": "https://github.com/rody-huancas"
  },
  "parentOrganization": {
    "@type": "Organization",
    "name": "Novtiq"
  },
  "sameAs": [
    "https://github.com/rody-huancas/dependra"
  ]
};

export const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Dependra",
  "url": "https://dependra.novtiq.com",
  "description": "Herramienta profesional para analizar y visualizar la estructura de dependencias de repositorios GitHub. Analiza arquitectura de software, estructura de código y proyectos full stack con diagramas interactivos.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Person",
    "name": "Rody Huancas",
    "url": "https://github.com/rody-huancas"
  },
  "creator": {
    "@type": "Person",
    "name": "Rody Huancas",
    "url": "https://github.com/rody-huancas"
  },
  "featureList": [
    "Visualización interactiva de repositorios GitHub",
    "Análisis de dependencias de código",
    "Diagramas de arquitectura de software",
    "Exploración de estructura de proyectos",
    "Análisis de código en tiempo real",
    "Integración con GitHub API"
  ],
  "screenshot": "https://dependra.novtiq.com/preview.png",
  "image": "https://dependra.novtiq.com/og-image.png",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "ratingCount": "1"
  }
};

export const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://dependra.novtiq.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Análisis de Repositorio",
      "item": "https://dependra.novtiq.com/analyze-repository"
    }
  ]
};
