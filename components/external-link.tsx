"use client";

import { Link } from "@heroui/react";
import type { ReactNode } from "react";

/**
 * HeroUI is built on React Aria, so its components are client only. This
 * is the boundary: server components render this, not the library
 * directly.
 *
 * Only external destinations belong here. Internal routes use next/link
 * so client navigation and prefetch survive.
 */
export function ExternalLink({
  href,
  children,
  className = "link-quiet",
  showIcon = true,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  showIcon?: boolean;
}) {
  const external = href.startsWith("http");

  return (
    <Link
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
      {external && showIcon && <Link.Icon />}
    </Link>
  );
}
