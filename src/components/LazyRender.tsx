import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { isRevealRequested, onRevealRequest } from "@/lib/scroll";

type LazyRenderProps = {
  children: ReactNode;
  rootMargin?: string;
  minHeight?: string;
  className?: string;
  threshold?: number;
};

const LazyRender = ({
  children,
  rootMargin = "0px",
  minHeight = "240px",
  className,
  threshold = 0.2,
}: LazyRenderProps) => {
  // Mounted right away when a link asked to scroll to a section (#contact...).
  const [isVisible, setIsVisible] = useState(isRevealRequested);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isVisible) return;
    return onRevealRequest(() => setIsVisible(true));
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, rootMargin, threshold]);

  const style = !isVisible ? { minHeight } : undefined;

  return (
    <div ref={ref} className={className} style={style}>
      {isVisible ? children : null}
    </div>
  );
};

export default LazyRender;
