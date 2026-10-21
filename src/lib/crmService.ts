import fs from "fs";
import path from "path";

export interface Lead {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  district: string;
  projectType: string;
  budget: string;
  areaSqFt?: string;
  message?: string;
  vastuPreferred?: boolean;
  aadhaarNumber?: string;
  source: string;
  assignedManager: {
    name: string;
    role: string;
    office: string;
  };
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "SITE_VISIT" | "CLOSED";
  createdAt: string;
  hubspotSynced?: boolean;
  n8nSynced?: boolean;
}

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

// Initial sample leads for demo purposes
const DEFAULT_DEMO_LEADS: Lead[] = [
  {
    id: "LEAD-1001",
    name: "Karthik Subramanian",
    mobile: "9840123456",
    email: "karthik.subramanian@example.com",
    district: "Madurai",
    projectType: "Residential Bungalow",
    budget: "₹50 Lakh - ₹1 Crore",
    areaSqFt: "2400 Sq.Ft",
    message: "Looking for G+1 duplex home design near KK Nagar, Madurai.",
    vastuPreferred: true,
    source: "Contact Form",
    assignedManager: {
      name: "Er. Ramesh Kumar",
      role: "Chief Manager (South Zone)",
      office: "Madurai HQ Office",
    },
    status: "QUALIFIED",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    hubspotSynced: true,
    n8nSynced: true,
  },
  {
    id: "LEAD-1002",
    name: "Priya Rajan",
    mobile: "9790987654",
    email: "priya.rajan@example.com",
    district: "Chennai",
    projectType: "Renovation/Extension",
    budget: "₹30 Lakh - ₹50 Lakh",
    areaSqFt: "1500 Sq.Ft",
    message: "Want to extend 2nd floor with modern terrace garden in Adyar.",
    vastuPreferred: false,
    source: "Quick Quote Modal",
    assignedManager: {
      name: "Er. S. Anbarasan",
      role: "Regional Manager (North Zone)",
      office: "Chennai Office",
    },
    status: "NEW",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    hubspotSynced: false,
    n8nSynced: true,
  },
  {
    id: "LEAD-1003",
    name: "Muthu Kumar",
    mobile: "9443112233",
    email: "muthu.m@example.com",
    district: "Coimbatore",
    projectType: "Commercial Space",
    budget: "₹1 Crore - ₹2 Crore",
    areaSqFt: "4500 Sq.Ft",
    message: "Inquiring for corporate showroom building construction.",
    vastuPreferred: true,
    source: "WhatsApp Widget",
    assignedManager: {
      name: "Ms. Meera Krishnan",
      role: "Regional Manager (West Zone)",
      office: "Coimbatore/Salem Office",
    },
    status: "CONTACTED",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    hubspotSynced: true,
    n8nSynced: true,
  },
];

function ensureStorageExists() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, JSON.stringify(DEFAULT_DEMO_LEADS, null, 2), "utf8");
    }
  } catch (err) {
    console.error("Error creating storage file:", err);
  }
}

export function getLeads(): Lead[] {
  ensureStorageExists();
  try {
    const content = fs.readFileSync(LEADS_FILE, "utf8");
    return JSON.parse(content);
  } catch {
    return DEFAULT_DEMO_LEADS;
  }
}

export function saveLeads(leads: Lead[]) {
  ensureStorageExists();
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving leads:", err);
  }
}

export async function createLead(rawLead: Partial<Lead>): Promise<Lead> {
  const leads = getLeads();

  // Helper manager assigner based on district
  const getManager = (district?: string) => {
    const northDistricts = ["Chennai", "Kanchipuram", "Vellore", "Tiruvallur", "Ranipet", "Chengalpattu"];
    const westDistricts = ["Coimbatore", "Salem", "Erode", "Tiruppur", "Karur", "Nilgiris"];

    if (district && northDistricts.includes(district)) {
      return {
        name: "Er. S. Anbarasan",
        role: "Regional Manager (North Zone & Chennai)",
        office: "Chennai Office",
      };
    }
    if (district && westDistricts.includes(district)) {
      return {
        name: "Ms. Meera Krishnan",
        role: "Regional Manager (West Zone & Coimbatore)",
        office: "Coimbatore/Salem Office",
      };
    }
    return {
      name: "Er. Ramesh Kumar",
      role: "Chief Manager (South & Central Zone)",
      office: "Madurai HQ Office",
    };
  };

  const newLead: Lead = {
    id: `LEAD-${Math.floor(100000 + Math.random() * 900000)}`,
    name: rawLead.name || "Anonymous Prospect",
    mobile: rawLead.mobile || "N/A",
    email: rawLead.email || "",
    district: rawLead.district || "Madurai",
    projectType: rawLead.projectType || "Residential Bungalow",
    budget: rawLead.budget || "Not Specified",
    areaSqFt: rawLead.areaSqFt || "1800 Sq.Ft",
    message: rawLead.message || "",
    vastuPreferred: rawLead.vastuPreferred ?? true,
    aadhaarNumber: rawLead.aadhaarNumber || "",
    source: rawLead.source || "Website Form",
    assignedManager: getManager(rawLead.district),
    status: "NEW",
    createdAt: new Date().toISOString(),
    hubspotSynced: false,
    n8nSynced: false,
  };

  // Sync to External CRM (HubSpot & n8n)
  const syncResults = await syncLeadToExternalCRMs(newLead);
  newLead.hubspotSynced = syncResults.hubspot;
  newLead.n8nSynced = syncResults.n8n;

  // Insert at top of array
  leads.unshift(newLead);
  saveLeads(leads);

  return newLead;
}

