import { useState, useEffect, useRef } from "react";

export function useInView<T extends HTMLElement>(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<T>(null); // Fix here

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return { ref, inView: isInView };
}
