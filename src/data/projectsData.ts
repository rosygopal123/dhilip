export interface Project360Room {
  id: string;
  name: string;
  tag: string;
  panoramaUrl: string;
  specs: string;
}

export interface ProjectCadDrawing {
  id: string;
  title: string;
  sheetNo: string;
  type: "Architectural Floor Plan" | "Structural Column Grid" | "Elevation & Section CAD" | "Concept Sketch" | "MEP Layout";
  scale: string;
  dwgUrl: string;
  dimensions: string;
  approvalStatus: string;
  description: string;
  keySpecs: string[];
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
  cameraTarget?: string;
  fieldOfView?: string;
  rooms360: Project360Room[];
  cadDrawings: ProjectCadDrawing[];
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
    cadDrawings: [
      {
        id: "rm-cad-01",
        title: "Commercial Facade Architectural Elevation & Structural CAD Sheet",
        sheetNo: "DWG-2024-RM-01",
        type: "Elevation & Section CAD",
        scale: "1:100 @ A1",
        dwgUrl: "/images/danam/SRJ-20Jewellery-20ElevationNight-20View-20_-20print-20_-2001.jpg.webp",
        dimensions: "65'0\" Frontage x 78'0\" Depth (Multi-Level Showroom)",
        approvalStatus: "Madurai City Municipal Corporation & DTCP Approved",
        description: "Official working CAD elevation drawing specifying structural curtain wall anchorage, composite facade panels, night lighting lux distribution, and column centerline offsets.",
        keySpecs: [
          "IS 875 Part 3 Wind Load Analysis for facade brackets",
          "600x600mm heavy commercial RCC column grid with Fe550D ties",
          "Double-glazed structural unitized envelope with thermal break",
          "Sign-off verified by Chief Structural Consultant & Chief Architect"
        ]
      },
      {
        id: "rm-skt-02",
        title: "Architectural Exterior Facade & Lighting Concept Sketch",
        sheetNo: "SKT-2024-RM-02",
        type: "Concept Sketch",
        scale: "Architectural Perspective",
        dwgUrl: "/images/danam/ddhvrktrjjjln58schqk.webp",
        dimensions: "Multi-Storey Commercial Footprint",
        approvalStatus: "Client Approved Design Concept",
        description: "Preliminary architectural 3D perspective sketch validating glass-to-solid facade ratio, signage band proportions, and client branding visibility.",
        keySpecs: [
          "Symmetry-balanced modern retail facade envelope",
          "Concealed linear 3000K LED wash illumination",
          "High-contrast bronze aluminum composite cladding",
          "Seamless vehicular drop-off and pedestrian circulation"
        ]
      }
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
    cadDrawings: [
      {
        id: "ta-cad-01",
        title: "Structural Mezzanine & Clear Span Commercial CAD Blueprint",
        sheetNo: "DWG-2023-TA-01",
        type: "Structural Column Grid",
        scale: "1:100 @ A1",
        dwgUrl: "/images/danam/marthupandiyar-20vk-20model-201.webp",
        dimensions: "80'0\" x 120'0\" Clear Span Commercial Plate",
        approvalStatus: "Local Planning Authority & Fire Department NOC Approved",
        description: "Engineered working blueprint detailing column-free structural portals, mezzanine steel decking, foundation load transfer, and high-volume customer egress stairs.",
        keySpecs: [
          "Cantilever portal frame engineered for heavy retail merchandise loads",
          "M25 grade ready-mix concrete with NABL compressive cylinder tests",
          "IS 2189 compliant commercial fire alarm and sprinkler grid piping",
          "Approved architectural drawing registered with town planning authority"
        ]
      },
      {
        id: "ta-skt-02",
        title: "Commercial Retail Elevation Design Sketch",
        sheetNo: "SKT-2023-TA-02",
        type: "Concept Sketch",
        scale: "1:75 Elevation",
        dwgUrl: "/images/danam/l3s2jgqoz98xoktjyzvk.webp",
        dimensions: "Flagship Retail Complex",
        approvalStatus: "Client Design Sign-Off",
        description: "Architectural front elevation sketch detailing customer entry canopy, weather louvers, signage display grid, and glass showcase vitrines.",
        keySpecs: [
          "Natural stone and louvered facade treatment",
          "High-traffic anti-skid entrance thresholds",
          "Dedicated service access and loading dock zoning"
        ]
      }
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
    cadDrawings: [
      {
        id: "sacs-cad-01",
        title: "Structural RCC Column Grid & Foundation Engineering Blueprint",
        sheetNo: "DWG-2024-SACS-01",
        type: "Structural Column Grid",
        scale: "1:75 @ A1",
        dwgUrl: "/images/danam/HDFC-20Govind-20-20001.webp",
        dimensions: "120'0\" x 90'0\" Institutional Footprint",
        approvalStatus: "IS 456:2000 Structural Stability Audited & Certified",
        description: "Heavy civil engineering structural drawing specifying foundation footings, shear walls, seismic column confinement ties, and grade beam reinforcement schedules.",
        keySpecs: [
          "Seismic Zone-III ductile detailing conforming to IS 13920",
          "M25 RMC matrix with micro-silica waterproofing admixtures",
          "Concealed heavy copper busbar ducting routes and earthing pits",
          "Certified by Chartered Structural Engineer with load calculation notes"
        ]
      },
      {
        id: "sacs-skt-02",
        title: "Institutional Elevation Working Drawing & Facade Study",
        sheetNo: "SKT-2024-SACS-02",
        type: "Elevation & Section CAD",
        scale: "1:100 Working Section",
        dwgUrl: "/images/danam/rvxn271huf5gcqqtdb46.webp",
        dimensions: "Civil Institutional Facility",
        approvalStatus: "Institution Committee Approved",
        description: "Architectural cross-section detailing high-traffic concourse clearances, acoustic ceiling baffles, and daylight harvesting window bands.",
        keySpecs: [
          "Saint-Gobain acoustic performance glazing",
          "Wide pedestrian egress stairwells per NBC fire codes",
          "Weatherproof silicone sealants with 10-year warranty"
        ]
      }
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
    cadDrawings: [
      {
        id: "op-cad-01",
        title: "Luxury Villa Front Elevation & Spatial Section CAD Blueprint",
        sheetNo: "DWG-2024-OP-01",
        type: "Elevation & Section CAD",
        scale: "1:50 @ A1",
        dwgUrl: "/images/danam/f5ktkhnwu6qzx1rytkhr.webp",
        dimensions: "45'0\" Frontage x 70'0\" Depth (4,400 Sq.Ft G+2)",
        approvalStatus: "Madurai DTCP Residential Sanction No. 248/2024",
        description: "High-precision architectural blueprint detailing double-height atrium section cuts, cantilevered balconies, structural column grids, and acoustic window lintels.",
        keySpecs: [
          "14'6\" clear ceiling height with perimeter steel-reinforced lintels",
          "Acoustic UPVC window openings with 38dB noise barrier insulation",
          "Full Vastu Shastra compliance: NE main entry & SW master bedroom suite",
          "DTCP approved blueprint with registered local planning permit"
        ]
      },
      {
        id: "op-skt-02",
        title: "Double-Height Living Atrium Interior Spatial Concept Sketch",
        sheetNo: "SKT-2024-OP-02",
        type: "Concept Sketch",
        scale: "1:25 Interior Detail",
        dwgUrl: "/images/danam/FFLiving-002.webp",
        dimensions: "G+2 Luxury Villa Interior",
        approvalStatus: "Client Approved Interior Palette",
        description: "Interior design concept sketch illustrating bookmatched Italian marble wall cladding, floating wooden staircase, and architectural cove illumination.",
        keySpecs: [
          "Imported Italian Calacatta marble wall bookmatch layout",
          "Concealed Daikin VRV climate conditioning integration",
          "Automated smart architectural mood lighting circuits"
        ]
      }
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
    cadDrawings: [
      {
        id: "vbjv-cad-01",
        title: "Contemporary 3D Elevation Working Blueprint & Section",
        sheetNo: "DWG-2024-VBJV-01",
        type: "Elevation & Section CAD",
        scale: "1:50 @ A1",
        dwgUrl: "/images/danam/qbic7zxhdojtkqcdzktv.webp",
        dimensions: "40'0\" x 60'0\" (3,600 Sq.Ft G+2)",
        approvalStatus: "Madurai Corporation Building Sanction Approved",
        description: "Architectural CAD elevation detailing modern cantilever balconies, exterior stone cladding panels, louvered privacy screens, and cross-ventilation openings.",
        keySpecs: [
          "IS 456 compliant RCC cantilevered balcony reinforcement",
          "Engineered exterior stone cladding anchors with expansion joints",
          "Auspicious East-facing entrance with Vastu verified coordinates",
          "Madurai City Municipal Corporation building permit registered"
        ]
      },
      {
        id: "vbjv-cad-02",
        title: "Structural Column Layout & Ground Floor CAD Plan",
        sheetNo: "DWG-2024-VBJV-02",
        type: "Structural Column Grid",
        scale: "1:50 Blueprint",
        dwgUrl: "/images/danam/Dr-20rikesh-20-20001.webp",
        dimensions: "Ground & First Floor Layout Grid",
        approvalStatus: "Structural Engineer Verified",
        description: "Working structural drawing highlighting column centerline markers, footing dimensions, brick wall thickness, and door/window lintel levels.",
        keySpecs: [
          "9-inch wire-cut brick external walls with thermal insulation",
          "Fe550D TMT reinforcement with earthquake resistance ties",
          "Concealed electrical conduit runs in ceiling slab"
        ]
      }
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
    cadDrawings: [
      {
        id: "hdfc-cad-01",
        title: "Commercial Banking & Office Working CAD Blueprint",
        sheetNo: "DWG-2023-HDFC-01",
        type: "Architectural Floor Plan",
        scale: "1:100 @ A1",
        dwgUrl: "/images/danam/HDFC-20Govind-20-20001.webp",
        dimensions: "55'0\" Frontage x 85'0\" Depth Commercial Layout",
        approvalStatus: "Commercial Banking Safety Standards Certified",
        description: "Official structural blueprint specifying banking concourse layout, cash counter reinforced partitions, vault envelope thickness, and dual fire exits.",
        keySpecs: [
          "Heavy RCC security vault envelope with M30 grade concrete",
          "Fire suppression sprinkler and FM200 gas system pipe routing",
          "IS 456 compliant column layout with heavy axial load capacity",
          "Corporate sign-off verified with HDFC facility engineering standards"
        ]
      },
      {
        id: "hdfc-cad-02",
        title: "Structural Column Skeleton & Foundation Layout",
        sheetNo: "DWG-2023-HDFC-02",
        type: "Structural Column Grid",
        scale: "1:100 Detail",
        dwgUrl: "/images/danam/hh2.webp",
        dimensions: "Heavy Commercial Foundation Grid",
        approvalStatus: "Structural Engineer Certified",
        description: "On-site engineering grid detailing column reinforcement cages, footing depth, and vibration-isolated rooftop generator plinth.",
        keySpecs: [
          "Ductile detailing for high structural stability",
          "Concealed copper busbar rising mains",
          "Anti-termite treated subterranean foundation"
        ]
      }
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
    cadDrawings: [
      {
        id: "dr-cad-01",
        title: "Architectural Floor Plan CAD Blueprint & Clinical Wing Layout",
        sheetNo: "DWG-2023-DR-01",
        type: "Architectural Floor Plan",
        scale: "1:50 @ A1",
        dwgUrl: "/images/danam/Dr-20rikesh-20-20001.webp",
        dimensions: "38'0\" Frontage x 58'0\" Depth (3,200 Sq.Ft G+1)",
        approvalStatus: "Madurai North Zone Municipal Sanctioned",
        description: "Official CAD architectural floor plan detailing bifurcated doctor consultation suite, patient waiting lounge, family residential privacy corridor, and staircase clearance.",
        keySpecs: [
          "Bifurcated public-clinic and private-residence acoustic partition",
          "Wall thickness: 9\" external weather barrier & 4.5\" internal partitions",
          "North-facing clinical entrance & South-West master bedroom alignment",
          "Madurai City Municipal Corporation building sanction registered"
        ]
      },
      {
        id: "dr-cad-02",
        title: "Structural Framing Grid & Wall Schedule Drawing",
        sheetNo: "DWG-2023-DR-02",
        type: "Structural Column Grid",
        scale: "1:50 Working Plan",
        dwgUrl: "/images/danam/hh1.webp",
        dimensions: "G+1 RCC Skeleton Layout",
        approvalStatus: "Structural Engineer Approved",
        description: "Structural site execution drawing displaying column positions, beam depths, plinth beam reinforcement, and lintel casting levels.",
        keySpecs: [
          "Fe550D TMT reinforcements with ductile lap splices",
          "M25 grade controlled machine concrete mix",
          "Plinth beam DPC waterproofing membrane treatment"
        ]
      }
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
    cadDrawings: [
      {
        id: "mpn-cad-01",
        title: "Architectural Elevation CAD & Structural Section Blueprint",
        sheetNo: "DWG-2023-MPN-01",
        type: "Elevation & Section CAD",
        scale: "1:50 @ A1",
        dwgUrl: "/images/danam/marthupandiyar-20vk-20model-201.webp",
        dimensions: "32'0\" Frontage x 52'0\" Depth (2,850 Sq.Ft G+1)",
        approvalStatus: "DTCP Approved Layout Plan",
        description: "Comprehensive architectural working drawing showing floor levels, staircase headroom, parapet wall details, sunshade projections, and terrace cool-tile cross section.",
        keySpecs: [
          "IS 456 compliant column-beam framed structure",
          "Terrace cool roof heat-reflective tile matrix with waterproofing",
          "Double-washed M-Sand masonry with anti-crack chicken mesh",
          "Approved building plan sanction registered under DTCP layout"
        ]
      },
      {
        id: "mpn-cad-02",
        title: "Reinforced Concrete Structural Plan & Footing Schedule",
        sheetNo: "DWG-2023-MPN-02",
        type: "Structural Column Grid",
        scale: "1:50 Blueprint",
        dwgUrl: "/images/danam/hh3.webp",
        dimensions: "G+1 Residential Foundation Grid",
        approvalStatus: "Structural Engineer Verified",
        description: "Foundation trench and column footing layout specifying Fe550D rebar bending schedules, cover blocks, and concrete slump test standards.",
        keySpecs: [
          "53-Grade Ultratech cement with controlled hydration",
          "10'0\" clear floor-to-slab architectural ceiling height",
          "Concealed Astral CPVC and SWR drainage piping routes"
        ]
      }
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
    cadDrawings: [
      {
        id: "vkmp-cad-01",
        title: "Architectural Facade CAD Blueprint & Structural Section",
        sheetNo: "DWG-2024-VKMP-01",
        type: "Elevation & Section CAD",
        scale: "1:100 @ A1",
        dwgUrl: "/images/danam/ktmpja5oicl4edkegt6v.webp",
        dimensions: "70'0\" x 95'0\" Site Boundary Layout",
        approvalStatus: "Heritage Conservation & Corporation Certified",
        description: "Specialized structural retrofitting and facade elevation blueprint aligning modern civil engineering with heritage precinct guidelines near Vandiyur Mariamman Teppakulam.",
        keySpecs: [
          "Carbon-fiber reinforced polymer (CFRP) structural wrapping schedule",
          "High water-table subterranean hydrostatic pressure waterproofing barrier",
          "Heritage facade archway geometry and traditional Madurai cornice detail",
          "Approved municipal structural retrofitting plan registration"
        ]
      },
      {
        id: "vkmp-cad-02",
        title: "Underpinning & Retrofit Structural Layout",
        sheetNo: "DWG-2024-VKMP-02",
        type: "Structural Column Grid",
        scale: "1:75 Detail",
        dwgUrl: "/images/danam/hh5.webp",
        dimensions: "Underpinning & Foundation Grid",
        approvalStatus: "Civil Engineering Board Approved",
        description: "Underpinning beam schedule, micropile arrangement, and heavy column jacketing coordinates for seismic upgrade.",
        keySpecs: [
          "Micro-fine cementitious grouting along foundation periphery",
          "Fe550D high-ductility rebar jacketing for load-bearing columns",
          "Continuous electronic crack-monitoring sensor coordinates"
        ]
      }
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
