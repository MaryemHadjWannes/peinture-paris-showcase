import React from 'react';
import nhLogo from '@/assets/nh-logo.png';
import { MapPin, Mail, Phone, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-primary-foreground py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <img src={nhLogo} alt="NH Logo" className="h-12 sm:h-14 w-auto" />
              </div>
              <p className="text-primary-foreground/80 text-sm sm:text-base mb-4 leading-relaxed">
                Votre partenaire de confiance pour tous vos projets de peinture.
                Excellence, créativité et satisfaction garantie depuis 15 ans.
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
                    href="mailto:contact@nh-renovation.fr"
                    className="text-xs sm:text-sm underline hover:text-accent"
                  >
                    contact@nh-renovation.fr
                  </a>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-heading font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                Services
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-primary-foreground/80">
                <li>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="hover:text-accent underline w-full text-left"
                  >
                    Enduit Professionnel
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="hover:text-accent underline w-full text-left"
                  >
                    Peinture Intérieure
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="hover:text-accent underline w-full text-left"
                  >
                    Peinture Extérieure
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="hover:text-accent underline w-full text-left"
                  >
                    Plâtrerie et Finition
                  </button>
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
              <h4 className="font-heading font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                Entreprise
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-primary-foreground/80">
                <li>
                  <button
                    onClick={() => scrollToSection('about')}
                    className="hover:text-accent underline w-full text-left"
                  >
                    À Propos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('portfolio')}
                    className="hover:text-accent underline w-full text-left"
                  >
                    Portfolio
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('testimonials')}
                    className="hover:text-accent underline w-full text-left"
                  >
                    Témoignages
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
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 sm:pt-8 border-t border-primary-foreground/20">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-xs sm:text-sm">
              <div className="flex items-center space-x-2">
                <span>© {currentYear} NH Renovation. Tous droits réservés.</span>
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