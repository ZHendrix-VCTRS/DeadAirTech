import Link from "next/link";

export type GraveyardGridProject = {
  id: string;
  name: string;
  hot_percentage: number;
  vote_count: number;
  ai_cause_of_death: string | null;
};

export function GraveyardGrid({ projects }: { projects: GraveyardGridProject[] }) {
  if (projects.length === 0) {
    return (
      <p className="font-body text-[14px] text-white/50">
        No published plots yet. The soil is waiting.
      </p>
    );
  }

  return (
    <div className="terminal-border max-h-[min(50vh,420px)] overflow-auto rounded-md p-2 sm:p-3">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(14px, 1fr))",
        }}
      >
        {projects.map((p) => {
          const hot = Number(p.hot_percentage) >= 50;
          const pct = Number(p.hot_percentage);
          const title = [
            p.name,
            `${pct.toFixed(0)}% hot · ${p.vote_count} votes`,
            p.ai_cause_of_death ?? undefined,
          ]
            .filter(Boolean)
            .join(" — ");

          return (
            <Link
              key={p.id}
              href={`/project/${p.id}`}
              title={title}
              className={`aspect-square min-h-[12px] min-w-[12px] rounded-sm border transition hover:z-[1] hover:ring-2 hover:ring-dead-neon/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dead-neon ${
                hot
                  ? "border-dead-neon/35 bg-dead-neon/22"
                  : "border-dead-red/35 bg-dead-red/18"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
