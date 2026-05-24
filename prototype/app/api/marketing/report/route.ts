import { NextResponse } from "next/server";
import { marketingMarkdown } from "@/lib/demo-data";
import { listMarketingOpportunities, saveMarketingReport } from "@/lib/db";
import { generateMarketingMarkdownWithGemini } from "@/lib/gemini";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ content: marketingMarkdown });
}

export async function POST() {
  const content = await generateMarketingMarkdownWithGemini({
    opportunities: listMarketingOpportunities(),
    fallback: marketingMarkdown,
  });
  return NextResponse.json(saveMarketingReport(content));
}
