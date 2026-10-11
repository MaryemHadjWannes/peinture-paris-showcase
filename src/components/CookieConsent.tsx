import { useEffect, useState } from "react";
import { OPEN_CONSENT_EVENT, readConsent, saveConsent, type ConsentChoice } from "@/lib/consent";

// Audience measurement (Google Analytics) is only loaded after explicit consent.
// CNIL rules: refusing must be as easy as accepting, and the visitor can change
// their mind at any time (footer link).
const CookieConsent = () => {
  const [open, setOpen] = useState(() => readConsent() === null);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, show);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, show);
  }, []);

  const choose = (value: ConsentChoice) => {
    saveConsent(value);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Gestion des cookies"
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
    >
      <div className="mx-auto max-w-3xl rounded-xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur-sm sm:flex sm:items-center sm:gap-4">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Nous utilisons Google Analytics pour mesurer l’audience du site, uniquement avec votre accord. Vous pouvez
          changer d’avis à tout moment via « Gestion des cookies » en bas de page.
        </p>
        <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="flex-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
