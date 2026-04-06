import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BUTTONDOWN_URL = "https://api.buttondown.com/v1/subscribers";

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY?.trim();
  if (!apiKey) {
    console.error("BUTTONDOWN_API_KEY is not set");
    return NextResponse.json({ error: "Newsletter is not configured." }, { status: 503 });
  }

  try {
    const res = await fetch(BUTTONDOWN_URL, {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
        "X-Buttondown-Collision-Behavior": "overwrite",
      },
      body: JSON.stringify({ email_address: email }),
    });

    if (res.ok) {
      return NextResponse.json({ ok: true });
    }

    const raw = await res.text();
    let detail = "Could not subscribe.";
    try {
      const errJson = JSON.parse(raw) as { detail?: string };
      if (typeof errJson.detail === "string" && errJson.detail) {
        detail = errJson.detail;
      } else if (raw) {
        detail = raw.slice(0, 200);
      }
    } catch {
      if (raw) detail = raw.slice(0, 200);
    }

    const status = res.status >= 400 && res.status < 600 ? res.status : 502;
    console.error("Buttondown subscribe:", res.status, detail);
    return NextResponse.json({ error: detail }, { status });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Network error. Try again." }, { status: 502 });
  }
}
