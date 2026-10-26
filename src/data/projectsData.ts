export interface Project360Room {
  id: string;
  name: string;
  tag: string;
  panoramaUrl: string;
  specs: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  img: string;
  beforeImg: string;
  location: string;
  type: "residential" | "commercial" | "renovation";
  badge: string;
  area: string;
  year: string;
  duration: string;
  budget: string;
  desc: string;
  quote: string;
  author: string;
  glbModel: string;
  modelAuthor: string;
  cameraOrbit?: string;
  fieldOfView?: string;
  rooms360: Project360Room[];
  civilSpecs: {
    structure: string;
    steel: string;
    concrete: string;
    vastu: string;
    ceiling: string;
    flooring: string;
    handoverTime: string;
  };
  highlights: string[];
}

export const ALL_PROJECTS: ProjectItem[] = [
  {
    id: "rajmahal-aishvaryam",
    title: "Rajmahal Aishvaryam",
    img: "/images/danam/ddhvrktrjjjln58schqk.webp",
    beforeImg: "/images/danam/hh2.webp",
    location: "Madurai",
    type: "commercial",
    badge: "Commercial Showroom",
    area: "Multi-Storey Showroom",
    year: "2024",
    duration: "14 Months",
    budget: "Turnkey EPC Commercial",
    desc: "Prominent retail and commercial showroom architecture featuring advanced facade cladding, reinforced heavy column grids, and modern MEP installations.",
    quote: "Exceptional speed, cost transparency, and top-tier finishing from initial 3D plans to key handover.",
    author: "Rajmahal Commercial Group",
    glbModel: "/models/LuxuryVilla_site_draco.glb",
    modelAuthor: "Zigurat Architecture Studio (CC-BY 4.0)",
    cameraOrbit: "45deg 75deg 80%",
    rooms360: [
      { id: "atrium", name: "Grand Retail Atrium", tag: "Double Volume", panoramaUrl: "/panoramas/living-room.jpg", specs: "14'6\" Height · Italian Statuario" },
      { id: "suite", name: "Executive Suite", tag: "Lounge", panoramaUrl: "/panoramas/master-bedroom.jpg", specs: "Burma Teak · Acoustic UPVC" },
      { id: "pantry", name: "Modern Corporate Pantry", tag: "Fittings", panoramaUrl: "/panoramas/modular-kitchen.jpg", specs: "German Blum · Quartz Counters" },
      { id: "terrace", name: "Sky Deck Lounge", tag: "Rooftop", panoramaUrl: "/panoramas/sky-terrace.jpg", specs: "WPC Decking · Toughened Glass" }
    ],
    civilSpecs: {
      structure: "Heavy-Duty Commercial Column-Beam RCC Frame (IS-456)",
      steel: "Fe550D High-Ductility TMT Rebars",
      concrete: "Ultratech M30 Grade Ready-Mix Concrete Matrix",
      vastu: "East-Facing Commercial Entrance Alignment",
      ceiling: "14'6\" Clear Ceiling Height with Integrated VRV Ducts",
      flooring: "Bookmatched Italian Marble & Heavy-Duty Commercial Tiles",
      handoverTime: "14 Months Turnkey Guaranteed Handover"
    },
    highlights: [
      "Thermal-break double-glazed curtain wall facade reducing HVAC load by 32%",
      "Engineered seismic shear-core foundation for heavy load retail displays",
      "Concealed Daikin VRV central cooling ducts in acoustic Gyproc false ceiling",
      "Itemized BOQ billing with zero cost escalation throughout execution"
    ]
  },
  {
    id: "theni-anandham",
    title: "Theni Anandham Flagship",
    img: "/images/danam/l3s2jgqoz98xoktjyzvk.webp",
    beforeImg: "/images/danam/hh3.webp",
    location: "Aruppukottai",
    type: "commercial",
    badge: "Commercial Complex",
    area: "Flagship Retail Complex",
    year: "2023",
    duration: "10 Months",
    budget: "Commercial Retail",
    desc: "High-capacity commercial retail building with expansive clear floor plates, structural steel mezzanine framing, and specialized waterproofing.",
    quote: "Their itemized BOQ billing gave us total confidence throughout construction. Zero surprise expenses.",
    author: "Theni Anandham Management",
    glbModel: "/models/villa.glb",
    modelAuthor: "Zigurat Architecture Studio (CC-BY 4.0)",
    cameraOrbit: "35deg 70deg 80%",
    rooms360: [
      { id: "main-floor", name: "Retail Floor Plate", tag: "Clear Span", panoramaUrl: "/panoramas/living-room.jpg", specs: "Spans 24'0\" · Zero Intermediate Columns" },
      { id: "office", name: "Management Office", tag: "Acoustic", panoramaUrl: "/panoramas/master-bedroom.jpg", specs: "Sound Insulation · Teak Paneling" },
      { id: "cafeteria", name: "Staff Cafeteria", tag: "Service", panoramaUrl: "/panoramas/modular-kitchen.jpg", specs: "SS304 Drainage · Quartz Sinks" },
      { id: "terrace", name: "Utility Terrace", tag: "Solar Ready", panoramaUrl: "/panoramas/sky-terrace.jpg", specs: "FRP Waterproof Membrane · Solar Slabs" }
    ],
    civilSpecs: {
      structure: "Engineered Wide-Span RCC Skeleton with Cantilever Portals",
      steel: "TATA Tiscon 550D Super Ductile Rebars",
      concrete: "M25 High-Strength Mix with NABL Cube Compressive Audits",
      vastu: "North-East Morning Sunlight Orientation",
      ceiling: "12'0\" Clear Floor-to-Slab Clearance",
      flooring: "Vitrified Industrial Anti-Skid 800x1600mm Slabs",
      handoverTime: "10 Months Record Turnkey Delivery"
    },
    highlights: [
      "Expansive column-free retail floor plate maximizing shopping visibility",
      "Heavy-duty fire suppression sprinkler infrastructure per NBC norms",
      "Rainwater harvesting collection sump integrated with sub-surface filtration",
      "Daily photographic progress updates provided via dedicated client portal"
    ]
  },
  {
    id: "sacs-madurai",
    title: "SACS Landmark Construction",
    img: "/images/danam/rvxn271huf5gcqqtdb46.webp",
    beforeImg: "/images/danam/hh4.webp",
    location: "K.Pudhur, Madurai",
    type: "commercial",
    badge: "Turnkey EPC Infrastructure",
    area: "Civil Institutional Facility",
    year: "2024",
    duration: "12 Months",
    budget: "Turnkey Civil Scope",
    desc: "Complete civil engineering and structural framework executed to IS 456 standards with high-ductility Fe550D TMT steel and ready-mix concrete.",
    quote: "Danam Holdings delivered this facility with remarkable structural discipline and transparent execution.",
    author: "SACS Management",
    glbModel: "/models/LuxuryVilla_site_draco.glb",
    modelAuthor: "Zigurat Architecture Studio (CC-BY 4.0)",
    cameraOrbit: "-40deg 75deg 80%",
    rooms360: [
      { id: "lobby", name: "Reception & Concourse", tag: "Institutional", panoramaUrl: "/panoramas/living-room.jpg", specs: "High Traffic · Polished Granite" },
      { id: "boardroom", name: "Executive Boardroom", tag: "Acoustic 40dB", panoramaUrl: "/panoramas/master-bedroom.jpg", specs: "Saint-Gobain Acoustic Baffles" },
      { id: "service", name: "Service & Pantry Area", tag: "Hygienic", panoramaUrl: "/panoramas/modular-kitchen.jpg", specs: "Non-Porous Composite Finish" },
      { id: "terrace", name: "Rooftop Assembly Area", tag: "Open Space", panoramaUrl: "/panoramas/sky-terrace.jpg", specs: "Safety Glass Railings · 3.5ft" }
    ],
    civilSpecs: {
      structure: "Seismic Zone-III Earthquake Resistant Heavy RCC Frame",
      steel: "SAIL / TATA Fe550D TMT Reinforcements",
      concrete: "M25 RMC Matrix with Waterproof Admixtures",
      vastu: "Vastu Shastra Compliant Entry & Administrative Grid",
      ceiling: "11'6\" Structural Height",
      flooring: "Heavy-Duty Full Body Vitrified Tiles & Leather Granite",
      handoverTime: "12 Months Turnkey Schedule"
    },
    highlights: [
      "Rigorous quality control with concrete batch cylinder testing on site",
      "Underground stormwater drainage networks avoiding monsoon waterlogging",
      "Concealed heavy copper busbar electrical distribution system",
      "Handed over on time with zero deviation from itemized BOQ commitments"
    ]
  },
  {
    id: "ocean-peacock",
    title: "Ocean Peacock SR Villa",
    img: "/images/danam/FFLiving-002.webp",
    beforeImg: "/images/danam/about-villa.webp",
    location: "Madurai",
    type: "residential",
    badge: "Luxury Residential Villa",
    area: "4,400 Sq.Ft (G+2)",
    year: "2024",
    duration: "11 Months",
    budget: "Luxury Residential",
    desc: "Architectural luxury villa showcasing double-height living ceilings, imported Italian marble, customized teak doors, and acoustic UPVC double glazing.",
    quote: "The 3D walkaround was exact. Every room and texture looks identical to the initial render.",
    author: "SR Family, Madurai",
    glbModel: "/models/villa.glb",
    modelAuthor: "Zigurat Architecture Studio (CC-BY 4.0)",
    cameraOrbit: "35deg 72deg 75%",
    rooms360: [
      { id: "living", name: "Living & Atrium", tag: "Double Height", panoramaUrl: "/panoramas/living-room.jpg", specs: "14'6\" Height · Statuario Marble" },
      { id: "master", name: "Master Suite", tag: "King Sanctuary", panoramaUrl: "/panoramas/master-bedroom.jpg", specs: "Burma Teak · Walk-in Wardrobe" },
      { id: "kitchen", name: "Modular Island Kitchen", tag: "German Blum", panoramaUrl: "/panoramas/modular-kitchen.jpg", specs: "Seamless Quartz · Hafele Pullouts" },
      { id: "terrace", name: "Sky Terrace Lounge", tag: "Rooftop Open", panoramaUrl: "/panoramas/sky-terrace.jpg", specs: "WPC Decking · Drip Irrigation" }
    ],
    civilSpecs: {
      structure: "Reinforced Monolithic Concrete Frame with Acoustic Insulation",
      steel: "Fe550D Super Ductile Corrosion-Resistant Rebars",
      concrete: "M25 / M30 High Durability Concrete",
      vastu: "100% Vastu Aligned: NE Living, SE Agni Kitchen, SW Master",
      ceiling: "14'6\" Double Volume Clear Living Ceiling",
      flooring: "Bookmatched Italian Calacatta & Natural Oak Planks",
      handoverTime: "11 Months Guaranteed Delivery"
    },
    highlights: [
      "Custom 9-foot Burma teak pivot main door with biometric digital lock",
      "Acoustic UPVC double-glazed sliding glass envelopes with 38dB noise cutoff",
      "Full solar rooftop net-metering provision with concealed inverters",
      "Central water softener and multi-stage pressure booster system"
    ]
  },
  {
    id: "vinoth-bjv",
    title: "Vinoth BJV Residence",
    img: "/images/danam/qbic7zxhdojtkqcdzktv.webp",
    beforeImg: "/images/danam/hh4.webp",
    location: "Selvapuram, Madurai",
    type: "residential",
    badge: "Residential Villa",
    area: "3,600 Sq.Ft (G+2)",
    year: "2024",
    duration: "9 Months",
    budget: "Turnkey Luxury Villa",
    desc: "Contemporary residential home engineered with 100% Vastu compliance, cross-ventilation corridors, and custom exterior louvers.",
    quote: "From 3D elevations to handover, the engineers treated our home like their own masterpiece.",
    author: "Vinoth BJV, Homeowner",
    glbModel: "/models/LuxuryVilla_site_draco.glb",
    modelAuthor: "Zigurat Architecture Studio (CC-BY 4.0)",
    cameraOrbit: "25deg 70deg 80%",
    rooms360: [
      { id: "living", name: "Family Living Hall", tag: "Open Plan", panoramaUrl: "/panoramas/living-room.jpg", specs: "Cross-Ventilation · Ambient Coves" },
      { id: "master", name: "Master Suite", tag: "Private Balcony", panoramaUrl: "/panoramas/master-bedroom.jpg", specs: "Wooden Flooring · Smart Dimming" },
      { id: "kitchen", name: "Modular Kitchen", tag: "Quartz Top", panoramaUrl: "/panoramas/modular-kitchen.jpg", specs: "Soft-Close Blum · Built-in Chimney" },
      { id: "terrace", name: "Rooftop Garden Terrace", tag: "Landscaped", panoramaUrl: "/panoramas/sky-terrace.jpg", specs: "Weatherproof Deck · Planters" }
    ],
    civilSpecs: {
      structure: "Seismic Resistant Column Grid with Solid Brick Masonry",
      steel: "Fe550D TMT Super Ductile",
      concrete: "M25 Ready-Mix Concrete with Anti-Shrink Admixtures",
      vastu: "Vastu Audited: Auspicious East Entrance & Pooja Mandir",
      ceiling: "10'6\" Clear Ceiling Height",
      flooring: "Kajaria 4x2 Vitrified Tiles & Teak Finish Tiles",
      handoverTime: "9 Months Rapid Turnkey Completion"
    },
    highlights: [
      "Natural stone exterior cladding with thermal barrier coating",
      "Concealed Finolex multi-strand copper wiring with Havells MCB distribution",
      "Underground RCC water sump with food-grade epoxy waterproof lining",
      "Delivered ahead of contracted schedule with itemized BOQ reconciliation"
    ]
  },
  {
    id: "hdfc-govind",
    title: "HDFC Govind Complex",
    img: "/images/danam/HDFC-20Govind-20-20001.webp",
    beforeImg: "/images/danam/hh2.webp",
    location: "HMS Colony, Madurai",
    type: "commercial",
    badge: "Financial Infrastructure",
    area: "Commercial Office Complex",
    year: "2023",
    duration: "8 Months",
    budget: "Turnkey Commercial",
    desc: "Secured banking and corporate infrastructure building with specialized vault foundations, fire suppression MEP systems, and durable tile flooring.",
    quote: "Professional engineers with strict adherence to safety standards and timeline deadlines.",
    author: "Project Coordinator",
    glbModel: "/models/villa.glb",
    modelAuthor: "Zigurat Architecture Studio (CC-BY 4.0)",
    cameraOrbit: "-30deg 75deg 80%",
    rooms360: [
      { id: "branch", name: "Banking Hall & Cash Counters", tag: "Secured", panoramaUrl: "/panoramas/living-room.jpg", specs: "Bullet-Resistant Glass · Heavy Tiles" },
      { id: "manager", name: "Branch Manager Cabin", tag: "Private", panoramaUrl: "/panoramas/master-bedroom.jpg", specs: "Acoustic Partition · Meeting Desk" },
      { id: "pantry", name: "Corporate Staff Lounge", tag: "MEP Integrated", panoramaUrl: "/panoramas/modular-kitchen.jpg", specs: "Stainless Steel Fittings" },
      { id: "terrace", name: "Utility Terrace & DG Deck", tag: "Heavy Load", panoramaUrl: "/panoramas/sky-terrace.jpg", specs: "Vibration Isolators · DG Set Slab" }
    ],
    civilSpecs: {
      structure: "Heavy Structural RCC with Reinforced Vault Enclosures",
      steel: "Fe550D High-Yield Rebars",
      concrete: "M30 High-Strength Concrete Matrix",
      vastu: "Vastu Compliant Financial Concourse Layout",
      ceiling: "11'0\" False Ceiling Clear Level",
      flooring: "High-Traffic Anti-Scratch Commercial Slabs",
      handoverTime: "8 Months Rapid Financial Turnkey"
    },
    highlights: [
      "Heavy reinforced foundation engineered for high-security bank vaults",
      "Integrated smoke detection, gas fire suppression, and dual escape staircases",
      "Independent DG generator platform with acoustic sound attenuation barriers",
      "100% itemized BOQ transparency with no hidden variance bills"
    ]
  },
  {
    id: "dr-rickesh",
    title: "Dr. Rickesh Residence & Clinic",
    img: "/images/danam/Dr-20rikesh-20-20001.webp",
    beforeImg: "/images/danam/hh1.webp",
    location: "Kadachanendhal, Madurai",
    type: "residential",
    badge: "Residential & Clinic",
    area: "3,200 Sq.Ft (G+1)",
    year: "2023",
    duration: "9 Months",
    budget: "Turnkey Custom Villa",
    desc: "Integrated residence with private doctor's consultation clinic wing, thermal acoustic insulation, and landscaped terrace garden.",
    quote: "Very smooth process. Handed over right on time without any delay or budget inflation.",
    author: "Dr. Rickesh",
    glbModel: "/models/LuxuryVilla_site_draco.glb",
    modelAuthor: "Zigurat Architecture Studio (CC-BY 4.0)",
    cameraOrbit: "40deg 70deg 80%",
    rooms360: [
      { id: "clinic", name: "Consultation & Waiting Lounge", tag: "Clinical Wing", panoramaUrl: "/panoramas/living-room.jpg", specs: "Antibacterial Surfaces · Air Purified" },
      { id: "master", name: "Doctor's Master Retreat", tag: "Acoustic Calm", panoramaUrl: "/panoramas/master-bedroom.jpg", specs: "Sound Insulation · Teak Accents" },
      { id: "kitchen", name: "Private Kitchen & Dining", tag: "Granite Island", panoramaUrl: "/panoramas/modular-kitchen.jpg", specs: "Polished Granite · Soft Closing" },
      { id: "terrace", name: "Herbal Terrace Garden", tag: "Greenery", panoramaUrl: "/panoramas/sky-terrace.jpg", specs: "Drip Irrigation · Waterproofed" }
    ],
    civilSpecs: {
      structure: "Bifurcated Residential-Clinical RCC Structural Frame",
      steel: "Fe550D TMT Reinforcement",
      concrete: "M25 Controlled Batch Mix",
      vastu: "North-Facing Clinical Entry & South-West Master Bedroom",
      ceiling: "10'6\" Clear Ceiling Height",
      flooring: "Vitrified Stain-Resistant Slabs & Natural Granite",
      handoverTime: "9 Months Guaranteed Handover"
    },
    highlights: [
      "Separate clinical entrance preventing patient traffic into family residential zones",
      "Hospital-grade acoustic insulation ensuring patient medical privacy",
      "Solar water heater and backup power invertor integration",
      "Delivered with zero cost overruns and complete structural warranty certificates"
    ]
  },
  {
    id: "maruthupandiyar-nagar",
    title: "Maruthupandiyar Nagar Villa",
    img: "/images/danam/marthupandiyar-20vk-20model-201.webp",
    beforeImg: "/images/danam/hh3.webp",
    location: "Madurai",
    type: "residential",
    badge: "Contemporary Villa",
    area: "2,850 Sq.Ft (G+1)",
    year: "2023",
    duration: "7 Months",
    budget: "Residential House",
    desc: "Independent custom residential home completed with Grade-A materials, 53-grade cement, double-washed M-Sand, and weather-proof exterior painting.",
    quote: "Clean workmanship, daily WhatsApp updates, and polite, responsive civil engineers.",
    author: "Homeowner, Maruthupandiyar Nagar",
    glbModel: "/models/villa.glb",
    modelAuthor: "Zigurat Architecture Studio (CC-BY 4.0)",
    cameraOrbit: "30deg 75deg 80%",
    rooms360: [
      { id: "hall", name: "Main Hall & Dining", tag: "Natural Light", panoramaUrl: "/panoramas/living-room.jpg", specs: "Large Windows · 3000K Lighting" },
      { id: "bed", name: "Master Bedroom", tag: "Comfort Suite", panoramaUrl: "/panoramas/master-bedroom.jpg", specs: "Attached Bath · Wardrobe Provision" },
      { id: "kitchen", name: "Compact Modular Kitchen", tag: "Blum Fitted", panoramaUrl: "/panoramas/modular-kitchen.jpg", specs: "Anti-Stain Quartz · SS Sink" },
      { id: "terrace", name: "Open Roof Terrace", tag: "Breeze Deck", panoramaUrl: "/panoramas/sky-terrace.jpg", specs: "Parapet Safety · Cool Roof Tiles" }
    ],
    civilSpecs: {
      structure: "Engineered RCC Column-Beam Frame with IS-456 Code",
      steel: "Fe550D TMT Bars",
      concrete: "53-Grade Ultratech Cement with Double-Washed M-Sand",
      vastu: "East-Facing Traditional Vastu Alignment",
      ceiling: "10'0\" Clear Ceiling Height",
      flooring: "Kajaria Premium 800x800mm Vitrified Tiles",
      handoverTime: "7 Months Record Speed Completion"
    },
    highlights: [
      "Thermal heat-reflective cool tiles on terrace reducing top-floor heat by 5°C",
      "Double-washed M-Sand and P-Sand plastering with crack-resistant mesh",
      "Full concealed plumbing with Astral CPVC pipes and Kohler CP fittings",
      "Delivered with zero defects and complete structural stability certificate"
    ]
  },
  {
    id: "vkmp-madurai",
    title: "VKMP Project",
    img: "/images/danam/ktmpja5oicl4edkegt6v.webp",
    beforeImg: "/images/danam/hh5.webp",
    location: "Theppakulam, Madurai",
    type: "renovation",
    badge: "Turnkey EPC & Renovation",
    area: "Urban Development Complex",
    year: "2024",
    duration: "8 Months",
    budget: "Turnkey Development",
    desc: "Urban project located adjacent to iconic Theppakulam, combining durable civil engineering with functional architectural space utilization.",
    quote: "Danam Holdings has set a benchmark for civil contracting quality in Madurai.",
    author: "Project Committee",
    glbModel: "/models/LuxuryVilla_site_draco.glb",
    modelAuthor: "Zigurat Architecture Studio (CC-BY 4.0)",
    cameraOrbit: "45deg 72deg 80%",
    rooms360: [
      { id: "atrium", name: "Central Gathering Hall", tag: "Heritage View", panoramaUrl: "/panoramas/living-room.jpg", specs: "High Ceiling · Architectural Coves" },
      { id: "office", name: "Administration Suite", tag: "Executive", panoramaUrl: "/panoramas/master-bedroom.jpg", specs: "Timber Finishes · Smart Access" },
      { id: "service", name: "Service & Refreshment Wing", tag: "Hygienic", panoramaUrl: "/panoramas/modular-kitchen.jpg", specs: "Commercial Grade Stainless Steel" },
      { id: "terrace", name: "Theppakulam View Terrace", tag: "Panoramic", panoramaUrl: "/panoramas/sky-terrace.jpg", specs: "360° Water View · Safety Railings" }
    ],
    civilSpecs: {
      structure: "Underpinned Retrofitted Heavy RCC Structural Core",
      steel: "Fe550D High-Ductility TMT Rebars",
      concrete: "M25 / M30 High Durability Concrete Matrix",
      vastu: "Vastu Shastra Optimized Concourse",
      ceiling: "11'6\" Clear Ceiling Height",
      flooring: "Honed Granite Slabs & Heavy Vitrified Pavers",
      handoverTime: "8 Months Turnkey Delivery"
    },
    highlights: [
      "Advanced structural retrofitting and carbon-fiber wrapping for enhanced seismic capacity",
      "Waterproofing barriers engineered for high-water-table zone near Theppakulam",
      "Architectural facade restoration honoring Madurai heritage aesthetics",
      "Fixed-price contract delivered on time with zero unapproved variances"
    ]
  }
];
