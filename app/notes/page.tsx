import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { AnimatedHeadline, Reveal } from "@/components/reveal";
import { getAllNotes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Notes",
  description: "Short notes on building interfaces for web, mobile, and desktop.",
};

export default function NotesPage() {
  const notes = getAllNotes().map((d) => d.meta);

  return (
    <section className="shell pt-16 md:pt-24">
      <AnimatedHeadline text="Notes" className="display text-4xl md:text-6xl" />
      <Reveal delay={0.2}>
        <p className="measure mt-6 text-lg text-muted">
          Short pieces on building interfaces. No archive, no schedule.
        </p>
      </Reveal>

      {notes.length === 0 ? (
        <p className="mt-16 border-t border-line py-16 text-muted">Nothing published yet.</p>
      ) : (
        <ul className="mt-20">
          {notes.map((note, i) => (
            <Reveal key={note.slug} delay={i * 0.04}>
              <li>
                <Link
                  href={`/notes/${note.slug}`}
                  className="group relative flex items-center justify-between gap-6 border-t border-line py-7"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
                  />
                  <span className="text-lg transition-transform group-hover:translate-x-1 md:text-xl">
                    {note.title}
                  </span>
                  <ArrowRightIcon className="size-4 shrink-0 text-muted transition-[transform,color] group-hover:translate-x-1 group-hover:text-accent" />
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      )}
    </section>
  );
}
