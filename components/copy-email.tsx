"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";

type Props = {
  email: string;
  variant?: "primary" | "quiet";
};

export function CopyEmail({ email, variant = "primary" }: Props) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 2200);
    return () => clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  const label =
    state === "copied" ? "Copied" : state === "failed" ? email : "Copy email";

  if (variant === "quiet") {
    return (
      <button
        type="button"
        onClick={copy}
        className="group inline-flex items-center gap-2 text-sm text-muted transition-colors duration-[--micro] hover:text-accent"
      >
        {state === "copied" ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="inline-flex h-11 items-center gap-2 rounded-lg bg-fg px-5 text-sm font-medium whitespace-nowrap text-bg transition-transform duration-[--micro] active:translate-y-px"
    >
      {state === "copied" ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
      {label}
    </button>
  );
}
