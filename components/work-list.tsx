"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import type { WorkMeta } from "@/lib/content";

type Props = { items: WorkMeta[] };

export function WorkList({ items }: Props) {
  const reduce = useReducedMotion();
  const [pointerFine, setPointerFine] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const wrap = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 30, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 280, damping: 30, mass: 0.4 });

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
    x.set(event.clientX - box.left + 24);
    y.set(event.clientY - box.top - 90);
  }

  if (items.length === 0) {
    return (
      <p className="border-t border-line py-16 text-muted">
        No case studies are published yet.
      </p>
    );
  }

  return (
    <div ref={wrap} onMouseMove={onMove} className="relative" onMouseLeave={() => setActive(null)}>
      <ul>
        {items.map((item, i) => (
          <li key={item.slug}>
            <Link
              href={`/work/${item.slug}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(null)}
              className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-2 border-t border-line py-8 transition-colors duration-[--micro] hover:border-accent md:py-10"
            >
              <h3 className="display text-2xl transition-colors duration-[--micro] group-hover:text-accent md:text-4xl">
                {item.title}
              </h3>
              <ArrowTopRightIcon className="size-5 shrink-0 self-center text-muted transition-all duration-[--micro] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              <p className="label col-span-2 md:col-span-1">
                {item.role}
                <span className="mx-2 text-line">/</span>
                {item.stack.slice(0, 2).join(", ")}
                <span className="mx-2 text-line">/</span>
                {item.platforms.join(", ")}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="border-t border-line" />

      {preview && (
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key={items[active].slug}
              style={{ x: sx, y: sy }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute top-0 left-0 z-10 hidden overflow-hidden rounded-lg border border-line md:block"
            >
              <Image
                src={items[active].cover}
                alt=""
                width={280}
                height={180}
                className="h-[180px] w-[280px] object-cover"
                unoptimized
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
