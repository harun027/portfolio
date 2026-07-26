"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import type { WorkMeta } from "@/lib/content";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export function WorkList({ items }: { items: WorkMeta[] }) {
  const reduce = useReducedMotion();
  const [pointerFine, setPointerFine] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const wrap = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Spring rather than direct tracking. Tying the preview straight to the
  // cursor reads as mechanical; a little lag gives it weight.
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.4 });

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setPointerFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const preview = pointerFine && !reduce;

  function onMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!preview || !wrap.current) return;
    const box = wrap.current.getBoundingClientRect();
    x.set(event.clientX - box.left + 28);
    y.set(event.clientY - box.top - 96);
  }

  if (items.length === 0) {
    return <p className="border-t border-line py-16 text-muted">No case studies are published yet.</p>;
  }

  return (
    <div ref={wrap} onMouseMove={onMove} onMouseLeave={() => setActive(null)} className="relative">
      <ul>
        {items.map((item, i) => (
          <li key={item.slug}>
            <Link
              href={`/work/${item.slug}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(null)}
              className="group relative block border-t border-line py-8 md:py-11"
            >
              {/* The rule under the row draws in from the left on hover.
                  Scaling an existing line is cheaper and steadier than
                  animating a colour across a 1px border. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
              />

              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <h3 className="display text-2xl transition-[transform,color] duration-[--micro] group-hover:translate-x-1 group-hover:text-accent md:text-4xl">
                    {item.title}
                  </h3>
                  <p className="label mt-3">
                    {item.role}
                    <span className="mx-2 text-line">/</span>
                    {item.stack.slice(0, 2).join(", ")}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <span className="label hidden md:inline">{item.platforms.join(", ")}</span>
                  <ArrowTopRightIcon className="size-5 text-muted transition-[transform,color] duration-[--micro] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="border-t border-line" />

      {preview && (
        <AnimatePresence mode="wait">
          {active !== null && (
            <motion.div
              key={items[active].slug}
              style={{ x: sx, y: sy, willChange: "transform" }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              // Exit is quicker than enter. Leaving should feel like the
              // interface getting out of the way.
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.14 } }}
              transition={{ duration: 0.26, ease: EASE_OUT }}
              className="pointer-events-none absolute top-0 left-0 z-10 hidden w-75 overflow-hidden rounded-lg border border-line bg-surface md:block"
            >
              {/* Window chrome around the preview. It frames a temporary
                  image as a screen rather than as stock photography, and
                  the slot stays identical when real captures land. */}
              <div className="flex h-7 items-center gap-2 border-b border-line px-3">
                <span className="h-1.5 w-16 rounded-full bg-line" />
                <span className="label truncate text-[10px]">
                  {items[active].platforms[0]}
                </span>
              </div>
              <Image
                src={items[active].cover}
                alt=""
                width={300}
                height={168}
                className="h-42 w-full object-cover"
                unoptimized
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
