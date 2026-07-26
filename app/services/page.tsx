import type { Metadata } from "next";
import { CopyEmail } from "@/components/copy-email";
import { Reveal } from "@/components/reveal";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description: "Frontend work for web, mobile, and desktop, on a contract basis.",
};

export default function ServicesPage() {
  const site = getSite();

  return (
    <section className="shell pt-16 pb-8 md:pt-24">
      <h1 className="display text-4xl md:text-6xl">Services</h1>
      <p className="measure mt-6 text-lg text-muted">{site.services.intro}</p>

      <div className="mt-20 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3">
        {site.services.offers.map((offer) => (
          <article key={offer.title} className="bg-bg p-6 md:p-8">
            <h2 className="display text-xl md:text-2xl">{offer.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{offer.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-24 grid gap-12 md:grid-cols-2 md:gap-16">
        <Reveal>
          <h2 className="display text-2xl md:text-3xl">How I work</h2>
          <p className="mt-4 leading-relaxed text-muted">{site.services.howIWork}</p>
        </Reveal>
        {/* Naming the boundary filters out the wrong enquiries before
            they cost anyone time. */}
        <Reveal delay={0.05}>
          <h2 className="display text-2xl md:text-3xl">What I do not take on</h2>
          <p className="mt-4 leading-relaxed text-muted">{site.services.notDoing}</p>
        </Reveal>
      </div>

      <div className="mt-24 border-t border-line pt-10">
        <CopyEmail email={site.email} />
      </div>
    </section>
  );
}
