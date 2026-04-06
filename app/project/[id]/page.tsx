import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ObituaryContent } from "@/components/obituary-content";
import { VoteButtons } from "@/components/vote-buttons";
import { createClient } from "@/lib/supabase/server";
import { getServerFingerprint } from "@/lib/server/fingerprint";
import type { Project } from "@/lib/types/database";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("name, ai_tagline").eq("id", id).maybeSingle();
  if (!data) return { title: "Project" };
  const p = data as Pick<Project, "name" | "ai_tagline">;
  return {
    title: p.name,
    description: p.ai_tagline ?? undefined,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const fingerprint = await getServerFingerprint();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();

  if (error || !data) notFound();

  const project = data as Project;

  const isOwner = user?.id === project.submitted_by;
  const canView =
    project.status === "published" || (isOwner && (project.status === "flagged" || project.status === "removed"));

  if (!canView) notFound();

  const showPending = project.status === "removed" && !project.ai_obituary;

  return (
    <article className="space-y-8">
      <nav>
        <Link href="/" className="font-display text-[10px] text-[#666] transition hover:text-dead-neon">
          ← BACK TO GRAVEYARD
        </Link>
      </nav>

      <header className="space-y-4 border-b border-dead-line pb-8">
        <div className="flex flex-wrap items-start gap-4">
          <span className="text-5xl drop-shadow-[0_0_20px_rgba(57,255,20,0.25)]" aria-hidden>
            {project.ai_emoji ?? "💀"}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[18px] leading-snug text-[#e0e0e0]">{project.name}</h1>
            {project.ai_tagline && (
              <p className="font-body mt-2 text-[14px] italic text-[#c0c0c0]">{project.ai_tagline}</p>
            )}
            {project.ai_cause_of_death && (
              <p className="font-body mt-4 border-l-2 border-dead-red/70 pl-4 text-[13px] italic text-[#a0a0a0]">
                CAUSE OF DEATH: {project.ai_cause_of_death}
              </p>
            )}
          </div>
        </div>

        {project.status === "flagged" && (
          <p className="rounded border border-dead-red/40 bg-[rgba(255,0,64,0.08)] px-4 py-3 font-body text-[15px] text-dead-red">
            This obituary was held for review. {project.ai_flag_reason ? `(${project.ai_flag_reason})` : ""}
          </p>
        )}

        {showPending && (
          <p className="animate-pulse font-display text-[11px] text-dead-neon">
            THE OBITUARY WRITER IS STILL SHARPENING THEIR PEN…
          </p>
        )}

        <div className="flex flex-wrap gap-4 text-[15px]">
          {project.tech_stack && (
            <span className="rounded border border-dead-line bg-[rgba(10,10,10,0.85)] px-2 py-1 font-body text-[13px] text-[#c0c0c0]">
              {project.tech_stack}
            </span>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-[10px] text-dead-neon underline-offset-4 hover:underline"
            >
              WEBSITE
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-[10px] text-dead-neon underline-offset-4 hover:underline"
            >
              GITHUB
            </a>
          )}
        </div>

        {project.screenshot_url && (
          <div className="relative mt-4 aspect-video max-w-2xl overflow-hidden rounded border border-dead-line bg-dead-bg">
            <Image
              src={project.screenshot_url}
              alt={`Screenshot of ${project.name}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        )}

        {project.status === "published" && project.ai_obituary && (
          <VoteButtons
            projectId={project.id}
            fingerprint={fingerprint}
            userId={user?.id ?? null}
            hotPct={Number(project.hot_percentage)}
            voteCount={project.vote_count}
          />
        )}
      </header>

      {project.ai_obituary ? (
        <ObituaryContent obituary={project.ai_obituary} />
      ) : (
        !showPending && <p className="font-body text-[#666]">No obituary yet.</p>
      )}
    </article>
  );
}
