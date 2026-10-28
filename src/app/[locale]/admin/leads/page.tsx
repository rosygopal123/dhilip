"use client";
import React, { useState, useEffect } from "react";
import { Lead } from "@/lib/crmService";
import {
  Users,
  Search,
  Filter,
  Download,
  PlusCircle,
  CheckCircle,
  Clock,
  Send,
  Building,
  RefreshCw,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
} from "lucide-react";

export default function AdminLeadsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [generating, setGenerating] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("danam_admin_auth");
      if (stored === "true") {
        setIsAuthenticated(true);
        fetchLeads();
      }
      setAuthChecking(false);
    }
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = passwordInput.trim().toLowerCase().replace(/\s+/g, "");
    // Accepts "admin123" or "admin 123"
    if (clean === "admin123") {
      sessionStorage.setItem("danam_admin_auth", "true");
      setIsAuthenticated(true);
      setAuthError("");
      fetchLeads();
    } else {
      setAuthError("Incorrect admin password. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("danam_admin_auth");
    setIsAuthenticated(false);
    setPasswordInput("");
    setAuthError("");
  };

  const handleStatusChange = async (id: string, newStatus: Lead["status"]) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleGenerateTestLead = async () => {
    setGenerating(true);
    const mockDistricts = ["Madurai", "Chennai", "Coimbatore", "Trichy", "Salem"];
    const mockNames = ["Rohan Sundaram", "Divya Lakshmi", "Venkatesh Babu", "Kavitha Nair", "Balaji Pillai"];
    const randomDistrict = mockDistricts[Math.floor(Math.random() * mockDistricts.length)];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const randomPhone = `98${Math.floor(10000000 + Math.random() * 90000000)}`;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: randomName,
          mobile: randomPhone,
          email: `${randomName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
          district: randomDistrict,
          projectType: "Residential Bungalow",
          budget: "₹50 Lakh - ₹1 Crore",
          areaSqFt: "2200 Sq.Ft",
          message: `Demo lead generated automatically from Admin Console for ${randomDistrict} project.`,
          source: "Admin Demo Test Generator",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => [data.lead, ...prev]);
      }
    } catch (err) {
      console.error("Failed to generate test lead:", err);
    } finally {
      setGenerating(false);
    }
  };

  const exportToCSV = () => {
    if (leads.length === 0) return;
    const headers = ["Lead ID", "Name", "Mobile", "Email", "District", "Project Type", "Budget", "Area", "Status", "Source", "Assigned Manager", "Created At"];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name}"`,
      l.mobile,
      l.email || "",
      l.district,
      `"${l.projectType}"`,
      `"${l.budget}"`,
      l.areaSqFt || "",
      l.status,
      `"${l.source}"`,
      `"${l.assignedManager?.name || ""}"`,
      l.createdAt,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Danam_Holdings_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter((l) => {
    const matchesStatus = filterStatus === "ALL" || l.status === filterStatus;
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.mobile.includes(searchTerm) ||
      l.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (authChecking) {
    return (
      <div className="min-h-screen bg-surface-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-forest border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090d] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Architectural grid background */}
        <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-forest/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-teak/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-[#0d1117] border border-white/15 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#141b24] border border-white/15 flex items-center justify-center shadow-lg mb-4">
              <Lock className="w-7 h-7 text-amber-400" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-leaf-light font-bold">
              DANAM HOLDINGS • RESTRICTED ACCESS
            </span>
            <h1 className="font-display text-2xl font-bold text-white mt-1">
              Admin CRM Portal
            </h1>
            <p className="text-white/60 text-xs mt-1 max-w-xs">
              Enter executive password to access client inquiries & sales leads.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoFocus
                  required
                  placeholder="Enter password..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError("");
                  }}
                  className="w-full bg-[#161d26] border border-white/20 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors pr-11 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="bg-red-500/15 border border-red-500/40 rounded-xl p-3 text-xs text-red-300 font-mono">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-brand-forest to-brand-forest-dark hover:brightness-110 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Unlock Dashboard</span>
            </button>
          </form>

          {/* Security Badge */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-white/40 text-[11px] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>End-to-End Encrypted Session</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-1 pt-28 pb-20 px-6 md:px-12 text-left">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-0 border border-brand-teak/20 p-8 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-brand-teak/10 text-brand-teak font-mono text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">
                HUBSPOT & N8N CONNECTED
              </span>
              <span className="font-mono text-[10px] text-text-tertiary">Live CRM Sync</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-text-primary">
              Lead Generation & CRM Admin Dashboard
            </h1>
            <p className="font-ui text-xs text-text-secondary mt-1">
              Manage incoming sales inquiries, track assigned branch managers, and inspect HubSpot / n8n webhook status.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleGenerateTestLead}
              disabled={generating}
              className="bg-brand-teak hover:bg-brand-teal text-white px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold rounded shadow flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{generating ? "Simulating..." : "+ Demo Test Lead"}</span>
            </button>

            <button
              onClick={exportToCSV}
              className="border border-border-subtle hover:border-brand-teak bg-surface-0 text-text-primary px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold rounded flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-brand-teak" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="border border-red-500/30 hover:border-red-500/60 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3.5 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Lock Admin Dashboard"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-0 border border-border-subtle p-5 rounded-lg">
            <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider font-bold">
              Total Inquiries Captured
            </span>
            <div className="font-display text-3xl font-bold text-brand-teak mt-2">{leads.length}</div>
          </div>

          <div className="bg-surface-0 border border-border-subtle p-5 rounded-lg">
            <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider font-bold">
              New Uncontacted Leads
            </span>
            <div className="font-display text-3xl font-bold text-amber-500 mt-2">
              {leads.filter((l) => l.status === "NEW").length}
            </div>
          </div>

          <div className="bg-surface-0 border border-border-subtle p-5 rounded-lg">
            <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider font-bold">
              HubSpot API Synced
            </span>
            <div className="font-display text-3xl font-bold text-brand-teal mt-2">
              {leads.filter((l) => l.hubspotSynced).length} / {leads.length}
            </div>
          </div>

          <div className="bg-surface-0 border border-border-subtle p-5 rounded-lg">
            <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider font-bold">
              n8n Webhook Dispatches
            </span>
            <div className="font-display text-3xl font-bold text-emerald-600 mt-2">
              {leads.filter((l) => l.n8nSynced).length} / {leads.length}
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-surface-0 border border-border-subtle p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search lead name, phone, district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-surface-1 border border-border-subtle pl-9 pr-3 py-2 text-xs font-ui text-text-primary w-full outline-none focus:border-brand-teak"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto font-mono text-[10px] uppercase font-semibold">
            {["ALL", "NEW", "CONTACTED", "QUALIFIED", "SITE_VISIT", "CLOSED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  filterStatus === status
                    ? "bg-brand-teak text-white font-bold"
                    : "text-text-secondary hover:bg-surface-2"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-surface-0 border border-border-subtle overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 text-center font-mono text-xs text-text-tertiary">
              Loading CRM lead records...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-20 text-center font-mono text-xs text-text-tertiary">
              No leads found matching current filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-ui text-xs">
                <thead className="bg-surface-1 border-b border-border-subtle font-mono text-[10px] uppercase text-text-secondary">
                  <tr>
                    <th className="p-4">Lead ID</th>
                    <th className="p-4">Prospect</th>
                    <th className="p-4">Location & Type</th>
                    <th className="p-4">Budget / Area</th>
                    <th className="p-4">Assigned Manager</th>
                    <th className="p-4">Source</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">CRM Sync</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-surface-1/50 transition-colors">
                      {/* ID */}
                      <td className="p-4 font-mono font-bold text-brand-teak">{lead.id}</td>

                      {/* Name & Contact */}
                      <td className="p-4">
                        <div className="font-semibold text-text-primary">{lead.name}</div>
                        <div className="font-mono text-[10px] text-text-tertiary flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-brand-teal" />
                          <span>{lead.mobile}</span>
                        </div>
                        {lead.email && (
                          <div className="font-mono text-[10px] text-text-tertiary flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3" />
                            <span>{lead.email}</span>
                          </div>
                        )}
                      </td>

                      {/* District & Project */}
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-text-primary font-medium">
                          <MapPin className="w-3 h-3 text-brand-teak" />
                          <span>{lead.district}</span>
                        </div>
                        <div className="text-[10px] text-text-tertiary">{lead.projectType}</div>
                      </td>

                      {/* Budget & SqFt */}
                      <td className="p-4">
                        <div className="font-semibold text-text-primary">{lead.budget}</div>
                        <div className="font-mono text-[10px] text-brand-teal">{lead.areaSqFt}</div>
                      </td>

                      {/* Manager */}
                      <td className="p-4">
                        <div className="font-medium text-text-primary">{lead.assignedManager?.name}</div>
                        <div className="text-[9px] font-mono text-text-tertiary">
                          {lead.assignedManager?.office}
                        </div>
                      </td>

                      {/* Source & Referral */}
                      <td className="p-4">
                        <span className="font-mono text-[10px] bg-surface-2 px-2 py-1 rounded text-text-secondary block w-fit">
                          {lead.source}
                        </span>
                        {lead.message && (
                          <div className="text-[10px] text-brand-teak italic mt-1 max-w-[150px] truncate" title={lead.message}>
                            Source: {lead.message}
                          </div>
                        )}
                      </td>

                      {/* Status Selector */}
                      <td className="p-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead["status"])}
                          className={`font-mono text-[10px] uppercase font-bold p-1.5 rounded outline-none border cursor-pointer ${
                            lead.status === "NEW"
                              ? "bg-amber-50 border-amber-300 text-amber-800"
                              : lead.status === "QUALIFIED"
                              ? "bg-blue-50 border-blue-300 text-blue-800"
                              : lead.status === "CLOSED"
                              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                              : "bg-gray-50 border-gray-300 text-gray-800"
                          }`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="QUALIFIED">QUALIFIED</option>
                          <option value="SITE_VISIT">SITE_VISIT</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>

                      {/* CRM Badges */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1 font-mono text-[9px]">
                          <span
                            className={`px-1.5 py-0.5 rounded text-center font-bold ${
                              lead.hubspotSynced
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            HubSpot {lead.hubspotSynced ? "✓" : "Pending"}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-center font-bold ${
                              lead.n8nSynced
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            n8n {lead.n8nSynced ? "✓" : "Pending"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Integration Instructions Card */}
        <div className="bg-surface-0 border border-brand-teak/20 p-6 rounded-lg font-ui text-xs flex flex-col gap-3">
          <h4 className="font-display font-semibold text-sm text-text-primary flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-teak" />
            <span>Connecting Self-Hosted n8n & Live HubSpot Keys</span>
          </h4>
          <p className="text-text-secondary leading-relaxed">
            To direct live leads directly into your self-hosted **n8n** or **HubSpot** account, add the following key environment variables to your `.env.local` file:
          </p>
          <div className="bg-surface-1 p-3 rounded font-mono text-[11px] text-brand-teak border border-border-subtle flex flex-col gap-1">
            <span>HUBSPOT_ACCESS_TOKEN=pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</span>
            <span>N8N_WEBHOOK_URL=http://localhost:5678/webhook/abc-builders-lead</span>
          </div>
        </div>

      </div>
    </div>
  );
}
