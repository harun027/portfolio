import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "./reveal";

/**
 * The page's structural rhythm: a section name parked in the left column,
 * content in the right. It behaves like an index rather than a stack of
 * decorative labels above every heading, and the label stays with the
 * reader while the section scrolls past.
 */
export function Section({
  label,
  children,
  id,
  action,
}: {
  label: string;
  children: ReactNode;
  id?: string;
  action?: { href: string; text: string };
}) {
  return (
    <section id={id} className="shell scroll-mt-24 pt-16 md:pt-28">
      <div className="grid gap-y-8 md:grid-cols-12 md:gap-x-10">
        <div className="md:col-span-3">
          <Reveal>
            <div className="flex items-baseline justify-between gap-4 md:sticky md:top-24 md:block">
              <p className="text-sm text-muted">{label}</p>
              {action && (
                <Link
                  href={action.href}
                  className="text-sm text-muted transition-colors duration-[--micro] hover:text-accent md:mt-3 md:inline-block"
                >
                  {action.text}
                </Link>
              )}
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-9">{children}</div>
      </div>
    </section>
  );
}
