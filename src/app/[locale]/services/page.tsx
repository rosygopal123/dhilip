"use client";
import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Check, ShieldAlert, FileDown, Send, Home, Building2, Layers, Hammer, Paintbrush, Compass, ChevronDown } from "lucide-react";
import { jsPDF } from "jspdf";

export default function ServicesPage() {
  const { t } = useLanguage();
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // BOQ Estimator State
  const [areaInput, setAreaInput] = useState("1800");
  const [unitType, setUnitType] = useState<"sqft" | "cents" | "grounds">("sqft");
  const [floors, setFloors] = useState(1);
  const [grade, setGrade] = useState<"economy" | "standard" | "premium">("standard");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [district, setDistrict] = useState("Madurai");
  const [showOutput, setShowOutput] = useState(false);

  // 38 TN Districts with cost index multipliers
  const tnDistricts = [
    { name: "Madurai", multiplier: 1.0 },
    { name: "Chennai", multiplier: 1.15 },
    { name: "Coimbatore", multiplier: 1.08 },
    { name: "Trichy", multiplier: 1.02 },
    { name: "Salem", multiplier: 1.0 },
    { name: "Tirunelveli", multiplier: 0.98 },
    { name: "Erode", multiplier: 1.02 },
    { name: "Vellore", multiplier: 1.0 },
    { name: "Thanjavur", multiplier: 0.98 },
    { name: "Tuticorin", multiplier: 0.97 },
    { name: "Dindigul", multiplier: 0.96 },
    { name: "Kanyakumari", multiplier: 1.02 },
    { name: "Theni", multiplier: 0.96 },
    { name: "Virudhunagar", multiplier: 0.96 },
    { name: "Sivaganga", multiplier: 0.95 },
    { name: "Ramanathapuram", multiplier: 0.96 },
    { name: "Pudukkottai", multiplier: 0.95 },
    { name: "Karur", multiplier: 0.97 },
    { name: "Namakkal", multiplier: 0.98 },
    { name: "Tiruppur", multiplier: 1.04 },
    { name: "Nilgiris", multiplier: 1.12 },
    { name: "Kanchipuram", multiplier: 1.06 },
    { name: "Tiruvallur", multiplier: 1.05 },
    { name: "Cuddalore", multiplier: 0.98 },
    { name: "Villupuram", multiplier: 0.97 },
    { name: "Tiruvannamalai", multiplier: 0.96 },
    { name: "Nagapattinam", multiplier: 0.97 },
    { name: "Tiruvarur", multiplier: 0.96 },
    { name: "Ariyalur", multiplier: 0.95 },
    { name: "Perambalur", multiplier: 0.95 },
    { name: "Dharmapuri", multiplier: 0.96 },
    { name: "Krishnagiri", multiplier: 1.02 },
    { name: "Ranipet", multiplier: 0.98 },
    { name: "Tirupathur", multiplier: 0.97 },
    { name: "Kallakurichi", multiplier: 0.96 },
    { name: "Chengalpattu", multiplier: 1.08 },
    { name: "Tenkasi", multiplier: 0.97 },
    { name: "Mayiladuthurai", multiplier: 0.97 }
  ];

  const serviceCards = [
    {
      title: t.services.service1.title,
      icon: Home,
      desc: t.services.service1.desc,
      details: ["Architectural 3D renderings", "TNRERA single window approval handling", "M25 concrete structural guarantee", "Fine teakwood joineries", "Custom Kerala / Tamil contemporary interior motifs"],
    },
    {
      title: t.services.service2.title,
      icon: Building2,
      desc: t.services.service2.desc,
      details: ["FSI compliant structural design", "RCC frame columns for high loading capacity", "Industrial warehouse heavy flooring", "Fire safety NOC compliance filing", "Integrated HVAC & parking allocations"],
    },
    {
      title: t.services.service3.title,
      icon: Layers,
      desc: t.services.service3.desc,
      details: ["Stilt + 3 Floor residential layout specialists", "Common amenities design (lift, solar lights)", "Rainwater harvesting integration", "Sound insulation partitions", "Accurate undivided share of land (UDS) profiling"],
    },
    {
      title: t.services.service4.title,
      icon: Hammer,
      desc: t.services.service4.desc,
      details: ["Structural integrity retrofitting", "Load bearing walls assessment and removal", "Vertical ceiling height expansions", "Core waterproofing treatments", "Structural stability certificate provisioning"],
    },
    {
      title: t.services.service5.title,
      icon: Paintbrush,
      desc: t.services.service5.desc,
      details: ["Premium modular kitchen setups", "Custom gypsum false ceilings with warm LED channels", "Multi-layered electrical conduits", "Smart automation wiring paths", "Asian Paints Royal luxury emulsion application"],
    },
    {
      title: t.services.service6.title,
      icon: Compass,
      desc: t.services.service6.desc,
      details: ["DTCP Layout rule compliance mapping", "Plot boundaries masonry marking", "Underground drainage layout channels", "Street light electrical planning", "Zoning verification and FSI analysis"],
    },
  ];

  // Material brand table data
  const materialSpecs = [
    { cat: t.services.materials.cement, brand: "Ultratech OPC 53, Dalmia DSP, India Cements" },
    { cat: t.services.materials.steel, brand: "TATA Tiscon Fe500D, SAIL, JSPL" },
    { cat: t.services.materials.bricks, brand: "Wire-cut burnt clay red bricks (BIS 1077), fly ash eco bricks" },
    { cat: t.services.materials.waterproof, brand: "Dr. Fixit, Fosroc, SikaTop sealants" },
    { cat: t.services.materials.tiles, brand: "RAK, Nitco, Johnson (interior, parking, anti-skid bathroom)" },
    { cat: t.services.materials.windows, brand: "Fenesta, Deceuninck, Encraft double-glazed UPVC profiles" },
    { cat: t.services.materials.electrical, brand: "Legrand switches, Schneider MCBs, Havells/Finolex FRLS wires" },
    { cat: t.services.materials.plumbing, brand: "Astral CPVC lead-free pipes, Finolex conduits, Supreme plumbing fittings" },
  ];

  // Estimate calculations
  const getBaseRate = () => {
    if (grade === "economy") return 1750;
    if (grade === "premium") return 2750;
    return 2150; // standard
  };

  const getAreaInSqft = () => {
    const val = parseFloat(areaInput) || 0;
    if (unitType === "cents") return val * 435.6;
    if (unitType === "grounds") return val * 2400;
    return val;
  };

  const calculateEstimate = () => {
    const area = getAreaInSqft();
    const baseRate = getBaseRate();
    const districtObj = tnDistricts.find((d) => d.name === district) || { multiplier: 1.0 };
    
    // Core cost
    const coreCost = area * baseRate * floors * districtObj.multiplier;

    // Addons cost
    let addonsCost = 0;
    if (selectedAddons.includes("kitchen")) addonsCost += 300000;
    if (selectedAddons.includes("ceiling")) addonsCost += 150000;
    if (selectedAddons.includes("security")) addonsCost += 60000;
    if (selectedAddons.includes("solar")) addonsCost += 250000;
    if (selectedAddons.includes("landscaping")) addonsCost += 100000;

    const subtotal = coreCost + addonsCost;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    return {
      area: Math.round(area),
      core: Math.round(coreCost),
      addons: addonsCost,
      subtotal: Math.round(subtotal),
      gst: Math.round(gst),
      total: Math.round(total),
      ratePerSqft: Math.round(total / (area || 1))
    };
  };

  const est = calculateEstimate();

  const handleAddonToggle = (key: string) => {
    if (selectedAddons.includes(key)) {
      setSelectedAddons(selectedAddons.filter((k) => k !== key));
    } else {
      setSelectedAddons([...selectedAddons, key]);
    }
  };

  // PDF Download Action
  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(45, 89, 17); // emerald forest
    doc.text("DANAM HOLDINGS, MADURAI", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("TNRERA Reg: TN/20/Building/0129/2022 | Kamarajar Salai, Madurai", 14, 27);
    doc.line(14, 30, 196, 30);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(26, 24, 24);
    doc.text("PRELIMINARY BOQ ESTIMATE (2026 STACK)", 14, 40);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`District: ${district}`, 14, 50);
    doc.text(`Construction Area: ${est.area} Sq.Ft`, 14, 56);
    doc.text(`Number of Floors: ${floors}`, 14, 62);
    doc.text(`Quality Grade: ${grade.toUpperCase()}`, 14, 68);

    doc.line(14, 75, 196, 75);

    // Bill of details table
    doc.setFont("helvetica", "bold");
    doc.text("Cost Breakdown Items", 14, 85);
    doc.text("Amount (INR)", 140, 85);
    doc.setFont("helvetica", "normal");

    doc.text("1. Core Concrete Structure, Foundation & Brickwork", 14, 95);
    doc.text(`Rs. ${est.core.toLocaleString("en-IN")}`, 140, 95);

    doc.text("2. Optional Add-ons & Landscaping Services", 14, 105);
    doc.text(`Rs. ${est.addons.toLocaleString("en-IN")}`, 140, 105);

    doc.setFont("helvetica", "bold");
    doc.text("Subtotal", 14, 118);
    doc.text(`Rs. ${est.subtotal.toLocaleString("en-IN")}`, 140, 118);
    doc.setFont("helvetica", "normal");

    doc.text("GST (18% Construction Works Contract)", 14, 126);
    doc.text(`Rs. ${est.gst.toLocaleString("en-IN")}`, 140, 126);

    doc.line(14, 132, 196, 132);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 146, 74);
    doc.text("Total Estimated Project Cost", 14, 142);
    doc.text(`Rs. ${est.total.toLocaleString("en-IN")}`, 140, 142);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(`Effective rate per Sq.Ft: Rs. ${est.ratePerSqft}/-`, 14, 150);

    doc.line(14, 160, 196, 160);
    doc.setTextColor(181, 67, 26); // terracotta red
    doc.text("Disclaimer:", 14, 170);
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text("This calculation is an automated preliminary estimate based on 2026 regional indexes.", 14, 176);
    doc.text("Actual site quotation will be drafted after physical soil examination and structural drawings.", 14, 182);

    doc.save(`Danam_Holdings_Estimate_${district}.pdf`);
  };

  // WhatsApp Send Action
  const sendWhatsApp = () => {
    const waText = `Hi Danam Holdings, I generated a preliminary BOQ estimate:
- District: ${district}
- Area: ${est.area} Sq.Ft (${floors} Floors)
- Grade: ${grade.toUpperCase()}
- Addons: ${selectedAddons.join(", ") || "None"}
- Estimated Total: Rs. ${est.total.toLocaleString("en-IN")}
Please contact me for site verification.`;

    const waNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918883332499";
    const url = `https://wa.me/${waNum}?text=${encodeURIComponent(waText)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="relative w-full">
      {/* 1. Hero Header */}
      <section className="relative h-[55vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/video2/ezgif-frame-090.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/55 z-10" />
        <div className="relative z-20 text-center max-w-4xl px-6 pt-16">
          <span className="text-brand-teak font-mono text-xs uppercase tracking-widest mb-2 block">
            SERVICES
          </span>
          <h1 className="font-display text-4xl md:text-7xl font-medium tracking-tight text-white mb-4">
            {t.services.subtitle}
          </h1>
        </div>
      </section>

      {/* 2. Six Service Cards Grid with accordion height expansion */}
      <section className="py-24 bg-surface-1">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {serviceCards.map((service, idx) => {
              const Icon = service.icon;
              const isOpen = activeCard === idx;

              return (
                <div
                  key={idx}
                  className="bg-surface-0 border border-border-subtle p-8 text-left transition-all duration-300 hover:border-brand-teak flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 bg-surface-1 rounded-lg flex items-center justify-center border border-brand-teak/20 mb-6">
                      <Icon className="w-6 h-6 text-brand-teak" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-text-primary mb-4">
                      {service.title}
                    </h3>
                    <p className="font-ui text-xs text-text-secondary leading-relaxed mb-6">
                      {service.desc}
                    </p>
                  </div>

                  {/* Expandable details drawer */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      isOpen ? "max-h-60 opacity-100 mb-6" : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="space-y-2 border-t border-border-subtle pt-4 text-xs font-ui text-text-secondary">
                      {service.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-brand-teal mt-0.5 shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => setActiveCard(isOpen ? null : idx)}
                    className="text-xs font-semibold text-brand-teak hover:text-brand-teal tracking-wider uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isOpen ? "Close Details" : "View Scope Specs"}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Material Specifications Wall */}
      <section data-theme="light" className="py-24 bg-[var(--bp-paper)] text-[var(--bp-ink)] relative border-t border-b border-border-subtle">
        <div className="absolute inset-0 blueprint-grid opacity-8 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl text-left mb-16">
            <span className="text-[var(--bp-ink)]/70 font-mono text-xs uppercase tracking-widest mb-2 block">
              MATERIAL STANDARDS
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight mb-4">
              {t.services.materials.title}
            </h2>
            <p className="font-ui text-sm opacity-80 leading-relaxed">
              {t.services.materials.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
            {materialSpecs.map((spec, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row md:items-center justify-between border-b border-[var(--bp-ink)]/15 pb-4 gap-2"
              >
                <span className="font-display font-semibold text-base w-full md:w-1/3 text-brand-teak">
                  {spec.cat}
                </span>
                <span className="font-ui text-xs md:text-sm text-text-secondary leading-relaxed w-full md:w-2/3">
                  {spec.brand}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Grade Comparison Table */}
      <section className="py-24 bg-surface-0 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <span className="text-brand-teak font-mono text-xs uppercase tracking-widest mb-2 block">
            COMPARISON
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-text-primary mb-16">
            Construction Grades (2026 rate/sqft)
          </h2>

          <div className="max-w-5xl mx-auto overflow-x-auto">
            <table className="w-full text-left font-ui border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-border-medium bg-surface-1">
                  <th className="p-4 text-xs uppercase tracking-widest font-bold">Specs</th>
                  <th className="p-4 text-xs uppercase tracking-widest font-bold">Economy</th>
                  <th className="p-4 text-xs uppercase tracking-widest font-bold text-brand-teak border-x border-brand-teak/20 bg-brand-teak/5">
                    Standard (Most Popular)
                  </th>
                  <th className="p-4 text-xs uppercase tracking-widest font-bold">Premium Luxury</th>
                </tr>
              </thead>
              <tbody className="text-xs text-text-secondary">
                <tr className="border-b border-border-subtle hover:bg-surface-1/40 transition-colors">
                  <td className="p-4 font-semibold text-text-primary">Steel reinforcement</td>
                  <td className="p-4">Fe500 Local Brand</td>
                  <td className="p-4 border-x border-brand-teak/15 bg-brand-teak/[0.02]">TATA Tiscon / JSW</td>
                  <td className="p-4">TATA Tiscon Fe500D Premium</td>
                </tr>
                <tr className="border-b border-border-subtle hover:bg-surface-1/40 transition-colors">
                  <td className="p-4 font-semibold text-text-primary">Cement Brand</td>
                  <td className="p-4">Standard Portland PPC</td>
                  <td className="p-4 border-x border-brand-teak/15 bg-brand-teak/[0.02]">Ultratech OPC 53</td>
                  <td className="p-4">Dalmia DSP Premium / Ultratech</td>
                </tr>
                <tr className="border-b border-border-subtle hover:bg-surface-1/40 transition-colors">
                  <td className="p-4 font-semibold text-text-primary">Masonry partition</td>
                  <td className="p-4">Fly ash chamber blocks</td>
                  <td className="p-4 border-x border-brand-teak/15 bg-brand-teak/[0.02]">Wire-cut red clay bricks</td>
                  <td className="p-4">High strength premium wire-cut red bricks</td>
                </tr>
                <tr className="border-b border-border-subtle hover:bg-surface-1/40 transition-colors">
                  <td className="p-4 font-semibold text-text-primary">Flooring Tiles</td>
                  <td className="p-4">2x2 Vitrified (Rs. 50/sft)</td>
                  <td className="p-4 border-x border-brand-teak/15 bg-brand-teak/[0.02]">2x4 Kajaria/RAK (Rs. 90/sft)</td>
                  <td className="p-4">Italian Marble / Kajaria 4x4 (Rs. 180+/sft)</td>
                </tr>
                <tr className="border-b border-border-subtle hover:bg-surface-1/40 transition-colors">
                  <td className="p-4 font-semibold text-text-primary">Main Door</td>
                  <td className="p-4">Flush door with paint</td>
                  <td className="p-4 border-x border-brand-teak/15 bg-brand-teak/[0.02]">Burma Teakwood frame</td>
                  <td className="p-4">Elite teak slatted Kerala door, brass fittings</td>
                </tr>
                <tr className="border-b border-border-medium hover:bg-surface-1/40 transition-colors">
                  <td className="p-4 font-semibold text-text-primary">Electrical wires</td>
                  <td className="p-4">Local PVC insulated</td>
                  <td className="p-4 border-x border-brand-teak/15 bg-brand-teak/[0.02]">Finolex FRLS / Havells</td>
                  <td className="p-4">Legrand modular switches, flame proof wiring</td>
                </tr>
                <tr className="bg-surface-1 font-bold text-text-primary">
                  <td className="p-4 uppercase tracking-widest text-[10px]">TN Rate per Sq.Ft</td>
                  <td className="p-4 text-base">₹1,750/-</td>
                  <td className="p-4 text-base text-brand-teak border-x border-brand-teak/20 bg-brand-teak/10">
                    ₹2,150/-
                  </td>
                  <td className="p-4 text-base">₹2,750/-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. BOQ Estimator Widget */}
      <section data-theme="light" className="py-24 bg-[var(--bp-paper)] text-[var(--bp-ink)] relative">
        <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 bg-white/70 backdrop-blur-md border border-[var(--bp-ink)]/15 p-8 md:p-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[var(--bp-ink)]/70 font-mono text-xs uppercase tracking-widest mb-2 block">
              ESTIMATOR
            </span>
            <h2 className="font-display text-2xl md:text-4xl font-medium tracking-tight mb-2">
              {t.services.estimator.title}
            </h2>
            <p className="font-ui text-xs opacity-75">
              {t.services.estimator.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-left">
            {/* Left Inputs */}
            <div className="flex flex-col gap-6">
              {/* Unit & Area Input */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs uppercase tracking-wider font-semibold font-mono">
                  <label>{t.services.estimator.areaLabel}</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUnitType("sqft")}
                      className={`px-2 py-0.5 rounded text-[10px] ${unitType === "sqft" ? "bg-[var(--bp-ink)] text-white" : "border border-[var(--bp-ink)]/30"}`}
                    >
                      Sq.Ft
                    </button>
                    <button
                      onClick={() => setUnitType("cents")}
                      className={`px-2 py-0.5 rounded text-[10px] ${unitType === "cents" ? "bg-[var(--bp-ink)] text-white" : "border border-[var(--bp-ink)]/30"}`}
                    >
                      Cents
                    </button>
                    <button
                      onClick={() => setUnitType("grounds")}
                      className={`px-2 py-0.5 rounded text-[10px] ${unitType === "grounds" ? "bg-[var(--bp-ink)] text-white" : "border border-[var(--bp-ink)]/30"}`}
                    >
                      Grounds
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  value={areaInput}
                  onChange={(e) => setAreaInput(e.target.value)}
                  className="w-full bg-surface-0 border border-[var(--bp-ink)]/30 p-3 font-mono text-base focus:border-[var(--bp-ink)] outline-none"
                  min="1"
                />
              </div>

              {/* Floors Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wider font-semibold font-mono">
                  {t.services.estimator.floorsLabel}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFloors(f)}
                      className={`py-3 text-sm font-semibold border ${
                        floors === f
                          ? "bg-[var(--bp-ink)] text-white border-transparent"
                          : "bg-surface-0 border-[var(--bp-ink)]/30"
                      }`}
                    >
                      {f === 1 ? "G" : `G+${f - 1}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* District cost index dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wider font-semibold font-mono">
                  {t.services.estimator.districtLabel}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-surface-0 border border-[var(--bp-ink)]/30 p-3 font-ui text-sm focus:border-[var(--bp-ink)] outline-none"
                >
                  {tnDistricts.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} {d.multiplier !== 1 ? `(Multiplier: x${d.multiplier})` : "(Base Rate)"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quality Grade selection */}
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wider font-semibold font-mono">
                  {t.services.estimator.gradeLabel}
                </label>
                <div className="flex flex-col gap-2">
                  {[
                    { key: "economy", name: t.services.estimator.gradeEconomy, rate: "₹1,750" },
                    { key: "standard", name: t.services.estimator.gradeStandard, rate: "₹2,150" },
                    { key: "premium", name: t.services.estimator.gradePremium, rate: "₹2,750" },
                  ].map((g) => (
                    <button
                      key={g.key}
                      onClick={() => setGrade(g.key as "economy" | "standard" | "premium")}
                      className={`p-3 text-xs flex justify-between items-center border text-left ${
                        grade === g.key
                          ? "bg-brand-teak/10 border-brand-teak text-brand-teak font-semibold"
                          : "bg-surface-0 border-[var(--bp-ink)]/20"
                      }`}
                    >
                      <span>{g.name}</span>
                      <span>{g.rate}/sq.ft</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Addons Checkbox Grid */}
            <div className="flex flex-col gap-4">
              <label className="text-xs uppercase tracking-wider font-semibold font-mono mb-2">
                {t.services.estimator.addonsLabel}
              </label>

              {[
                { key: "kitchen", label: t.services.estimator.kitchen },
                { key: "ceiling", label: t.services.estimator.ceiling },
                { key: "security", label: t.services.estimator.security },
                { key: "solar", label: t.services.estimator.solar },
                { key: "landscaping", label: t.services.estimator.landscaping },
              ].map((addon) => (
                <button
                  key={addon.key}
                  onClick={() => handleAddonToggle(addon.key)}
                  className={`p-4 border text-left text-xs font-ui flex justify-between items-center transition-all ${
                    selectedAddons.includes(addon.key)
                      ? "border-brand-teak bg-brand-teak/5 font-semibold text-brand-teak"
                      : "border-[var(--bp-ink)]/20 bg-surface-0"
                  }`}
                >
                  <span>{addon.label}</span>
                  <div
                    className={`w-4 h-4 border flex items-center justify-center rounded ${
                      selectedAddons.includes(addon.key) ? "bg-brand-teak border-transparent text-white" : "border-text-tertiary"
                    }`}
                  >
                    {selectedAddons.includes(addon.key) && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              ))}

              {/* Estimate Calculate Button */}
              <button
                onClick={() => setShowOutput(true)}
                className="bg-[var(--bp-ink)] hover:bg-brand-teak text-white font-semibold py-4 w-full text-xs uppercase tracking-widest transition-colors font-mono cursor-pointer mt-auto"
              >
                Calculate BOQ Estimate
              </button>
            </div>
          </div>

          {/* Animated Output Panel */}
          {showOutput && (
            <div className="mt-8 border-t-2 border-brand-teak pt-8 text-left animate-[fadeIn_0.5s_ease-out]">
              <h3 className="font-display font-semibold text-lg text-[var(--bp-ink)] mb-6 uppercase tracking-wider">
                Cost Valuation Analysis
              </h3>

              <div className="flex flex-col gap-4 font-mono text-xs text-text-secondary mb-6 bg-surface-1 p-6 border border-[var(--bp-ink)]/15">
                <div className="flex justify-between border-b border-border-subtle pb-2">
                  <span>Core Building Structure Cost</span>
                  <span className="font-semibold text-text-primary">Rs. {est.core.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between border-b border-border-subtle pb-2">
                  <span>Optional Interior/Utility Add-ons</span>
                  <span className="font-semibold text-text-primary">Rs. {est.addons.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between border-b border-border-subtle pb-2">
                  <span>{t.services.estimator.subtotal}</span>
                  <span className="font-semibold text-text-primary">Rs. {est.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between border-b border-border-subtle pb-2 text-[var(--con-brick)]">
                  <span>{t.services.estimator.gst}</span>
                  <span className="font-semibold">Rs. {est.gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-brand-teak pt-2">
                  <span>{t.services.estimator.total}</span>
                  <span>Rs. {est.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-text-tertiary mb-8">
                <ShieldAlert className="w-4 h-4 text-brand-teak shrink-0" />
                <span>{t.services.estimator.disclaimer}</span>
              </div>

              {/* PDF & Send buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={downloadPDF}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-teak hover:bg-brand-teal text-white font-semibold py-3.5 text-xs uppercase tracking-widest transition-colors font-mono cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  <span>{t.services.estimator.pdfBtn}</span>
                </button>
                <button
                  onClick={sendWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 border border-[var(--bp-ink)] hover:bg-[var(--bp-ink)] hover:text-white text-[var(--bp-ink)] font-semibold py-3.5 text-xs uppercase tracking-widest transition-all font-mono cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.services.estimator.whatsappBtn}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
