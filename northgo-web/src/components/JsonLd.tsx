import { offices } from "@/content/offices";
import { siteConfig } from "@/lib/site";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    description: siteConfig.tagline,
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 50,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "7F., No. 10, Sec. 3, Minsheng E. Rd.",
      addressLocality: "Taipei City",
      postalCode: "104511",
      addressCountry: "TW",
    },
    location: offices.map((o) => ({
      "@type": "LocalBusiness",
      name: o.names.en,
      email: o.email,
      telephone: o.tel,
      address: {
        "@type": "PostalAddress",
        streetAddress: o.addresses.en,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: o.lat,
        longitude: o.lng,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
