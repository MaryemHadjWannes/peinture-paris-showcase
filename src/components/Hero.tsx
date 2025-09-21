import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Paintbrush, Award, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import heroBackground from '@/assets/hero-background.jpg';

const Hero = () => {
  const { t } = useLanguage();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img 
          src={heroBackground} 
          alt="Professional painting workspace" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/70"></div>
        
        {/* Animated geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-primary/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-accent/30 rounded-full blur-xl animate-bounce delay-500"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 bg-accent/20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 border border-accent/30">
            <Paintbrush className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
            <span className="text-accent font-medium text-sm sm:text-base">{t('experts')}</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 sm:mb-8 leading-tight">
            {t('transform')}
            <span className="block bg-gradient-to-r from-accent via-yellow-300 to-accent bg-clip-text text-transparent animate-pulse">
              {t('spaces')}
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-14 max-w-2xl mx-auto">
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover-lift">
            <div className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-2">500+</div>
            <div className="text-sm sm:text-base text-white/90 font-medium">{t('projectsCompleted')}</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover-lift">
            <div className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-2">15</div>
            <div className="text-sm sm:text-base text-white/90 font-medium">{t('yearsExperience')}</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover-lift">
            <div className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-2">98%</div>
            <div className="text-sm sm:text-base text-white/90 font-medium">{t('satisfaction')}</div>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 text-lg hover-lift shadow-large border-2 border-accent hover:border-accent/80 transition-all duration-300"
            onClick={() => scrollToSection('portfolio')}
          >
            {t('viewWork')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="w-full sm:w-auto border-2 border-white/50 text-white hover:bg-white/20 hover:border-white font-semibold px-8 py-4 text-lg hover-lift backdrop-blur-sm transition-all duration-300"
            onClick={() => scrollToSection('contact')}
          >
            {t('freeQuote')}
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