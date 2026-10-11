import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToSection } from "@/lib/scroll";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }
    // /#contact etc. (from another page or a direct link): the section may be lazy.
    let id = hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      // malformed escape: keep the raw value
    }
    scrollToSection(id, { updateHash: false });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
