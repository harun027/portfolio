import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/* ---------------------------------------------------------------
   Content loading and validation.

   The build is the gate. A portfolio whose copy is not written yet
   must not be deployable, so unwritten copy fails `next build`
   rather than shipping quietly. Set CONTENT_DRAFT=1 to preview an
   unfinished site locally.
--------------------------------------------------------------- */

const DRAFT = process.env.CONTENT_DRAFT === "1";
const CONTENT_DIR = path.join(process.cwd(), "content");

const UNWRITTEN = /\b(lorem ipsum|lorem|todo|tbd|fixme|placeholder|isi di sini)\b/i;

export type WorkMeta = {
  title: string;
  slug: string;
  order: number;
  role: string;
  platforms: string[];
  stack: string[];
  duration: string;
  summary: string;
  scopeNote: string;
  cover: string;
  coverAlt: string;
  published: boolean;
};

export type NoteMeta = {
  title: string;
  slug: string;
  order: number;
  published: boolean;
};

export type Doc<T> = { meta: T; body: string };

export type Site = {
  name: string;
  role: string;
  headline: string;
  intro: string;
  availability: string;
  email: string;
  github: string;
  linkedin: string;
  timezone: string;
  capabilities: { platform: string; body: string }[];
  services: {
    intro: string;
    offers: { title: string; body: string }[];
    howIWork: string;
    notDoing: string;
  };
};

class ContentError extends Error {
  constructor(file: string, problems: string[]) {
    super(
      `\n\nContent is not ready: ${file}\n` +
        problems.map((p) => `  - ${p}`).join("\n") +
        `\n\nFill this in before building. To preview an unfinished site locally, run:\n` +
        `  pnpm build:draft\n`,
    );
    this.name = "ContentError";
  }
}

function report(file: string, problems: string[]) {
  if (problems.length === 0) return;
  if (DRAFT) {
    console.warn(`[content] ${file} is unfinished:\n  ${problems.join("\n  ")}`);
    return;
  }
  throw new ContentError(file, problems);
}

function requireText(
  value: unknown,
  field: string,
  file: string,
  problems: string[],
): string {
  if (typeof value !== "string" || value.trim() === "") {
    problems.push(`"${field}" is missing`);
    return "";
  }
  if (UNWRITTEN.test(value)) {
    problems.push(`"${field}" still holds unwritten copy: ${JSON.stringify(value.slice(0, 60))}`);
  }
  return value;
}

function requireList(
  value: unknown,
  field: string,
  file: string,
  problems: string[],
): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    problems.push(`"${field}" is missing or empty`);
    return [];
  }
  return value.map((v, i) => requireText(v, `${field}[${i}]`, file, problems));
}

function readDir(kind: "work" | "notes"): { file: string; raw: string }[] {
  const dir = path.join(CONTENT_DIR, kind);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => ({ file: f, raw: fs.readFileSync(path.join(dir, f), "utf8") }));
}

/* -------------------------------- work -------------------------------- */

export function getAllWork(): Doc<WorkMeta>[] {
  const docs = readDir("work").map(({ file, raw }) => {
    const { data, content } = matter(raw);
    const problems: string[] = [];
    const expectedSlug = file.replace(/\.mdx$/, "");

    const meta: WorkMeta = {
      title: requireText(data.title, "title", file, problems),
      slug: requireText(data.slug, "slug", file, problems),
      order: typeof data.order === "number" ? data.order : (problems.push('"order" must be a number'), 0),
      role: requireText(data.role, "role", file, problems),
      platforms: requireList(data.platforms, "platforms", file, problems),
      stack: requireList(data.stack, "stack", file, problems),
      duration: requireText(data.duration, "duration", file, problems),
      summary: requireText(data.summary, "summary", file, problems),
      scopeNote: requireText(data.scopeNote, "scopeNote", file, problems),
      cover: requireText(data.cover, "cover", file, problems),
      coverAlt: requireText(data.coverAlt, "coverAlt", file, problems),
      published: data.published === true,
    };

    if (meta.slug && meta.slug !== expectedSlug) {
      problems.push(`"slug" (${meta.slug}) does not match the filename (${expectedSlug})`);
    }
    if (content.trim().length < 200) {
      problems.push("the case study body is empty or too short to be a case study");
    }
    if (UNWRITTEN.test(content)) {
      problems.push("the case study body still holds unwritten copy");
    }

    report(`content/work/${file}`, problems);
    return { meta, body: content };
  });

  const slugs = new Set<string>();
  for (const d of docs) {
    if (slugs.has(d.meta.slug)) report("content/work", [`duplicate slug: ${d.meta.slug}`]);
    slugs.add(d.meta.slug);
  }

  return docs.filter((d) => d.meta.published || DRAFT).sort((a, b) => a.meta.order - b.meta.order);
}

