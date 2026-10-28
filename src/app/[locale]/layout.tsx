import { Cormorant_Garamond, DM_Sans, Noto_Sans_Tamil, Noto_Serif_Tamil } from "next/font/google";
import { LanguageProvider } from "@/i18n/LanguageContext";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import StructuredData from "@/components/StructuredData";
import Analytics from "@/components/Analytics";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-dmsans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const notoTamilSans = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-notosans-tamil",
  display: "swap",
  fallback: ["sans-serif"],
});

const notoTamilSerif = Noto_Serif_Tamil({
  subsets: ["tamil"],
  weight: ["400", "500", "700"],
  variable: "--font-notoserif-tamil",
  display: "swap",
  fallback: ["serif"],
});

type Locale = "en" | "ta";

export async function generateMetadata() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://danamholdings.in";

  return {
    title: {
      default: "Danam Holdings | Civil Engineering & Turnkey EPC Construction Madurai",
      template: "%s | Danam Holdings",
    },
    description:
      "Danam Holdings, Madurai – Turnkey civil construction, structural steel, architectural 3D visualization, renovation, and EPC project management across South India.",
    metadataBase: new URL(siteUrl),
    keywords: [
      "civil engineering Madurai",
      "turnkey construction Tamil Nadu",
      "luxury villa construction Madurai",
      "3D architectural elevation",
      "360 virtual tour builder",
      "IS 456 concrete testing",
      "itemized BOQ contractor",
      "commercial showroom builder Madurai",
    ],
    authors: [{ name: "Danam Holdings" }],
    creator: "Danam Holdings",
    publisher: "Danam Holdings",
    alternates: {
      canonical: "/",
      languages: {
        en: "/en",
        ta: "/ta",
      },
    },
    openGraph: {
      title: "Danam Holdings | Civil Engineering & Turnkey EPC Construction",
      description:
        "Premier civil engineering, turnkey luxury villas, 3D architectural walkarounds, and itemized BOQ transparency across South India.",
      url: siteUrl,
      siteName: "Danam Holdings",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: "/images/danam/about-villa.webp",
          width: 1200,
          height: 630,
          alt: "Danam Holdings Luxury Villa 3D Walkaround & Turnkey Construction",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Danam Holdings | Civil Engineering & Turnkey EPC Construction",
      description:
        "Turnkey luxury villa construction, structural engineering, 3D architectural models, and on-time delivery across Tamil Nadu.",
      images: ["/images/danam/about-villa.webp"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = (locale === "ta" ? "ta" : "en") as Locale;

  return (
    <html
      lang={safeLocale}
      className={`${cormorant.variable} ${dmSans.variable} ${notoTamilSans.variable} ${notoTamilSerif.variable} h-full antialiased`}
    >
      <body className="font-ui min-h-full flex flex-col relative bg-surface-0 text-text-primary">
        <LanguageProvider initialLocale={safeLocale}>
          {/* SEO Structured Data Schema */}
          <StructuredData />

          {/* Marketing Analytics & Pixels */}
          <Analytics />

          {/* Smooth Scroll via Lenis */}
          <SmoothScroll />

          {/* Fixed Top Navbar */}
          <Navbar />
          
          {/* Main viewport */}
          <main className="flex-1">{children}</main>
          
          {/* Footer, WhatsApp Floating widget & Quick Lead Modal */}
          <Footer />
          <WhatsAppFloat />
          <LeadCaptureModal />
        </LanguageProvider>
      </body>
    </html>
  );
}
