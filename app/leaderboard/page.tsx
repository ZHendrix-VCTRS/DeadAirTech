import { LeaderboardTable } from "@/components/leaderboard-table";
import { createClient } from "@/lib/supabase/server";
import type { LeaderboardRow } from "@/lib/types/database";

export const metadata = {
  title: "Leaderboard",
};

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("leaderboard").select("*");

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-base text-dead-neon">LEADERBOARD</h1>
        <p className="font-body text-[15px] text-dead-red">Could not load leaderboard: {error.message}</p>
      </div>
    );
  }

  const rows = (data ?? []) as LeaderboardRow[];

  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center">
        <p className="font-display text-[10px] tracking-[0.25em] text-[#808080]">RANKED BY HOTNESS</p>
        <h1 className="font-display text-base text-dead-neon sm:text-lg">LEADERBOARD</h1>
        <p className="font-body mx-auto max-w-xl text-[15px] text-[#d4d4d4]">
          Only projects with at least three votes qualify. Democracy is messy; the graveyard is honest.
        </p>
      </header>
      <LeaderboardTable rows={rows} />
    </div>
  );
}
