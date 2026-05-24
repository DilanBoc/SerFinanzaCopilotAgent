import { NextResponse } from "next/server";
import { getQualityDashboard } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(getQualityDashboard());
}
