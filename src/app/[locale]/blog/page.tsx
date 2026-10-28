"use client";
import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Calendar, Clock, Share2, ArrowRight, X, PhoneCall } from "lucide-react";

interface Article {
  slug: string;
  category: string;
  catLabel: { en: string; ta: string };
  date: string;
  readTime: string;
  cover: string;
  title: { en: string; ta: string };
  excerpt: { en: string; ta: string };
  content: { en: string; ta: string };
}

export default function BlogPage() {
  const { locale, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [phoneInput, setPhoneInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Categories list
  const categories = [
    { key: "all", en: "All Articles", ta: "அனைத்தும்" },
    { key: "vastu", en: "Vastu Tips", ta: "வாஸ்து குறிப்புகள்" },
    { key: "material", en: "Material Guide", ta: "பொருள் வழிகாட்டி" },
    { key: "legal", en: "Legal & Finance", ta: "சட்டம் & நிதி" },
    { key: "cost", en: "Cost Guide", ta: "செலவு கணக்கு" },
    { key: "stories", en: "Project Stories", ta: "திட்ட கதைகள்" }
  ];

  // 7 Priority SEO Articles - Full Bilingual Database
  const articles = [
    {
      slug: "construction-cost-chennai-2026",
      category: "cost",
      catLabel: { en: "Cost Guide", ta: "செலவு கணக்கு" },
      date: "May 24, 2026",
      readTime: "5 min read",
      cover: "/assets/blog_cost.png",
      title: {
        en: "Home Construction Cost in Chennai & Madurai 2026 Guide",
        ta: "Chennai & Madurai-ல் வீடு கட்ட ஆகும் செலவு 2026 வழிகாட்டி"
      },
      excerpt: {
        en: "Discover the latest raw material rates, labor costs, and FSI permit fees in Tamil Nadu's metro cities for 2026.",
        ta: "2026-ஆம் ஆண்டில் சென்னை மற்றும் மதுரையில் செங்கல், கம்பிகள், சிமெண்ட் மற்றும் லேபர் கூலி ஆகியவற்றின் தற்போதைய விலை நிலவரம்."
      },
      content: {
        en: `Building a home in Tamil Nadu during 2026 requires understanding the post-pandemic stabilization of raw material prices. Currently, the basic average cost for construction ranges as follows:
- Economy Grade: Rs. 1,700 to Rs. 1,850 per Sq.Ft
- Standard Grade: Rs. 2,100 to Rs. 2,300 per Sq.Ft
- Premium Luxury Grade: Rs. 2,700 to Rs. 3,200 per Sq.Ft

Key Factors driving prices:
1. Sand & Aggregate: River sand licensing has become tighter; M-Sand is standard.
2. Steel & Reinforcement: Standard TATA Tiscon averages Rs. 75,000 per Ton.
3. Approvals: CMDA Single Window clearance fees average Rs. 1.2 Lakhs for a standard G+1 plot.`,
        ta: "2026 ஆம் ஆண்டில் தமிழ்நாட்டில் ஒரு வீடு கட்டுவதற்கு மூலப்பொருட்களின் தற்போதைய சந்தை மதிப்பை அறிவது அவசியம். சராசரி சதுர அடியின் விலை பின்வருமாறு: \n- எகானமி: சதுர அடிக்கு ₹1,700 முதல் ₹1,850 வரை \n- ஸ்டாண்டர்ட்: சதுர அடிக்கு ₹2,100 முதல் ₹2,300 வரை \n- பிரீமியம்: சதுர அடிக்கு ₹2,700 முதல் ₹3,200 வரை \n\nமுக்கிய காரணிகள்: \n1. இரும்பு கம்பிகள்: டாடா டிஸ்கான் டன் ஒன்றுக்கு சராசரியாக ₹75,000 ஆக உள்ளது. \n2. அனுமதிகள்: பஞ்சாயத்து அல்லது கார்ப்பரேஷன் வரைபட அனுமதி கட்டணம் தோராயமாக ₹50,000 முதல் ₹1,20,000 வரை தேவைப்படலாம்."
      }
    },
    {
      slug: "how-to-get-cmda-permit-madurai",
      category: "legal",
      catLabel: { en: "Legal & Finance", ta: "சட்டம் & நிதி" },
      date: "May 18, 2026",
      readTime: "6 min read",
      cover: "/assets/blog_permit.png",
      title: {
        en: "How to Secure CMDA & DTCP Permits in Madurai 2026",
        ta: "Madurai-ல் CMDA மற்றும் DTCP permit பெறுவது எப்படி?"
      },
      excerpt: {
        en: "Learn the document checklist, licensing timeframes, and single window submission procedures for layouts.",
        ta: "கட்டிட வரைபட அனுமதி பெற தேவையான ஆவணங்கள், விண்ணப்பிக்கும் முறைகள் மற்றும் கால அளவுகள் பற்றிய கையேடு."
      },
      content: {
        en: `Securing a building license in Madurai is managed online. Documents required:
1. Sale Deed & Parent Deed (Verify link paths for 30 years)
2. Land Patta (Computerized Patta, Chitta, Adangal)
3. Encumbrance Certificate (EC) for past 30 years
4. Architectural drawing scaled 1:100 showing structural grids

Timeline: DTCP approvals in outer regions take 30 to 45 days. Urban corporation permits take 20 to 30 days. Building without approved drawings is highly illegal and leads to EB disconnection.`,
        ta: "கட்டிட அனுமதி பெற ஆன்லைனில் விண்ணப்பிக்க வேண்டும். ஆவணங்கள் பட்டியல்: \n1. கிரைய பத்திரம் மற்றும் தாய் பத்திரம் (30 வருட லிங்க் பத்திரம்) \n2. பட்டா, சிட்டா, அ-பதிவேடு நகல் \n3. 30 வருட வில்லங்கச் சான்றிதழ் (EC) \n4. உரிமம் பெற்ற பொறியாளர் வரைந்த மனை வரைபடம் \n\nகால அளவு: DTCP அனுமதி பெற 30 முதல் 45 நாட்கள் வரை ஆகும். முறையான அனுமதியின்றி கட்டப்படும் கட்டிடங்களுக்கு மின் இணைப்பு வழங்கப்பட மாட்டாது."
      }
    },
    {
      slug: "tmt-steel-vs-mild-steel",
      category: "material",
      catLabel: { en: "Material Guide", ta: "பொருள் வழிகாட்டி" },
      date: "May 10, 2026",
      readTime: "4 min read",
      cover: "/assets/blog_steel.png",
      title: {
        en: "TMT Steel vs Mild Steel: The Ultimate Reinforcement Choice",
        ta: "TMT steel vs mild steel — வீடுகளுக்கு எது சிறந்தது?"
      },
      excerpt: {
        en: "Understand why Thermo-Mechanically Treated (TMT) bars are mandatory for seismic-safe foundations in Tamil Nadu.",
        ta: "நிலநடுக்கத்தை தாங்கும் வகையில் வீட்டின் அஸ்திவாரத்தை அமைக்க எந்த கம்பி சிறந்தது என்று விளக்குகிறது இக்கட்டுரை."
      },
      content: {
        en: `Thermo-Mechanically Treated (TMT) steel has completely replaced mild steel in modern home foundations. TMT steel bars (like Fe500D) undergo a rapid quenching heat treatment that creates a hard outer martensitic rim with a soft ductile ferrite-pearlite core.
Advantages:
1. Seismic safety: High elongation properties allow the building to absorb vibrations.
2. Corrosion resistance: Highly critical for coastal regions like Chennai and Tuticorin.
3. Better binding: Ribbed patterns bind stronger with concrete matrix.`,
        ta: "நவீன கட்டுமானங்களில் சாதாரண இரும்பு கம்பிகளுக்கு பதிலாக டிஎம்டி (TMT) கம்பிகள் மட்டுமே பயன்படுத்தப்படுகின்றன. \n\nகாரணிகள்: \n1. அதிக நெகிழ்வுத்தன்மை கொண்டதால் நில அதிர்வுகளைத் தாங்கும். \n2. துருப்பிடிக்காத தரம்: சென்னை, தூத்துக்குடி போன்ற கடலோர பகுதிகளில் வீடுகள் துருப்பிடிக்கதைத் தடுக்கும். \n3. கான்கிரீட்டுடன் சிறந்த பிணைப்பு (RIB pattern)."
      }
    },
    {
      slug: "building-per-vastu-shastra",
      category: "vastu",
      catLabel: { en: "Vastu Tips", ta: "வாஸ்து சாஸ்திர முறைப்படி வீடு கட்டலாம்" },
      date: "Apr 28, 2026",
      readTime: "4 min read",
      cover: "/assets/blog_vastu.png",
      title: {
        en: "South Indian Vastu Shastra Guidelines for Multi-Level Houses",
        ta: "வாஸ்து படி வீட்டின் அறைகளை எங்கு அமைக்க வேண்டும்?"
      },
      excerpt: {
        en: "Top directions for the entrance, master bedroom, kitchen, and pooja rooms to invite positive energy.",
        ta: "நுழைவு வாசல், சமையலறை, படுக்கையறை மற்றும் பூஜையறை ஆகியவற்றிற்கு உகந்த திசைகள் மற்றும் காரணங்கள்."
      },
      content: {
        en: `Traditional South Indian Vastu provides scientific guidelines for light, ventilation, and elements sync:
1. Entrance (Eshanya/North-East or East): Catches the early morning sunlight.
2. Kitchen (Agni/South-East): Winds blow from south-west to north-east, keeping combustion smoke away from other rooms.
3. Master Bedroom (Nairuthi/South-West): Ensures maximum privacy and cool breeze during evenings.
4. Pooja Room (North-East): Ideal corner for quiet spiritual prayer.`,
        ta: "நமது முன்னோர்கள் வகுத்த வாஸ்து விதிகள் காற்றோட்டம் மற்றும் சூரிய வெளிச்சத்தை அடிப்படையாகக் கொண்டது: \n1. தலைவாசல்: வடகிழக்கு அல்லது கிழக்கு (காலை வெயில் வீட்டிற்குள் வர). \n2. சமையலறை: தென்கிழக்கு (அக்னி மூலை, சமையல் புகை பரவாமல் தடுக்க). \n3. படுக்கையறை: தென்மேற்கு (குபேர மூலை, அமைதியான காற்று மற்றும் தனியுரிமை). \n4. பூஜையறை: வடகிழக்கு (ஈசான்ய மூலை, தியானத்திற்கு உகந்தது)."
      }
    },
    {
      slug: "what-is-tnrera-compliance",
      category: "legal",
      catLabel: { en: "Legal & Finance", ta: "சட்டம் & நிதி" },
      date: "Apr 15, 2026",
      readTime: "5 min read",
      cover: "/assets/blog_rera.png",
      title: {
        en: "What is TNRERA and Why is it Mandatory for Home Buyers?",
        ta: "TNRERA என்றால் என்ன? அது ஏன் கட்டாயமாக்கப்பட்டது?"
      },
      excerpt: {
        en: "Learn how the Real Estate Regulatory Authority protects Tamil Nadu buyers from delays and frauds.",
        ta: "வீடு கட்டுபவர்கள் மற்றும் வாங்குபவர்களின் உரிமைகளைப் பாதுகாக்கும் டிஎன்ஆர்இஆர்ஏ சட்டம் பற்றி தெரிந்துகொள்ளுங்கள்."
      },
      content: {
        en: `TNRERA (Tamil Nadu Real Estate Regulatory Authority) regulates construction contracts.
Key benefits:
1. Project Escrow: 70% of client funds must be held in a project bank account used only for construction.
2. Time Adherence: Delays are subject to penalty interest payouts to the client.
3. Plan Compliance: Builders cannot modify approved plans without client consent.
Danam Holdings is fully registered under TNRERA.`,
        ta: "டிஎன்ஆர்இஆர்ஏ (TNRERA) என்பது ரியல் எஸ்டேட் ஒழுங்குமுறை ஆணையமாகும். \n\nநன்மைகள்: \n1. திட்ட பாதுகாப்பு: வாடிக்கையாளரின் பணத்தில் 70% தனி வங்கிக் கணக்கில் வைக்கப்பட்டு கட்டுமானத்திற்கு மட்டுமே பயன்படுத்தப்படும். \n2. காலக்கெடு: தாமதங்களுக்கு பில்டர் வாடிக்கையாளருக்கு வட்டி செலுத்த வேண்டும். \n3. வரைபட மாற்றம்: வாடிக்கையாளர் அனுமதியின்றி வரைபடங்களை மாற்ற முடியாது."
      }
    },
    {
      slug: "fly-ash-bricks-vs-clay-bricks",
      category: "material",
      catLabel: { en: "Material Guide", ta: "பொருள் வழிகாட்டி" },
      date: "Apr 02, 2026",
      readTime: "5 min read",
      cover: "/assets/blog_bricks.png",
      title: {
        en: "Fly Ash Bricks vs Red Clay Bricks: Strength & Eco Audit",
        ta: "Fly ash bricks vs clay bricks — எது சிறந்த செங்கல்?"
      },
      excerpt: {
        en: "Compare thermal insulation, water absorption, compressive strength, and unit rates.",
        ta: "வெப்பத் தடுப்பு, நீர் உறிஞ்சும் திறன், சுவர்களின் உறுதிப்பாடு மற்றும் விலைகளை ஒப்பிடும் கட்டுரை."
      },
      content: {
        en: `Choosing between Fly Ash bricks and traditional Red Clay bricks impacts structural weight and temperature:
- Red Clay Bricks: Handmade wire-cut clay bricks are highly durable, have high structural weight, and breathe moisture, but have size variations.
- Fly Ash Bricks: Manufactured from industrial waste (fly ash + cement), they have uniform sizes (reducing plastering mortar consumption) and lower water absorption.
Recommendation: For outer walls, wire-cut clay red bricks are premium. For internal partitions, Fly Ash bricks offer cost-efficient alternatives.`,
        ta: "செங்கற்கள் தேர்வு சுவர்களின் வெப்பம் மற்றும் சிமெண்ட் தேவையை தீர்மானிக்கும்: \n- செம்புரை செங்கற்கள் (Red Clay): பாரம்பரியமானவை, அதிக உறுதி, ஆனால் அளவுகளில் மாற்றங்கள் இருக்கும். \n- ப்ளை ஆஷ் செங்கற்கள் (Fly Ash): சிமெண்ட் மற்றும் சாம்பல் கலவை, சமமான அளவு (பூச்சு வேலைக்கு சிமெண்ட் குறைவாகத் தேவைப்படும்), நீர் உறிஞ்சுதல் குறைவு. \n\nபரிந்துரை: வெளிச்சுவர்களுக்கு செங்கற்களும், உள் சுவர்களுக்கு ப்ளை ஆஷ் கற்களும் உகந்தது."
      }
    },
    {
      slug: "home-loan-vs-construction-loan-tn-2026",
      category: "legal",
      catLabel: { en: "Legal & Finance", ta: "சட்டம் & நிதி" },
      date: "Mar 20, 2026",
      readTime: "6 min read",
      cover: "/assets/blog_loan.png",
      title: {
        en: "Home Loan vs Construction Loan in Tamil Nadu 2026",
        ta: "Home loan vs construction loan — என்ன வித்தியாசம்?"
      },
      excerpt: {
        en: "Compare interest rates, disbursement stages, and tax benefits under Section 24b.",
        ta: "வீடு கட்ட வாங்கும் கடன்களுக்கான வட்டி விகிதங்கள் மற்றும் தவணைத் தொகை விடுவிக்கப்படும் நிலைகள்."
      },
      content: {
        en: `Many builders confuse standard housing loans (flat purchase) with self-construction loans (plot building):
1. Disbursement: Construction loans are released in stages (Foundation, Slab, Brickwork, Plastering) after structural certification.
2. Interest Rate: Construction loans average 8.75% to 9.25%, slightly higher than standard home loans.
3. Tax benefits: Tax deductions on interest apply only after the completion certificate is uploaded.`,
        ta: "கட்டி முடித்த வீட்டை வாங்குவதற்கும், சொந்த மனையில் வீடு கட்டுவதற்கும் வாங்கும் கடன்கள் மாறுபடும்: \n1. தவணைத் தொகை: அஸ்திவாரம், கான்கிரீட் தளம், பூச்சு வேலை என கட்டுமான நிலைகளுக்கு ஏற்பவே வங்கி பணம் விடுவிக்கும். \n2. வட்டி: பொதுவாக 8.75% முதல் 9.25% வரை இருக்கும். \n3. வரிச் சலுகை: கட்டுமானப் பணிகள் முடிந்து சான்றிதழ் சமர்ப்பித்த பிறகே வரி விலக்கு பெற முடியும்."
      }
    }
  ];

  const filteredArticles = selectedCategory === "all"
    ? articles
    : articles.filter((a) => a.category === selectedCategory);

  const handleShareWa = (article: Article) => {
    const articleTitle = typeof article.title === "string" ? article.title : article.title.en;
    const waText = `Read this useful article from Danam Holdings: "${articleTitle}" - ${window.location.href}`;
    const url = `https://wa.me/?text=${encodeURIComponent(waText)}`;
    window.open(url, "_blank");
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneInput.length === 10) {
      setSubscribed(true);
      const text = `Hi Danam Holdings, I want to subscribe to weekly construction tips. My number is ${phoneInput}.`;
      const waNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918883332499";
      window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  return (
    <div className="relative w-full">
      {/* 1. Hero */}
      <section className="relative py-24 blueprint-grid text-center overflow-hidden border-b border-border-subtle pt-32">
        {/* Blueprint grid overlay */}
        <div className="absolute inset-0 blueprint-grid opacity-12 z-0" />
        
        <div className="relative z-10 max-w-4xl px-6 mx-auto mt-8 select-none">
          <span className="text-brand-teak font-mono text-xs uppercase tracking-widest mb-2 block">
            BLOG & KNOWLEDGEBASE
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-medium tracking-tight text-text-primary mb-2">
            Know Before You Build.
          </h1>
          <p className="font-ui text-xs md:text-sm text-text-secondary max-w-lg mx-auto leading-relaxed">
            {t.blog.heroSub}
          </p>
        </div>
      </section>

      {/* 2. Category selection */}
      <section className="bg-surface-0 border-b border-border-subtle py-4 select-none">
        <div className="max-w-7xl mx-auto px-6 md:px-12 overflow-x-auto flex gap-3 justify-start lg:justify-center whitespace-nowrap">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-1.5 text-xs font-ui uppercase tracking-wider transition-colors cursor-pointer ${
                selectedCategory === cat.key
                  ? "bg-brand-teak text-white font-semibold"
                  : "border border-border-subtle hover:bg-surface-2"
              }`}
            >
              {cat.en}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Grid of articles */}
      <section className="py-24 bg-surface-1">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredArticles.map((art) => (
              <div
                key={art.slug}
                onClick={() => setActiveArticle(art)}
                className="bg-surface-0 border border-border-subtle hover:border-brand-teak flex flex-col text-left group cursor-pointer transition-all duration-300"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-surface-2 select-none">
                  <img
                    src={art.cover}
                    alt={art.title.en}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-brand-charcoal text-white font-mono text-[9px] px-2 py-0.5 uppercase tracking-widest">
                    {art.catLabel.en}
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex gap-4 text-[9px] text-text-tertiary font-mono tracking-wider mb-2 select-none">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {art.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {art.readTime}</span>
                    </div>
                    <h4 className="font-display text-base md:text-lg font-semibold text-text-primary mb-3 group-hover:text-brand-teak transition-colors line-clamp-2">
                      {art.title.en}
                    </h4>
                    <p className="font-ui text-xs text-text-secondary leading-relaxed line-clamp-3 mb-6">
                      {art.excerpt.en}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-semibold text-brand-teak tracking-widest uppercase flex items-center gap-1 border-b border-transparent group-hover:border-brand-teak transition-all duration-300">
                      <span>{t.blog.readMore}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareWa(art);
                      }}
                      className="p-1.5 hover:bg-brand-teak/10 rounded text-brand-teak transition-colors cursor-pointer"
                      title={t.blog.shareWa}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Reading Article Overlay Drawer */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-night/85 backdrop-blur-sm p-4 md:p-8 animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-surface-0 border border-brand-teak/30 w-full max-w-3xl h-full max-h-[80vh] overflow-y-auto relative p-8 md:p-12 text-left">
            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 right-6 p-2 bg-brand-charcoal text-white rounded-full hover:bg-brand-teak transition-colors cursor-pointer z-10"
              aria-label="Close Article"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-brand-teak font-mono text-[9px] uppercase tracking-widest mb-1 block select-none">
              {typeof activeArticle.catLabel === "object" ? (activeArticle.catLabel as any)[locale] || (activeArticle.catLabel as any).en : String(activeArticle.catLabel)} · {activeArticle.readTime}
            </span>
            <h3 className="font-display text-2xl md:text-4xl font-semibold text-text-primary mb-6 leading-tight">
              {typeof activeArticle.title === "object" ? (activeArticle.title as any)[locale] || (activeArticle.title as any).en : String(activeArticle.title)}
            </h3>

            <div className="relative aspect-video w-full overflow-hidden bg-surface-2 mb-8 select-none">
              <img src={activeArticle.cover} alt="Article cover" className="w-full h-full object-cover" />
            </div>

            {/* Markdown-like article body */}
            <div className="font-ui text-sm text-text-secondary leading-relaxed whitespace-pre-wrap flex flex-col gap-4">
              {typeof activeArticle.content === "object" ? (activeArticle.content as any)[locale] || (activeArticle.content as any).en : String(activeArticle.content)}
            </div>

            {/* Bottom Actions */}
            <div className="mt-12 pt-6 border-t border-border-subtle flex justify-between items-center select-none">
              <div className="flex gap-4 text-[10px] text-text-tertiary font-mono">
                <span>Published: {activeArticle.date}</span>
              </div>
              <button
                onClick={() => handleShareWa(activeArticle)}
                className="bg-brand-teak hover:bg-brand-teal text-white flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>{t.blog.shareWa}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. WhatsApp Subscription Newsletter */}
      <section className="py-24 bg-brand-charcoal text-white/95" data-theme="night">
        <div className="max-w-4xl mx-auto px-6 text-center select-none">
          <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
            <PhoneCall className="w-12 h-12 text-brand-teak animate-bounce" />
            <h3 className="font-display text-2xl md:text-4xl font-medium tracking-tight">
              {t.blog.subTitle}
            </h3>
            <p className="font-ui text-xs text-white/60 leading-relaxed max-w-sm">
              Subscribe to get structural specifications checklists, vastu rules overlays, and price index guides once a week directly in WhatsApp.
            </p>

            {subscribed ? (
              <div className="bg-brand-teak/10 border border-brand-teak text-brand-teak p-4 text-xs font-semibold w-full">
                Subscribed successfully! We will redirect you to start the broadcast listing.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full gap-2 mt-4">
                <input
                  type="tel"
                  placeholder={t.blog.subPlaceholder}
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="bg-brand-night border border-white/10 p-4 font-mono text-sm flex-1 outline-none text-center sm:text-left focus:border-brand-teak"
                  required
                />
                <button
                  type="submit"
                  className="bg-brand-teak hover:bg-brand-teal text-white px-8 py-4 text-xs uppercase tracking-widest font-semibold transition-colors font-mono cursor-pointer"
                >
                  {t.blog.subBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
