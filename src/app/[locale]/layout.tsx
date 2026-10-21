import { Cormorant_Garamond, DM_Sans, Noto_Sans_Tamil, Noto_Serif_Tamil } from "next/font/google";
import { LanguageProvider } from "@/i18n/LanguageContext";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import LeadCaptureModal from "@/components/LeadCaptureModal";
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
  return {
    title: "Danam Holdings | Civil Engineering & Turnkey EPC Construction Madurai",
    description: "Danam Holdings, Madurai – Turnkey civil construction, structural steel, architectural 3D visualization, renovation, and EPC project management across South India.",
    metadataBase: new URL("https://danamholdings.com"),
    openGraph: {
      title: "Danam Holdings | Towards Fortune Unfoldings",
      description: "Premier civil engineering & turnkey EPC construction across South India.",
      type: "website",
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
