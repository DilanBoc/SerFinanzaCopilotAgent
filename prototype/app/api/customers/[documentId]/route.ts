import { NextResponse } from "next/server";
import { findCustomerByDocument } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ documentId: string }> }) {
  const { documentId } = await context.params;
  const customer = findCustomerByDocument(documentId);
  if (!customer) return NextResponse.json({ error: "Cliente dummy no encontrado" }, { status: 404 });
  return NextResponse.json({ customer });
}
