import Link from "next/link";
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
          <Link
            href={site.github}
            className="text-sm text-muted transition-colors duration-[--micro] hover:text-accent"
          >
            GitHub
          </Link>
          {site.linkedin && (
            <Link
              href={site.linkedin}
              className="text-sm text-muted transition-colors duration-[--micro] hover:text-accent"
            >
              LinkedIn
            </Link>
          )}
          <Link
            href="/cv.pdf"
            className="text-sm text-muted transition-colors duration-[--micro] hover:text-accent"
          >
            CV
          </Link>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <p className="label">
            {site.name}
            <span className="mx-2 text-line">/</span>
            {site.timezone}
          </p>
          <Link
            href={`${site.github}/portfolio`}
            className="label transition-colors duration-[--micro] hover:text-accent"
          >
            Source
          </Link>
        </div>
      </div>
    </footer>
  );
}
