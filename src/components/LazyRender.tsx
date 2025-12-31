import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

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
  const isPrerender =
    typeof navigator !== "undefined" && navigator.userAgent.includes("ReactSnap");
  const [isVisible, setIsVisible] = useState(isPrerender);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isVisible || isPrerender) return;
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
  }, [isVisible, rootMargin]);

  const style = !isVisible ? { minHeight } : undefined;

  return (
    <div ref={ref} className={className} style={style}>
      {isVisible ? children : null}
    </div>
  );
};

export default LazyRender;
