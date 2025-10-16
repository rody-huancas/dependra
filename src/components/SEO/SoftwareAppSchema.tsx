/**
 * Software Application Schema for SEO
 * Additional structured data for software application
 */

export const SoftwareAppSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Dependra",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser, All",
    "url": "https://dependra.novtiq.com",
    "description": "Herramienta profesional para analizar y visualizar la estructura de dependencias de repositorios GitHub. Desarrollada por Rody Huancas, especialista en desarrollo web full stack e innovación tecnológica.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "applicationSubCategory": "Development Tool",
    "downloadUrl": "https://dependra.novtiq.com",
    "softwareVersion": "1.0",
    "author": {
      "@type": "Person",
      "name": "Rody Huancas",
      "url": "https://github.com/rody-huancas",
      "jobTitle": "Full Stack Developer",
      "worksFor": {
        "@type": "Organization",
        "name": "Novtiq"
      }
    },
    "creator": {
      "@type": "Person",
      "name": "Rody Huancas",
      "url": "https://github.com/rody-huancas"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Novtiq",
      "url": "https://dependra.novtiq.com"
    },
    "screenshot": "https://dependra.novtiq.com/preview.png",
    "image": "https://dependra.novtiq.com/og-image.png",
    "featureList": [
      "Visualización interactiva de repositorios GitHub",
      "Análisis de dependencias de código",
      "Diagramas de arquitectura de software",
      "Exploración de estructura de proyectos",
      "Análisis en tiempo real",
      "Integración completa con GitHub API",
      "Soporte para múltiples lenguajes de programación",
      "Interfaz intuitiva y moderna"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "1",
      "bestRating": "5",
      "worstRating": "1"
    },
    "inLanguage": "es-ES",
    "keywords": "desarrollo web, análisis de código, visualización de dependencias, github, arquitectura de software, full stack, herramientas de desarrollo, rody huancas",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareHelp": {
      "@type": "CreativeWork",
      "url": "https://github.com/rody-huancas/dependra"
    },
    "isAccessibleForFree": true
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
