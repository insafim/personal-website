import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "#site/content";
import { PageIntro } from "@/components/PageIntro";
import { ProjectMeta } from "@/components/ProjectMeta";
import { buildMetadata } from "@/lib/metadata";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return buildMetadata({
    path: `/projects/${slug}`,
    title: project.title,
    description: project.problem.slice(0, 200),
    type: "article",
  });
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="px-4 max-w-6xl mx-auto pt-12 pb-20">
      <PageIntro
        eyebrow={project.affiliation}
        title={project.title}
        description={project.problem}
        variant="accent"
        utility={
          <div className="flex flex-wrap gap-2 md:justify-end">
            <span className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-1 text-sm text-[var(--color-fg-muted)]">
              {project.year}
            </span>
          </div>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="min-w-0">
          <section className="surface-elevated mb-8 px-6 py-6 md:px-8 md:py-8">
            <p className="eyebrow mb-3">Approach</p>
            <p className="max-w-3xl text-base leading-relaxed text-[var(--color-fg)] md:text-lg">
              {project.approach}
            </p>
          </section>

          <article
            className="prose prose-neutral dark:prose-invert max-w-none
                       prose-headings:display prose-headings:tracking-tight
                       prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-10 prose-h2:mb-4
                       prose-p:leading-relaxed prose-p:text-[var(--color-fg)]
                       prose-strong:text-[var(--color-fg)] prose-strong:font-semibold
                       prose-a:text-[var(--color-accent)] prose-a:no-underline hover:prose-a:underline"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Velite-compiled MDX is trusted (build-time, author-controlled).
            dangerouslySetInnerHTML={{ __html: project.body_mdx }}
          />
        </div>

        <aside className="lg:sticky lg:top-24">
          <ProjectMeta project={project} />
        </aside>
      </div>
    </div>
  );
}
