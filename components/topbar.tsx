"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme";

const links = [
  { href: "/#work", label: "Work", match: "/work" },
  { href: "/notes", label: "Notes", match: "/notes" },
  { href: "/services", label: "Services", match: "/services" },
];

export function Topbar({ name }: { name: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // IntersectionObserver on a sentinel rather than a scroll listener,
    // which would run work on every frame.
    const sentinel = document.getElementById("top-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: "0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-bg/85 backdrop-blur-md transition-colors duration-300 ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <nav className="shell flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-mono text-xs tracking-[0.08em] uppercase transition-colors duration-[--micro] hover:text-accent"
        >
          {name}
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname.startsWith(link.match);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm transition-colors duration-[--micro] hover:text-fg ${
                  active ? "text-accent" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
