import type { CSSProperties } from "react";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Maps token keys to var(--space-*) used on the main page */
const SPACE_MAP: Record<string, string> = {
  4: "var(--space-4)",
  8: "var(--space-8)",
  12: "var(--space-12)",
  16: "var(--space-16)",
  20: "var(--space-20)",
  24: "var(--space-24)",
  32: "var(--space-32)",
  40: "var(--space-40)",
  48: "var(--space-48)",
  64: "var(--space-64)",
  80: "var(--space-80)",
  head: "var(--section-head-gap)",
  grid: "var(--grid-gap)",
  card: "var(--card-gap)",
};

export type GapToken = keyof typeof SPACE_MAP;

export function gapStyle(gap?: GapToken): CSSProperties | undefined {
  if (!gap) return undefined;
  const v = SPACE_MAP[gap];
  return v ? { gap: v } : undefined;
}
