"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

/**
 * Runs before paint so the correct theme is already on <html> when the
 * first pixel lands. HeroUI reads data-theme; the class keeps Tailwind's
 * dark variant in step.
 */
export const themeScript = `
(function(){
  try {
    var stored = localStorage.getItem("theme");
    var system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    var theme = stored || system;
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch (e) {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.classList.add("dark");
  }
})();
`;

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.setAttribute("data-theme-changing", "");
    root.dataset.theme = next;
    root.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
    setTheme(next);
    window.requestAnimationFrame(() => root.removeAttribute("data-theme-changing"));
  }

  return (
    <Button
      isIconOnly
      size="sm"
      variant="ghost"
      className="btn-quiet"
      onPress={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
    </Button>
  );
}
