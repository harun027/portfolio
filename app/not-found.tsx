import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[60dvh] flex-col justify-center py-24">
      <p className="label">404</p>
      <h1 className="display mt-4 text-4xl md:text-6xl">This page does not exist.</h1>
      <Link
        href="/"
        className="mt-8 inline-flex w-fit text-sm text-muted transition-colors duration-[--micro] hover:text-accent"
      >
        Back to the start
      </Link>
    </section>
  );
}
