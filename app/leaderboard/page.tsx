import { GraveyardGrid } from "@/components/graveyard-grid";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { createClient } from "@/lib/supabase/server";
import type { LeaderboardRow } from "@/lib/types/database";

export const metadata = { title: "Leaderboard" };

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const [
    { data: leaderboardData, error: leaderboardError },
    { data: gridData, error: gridError },
  ] = await Promise.all([
    supabase.from("leaderboard").select("*"),
    supabase
      .from("projects")
      .select("id, name, hot_percentage, vote_count, ai_cause_of_death")
      .eq("status", "published")
      .order("name", { ascending: true }),
  ]);

  if (leaderboardError) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-base text-dead-neon">LEADERBOARD</h1>
        <p className="font-body text-[15px] text-dead-red">
          Could not load leaderboard: {leaderboardError.message}
        </p>
      </div>
    );
  }

  const rows = (leaderboardData ?? []) as LeaderboardRow[];
  const gridProjects = gridError ? [] : (gridData ?? []);

  return (
    <div className="space-y-12">
      <header className="space-y-2 text-center">
        <p className="font-display text-[10px] tracking-[0.25em] text-white/40">RANKED BY HOTNESS</p>
        <h1 className="font-display text-base text-dead-neon sm:text-lg">LEADERBOARD</h1>
        <p className="font-body mx-auto max-w-xl text-[15px] text-white">
          Only projects with at least three votes qualify. Democracy is messy. The graveyard is honest.
        </p>
      </header>

      <section className="space-y-4">
        <div className="space-y-1">
          <p className="font-display text-[10px] tracking-[0.25em] text-white/40">THE GRAVEYARD MAP</p>
          <h2 className="font-display text-[14px] text-dead-neon">
            GREEN MEANS BRING IT BACK. RED MEANS LET IT ROT.
          </h2>
          <p className="font-body text-[14px] text-white/50">Hover a square. Pay your respects.</p>
        </div>

        <div className="terminal-border rounded-md border-dead-neon/30 bg-[rgba(57,255,20,0.06)] p-4">
          <p className="mb-2 animate-pulse font-display text-[10px] tracking-widest text-dead-red">
            ⚠ VOTES PENDING
          </p>
          <p className="font-body text-[15px] leading-relaxed text-white">
            This map is waiting on the internet to have opinions. Shouldn&apos;t take long. You people have never
            built anything in your lives but you&apos;ve got extremely strong feelings about what should have
            survived. We respect that. Mostly. Vote below. Then come back and watch the graveyard change colors.
          </p>
        </div>

        {gridError && (
          <p className="font-body text-[13px] text-dead-red">
            Could not load the graveyard map: {gridError.message}
          </p>
        )}
        <GraveyardGrid projects={gridProjects} />
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <p className="font-display text-[10px] tracking-[0.25em] text-white/40">RANKED</p>
          <h2 className="font-display text-[14px] text-dead-neon">THE OFFICIAL STANDINGS</h2>
        </div>
        <LeaderboardTable rows={rows} />
      </section>
    </div>
  );
}
