import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Topbar } from "@/components/topbar";
import { Footer } from "@/components/footer";
import { themeScript } from "@/components/theme";
import { getSite } from "@/lib/content";
import "./globals.css";

export function generateMetadata(): Metadata {
  const site = getSite();
  return {
    title: {
      default: `${site.name}, ${site.role}`,
      template: `%s / ${site.name}`,
    },
    description: site.intro,
    openGraph: {
      title: `${site.name}, ${site.role}`,
      description: site.intro,
      type: "website",
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSite();

  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:text-bg"
        >
          Skip to content
        </a>
        <div id="top-sentinel" aria-hidden className="absolute top-0 h-2 w-full" />
        <Topbar name={site.name} />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
