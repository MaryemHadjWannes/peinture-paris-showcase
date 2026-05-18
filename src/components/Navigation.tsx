import React, { useState } from "react";
import nhLogoPng147 from "@/assets/nh-logo-147.png";
import nhLogoPng294 from "@/assets/nh-logo-294.png";
import nhLogoWebp147 from "@/assets/nh-logo-147.webp";
import nhLogoWebp294 from "@/assets/nh-logo-294.webp";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const scrollToSectionWithOffset = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return false;
    const navOffset = 88;
    const top = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
    return true;
  };

  const goToHomeSection = (id: string) => {
    const tryScroll = () => scrollToSectionWithOffset(id);

    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      let attempts = 0;
      const poll = () => {
        if (tryScroll() || ++attempts > 20) return;
        requestAnimationFrame(poll);
      };
      setTimeout(poll, 100);
      return;
    }

    if (!tryScroll()) {
      setTimeout(tryScroll, 100);
    }
  };

  const handleNavClick = (item: { id: string; label: string; type: "section" | "route"; path?: string }) => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
      setTimeout(() => {
        goToHomeSection(item.id);
      }, 300);
      return;
    }
    goToHomeSection(item.id);
  };

  const handleRouteClick = (event: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!isMobileMenuOpen) return;
    event.preventDefault();
    closeMobileMenu();
    setTimeout(() => navigate(path), 300);
  };

  const navItems: Array<
    { id: string; label: string; type: "section" | "route"; path?: string; srLabel?: string }
  > = [
    { id: "home", label: "Accueil", type: "route", path: "/", srLabel: "HN Rénovation à Cambrai" },
    { id: "about", label: "À Propos", type: "section" },
    {
      id: "realisations",
      label: "Réalisations",
      type: "route",
      path: "/realisations",
      srLabel: "peinture et rénovation",
    },
    { id: "services", label: "Services", type: "section" },
    { id: "Avis", label: "Avis", type: "route", path: "/avis", srLabel: "clients HN Rénovation" },
    { id: "faq", label: "FAQ", type: "section" },
    { id: "contact", label: "Contact", type: "section" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-translate">
      {/* Top Contact Bar */}
      <div className="bg-slate-950/95 text-white/90 border-b border-slate-800 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 py-2 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold">Devis gratuit sous 24h</span>
            <a href="tel:+330602228001" className="hover:text-white font-medium">
              +33 06 02 22 80 01
            </a>
            <a href="mailto:hn.renovation.fr@gmail.com" className="hover:text-white font-medium hidden sm:inline">
              hn.renovation.fr@gmail.com
            </a>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="rounded-full bg-accent px-3 py-1 text-accent-foreground text-xs font-semibold">Assurance décennale</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white backdrop-blur-md border-b border-gray-200 shadow-soft">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center flex-shrink-0"
              aria-label="Retour à l'accueil"
            >
              <picture>
                <source
                  type="image/webp"
                  srcSet={`${nhLogoWebp147} 147w, ${nhLogoWebp294} 294w`}
                  sizes="(max-width: 640px) 70px, 90px"
                />
                <img
                  src={nhLogoPng147}
                  srcSet={`${nhLogoPng147} 147w, ${nhLogoPng294} 294w`}
                  sizes="(max-width: 640px) 70px, 90px"
                  alt="HN Rénovation"
                  title="HN Rénovation"
                  className="h-10 w-[70px] sm:h-12 sm:w-[90px]"
                  width={147}
                  height={84}
                  decoding="async"
                />
              </picture>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) =>
                item.type === "route" && item.path ? (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={(event) => handleRouteClick(event, item.path)}
                    className="px-2 lg:px-3 py-2 text-foreground hover:text-primary text-sm font-medium transition-colors duration-200"
                  >
                    {item.label}
                    {item.srLabel ? <span className="sr-only"> {item.srLabel}</span> : null}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className="px-2 lg:px-3 py-2 text-foreground hover:text-primary text-sm font-medium transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                )
              )}
            </div>

            {/* Desktop CTA */}
            <Button
              size="sm"
              className="hidden sm:flex rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition font-semibold"
              onClick={() => handleNavClick({ id: "contact", label: "Devis Gratuit", type: "section" })}
            >
              Devis Gratuit
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden bg-background/95 backdrop-blur-sm border-t border-border overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
              isMobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
            aria-hidden={!isMobileMenuOpen}
          >
            <div
              className={`flex flex-col items-stretch py-3 space-y-2 ${
                isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
              }`}
            >
              {navItems.map((item) =>
                item.type === "route" && item.path ? (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={(event) => handleRouteClick(event, item.path)}
                    className="text-foreground hover:text-primary hover:bg-secondary/40 px-4 py-2 text-base font-medium transition-colors duration-200"
                  >
                    {item.label}
                    {item.srLabel ? <span className="sr-only"> {item.srLabel}</span> : null}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className="text-foreground hover:text-primary hover:bg-secondary/40 px-4 py-2 text-base font-medium transition-colors duration-200 text-left"
                  >
                    {item.label}
                  </button>
                )
              )}
              <Button
                size="sm"
                className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 mx-4 mt-2 font-semibold"
                onClick={() => {
                  handleNavClick({ id: "contact", label: "Devis Gratuit", type: "section" });
                  closeMobileMenu();
                }}
              >
                Devis Gratuit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
