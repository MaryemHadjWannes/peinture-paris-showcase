// Scrolling to a section (#contact, #services, ...) that may not be in the DOM yet:
// home page sections are mounted lazily by <LazyRender> when they approach the
// viewport. scrollToSection() asks every LazyRender to mount, waits for the
// target to exist and for the layout above it to settle, then scrolls.

const REVEAL_EVENT = "hn:reveal-sections";
const NAV_OFFSET = 88; // height of the fixed navigation bar
const MAX_WAIT_MS = 6000; // lazy chunks can be slow on mobile networks

let revealRequested = false;
let currentRun = 0;

export const isRevealRequested = () => revealRequested;

export const onRevealRequest = (callback: () => void) => {
  window.addEventListener(REVEAL_EVENT, callback);
  return () => window.removeEventListener(REVEAL_EVENT, callback);
};

const elementTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;

export function scrollToSection(id: string, options: { updateHash?: boolean } = {}) {
  const { updateHash = true } = options;
  const run = ++currentRun;
  const start = Date.now();
  const behavior: ScrollBehavior = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

  revealRequested = true;
  window.dispatchEvent(new Event(REVEAL_EVENT));

  let lastTop: number | null = null;
  let stableChecks = 0;

  const finish = (el: HTMLElement) => {
    revealRequested = false;
    window.scrollTo({ top: elementTop(el), behavior });
    if (updateHash) window.history.replaceState(window.history.state, "", `#${id}`);
    // Late images/sections above the target can still shift it: correct once.
    window.setTimeout(() => {
      if (run !== currentRun) return;
      const top = elementTop(el);
      if (Math.abs(top - window.scrollY) > 24) window.scrollTo({ top, behavior: "auto" });
    }, 900);
  };

  const tick = () => {
    if (run !== currentRun) return;
    const el = document.getElementById(id);
    if (el) {
      const top = elementTop(el);
      stableChecks = lastTop !== null && Math.abs(top - lastTop) < 2 ? stableChecks + 1 : 0;
      lastTop = top;
      // Same position for several checks in a row: the sections above are rendered.
      if (stableChecks >= 3 || Date.now() - start > MAX_WAIT_MS) {
        finish(el);
        return;
      }
    } else if (Date.now() - start > MAX_WAIT_MS) {
      revealRequested = false;
      return;
    }
    window.setTimeout(tick, 60);
  };

  tick();
}
