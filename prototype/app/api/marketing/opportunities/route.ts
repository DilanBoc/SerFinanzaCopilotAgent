import { NextResponse } from "next/server";
import { listMarketingOpportunities } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ opportunities: listMarketingOpportunities() });
}
