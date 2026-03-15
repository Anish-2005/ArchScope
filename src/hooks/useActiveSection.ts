"use client";

import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to track which section is currently active in the viewport.
 * @param sectionIds Array of section IDs to observe.
 * @param offset Top offset for the observer margin.
 * @returns The ID of the currently active section.
 */
export function useActiveSection(sectionIds: string[], offset: number = 100) {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0]);
  
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: `-${offset}px 0px -60% 0px`,
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sectionIds, offset]);

  return activeSection;
}
