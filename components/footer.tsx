import { ExternalLink } from "./external-link";
import { CopyEmail } from "./copy-email";
import { getSite } from "@/lib/content";

export function Footer() {
  const site = getSite();

  return (
    <footer className="mt-32 border-t border-line py-16 md:mt-48 md:py-20">
      <div className="shell">
        <p className="display measure text-3xl md:text-5xl">
          Available for remote frontend work.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <CopyEmail email={site.email} />
          <ExternalLink href={site.github}>GitHub</ExternalLink>
          {site.linkedin && <ExternalLink href={site.linkedin}>LinkedIn</ExternalLink>}
          <ExternalLink href="/cv.pdf">CV</ExternalLink>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <p className="label">
            {site.name}
            <span className="mx-2 text-line">/</span>
            {site.timezone}
          </p>
          <ExternalLink className="link-quiet label" href={`${site.github}/portfolio`}>
            Source
          </ExternalLink>
        </div>
      </div>
    </footer>
  );
}
