import { NextResponse } from "next/server";
import { OBITUARY_SYSTEM_PROMPT } from "@/lib/ai/obituary-prompt";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const MODEL = "claude-sonnet-4-20250514";
const FALLBACK_OBITUARY =
  "The AI obituary writer is currently experiencing technical difficulties. Which, for a site about dead tech, is honestly on brand.";

function stripCodeFences(text: string): string {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/u, "");
  }
  return t.trim();
}

type ClaudeContent = { type: string; text?: string };

type ObituaryPayload = {
  tagline: string;
  cause_of_death: string;
  emoji: string;
  obituary: string;
  flagged: boolean;
  flag_reason: string | null;
};

export async function POST(request: Request) {
  let body: { projectId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const projectId = body.projectId;
  if (!projectId || typeof projectId !== "string") {
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
  }

  const supabaseUser = await createClient();
  const {
    data: { user },
  } = await supabaseUser.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: project, error: fetchErr } = await admin
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .maybeSingle();

  if (fetchErr || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (project.submitted_by !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userMessage = JSON.stringify({
    project_name: project.name,
    one_liner: project.one_liner ?? null,
    tech_stack: project.tech_stack ?? null,
    url: project.url ?? null,
    github_url: project.github_url ?? null,
    why_stopped: project.why_stopped ?? null,
  });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    await admin
      .from("projects")
      .update({
        ai_obituary: FALLBACK_OBITUARY,
        ai_tagline: "Silence from the beyond.",
        ai_cause_of_death: "The obituary API lost its keys.",
        ai_emoji: "🔌",
        ai_flagged: false,
        ai_flag_reason: null,
        status: "published",
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    return NextResponse.json({ ok: true, fallback: true, reason: "missing_api_key" });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: OBITUARY_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const raw = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        typeof (raw as { error?: { message?: string } }).error?.message === "string"
          ? (raw as { error: { message: string } }).error.message
          : `Anthropic error ${res.status}`
      );
    }

    const textBlock = (raw as { content?: ClaudeContent[] }).content?.find((c) => c.type === "text");
    const rawText = textBlock?.text ?? "";
    const parsed = JSON.parse(stripCodeFences(rawText)) as ObituaryPayload;

    const flagged = Boolean(parsed.flagged);
    const status = flagged ? "flagged" : "published";

    await admin
      .from("projects")
      .update({
        ai_obituary: parsed.obituary ?? FALLBACK_OBITUARY,
        ai_tagline: parsed.tagline ?? null,
        ai_cause_of_death: parsed.cause_of_death ?? null,
        ai_emoji: parsed.emoji ?? "💀",
        ai_flagged: flagged,
        ai_flag_reason: parsed.flag_reason ?? null,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    return NextResponse.json({ ok: true });
  } catch {
    await admin
      .from("projects")
      .update({
        ai_obituary: FALLBACK_OBITUARY,
        ai_tagline: "The writer ghosted us.",
        ai_cause_of_death: "API chaos.",
        ai_emoji: "👻",
        ai_flagged: false,
        ai_flag_reason: null,
        status: "published",
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    return NextResponse.json({ ok: true, fallback: true });
  }
}
