import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Reveal } from "@/components/reveal";
import { getAllNotes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Notes",
  description: "Short notes on building interfaces for web, mobile, and desktop.",
};

export default function NotesPage() {
  const notes = getAllNotes().map((d) => d.meta);

  return (
    <section className="shell pt-16 md:pt-24">
      <h1 className="display text-4xl md:text-6xl">Notes</h1>
      <p className="measure mt-6 text-lg text-muted">
        Short pieces on building interfaces. No archive, no schedule.
      </p>

      {notes.length === 0 ? (
        <p className="mt-16 border-t border-line py-16 text-muted">Nothing published yet.</p>
      ) : (
        <ul className="mt-16">
          {notes.map((note, i) => (
            <Reveal key={note.slug} delay={i * 0.04}>
              <li>
                <Link
                  href={`/notes/${note.slug}`}
                  className="group flex items-center justify-between gap-6 border-t border-line py-6 transition-colors duration-[--micro] hover:border-accent"
                >
                  <span className="text-lg transition-colors duration-[--micro] group-hover:text-accent md:text-xl">
                    {note.title}
                  </span>
                  <ArrowRightIcon className="size-4 shrink-0 text-muted transition-all duration-[--micro] group-hover:translate-x-1 group-hover:text-accent" />
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      )}
    </section>
  );
}
