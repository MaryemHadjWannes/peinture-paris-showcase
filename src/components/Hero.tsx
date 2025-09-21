import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Paintbrush, Award, Users } from 'lucide-react';
import heroImage from '@/assets/hero-painting.jpg';

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Travaux de peinture professionnels" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 bg-accent/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Paintbrush className="h-5 w-5 text-accent" />
            <span className="text-accent font-medium">Experts en Peinture</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
            Transformez Vos
            <span className="block bg-gradient-accent bg-clip-text text-transparent">
              Espaces
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Peinture professionnelle d'intérieur et d'extérieur en France. 
            Qualité, créativité et finition impeccable garanties.
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mb-10 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-accent mb-1">500+</div>
            <div className="text-sm text-white/80">Projets Réalisés</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-accent mb-1">15</div>
            <div className="text-sm text-white/80">Ans d'Expérience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-accent mb-1">98%</div>
            <div className="text-sm text-white/80">Satisfaction</div>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-3 hover-lift"
            onClick={() => scrollToSection('portfolio')}
          >
            Voir Nos Réalisations
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 hover-lift"
            onClick={() => scrollToSection('contact')}
          >
            Devis Gratuit
          </Button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;