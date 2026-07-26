import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { getAllNotes, getNote } from "@/lib/content";

export function generateStaticParams() {
  return getAllNotes().map((d) => ({ slug: d.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getNote(slug);
  return doc ? { title: doc.meta.title } : {};
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getNote(slug);
  if (!doc) notFound();

  return (
    <article className="shell pt-16 md:pt-24">
      <Link
        href="/notes"
        className="label inline-flex items-center gap-2 transition-colors duration-[--micro] hover:text-accent"
      >
        <ArrowLeftIcon className="size-3.5" />
        Notes
      </Link>

      <h1 className="display measure mt-8 text-3xl md:text-5xl">{doc.meta.title}</h1>

      <div className="prose-body mt-12">
        <MDXRemote source={doc.body} />
      </div>
    </article>
  );
}
