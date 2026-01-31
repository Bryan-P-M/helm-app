import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { EXTRACTION_SYSTEM_PROMPT, buildExtractionPrompt } from "@/lib/ai/extraction-prompt";
import { callGemini } from "@/lib/ai/gemini";

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { meetingId, meetingTitle, meetingDate, notes } = body;

    if (!meetingId || !notes) {
      return NextResponse.json({ error: "meetingId and notes are required" }, { status: 400 });
    }

    // Build prompt and call Gemini
    const userPrompt = buildExtractionPrompt(
      meetingTitle || "Untitled Meeting",
      meetingDate || new Date().toISOString().slice(0, 10),
      notes
    );

    const resultText = await callGemini(EXTRACTION_SYSTEM_PROMPT, userPrompt);

    // Parse the JSON response
    let extractions;
    try {
      const parsed = JSON.parse(resultText);
      extractions = parsed.extractions || [];
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response", raw: resultText }, { status: 500 });
    }

    // Validate and sanitize extractions
    const validTypes = ["action", "decision", "risk", "issue"];
    const validPriorities = ["critical", "high", "medium", "low"];

    const sanitized = extractions
      .filter((e: any) => e.title && validTypes.includes(e.type))
      .map((e: any) => ({
        type: e.type,
        title: String(e.title).slice(0, 200),
        description: e.description ? String(e.description).slice(0, 2000) : null,
        confidence: Math.min(1, Math.max(0, Number(e.confidence) || 0.5)),
        owner: e.owner ? String(e.owner) : null,
        due_date: e.due_date && /^\d{4}-\d{2}-\d{2}$/.test(e.due_date) ? e.due_date : null,
        priority: validPriorities.includes(e.priority) ? e.priority : "medium",
        source_text: e.source_text ? String(e.source_text).slice(0, 1000) : null,
      }));

    return NextResponse.json({
      meetingId,
      extractionCount: sanitized.length,
      extractions: sanitized,
    });
  } catch (error: any) {
    console.error("Extraction error:", error);
    return NextResponse.json({ error: error.message || "Extraction failed" }, { status: 500 });
  }
}
