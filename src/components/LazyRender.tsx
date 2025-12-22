import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type LazyRenderProps = {
  children: ReactNode;
  rootMargin?: string;
  minHeight?: string;
  className?: string;
};

const LazyRender = ({
  children,
  rootMargin = "300px",
  minHeight = "240px",
  className,
}: LazyRenderProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

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
      { rootMargin }
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
