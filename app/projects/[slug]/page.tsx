import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "#site/content";
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
    <article className="px-4 py-12 max-w-3xl mx-auto">
      <header className="mb-8">
        <p className="text-sm uppercase tracking-wide text-[var(--color-fg-muted)] mb-2">
          {project.category} · {project.year}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
      </header>
      <ProjectMeta project={project} />
      <div
        className="prose prose-neutral dark:prose-invert max-w-none mt-8"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Velite-compiled MDX is trusted (build-time, author-controlled).
        dangerouslySetInnerHTML={{ __html: project.body_mdx }}
      />
    </article>
  );
}
