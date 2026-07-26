"use client";

import { useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

/* ---------------------------------------------------------------
   Three device panels standing in real 3D space.

   Depth is genuine CSS 3D, not a painted illusion: the group carries
   `transform-style: preserve-3d` and each panel sits at its own
   translateZ, so perspective, overlap, and parallax fall out of the
   transform rather than being faked with scale and offset.

   The panels themselves are HTML surfaces so they can hold a fill, a
   border, and a contact shadow, which is what makes a plane read as an
   object. The hairline content inside each one is SVG, drawing itself in
   via CSS rather than JavaScript.
--------------------------------------------------------------- */

type PanelProps = {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  z: number;
  dim?: boolean;
  drawDelay?: number;
};

function Panel({ className = "", style, children, z, dim, drawDelay = 0 }: PanelProps) {
  return (
    <div
      className={`draw absolute overflow-hidden border ${
        dim ? "border-art-soft text-art-soft" : "border-art text-art"
      } bg-surface ${className}`}
      style={
        {
          transform: `translateZ(${z}px)`,
          boxShadow: "var(--panel-shadow)",
          "--draw-delay": `${drawDelay}ms`,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

/** Hairline content bars. Structure, not a fake screenshot. */
function Lines({ rows }: { rows: [number, number][] }) {
  return (
    <svg viewBox="0 0 200 120" fill="none" preserveAspectRatio="none" className="h-full w-full">
      <g stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke">
        {rows.map(([y, w], i) => (
          <line key={i} x1={12} y1={y} x2={12 + w} y2={y} pathLength={1} />
        ))}
      </g>
    </svg>
  );
}

export function HeroVisual() {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  // The scene turns a little as the page moves, which is what sells the
  // depth: flat art cannot parallax.
  const spin = useTransform(scrollY, [0, 800], [0, 14]);
  const rise = useTransform(scrollY, [0, 800], [0, -30]);
  const spinY = useSpring(spin, { stiffness: 90, damping: 26 });
  const liftY = useSpring(rise, { stiffness: 90, damping: 26 });

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const tiltY = useSpring(px, { stiffness: 100, damping: 20, mass: 0.7 });
  const tiltX = useSpring(py, { stiffness: 100, damping: 20, mass: 0.7 });

  function onMove(event: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !wrap.current) return;
    const box = wrap.current.getBoundingClientRect();
    px.set(((event.clientX - box.left) / box.width - 0.5) * 14);
    py.set(((event.clientY - box.top) / box.height - 0.5) * -10);
  }

  function reset() {
    px.set(0);
    py.set(0);
  }

  const baseY = useTransform([tiltY, spinY], ([t, s]: number[]) => -19 + t + s);
  const baseX = useTransform([tiltX], ([t]: number[]) => 7 + t);

  return (
    <div
      ref={wrap}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="relative aspect-4/3 w-full select-none md:-mt-10"
      style={{ perspective: "1400px" }}
      // Illustration. The sentence beside it carries the same claim for
      // anyone who cannot see it.
      aria-hidden
    >
      <motion.div
        className="absolute inset-0"
        style={
          reduce
            ? { transform: "rotateY(-19deg) rotateX(7deg)", transformStyle: "preserve-3d" }
            : {
                rotateY: baseY,
                rotateX: baseX,
                y: liftY,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }
        }
      >
        {/* Back plane: the desktop tool, furthest from the viewer. */}
        <Panel
          z={-118}
          dim
          drawDelay={420}
          className="top-[2%] left-0 w-[54%] rounded-lg"
          style={{ aspectRatio: "16 / 11" }}
        >
          <div className="flex h-5 items-center border-b border-current/60 px-2">
            <span className="h-1 w-8 rounded-full bg-current/60" />
          </div>
          <div className="flex h-[calc(100%-1.25rem)]">
            <div className="w-[26%] border-r border-current/60 p-2">
              <Lines rows={[[24, 120], [52, 92], [80, 108]]} />
            </div>
            <div className="flex-1 p-2">
              <Lines rows={[[30, 160], [58, 132], [86, 148]]} />
            </div>
          </div>
        </Panel>

        {/* Middle plane: the web app, the anchor of the composition. */}
        <Panel
          z={0}
          drawDelay={120}
          className="top-[24%] left-[13%] w-[74%] rounded-xl"
          style={{ aspectRatio: "16 / 10" }}
        >
          <div className="flex h-7 items-center justify-center border-b border-current/60 px-3">
            <span className="h-1.5 w-2/5 rounded-full bg-current/55" />
          </div>
          <div className="h-[calc(100%-1.75rem)] p-4">
            <div className="h-1/3">
              <Lines rows={[[34, 150], [72, 104]]} />
            </div>
            <div className="mt-2 grid h-1/2 grid-cols-2 gap-3">
              <div className="rounded-md border border-current/70" />
              <div className="rounded-md border border-current/70" />
            </div>
          </div>
        </Panel>

        {/* Front plane: the phone, nearest the viewer. */}
        <Panel
          z={118}
          drawDelay={700}
          className="right-[5%] bottom-[3%] w-[20%] rounded-[1.4rem]"
          style={{ aspectRatio: "1 / 2.05" }}
        >
          <div className="flex h-6 items-center justify-center">
            <span className="h-1 w-8 rounded-full bg-current/60" />
          </div>
          <div className="px-2.5">
            <div className="h-8">
              <Lines rows={[[40, 96]]} />
            </div>
            <div className="aspect-4/3 rounded-md border border-current/70" />
            <div className="mt-3 h-10">
              <Lines rows={[[30, 140], [70, 96]]} />
            </div>
          </div>
        </Panel>
      </motion.div>
    </div>
  );
}

/**
 * Small glyph beside each capability heading. Every variant is boxed to the
 * same optical height so the three headings keep one baseline rhythm.
 */
export function PlatformGlyph({ platform }: { platform: string }) {
  const key = platform.toLowerCase();

  return (
    <div className="grid h-11 w-12 shrink-0 place-items-center text-art" aria-hidden>
      {key.includes("mobile") ? (
        <span className="block h-11 w-[22px] rounded-md border border-current">
          <span className="mx-auto mt-1 block h-0.5 w-2.5 rounded-full bg-current/60" />
        </span>
      ) : key.includes("desktop") ? (
        <span className="block h-9 w-12 rounded-md border border-current">
          <span className="block h-2 border-b border-current/60" />
          <span className="block h-full w-3.5 border-r border-current/60" />
        </span>
      ) : (
        <span className="block h-8 w-12 rounded-md border border-current">
          <span className="flex h-2.5 items-center justify-center border-b border-current/60">
            <span className="h-0.5 w-5 rounded-full bg-current/60" />
          </span>
        </span>
      )}
    </div>
  );
}
