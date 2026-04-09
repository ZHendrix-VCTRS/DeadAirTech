import { NextResponse } from "next/server";

const MODEL = "claude-sonnet-4-20250514";

function stripCodeFences(text: string): string {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/u, "");
  }
  return t.trim();
}

type ClaudeContent = { type: string; text?: string };

export async function POST(req: Request) {
  let body: { name?: string; description?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const prompt = `You are the voice of Dead Air Technologies — a dark humor tech obituary brand. Tone: Scott Galloway's brain in a 14-year-old's mouth. Sharp, irreverent, casually profane. Short sentences. Every joke has a real insight underneath it. Never punch down at indie devs — roast the product, not the person.

Write a tech obituary for: ${JSON.stringify(name)}
${description ? `Additional context: ${JSON.stringify(description)}` : ""}

Return ONLY valid JSON, no markdown, no backticks, nothing else:

{
  "cause_of_death": "One brutal specific funny line. Max 12 words. No mercy.",
  "survived_by": "3-4 absurd specific things that outlived it. Comma separated. Examples: three open GitHub issues, a Figma file nobody can find, the founder's LinkedIn which still lists it under Experience, a Medium post titled Move Fast and Break Things",
  "flowers_or_forget_me_nots": "Start with FLOWERS or FORGET IT — then one punchy sentence on the verdict. Should it come back or rot forever?",
  "pallbearers_note": "The real business or strategy insight. 2-3 sentences. Sharp. The thing that makes someone forward this to a coworker.",
  "sponsor": "A fake deadpan sponsor read. One sentence. Example: This eulogy was brought to you by Google, who would have killed this product anyway."
}`;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Eulogy generation is not configured." }, { status: 503 });
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
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const raw = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg =
        typeof (raw as { error?: { message?: string } }).error?.message === "string"
          ? (raw as { error: { message: string } }).error.message
          : `Anthropic error ${res.status}`;
      console.error("eulogy:", msg);
      return NextResponse.json(
        { error: "Eulogy generation failed. Even our AI is grieving." },
        { status: 500 }
      );
    }

    const textBlock = (raw as { content?: ClaudeContent[] }).content?.find((c) => c.type === "text");
    const text = textBlock?.text ?? "";
    const eulogy = JSON.parse(stripCodeFences(text)) as Record<string, unknown>;
    return NextResponse.json(eulogy);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Eulogy generation failed. Even our AI is grieving." },
      { status: 500 }
    );
  }
}
