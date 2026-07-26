import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { CopyEmail } from "@/components/copy-email";
import { AnimatedHeadline, Reveal } from "@/components/reveal";
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
    <div className="grid gap-1.5">
      <dt className="label">{label}</dt>
      <dd className="text-sm leading-snug">{value}</dd>
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
      <header className="md:w-11/12 lg:w-10/12">
        <AnimatedHeadline
          text={meta.title}
          className="display text-3xl md:text-5xl lg:text-6xl"
        />
        <Reveal delay={0.26}>
          <p className="measure mt-6 text-lg text-muted">{meta.summary}</p>
        </Reveal>
      </header>

      <Reveal delay={0.32}>
        <figure className="mt-14 overflow-hidden rounded-lg border border-line">
          <Image
            src={meta.cover}
            alt={meta.coverAlt}
            width={1600}
            height={900}
            priority
            unoptimized
            className="aspect-16/9 w-full object-cover"
          />
        </figure>
      </Reveal>

      {/* Facts stay beside the reading column and travel with it, so the
          role and stack are never more than a glance away while reading. */}
      <div className="mt-16 grid gap-y-12 md:grid-cols-12 md:gap-x-10">
        <aside className="md:col-span-3">
          <div className="md:sticky md:top-24">
            <dl className="grid grid-cols-2 gap-6 md:grid-cols-1">
              <Meta label="Role" value={meta.role} />
              <Meta label="Platforms" value={meta.platforms.join(", ")} />
              <Meta label="Stack" value={meta.stack.join(", ")} />
              <Meta label="Duration" value={meta.duration} />
            </dl>

            {/* Stating the boundary of the role is a trust signal, not a
                weakness. Everything else is read against it. */}
            <div className="mt-8 border-l-2 border-accent pl-4">
              <p className="label mb-1.5">Scope</p>
              <p className="font-mono text-xs leading-relaxed text-muted">{meta.scopeNote}</p>
            </div>
          </div>
        </aside>

        <div className="prose-body md:col-span-9">
          <MDXRemote source={doc.body} />
        </div>
      </div>

      <nav className="mt-28 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-10">
        {all.length > 1 && (
          <Link href={`/work/${next.meta.slug}`} className="group grid gap-1.5">
            <span className="label">Next</span>
            <span className="display inline-flex items-center gap-2 text-xl transition-colors group-hover:text-accent md:text-2xl">
              {next.meta.title}
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        )}
        <CopyEmail email={site.email} variant="quiet" />
      </nav>
    </article>
  );
}
