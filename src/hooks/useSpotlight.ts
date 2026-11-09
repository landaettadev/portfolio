import type React from 'react';

/** Pointer handler that feeds --x / --y to elements using the `.spotlight` class. */
export const spotlightMove = (e: React.PointerEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--x', `${e.clientX - r.left}px`);
  el.style.setProperty('--y', `${e.clientY - r.top}px`);
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const askAgent = (question?: string) =>
  window.dispatchEvent(new CustomEvent('ai:ask', { detail: question ?? '' }));

export const openPalette = () => window.dispatchEvent(new Event('palette:open'));

/** Mounts every lazy section, then scrolls to `id` once it exists (sections stream in progressively). */
export const scrollToSection = (id: string) => {
  window.dispatchEvent(new Event('mount:all'));
  const smooth = prefersReducedMotion() ? 'auto' : 'smooth';
  let tries = 0;
  const attempt = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: smooth as ScrollBehavior });
      // re-align once late chunks have settled the layout above the target
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'auto' }), 700);
      return;
    }
    if (tries++ < 40) window.setTimeout(attempt, 50);
  };
  attempt();
};

/** Runs `cb` in an idle slot (or after a short delay where unsupported); returns a cancel function. */
export const onIdle = (cb: () => void, timeout = 1500): (() => void) => {
  const w = window as Window & typeof globalThis;
  if (typeof w.requestIdleCallback === 'function') {
    const id = w.requestIdleCallback(cb, { timeout });
    return () => w.cancelIdleCallback(id);
  }
  const id = w.setTimeout(cb, Math.min(timeout, 600));
  return () => w.clearTimeout(id);
};
