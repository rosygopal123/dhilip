import React from "react";

export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://danamholdings.in";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["GeneralContractor", "HomeAndConstructionBusiness"],
        "@id": `${baseUrl}/#organization`,
        name: "Danam Holdings",
        alternateName: "Danam Holdings Civil Engineering & Turnkey EPC",
        url: baseUrl,
        logo: `${baseUrl}/images/danam/dhlogo.webp`,
        image: `${baseUrl}/images/danam/about-villa.webp`,
        description:
          "Premier civil engineering, turnkey villa construction, structural engineering, 3D architectural visualization, and interior execution in Madurai and across Tamil Nadu.",
        telephone: "+91-88833-32499",
        sameAs: [
          "https://wa.me/918883332499",
          "https://www.instagram.com/danamholdings",
          "https://www.facebook.com/danamholdings",
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: "Kamarajar Salai / KK Nagar",
          addressLocality: "Madurai",
          addressRegion: "Tamil Nadu",
          postalCode: "625009",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 9.9252,
          longitude: 78.1198,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "09:00",
            closes: "19:00",
          },
        ],
        priceRange: "₹₹₹",
        currenciesAccepted: "INR",
        paymentAccepted: "Bank Transfer, Cheque, UPI",
        areaServed: [
          { "@type": "City", name: "Madurai" },
          { "@type": "City", name: "Chennai" },
          { "@type": "City", name: "Coimbatore" },
          { "@type": "City", name: "Trichy" },
          { "@type": "City", name: "Salem" },
          { "@type": "State", name: "Tamil Nadu" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Civil Construction Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Turnkey Residential Villa Construction",
                description:
                  "Comprehensive design, structural engineering, IS-456 RCC framework, 3D architectural elevation, and turnkey handover.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Commercial Showroom & Retail Infrastructure",
                description:
                  "Heavy-duty column grid commercial construction, facade engineering, and MEP installations.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "3D Architectural Walkarounds & 360° Virtual Tours",
                description:
                  "WebGL 3D architectural modeling, digital BOQ estimation, and photorealistic equirectangular virtual walkarounds.",
              },
            },
          ],
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
