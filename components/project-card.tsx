import Link from "next/link";
import type { Project } from "@/lib/types/database";
import { VoteButtons } from "@/components/vote-buttons";

type Props = {
  project: Project;
  fingerprint: string;
  userId: string | null;
};

export function ProjectCard({ project, fingerprint, userId }: Props) {
  const emoji = project.ai_emoji ?? "💀";
  const tagline = project.ai_tagline ?? project.one_liner ?? "No epitaph yet.";

  return (
    <article className="terminal-border group relative overflow-hidden rounded-md transition hover:border-[rgba(57,255,20,0.25)] hover:shadow-[0_0_16px_rgba(57,255,20,0.12)]">
      <div className="absolute right-3 top-3 text-3xl opacity-90 drop-shadow-[0_0_12px_rgba(57,255,20,0.25)]" aria-hidden>
        {emoji}
      </div>
      <div className="p-5 pr-14">
        <h2 className="font-display text-[18px] leading-snug text-[#e0e0e0]">
          <Link href={`/project/${project.id}`} className="transition hover:text-dead-neon">
            {project.name}
          </Link>
        </h2>
        <p className="font-body mt-2 text-[14px] italic text-[#c0c0c0]">{tagline}</p>
        {project.ai_cause_of_death && (
          <p className="font-body mt-3 border-l-2 border-dead-red/70 pl-3 text-[13px] italic text-[#a0a0a0]">
            CAUSE OF DEATH: {project.ai_cause_of_death}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <VoteButtons
            projectId={project.id}
            fingerprint={fingerprint}
            userId={userId}
            hotPct={Number(project.hot_percentage)}
            voteCount={project.vote_count}
          />
          <Link
            href={`/project/${project.id}`}
            className="font-display text-[10px] text-[#666] underline-offset-4 transition hover:text-dead-neon hover:underline"
          >
            READ OBIT →
          </Link>
        </div>
      </div>
    </article>
  );
}
