import React from 'react';
import { MapPin, Mail, Phone, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <h3 className="text-2xl font-heading font-bold">PeinturePro</h3>
                <span className="text-accent text-sm">France</span>
              </div>
              <p className="text-primary-foreground/80 mb-4 leading-relaxed">
                Votre partenaire de confiance pour tous vos projets de peinture. 
                Excellence, créativité et satisfaction garantie depuis 15 ans.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="text-sm">123 Rue de la Peinture, 75001 Paris</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-accent" />
                  <span className="text-sm">+33 1 23 45 67 89</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-accent" />
                  <span className="text-sm">contact@peinturepro.fr</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-heading font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>Peinture Intérieure</li>
                <li>Peinture Extérieure</li>
                <li>Peinture Décorative</li>
                <li>Rénovation Complète</li>
                <li>Devis Gratuit</li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-heading font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>À Propos</li>
                <li>Portfolio</li>
                <li>Témoignages</li>
                <li>Contact</li>
                <li>Garanties</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-primary-foreground/20">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-sm">
                <span>© {currentYear} PeinturePro. Tous droits réservés.</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span>Fait avec</span>
                <Heart className="h-4 w-4 text-accent fill-current" />
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