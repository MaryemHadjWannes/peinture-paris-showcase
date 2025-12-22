import React, { useState } from "react";
import nhLogoPng147 from "@/assets/nh-logo-147.png";
import nhLogoPng294 from "@/assets/nh-logo-294.png";
import nhLogoWebp147 from "@/assets/nh-logo-147.webp";
import nhLogoWebp294 from "@/assets/nh-logo-294.webp";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const goToHomeSection = (id: string) => {
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else window.location.hash = `#${id}`;
    };

    // If not on home page, go home first with hash, then scroll after route change
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      // Allow the home page to render before trying to scroll
      setTimeout(doScroll, 250);
      return;
    }

    doScroll();
  };

  const handleNavClick = (item: { id: string; label: string; type: "section" | "route"; path?: string }) => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
      setTimeout(() => {
        if (item.type === "route" && item.path) {
          navigate(item.path);
        } else {
          goToHomeSection(item.id);
        }
      }, 300);
      return;
    }

    if (item.type === "route" && item.path) {
      navigate(item.path);
    } else {
      goToHomeSection(item.id);
    }
  };

  const navItems: Array<
    { id: string; label: string; type: "section" | "route"; path?: string }
  > = [
    { id: "home", label: "Accueil", type: "section" },
    { id: "about", label: "À Propos", type: "section" },
    { id: "realisations", label: "Réalisations", type: "route", path: "/realisations" },
    { id: "services", label: "Services", type: "section" },
    { id: "Avis", label: "Avis", type: "route", path: "/avis" },
    { id: "faq", label: "FAQ", type: "section" },
    { id: "contact", label: "Contact", type: "section" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft"
      style={{ WebkitTransform: "translateZ(0)" }}
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center"
            aria-label="Retour à l'accueil"
          >
            <picture>
              <source
                type="image/webp"
                srcSet={`${nhLogoWebp147} 147w, ${nhLogoWebp294} 294w`}
                sizes="(max-width: 640px) 84px, 98px"
              />
              <img
                src={nhLogoPng147}
                srcSet={`${nhLogoPng147} 147w, ${nhLogoPng294} 294w`}
                sizes="(max-width: 640px) 84px, 98px"
                alt="HN Rénovation"
                title="HN Rénovation"
                className="h-12 w-[84px] sm:h-14 sm:w-[98px]"
                width={147}
                height={84}
                decoding="async"
              />
            </picture>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="text-foreground hover:text-primary text-sm sm:text-base font-medium transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop Contact Info */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-accent" />
              <span>+33 06 02 22 80 01</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-accent" />
              <span>hn.renovation.fr@gmail.com</span>
            </div>
          </div>

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
            isMobileMenuOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
          }`}
          aria-hidden={!isMobileMenuOpen}
        >
          <div
            className={`flex flex-col items-center py-4 space-y-4 ${
              isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="text-foreground hover:text-primary text-lg font-medium transition-colors duration-200 w-full text-center py-2"
              >
                {item.label}
              </button>
            ))}

            {/* Mobile Contact Info */}
            <div className="flex flex-col items-center space-y-2 text-sm pt-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-accent" />
                <a href="tel:+330602228001" className="hover:text-primary">
                  +33 06 02 22 80 01
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-accent" />
                <a href="mailto:hn.renovation.fr@gmail.com" className="hover:text-primary">
                  hn.renovation.fr@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
