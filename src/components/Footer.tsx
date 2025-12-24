import React, { useMemo } from 'react';
import nhLogoPng147 from '@/assets/nh-logo-147.png';
import nhLogoPng294 from '@/assets/nh-logo-294.png';
import nhLogoWebp147 from '@/assets/nh-logo-147.webp';
import nhLogoWebp294 from '@/assets/nh-logo-294.webp';
import { MapPin, Mail, Phone, Heart, Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { CITIES, DEFAULT_CITY } from '@/data/seo';

const Footer = () => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  const citySlugs = useMemo(() => new Set(CITIES.map((city) => city.slug)), []);
  const shareUrl = `https://hn-renovation.fr${location.pathname}${location.search}`;
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const encodedShareText = encodeURIComponent("HN Rénovation - Artisan peintre");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = `#${id}`;
    }
  };

  const activeCitySlug = (() => {
    const cleanPath = location.pathname.replace(/\/+$/, "");
    const parts = cleanPath.split("/").filter(Boolean);
    if (parts.length >= 2 && citySlugs.has(parts[1])) return parts[1];
    if (parts.length === 1 && citySlugs.has(parts[0])) return parts[0];
    return DEFAULT_CITY.slug;
  })();

  return (
    <footer className="bg-primary text-primary-foreground py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
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
                    alt="HN Logo"
                    title="HN Logo"
                    className="h-12 w-[84px] sm:h-14 sm:w-[98px]"
                    width={147}
                    height={84}
                    decoding="async"
                  />
                </picture>
              </div>
              <p className="text-primary-foreground/80 text-sm sm:text-base mb-4 leading-relaxed">
                <strong className="text-primary-foreground">HN Rénovation</strong> : votre partenaire de confiance
                pour tous vos projets de peinture. Excellence, créativité et satisfaction, protégées par l'assurance
                décennale.
              </p>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                  <a
                    href="https://maps.google.com/?q=103+rue+saint+ladre,+59400+cambrai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm underline hover:text-accent"
                  >
                    103 rue Saint Ladre, 59400 Cambrai
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                  <a
                    href="tel:+330602228001"
                    className="text-xs sm:text-sm underline hover:text-accent"
                  >
                    +33 06 02 22 80 01
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                  <a
                    href="mailto:contact@hn-renovation.fr"
                    className="text-xs sm:text-sm underline hover:text-accent"
                  >
                    hn.renovation.fr@gmail.com
                  </a>
                </div>
              </div>

            </div>

            {/* Services */}
            <div>
              <h3 className="font-heading font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                Services
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-primary-foreground/80">
                <li>
                  <Link
                    to={`/enduit/${activeCitySlug}`}
                    className="hover:text-accent underline w-full text-left inline-block"
                  >
                    Enduit Professionnel
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/peinture-interieure/${activeCitySlug}`}
                    className="hover:text-accent underline w-full text-left inline-block"
                  >
                    Peinture Intérieure
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/peinture-exterieure/${activeCitySlug}`}
                    className="hover:text-accent underline w-full text-left inline-block"
                  >
                    Peinture Extérieure
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/platrerie/${activeCitySlug}`}
                    className="hover:text-accent underline w-full text-left inline-block"
                  >
                    Plâtrerie et Finition
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/artisan-peintre/${activeCitySlug}`}
                    className="hover:text-accent underline w-full text-left inline-block"
                  >
                    Artisan peintre
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="hover:text-accent underline w-full text-left"
                  >
                    Devis Gratuit
                  </button>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-heading font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                Entreprise
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-primary-foreground/80">
                <li>
                  <button
                    onClick={() => scrollToSection('home')}
                    className="hover:text-accent underline w-full text-left"
                  >
                    Accueil
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('about')}
                    className="hover:text-accent underline w-full text-left"
                  >
                    À Propos
                  </button>
                </li>
                <li>
                  <Link
                    to="/realisations"
                    className="hover:text-accent underline w-full text-left inline-block"
                  >
                    Réalisations
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="hover:text-accent underline w-full text-left"
                  >
                    Services
                  </button>
                </li>
                <li>
                  <Link
                    to="/avis"
                    className="hover:text-accent underline w-full text-left inline-block"
                  >
                    Avis
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('faq')}
                    className="hover:text-accent underline w-full text-left"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="hover:text-accent underline w-full text-left"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Social & Share */}
            <div className="text-xs sm:text-sm font-semibold">
              <div>Partager cette page</div>
              <div className="mt-2 flex items-center gap-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Partager sur Facebook"
                  title="Partager HN Rénovation sur Facebook"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/30 hover:text-accent hover:border-accent transition"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Partager sur LinkedIn"
                  title="Partager HN Rénovation sur LinkedIn"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/30 hover:text-accent hover:border-accent transition"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href={`https://x.com/intent/tweet?url=${encodedShareUrl}&text=${encodedShareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Partager sur X"
                  title="Partager HN Rénovation sur X"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/30 hover:text-accent hover:border-accent transition"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
                <div className="mt-4">Suivez-nous</div>
                <div className="mt-2 flex items-center gap-3">
                  <a
                    href="https://www.facebook.com/profile.php?id=61576234322277"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook HN Rénovation"
                    title="Facebook HN Rénovation"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/30 hover:text-accent hover:border-accent transition"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/hn-r%C3%A9novation-6947663a1/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn HN Rénovation"
                    title="LinkedIn HN Rénovation"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/30 hover:text-accent hover:border-accent transition"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href="https://x.com/HWannesMaryem"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X HN Rénovation"
                    title="X HN Rénovation"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/30 hover:text-accent hover:border-accent transition"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.youtube.com/@HN-Renovation"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chaîne YouTube HN Rénovation"
                  title="YouTube HN Rénovation"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/30 hover:text-accent hover:border-accent transition"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 sm:pt-8 border-t border-primary-foreground/20">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-xs sm:text-sm">
              <div className="flex items-center space-x-2">
                <span>© {currentYear} HN Renovation. Tous droits réservés.</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Fait avec</span>
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-accent fill-current" />
                <span>en France</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
