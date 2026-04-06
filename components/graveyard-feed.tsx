import { createClient } from "@/lib/supabase/server";
import { getPublicSupabaseEnv } from "@/lib/supabase/env";
import { getServerFingerprint } from "@/lib/server/fingerprint";
import type { Project } from "@/lib/types/database";
import { ProjectCard } from "@/components/project-card";

function formatRpcError(err: { message: string; cause?: unknown }): string {
  const base = err.message || "Unknown error";
  const cause =
    err.cause instanceof Error
      ? err.cause.message
      : err.cause != null
        ? String(err.cause)
        : "";
  const combined = cause ? `${base} (${cause})` : base;

  if (/fetch failed/i.test(combined)) {
    return `${combined}

Likely causes:
· .env.local is missing, misnamed, or not in the project root (same folder as package.json)
· Restart dev server after editing env (stop and run npm run dev again)
· Typo in NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY
· VPN/firewall blocking HTTPS, or Supabase project paused in the dashboard
· Try: npm run dev:ipv4 (some networks break IPv6 to Supabase)`;
  }

  return combined;
}

export async function GraveyardFeed() {
  const env = getPublicSupabaseEnv();
  if (!env.isConfigured) {
    return (
      <div className="terminal-border rounded-md p-4 font-body text-sm text-dead-red whitespace-pre-wrap">
        <p className="font-display text-xs text-[#e0e0e0]">SUPABASE ENV NOT LOADED</p>
        <ul className="mt-2 list-inside list-disc text-[#a0a0a0]">
          {env.issues.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-[#666]">
          Create <code className="text-dead-neon">.env.local</code> next to <code className="text-dead-neon">package.json</code>,
          then restart <code className="text-dead-neon">npm run dev</code>.
        </p>
      </div>
    );
  }

  const fingerprint = await getServerFingerprint();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc("get_random_projects", {
    p_fingerprint: fingerprint,
    p_limit: 12,
  });

  if (error) {
    return (
      <div className="terminal-border rounded-md p-4 font-body text-sm text-dead-red whitespace-pre-wrap">
        COULD NOT LOAD THE GRAVEYARD: {formatRpcError(error)}
      </div>
    );
  }

  const projects = (data ?? []) as Project[];

  if (projects.length === 0) {
    return (
      <p className="font-body text-sm text-[#808080]">The graveyard is quiet. Be the first to bury something.</p>
    );
  }

  return (
    <div className="grid gap-6">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} fingerprint={fingerprint} userId={user?.id ?? null} />
      ))}
    </div>
  );
}
