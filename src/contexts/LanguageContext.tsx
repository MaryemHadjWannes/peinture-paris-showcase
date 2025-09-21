import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Navigation
    home: 'Accueil',
    about: 'À Propos',
    portfolio: 'Portfolio',
    services: 'Services',
    contact: 'Contact',
    
    // Hero
    experts: 'Experts en Peinture',
    transform: 'Transformez Vos',
    spaces: 'Espaces',
    heroDescription: 'Peinture professionnelle d\'intérieur et d\'extérieur en France. Qualité, créativité et finition impeccable garanties.',
    projectsCompleted: 'Projets Réalisés',
    yearsExperience: 'Ans d\'Expérience',
    satisfaction: 'Satisfaction',
    viewWork: 'Voir Nos Réalisations',
    freeQuote: 'Devis Gratuit',
    
    // About
    aboutTitle: 'À Propos de PeinturePro',
    aboutDescription: 'Avec plus de 15 ans d\'expérience dans le domaine de la peinture, PeinturePro s\'est établi comme le leader en France pour les travaux de peinture résidentielle et commerciale.',
    whyChooseUs: 'Pourquoi Nous Choisir',
    qualityMaterials: 'Matériaux de Qualité',
    qualityDesc: 'Nous utilisons uniquement des peintures et matériaux haut de gamme',
    experiencedTeam: 'Équipe Expérimentée',
    teamDesc: 'Nos peintres sont certifiés et passionnés par leur métier',
    guarantee: 'Garantie Totale',
    guaranteeDesc: 'Satisfaction garantie ou nous refaisons le travail',
    
    // Services
    servicesTitle: 'Nos Services',
    servicesDescription: 'Découvrez notre gamme complète de services de peinture pour tous vos projets.',
    interiorPainting: 'Peinture Intérieure',
    exteriorPainting: 'Peinture Extérieure',
    decorativePainting: 'Peinture Décorative',
    
    // Contact
    contactTitle: 'Contactez-Nous',
    contactDescription: 'Prêt à transformer votre espace ? Contactez-nous pour un devis personnalisé.',
    address: 'Adresse',
    phone: 'Téléphone',
    email: 'Email',
    yourName: 'Votre nom',
    yourEmail: 'Votre email',
    yourPhone: 'Votre téléphone',
    projectDetails: 'Détails du projet',
    sendMessage: 'Envoyer le Message',
    
    // Footer
    followUs: 'Suivez-nous',
    quickLinks: 'Liens Rapides',
    allRightsReserved: 'Tous droits réservés'
  },
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    portfolio: 'Portfolio',
    services: 'Services',
    contact: 'Contact',
    
    // Hero
    experts: 'Painting Experts',
    transform: 'Transform Your',
    spaces: 'Spaces',
    heroDescription: 'Professional interior and exterior painting in France. Quality, creativity and impeccable finish guaranteed.',
    projectsCompleted: 'Projects Completed',
    yearsExperience: 'Years Experience',
    satisfaction: 'Satisfaction',
    viewWork: 'View Our Work',
    freeQuote: 'Free Quote',
    
    // About
    aboutTitle: 'About PeinturePro',
    aboutDescription: 'With over 15 years of experience in painting, PeinturePro has established itself as the leader in France for residential and commercial painting work.',
    whyChooseUs: 'Why Choose Us',
    qualityMaterials: 'Quality Materials',
    qualityDesc: 'We only use high-end paints and materials',
    experiencedTeam: 'Experienced Team',
    teamDesc: 'Our painters are certified and passionate about their craft',
    guarantee: 'Full Guarantee',
    guaranteeDesc: 'Satisfaction guaranteed or we redo the work',
    
    // Services
    servicesTitle: 'Our Services',
    servicesDescription: 'Discover our complete range of painting services for all your projects.',
    interiorPainting: 'Interior Painting',
    exteriorPainting: 'Exterior Painting',
    decorativePainting: 'Decorative Painting',
    
    // Contact
    contactTitle: 'Contact Us',
    contactDescription: 'Ready to transform your space? Contact us for a personalized quote.',
    address: 'Address',
    phone: 'Phone',
    email: 'Email',
    yourName: 'Your name',
    yourEmail: 'Your email',
    yourPhone: 'Your phone',
    projectDetails: 'Project details',
    sendMessage: 'Send Message',
    
    // Footer
    followUs: 'Follow Us',
    quickLinks: 'Quick Links',
    allRightsReserved: 'All rights reserved'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};