export async function updateLeadStatus(id: string, status: Lead["status"]): Promise<Lead | null> {
  const leads = getLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return null;

  leads[index].status = status;
  saveLeads(leads);
  return leads[index];
}

/**
 * Dispatches lead data to HubSpot Contacts API and self-hosted n8n / Zapier webhooks.
 */
export async function syncLeadToExternalCRMs(lead: Lead): Promise<{ hubspot: boolean; n8n: boolean }> {
  let hubspotSuccess = false;
  let n8nSuccess = false;

  const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN;
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || process.env.CRM_WEBHOOK_URL;

  // 1. Send to HubSpot Contacts API
  if (hubspotToken) {
    try {
      const nameParts = lead.name.split(" ");
      const firstname = nameParts[0] || lead.name;
      const lastname = nameParts.slice(1).join(" ") || "Prospect";

      const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${hubspotToken}`,
        },
        body: JSON.stringify({
          properties: {
            firstname: firstname,
            lastname: lastname,
            email: lead.email || `${lead.mobile}@prospect.danamholdings.in`,
            phone: lead.mobile,
            city: lead.district,
            hs_lead_status: "NEW",
            message: `[Danam Holdings Lead] Project: ${lead.projectType} | Budget: ${lead.budget} | Manager: ${lead.assignedManager.name} | Note: ${lead.message || "N/A"}`,
          },
        }),
      });

      if (res.ok) {
        hubspotSuccess = true;
      } else {
        console.warn("HubSpot API returned status:", res.status, await res.text());
      }
    } catch (err) {
      console.error("HubSpot dispatch failed:", err);
    }
  } else {
    // Simulated success for demo mode if token isn't provided yet
    hubspotSuccess = true;
  }

  // 2. Send to Self-Hosted n8n / Open-WA / Zapier Webhook
  const openWaUrl = process.env.OPEN_WA_WEBHOOK_URL;
  const ownerPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919361599097";

  // 3. Send Direct WhatsApp Notification via Open-WA API Server (http://localhost:8080/api/send-text)
  const openWaApiEndpoint = process.env.OPEN_WA_API_URL || "http://localhost:8080/api/send-text";
  try {
    const waText = `🚀 *NEW WEBSITE LEAD (${lead.id})*\n\n👤 *Name*: ${lead.name}\n📱 *Phone*: ${lead.mobile}\n📍 *District*: ${lead.district}\n🏗️ *Project*: ${lead.projectType}\n💰 *Budget*: ${lead.budget} (${lead.areaSqFt || ""})\n🏢 *Branch*: ${lead.assignedManager?.name} (${lead.assignedManager?.office})\n🌐 *Source*: ${lead.source}`;
    
    await fetch(openWaApiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: ownerPhone,
        message: waText,
      }),
    });
    n8nSuccess = true;
  } catch (err) {
    // Fail silently if Open-WA local server is offline
  }

  if (n8nWebhookUrl || openWaUrl) {
    const targetUrl = n8nWebhookUrl || openWaUrl;
    try {
      const res = await fetch(targetUrl!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "lead.created",
          timestamp: new Date().toISOString(),
          ownerWhatsAppNumber: ownerPhone,
          notificationMessage: `🚀 New Lead Captured (${lead.id})!\nName: ${lead.name}\nPhone: ${lead.mobile}\nDistrict: ${lead.district}\nProject: ${lead.projectType}\nBudget: ${lead.budget}\nSource: ${lead.source}`,
          lead: lead,
          crmPayload: {
            platform: "HubSpot / Open-WA / n8n Local",
            assignedBranch: lead.assignedManager.office,
          },
        }),
      });
      if (res.ok) n8nSuccess = true;
    } catch (err) {
      console.error("n8n / Open-WA Webhook dispatch failed:", err);
    }
  } else {
    n8nSuccess = true;
  }

  return { hubspot: hubspotSuccess, n8n: n8nSuccess };
}
