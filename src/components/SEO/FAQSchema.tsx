/**
 * FAQ Schema Component for SEO
 * Implements FAQ structured data for better search visibility
 */

interface FAQItem {
  question: string;
  answer  : string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export const FAQSchema = ({ faqs }: FAQSchemaProps) => {
  const schema = {
    "@context"  : "https://schema.org",
    "@type"     : "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type"         : "Question",
      "name"          : faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text" : faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// Default FAQs for Dependra
export const defaultFAQs: FAQItem[] = [
  {
    question: "¿Qué es Dependra?",
    answer  : "Dependra es una herramienta profesional desarrollada por Rody Huancas para analizar y visualizar la estructura de dependencias de repositorios GitHub. Permite explorar la arquitectura de software, analizar dependencias y comprender la estructura del código mediante diagramas interactivos."
  },
  {
    question: "¿Cómo funciona Dependra?",
    answer  : "Dependra se conecta a la API de GitHub para obtener información del repositorio. Luego analiza la estructura de archivos, dependencias y relaciones para crear una visualización interactiva que te permite explorar la arquitectura del proyecto de manera intuitiva."
  },
  {
    question: "¿Es gratuito usar Dependra?",
    answer  : "Sí, Dependra es completamente gratuito. Es una herramienta de código abierto desarrollada por Rody Huancas para la comunidad de desarrolladores."
  },
  {
    question: "¿Qué tipos de repositorios puedo analizar?",
    answer  : "Puedes analizar cualquier repositorio público de GitHub. Dependra es compatible con múltiples lenguajes de programación y frameworks, incluyendo JavaScript, TypeScript, React, Next.js, Python, Java y muchos más."
  },
  {
    question: "¿Quién creó Dependra?",
    answer  : "Dependra fue desarrollado por Rody Huancas, un Full Stack Developer especializado en desarrollo web, arquitectura de software e innovación tecnológica. Puedes encontrar más proyectos en su perfil de GitHub: https://github.com/rody-huancas"
  },
  {
    question: "¿Cómo mejora Dependra mi flujo de trabajo?",
    answer  : "Dependra te ayuda a comprender rápidamente la arquitectura de cualquier proyecto, identificar dependencias, detectar patrones de diseño y explorar la estructura del código de manera visual. Esto es especialmente útil al trabajar con proyectos grandes o al contribuir a proyectos open source."
  }
];
