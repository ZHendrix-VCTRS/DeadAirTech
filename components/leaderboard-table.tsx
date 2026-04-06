import Link from "next/link";
import type { LeaderboardRow } from "@/lib/types/database";

type Props = {
  rows: LeaderboardRow[];
};

export function LeaderboardTable({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <p className="terminal-border rounded-md p-6 font-body text-[15px] text-[#808080]">
        No entries yet — projects need at least 3 votes to haunt the leaderboard.
      </p>
    );
  }

  return (
    <div className="terminal-border overflow-x-auto rounded-md">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b border-dead-line font-display text-[10px] uppercase tracking-wider text-[#808080]">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Project</th>
            <th className="px-4 py-3">% Hot</th>
            <th className="px-4 py-3">Votes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-dead-line/50 transition hover:bg-[rgba(57,255,20,0.04)]">
              <td className="px-4 py-3 font-display text-sm text-dead-neon">{row.rank}</td>
              <td className="px-4 py-3">
                <Link
                  href={`/project/${row.id}`}
                  className="font-display text-[18px] text-[#e0e0e0] transition hover:text-dead-neon"
                >
                  <span className="mr-2" aria-hidden>
                    {row.ai_emoji ?? "💀"}
                  </span>
                  {row.name}
                </Link>
                {row.ai_tagline && (
                  <p className="font-body mt-1 text-[14px] text-[#808080]">{row.ai_tagline}</p>
                )}
              </td>
              <td className="px-4 py-3 font-display text-sm text-dead-neon">
                {Number(row.hot_percentage).toFixed(1)}%
              </td>
              <td className="px-4 py-3 font-body text-[15px] text-[#c0c0c0]">{row.vote_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
