"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const labelClass = "block font-display text-[10px] tracking-wider text-[#a0a0a0]";
const inputClass =
  "terminal-input mt-2 w-full rounded px-3 py-2 font-body text-[14px] text-dead-text placeholder:text-[#555]";

export function SubmitForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You need to log in to bury a project.");
      setLoading(false);
      return;
    }

    const { data: limitData, error: limitErr } = await supabase.rpc("check_submission_limit", {
      p_user_id: user.id,
    });
    if (limitErr) {
      setError(limitErr.message);
      setLoading(false);
      return;
    }
    const limit = limitData as { allowed?: boolean; message?: string };
    if (limit.allowed === false) {
      setError(limit.message ?? "Submission limit reached.");
      setLoading(false);
      return;
    }

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const one_liner = (form.elements.namedItem("one_liner") as HTMLInputElement).value.trim();
    const tech_stack = (form.elements.namedItem("tech_stack") as HTMLInputElement).value.trim();
    const url = (form.elements.namedItem("url") as HTMLInputElement).value.trim();
    const github_url = (form.elements.namedItem("github_url") as HTMLInputElement).value.trim();
    const why_stopped = (form.elements.namedItem("why_stopped") as HTMLTextAreaElement).value.trim();
    const screenshot = (form.elements.namedItem("screenshot") as HTMLInputElement).files?.[0];

    let screenshot_url: string | null = null;

    if (screenshot && screenshot.size > 0) {
      const ext = screenshot.name.split(".").pop()?.toLowerCase() ?? "png";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("project-screenshots")
        .upload(path, screenshot, { upsert: false });
      if (upErr) {
        setError(upErr.message);
        setLoading(false);
        return;
      }
      const { data: pub } = supabase.storage.from("project-screenshots").getPublicUrl(path);
      screenshot_url = pub.publicUrl;
    }

    const { data: inserted, error: insertErr } = await supabase
      .from("projects")
      .insert({
        submitted_by: user.id,
        name,
        one_liner: one_liner || null,
        tech_stack: tech_stack || null,
        url: url || null,
        github_url: github_url || null,
        why_stopped: why_stopped || null,
        screenshot_url,
        status: "removed",
      })
      .select("id")
      .single();

    if (insertErr) {
      setError(insertErr.message);
      setLoading(false);
      return;
    }

    await supabase.rpc("increment_submission_count", { p_user_id: user.id });

    const projectId = inserted?.id as string;
    const genRes = await fetch("/api/generate-obituary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });

    if (!genRes.ok) {
      const j = await genRes.json().catch(() => ({}));
      setError((j as { error?: string }).error ?? "Obituary generation failed.");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push(`/project/${projectId}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-6">
      <div>
        <label htmlFor="name" className={labelClass}>
          PROJECT NAME *
        </label>
        <input id="name" name="name" required className={inputClass} placeholder="My vaporware SaaS" />
      </div>
      <div>
        <label htmlFor="one_liner" className={labelClass}>
          ONE-LINER
        </label>
        <input id="one_liner" name="one_liner" className={inputClass} placeholder="It was Uber for something." />
      </div>
      <div>
        <label htmlFor="tech_stack" className={labelClass}>
          TECH STACK
        </label>
        <input id="tech_stack" name="tech_stack" className={inputClass} placeholder="Rust, hubris, Docker" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="url" className={labelClass}>
            SITE URL
          </label>
          <input id="url" name="url" type="url" className={inputClass} placeholder="https://" />
        </div>
        <div>
          <label htmlFor="github_url" className={labelClass}>
            GITHUB
          </label>
          <input
            id="github_url"
            name="github_url"
            type="url"
            className={inputClass}
            placeholder="https://github.com/..."
          />
        </div>
      </div>
      <div>
        <label htmlFor="why_stopped" className={labelClass}>
          WHY IT STOPPED
        </label>
        <textarea
          id="why_stopped"
          name="why_stopped"
          rows={4}
          className={`${inputClass} min-h-[100px]`}
          placeholder="Ran out of runway, motivation, or both."
        />
      </div>
      <div>
        <label htmlFor="screenshot" className={labelClass}>
          SCREENSHOT (OPTIONAL)
        </label>
        <input
          id="screenshot"
          name="screenshot"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="mt-2 w-full font-body text-[14px] text-[#808080] file:mr-3 file:rounded file:border file:border-dead-line file:bg-dead-bg file:px-3 file:py-1.5 file:font-display file:text-[10px] file:text-dead-neon"
        />
      </div>

      {error && (
        <p className="rounded border border-dead-red/50 bg-[rgba(255,0,64,0.08)] px-3 py-2 font-body text-[15px] text-dead-red">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="terminal-btn-primary w-full disabled:opacity-50">
        {loading ? "SUMMONING THE OBITUARY WRITER…" : "SUBMIT TO THE VOID"}
      </button>
    </form>
  );
}
