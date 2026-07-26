import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { CopyEmail } from "@/components/copy-email";
import { ExternalLink } from "@/components/external-link";
import { AnimatedHeadline, Reveal } from "@/components/reveal";
import { WorkList } from "@/components/work-list";
import { HeroVisual, PlatformGlyph } from "@/components/platform-art";
import { Section } from "@/components/section";
import { getAllNotes, getAllWork, getSite } from "@/lib/content";

export default function HomePage() {
  const site = getSite();
  const work = getAllWork().map((d) => d.meta);
  const notes = getAllNotes().slice(0, 3).map((d) => d.meta);

  return (
    <>
      {/* Hero. The headline takes the full measure so it lands in two lines
          rather than three, and the panels sit beside the call to action
          instead of opposite an empty column, which is what left a third of
          a screen of dead space in the previous layout. */}
      <section className="shell pt-14 pb-20 md:pt-20 md:pb-16">
        <AnimatedHeadline
          text={site.headline}
          className="display text-4xl sm:text-5xl md:text-6xl"
        />

        <div className="mt-10 grid items-start gap-y-14 md:mt-12 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-6">
            <Reveal delay={0.28}>
              <p className="measure text-lg text-muted">{site.intro}</p>

              <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-4">
                <CopyEmail email={site.email} />
                <span className="inline-flex items-center gap-2 rounded-full border border-line py-1.5 pr-3.5 pl-3 text-sm text-muted">
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-accent"
                    style={{
                      boxShadow:
                        "0 0 0 3px color-mix(in oklab, var(--accent) 20%, transparent)",
                    }}
                  />
                  {site.availability}
                </span>
              </div>

              {/* External destinations use the library's Link. Internal
                  routes stay on next/link so prefetch survives. */}
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                <ExternalLink href={site.github}>GitHub</ExternalLink>
                <ExternalLink href="/cv.pdf">CV</ExternalLink>
              </div>
            </Reveal>
          </div>

          {/* Three panels in real 3D space, making the multi-platform claim
              visible in the same breath as the sentence that states it. */}
          <div className="md:col-span-6">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* Work. Hairline rows, count agnostic: reads well at two entries and
          at eight, which a fixed grid would not. */}
      <Section id="work" label="Selected work">
        <WorkList items={work} />
      </Section>

      {/* Capabilities. Stated in sentences rather than a logo wall, which
          reads as an inflated claim when the code behind it is private. */}
      <Section label="What I ship">
        <div className="grid gap-14 md:gap-20">
          {site.capabilities.map((capability, i) => (
            <Reveal key={capability.platform} delay={i * 0.04}>
              <article>
                <div className="flex items-center gap-5">
                  <PlatformGlyph platform={capability.platform} />
                  <h3 className="display text-3xl md:text-4xl">{capability.platform}</h3>
                </div>
                <p className="measure mt-5 leading-relaxed text-muted">{capability.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Notes. Titles only. The content model carries no dates, so nothing
          here can read as abandoned. */}
      {notes.length > 0 && (
        <Section label="Notes" action={{ href: "/notes", text: "All notes" }}>
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
        </Section>
      )}
    </>
  );
}
