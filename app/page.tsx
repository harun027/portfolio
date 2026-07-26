import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { CopyEmail } from "@/components/copy-email";
import { Reveal } from "@/components/reveal";
import { WorkList } from "@/components/work-list";
import { getAllNotes, getAllWork, getSite } from "@/lib/content";

export default function HomePage() {
  const site = getSite();
  const work = getAllWork().map((d) => d.meta);
  const notes = getAllNotes().slice(0, 3).map((d) => d.meta);

  return (
    <>
      {/* Hero. Left aligned and offset rather than centred, so the eye
          lands on the claim before the availability state. */}
      <section className="shell grid gap-10 pt-16 pb-24 md:grid-cols-12 md:pt-24 md:pb-36">
        <div className="md:col-span-11 lg:col-span-10">
          <h1 className="display text-4xl md:text-6xl lg:text-7xl">{site.headline}</h1>
          <p className="measure mt-8 text-lg text-muted">{site.intro}</p>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <CopyEmail email={site.email} />
            <p className="flex items-center gap-2 text-sm text-muted">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-accent"
                style={{ boxShadow: "0 0 0 3px color-mix(in oklab, var(--accent) 22%, transparent)" }}
              />
              {site.availability}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href={site.github}
              className="text-sm text-muted transition-colors duration-[--micro] hover:text-accent"
            >
              GitHub
            </Link>
            <Link
              href="/cv.pdf"
              className="text-sm text-muted transition-colors duration-[--micro] hover:text-accent"
            >
              CV
            </Link>
          </div>
        </div>
      </section>

      {/* Work. Hairline rows, count agnostic: reads well at two entries
          and at eight, which a fixed grid would not. */}
      <section id="work" className="shell scroll-mt-24">
        <Reveal>
          <h2 className="display mb-10 text-xl text-muted md:mb-14">Selected work</h2>
        </Reveal>
        <Reveal delay={0.05}>
          <WorkList items={work} />
        </Reveal>
      </section>

      {/* Capabilities. Stated in sentences rather than a logo wall, which
          reads as an inflated claim when the code behind it is private. */}
      <section className="shell pt-32 md:pt-48">
        <Reveal>
          <h2 className="display mb-12 text-xl text-muted md:mb-20">What I ship</h2>
        </Reveal>
        <div className="grid gap-16 md:gap-24">
          {site.capabilities.map((capability, i) => (
            <Reveal key={capability.platform} delay={i * 0.05}>
              <article className="grid gap-4 md:grid-cols-12 md:gap-8">
                <h3 className="display text-3xl md:col-span-5 md:text-5xl">{capability.platform}</h3>
                <p className="text-muted md:col-span-6 md:col-start-7 md:pt-3">{capability.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Notes. Titles only. The content model carries no dates, so nothing
          here can read as abandoned. */}
      {notes.length > 0 && (
        <section className="shell pt-32 md:pt-48">
          <Reveal>
            <div className="mb-10 flex items-baseline justify-between gap-4">
              <h2 className="display text-xl text-muted">Notes</h2>
              <Link
                href="/notes"
                className="text-sm text-muted transition-colors duration-[--micro] hover:text-accent"
              >
                All notes
              </Link>
            </div>
          </Reveal>
          <ul className="grid gap-5">
            {notes.map((note, i) => (
              <Reveal key={note.slug} delay={i * 0.04}>
                <li>
                  <Link
                    href={`/notes/${note.slug}`}
                    className="group inline-flex items-center gap-3 text-lg transition-colors duration-[--micro] hover:text-accent md:text-xl"
                  >
                    {note.title}
                    <ArrowRightIcon className="size-4 -translate-x-1 text-muted opacity-0 transition-all duration-[--micro] group-hover:translate-x-0 group-hover:text-accent group-hover:opacity-100" />
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
