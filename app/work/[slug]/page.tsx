import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { CopyEmail } from "@/components/copy-email";
import { getAllWork, getSite, getWork } from "@/lib/content";

export function generateStaticParams() {
  return getAllWork().map((d) => ({ slug: d.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getWork(slug);
  if (!doc) return {};
  return { title: doc.meta.title, description: doc.meta.summary };
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <dt className="label">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getWork(slug);
  if (!doc) notFound();

  const site = getSite();
  const all = getAllWork();
  const index = all.findIndex((d) => d.meta.slug === slug);
  const next = all[(index + 1) % all.length];
  const { meta } = doc;

  return (
    <article className="shell pt-16 md:pt-24">
      <header className="md:grid md:grid-cols-12 md:gap-8">
        <div className="md:col-span-10">
          <h1 className="display text-3xl md:text-5xl lg:text-6xl">{meta.title}</h1>
          <p className="measure mt-6 text-lg text-muted">{meta.summary}</p>
        </div>
      </header>

      <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-line py-8 md:grid-cols-4">
        <Meta label="Role" value={meta.role} />
        <Meta label="Platforms" value={meta.platforms.join(", ")} />
        <Meta label="Stack" value={meta.stack.join(", ")} />
        <Meta label="Duration" value={meta.duration} />
      </dl>

      <figure className="mt-12 overflow-hidden rounded-lg border border-line">
        <Image
          src={meta.cover}
          alt={meta.coverAlt}
          width={1600}
          height={900}
          priority
          unoptimized
          className="aspect-[16/9] w-full object-cover"
        />
      </figure>

      {/* Stating the boundary of the role is a trust signal, not a
          weakness. Everything else on the page is read against it. */}
      <aside className="mt-12 border-l-2 border-accent bg-surface px-5 py-4">
        <p className="label mb-1">Scope</p>
        <p className="measure font-mono text-sm leading-relaxed">{meta.scopeNote}</p>
      </aside>

      <div className="prose-body mt-16">
        <MDXRemote source={doc.body} />
      </div>

      <nav className="mt-24 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-10">
        {all.length > 1 && (
          <Link href={`/work/${next.meta.slug}`} className="group grid gap-1">
            <span className="label">Next</span>
            <span className="display inline-flex items-center gap-2 text-xl transition-colors duration-[--micro] group-hover:text-accent md:text-2xl">
              {next.meta.title}
              <ArrowRightIcon className="size-4 transition-transform duration-[--micro] group-hover:translate-x-1" />
            </span>
          </Link>
        )}
        <CopyEmail email={site.email} variant="quiet" />
      </nav>
    </article>
  );
}
