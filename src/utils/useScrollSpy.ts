import { useState, useEffect } from 'react';

interface UseScrollSpyOptions {
  ids: string[];
  offset?: number;
}

/**
 * Returns the id of the last section whose top has scrolled past `offset`.
 * Looks elements up on every scroll so it works with lazily rendered sections.
 */
export const useScrollSpy = ({ ids, offset = 100 }: UseScrollSpyOptions) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids, offset]);

  return activeId;
};

export default useScrollSpy;
