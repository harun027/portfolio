import type { CSSProperties, ReactNode } from "react";

/**
 * Entry animation, in CSS.
 *
 * These used to be Motion components that started at opacity 0 and waited
 * on JavaScript. When the animation did not complete the content stayed
 * invisible, which cost the homepage its headline and its primary CTA.
 * CSS keyframes with `both` fill mode cannot fail that way, they do not
 * ship any JavaScript, and they run off the main thread.
 *
 * Both are server components now.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`reveal${className ? ` ${className}` : ""}`}
      style={{ "--d": `${Math.round(delay * 1000)}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * The headline arrives word by word. The stagger is capped by the CSS
 * `--i` index the caller sets, so a long sentence never turns into a slow
 * one, and every word is legible from the first paint regardless.
 */
export function AnimatedHeadline({
  text,
  className,
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  const words = text.split(" ");
  const last = words.length - 1;

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        // The space is a plain text node between spans. Inside an
        // inline-block a trailing space collapses and the words merge.
        <span key={`${word}-${i}`}>
          <span
            className="rise-word"
            style={{ "--i": Math.min(i, 12) } as CSSProperties}
          >
            {word}
          </span>
          {i < last ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
