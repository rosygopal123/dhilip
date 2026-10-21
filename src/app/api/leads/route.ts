import { NextResponse } from "next/server";
import { getLeads, createLead, updateLeadStatus } from "@/lib/crmService";

export async function GET() {
  try {
    const leads = getLeads();
    return NextResponse.json({ success: true, count: leads.length, leads });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch leads", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.mobile) {
      return NextResponse.json(
        { success: false, message: "Name and Mobile number are required fields." },
        { status: 400 }
      );
    }

    const lead = await createLead(body);

    return NextResponse.json({
      success: true,
      message: "Lead successfully recorded in CRM & Webhook queue",
      lead,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to process lead submission", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "ID and status are required for updating lead." },
        { status: 400 }
      );
    }

    const updatedLead = await updateLeadStatus(id, status);
    if (!updatedLead) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update lead status", error: String(error) },
      { status: 500 }
    );
  }
}
