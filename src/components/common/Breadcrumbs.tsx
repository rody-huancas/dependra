import Link from "next/link";
import { FaHome, FaChevronRight } from "react-icons/fa";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://dependra.novtiq.com"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.name,
        "item": item.href ? `https://dependra.novtiq.com${item.href}` : undefined
      }))
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav 
        aria-label="Breadcrumb" 
        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6"
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        <Link 
          href="/" 
          className="flex items-center hover:text-blue-500 transition-colors"
          itemProp="itemListElement" 
          itemScope 
          itemType="https://schema.org/ListItem"
        >
          <meta itemProp="position" content="1" />
          <FaHome className="w-4 h-4" aria-hidden="true" />
          <span className="sr-only" itemProp="name">Inicio</span>
          <link itemProp="item" href="https://dependra.novtiq.com" />
        </Link>
        
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <FaChevronRight className="w-3 h-3" aria-hidden="true" />
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-blue-500 transition-colors"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={String(index + 2)} />
                <span itemProp="name">{item.name}</span>
                <link itemProp="item" href={`https://dependra.novtiq.com${item.href}`} />
              </Link>
            ) : (
              <span 
                className="text-gray-900 dark:text-white font-medium"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                aria-current="page"
              >
                <meta itemProp="position" content={String(index + 2)} />
                <span itemProp="name">{item.name}</span>
              </span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
};
