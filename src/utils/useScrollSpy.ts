import { useState, useEffect } from 'react';

interface UseScrollSpyOptions {
  ids: string[];
  offset?: number;
}

export const useScrollSpy = ({ ids, offset = 100 }: UseScrollSpyOptions) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${offset}px 0px -${offset}px 0px`,
        threshold: 0.1,
      }
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      ids.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [ids, offset]);

  return activeId;
};

export default useScrollSpy;