export function getWork(slug: string): Doc<WorkMeta> | undefined {
  return getAllWork().find((d) => d.meta.slug === slug);
}

/* -------------------------------- notes -------------------------------- */

export function getAllNotes(): Doc<NoteMeta>[] {
  const docs = readDir("notes").map(({ file, raw }) => {
    const { data, content } = matter(raw);
    const problems: string[] = [];
    const expectedSlug = file.replace(/\.mdx$/, "");

    const meta: NoteMeta = {
      title: requireText(data.title, "title", file, problems),
      slug: requireText(data.slug, "slug", file, problems),
      order: typeof data.order === "number" ? data.order : (problems.push('"order" must be a number'), 0),
      published: data.published === true,
    };

    if (meta.slug && meta.slug !== expectedSlug) {
      problems.push(`"slug" (${meta.slug}) does not match the filename (${expectedSlug})`);
    }
    if (content.trim().length < 80) problems.push("the note body is empty");
    if (UNWRITTEN.test(content)) problems.push("the note body still holds unwritten copy");
    if ("date" in data) {
      problems.push('"date" is not part of this content model. Notes carry no dates by design.');
    }

    report(`content/notes/${file}`, problems);
    return { meta, body: content };
  });

  return docs.filter((d) => d.meta.published || DRAFT).sort((a, b) => a.meta.order - b.meta.order);
}

export function getNote(slug: string): Doc<NoteMeta> | undefined {
  return getAllNotes().find((d) => d.meta.slug === slug);
}

/* -------------------------------- site -------------------------------- */

let cachedSite: Site | undefined;

export function getSite(): Site {
  if (cachedSite) return cachedSite;

  const file = "content/site.json";
  const full = path.join(CONTENT_DIR, "site.json");
  if (!fs.existsSync(full)) throw new ContentError(file, ["the file does not exist"]);

  const data = JSON.parse(fs.readFileSync(full, "utf8"));
  const problems: string[] = [];

  const site: Site = {
    name: requireText(data.name, "name", file, problems),
    role: requireText(data.role, "role", file, problems),
    headline: requireText(data.headline, "headline", file, problems),
    intro: requireText(data.intro, "intro", file, problems),
    availability: requireText(data.availability, "availability", file, problems),
    email: requireText(data.email, "email", file, problems),
    github: requireText(data.github, "github", file, problems),
    linkedin: typeof data.linkedin === "string" ? data.linkedin : "",
    timezone: requireText(data.timezone, "timezone", file, problems),
    capabilities: Array.isArray(data.capabilities)
      ? data.capabilities.map((c: unknown, i: number) => {
          const item = (c ?? {}) as Record<string, unknown>;
          return {
            platform: requireText(item.platform, `capabilities[${i}].platform`, file, problems),
            body: requireText(item.body, `capabilities[${i}].body`, file, problems),
          };
        })
      : (problems.push('"capabilities" is missing'), []),
    services: {
      intro: requireText(data.services?.intro, "services.intro", file, problems),
      offers: Array.isArray(data.services?.offers)
        ? data.services.offers.map((o: unknown, i: number) => {
            const item = (o ?? {}) as Record<string, unknown>;
            return {
              title: requireText(item.title, `services.offers[${i}].title`, file, problems),
              body: requireText(item.body, `services.offers[${i}].body`, file, problems),
            };
          })
        : (problems.push('"services.offers" is missing'), []),
      howIWork: requireText(data.services?.howIWork, "services.howIWork", file, problems),
      notDoing: requireText(data.services?.notDoing, "services.notDoing", file, problems),
    },
  };

  if (site.capabilities.length !== 3) {
    problems.push('"capabilities" must hold exactly three entries: web, mobile, desktop');
  }

  report(file, problems);
  cachedSite = site;
  return site;
}
