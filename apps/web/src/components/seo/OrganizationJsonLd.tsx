const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://koosdoos.co.za";

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KoosDoos Fire Pits",
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.svg`,
    description:
      "Premium laser-cut steel fire pits for the serious braai enthusiast. Flat-pack design, rugged construction.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pretoria",
      addressRegion: "Gauteng",
      addressCountry: "ZA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+27-12-345-6789",
      contactType: "customer service",
      email: "info@koosdoos.co.za",
      availableLanguage: ["English", "Afrikaans"],
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
