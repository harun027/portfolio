"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
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
      // Clipboard access can be refused. Showing the address is a working
      // fallback, not a dead end.
      setState("failed");
    }
  }

  const label = state === "copied" ? "Copied" : state === "failed" ? email : "Copy email";
  const Icon = state === "copied" ? CheckIcon : CopyIcon;

  return (
    <Button
      variant="ghost"
      size={variant === "quiet" ? "sm" : "md"}
      className={variant === "quiet" ? "btn-quiet px-0" : "btn-solid px-5"}
      onPress={copy}
    >
      <Icon className={variant === "quiet" ? "size-3.5" : "size-4"} />
      <span aria-live="polite">{label}</span>
    </Button>
  );
}
