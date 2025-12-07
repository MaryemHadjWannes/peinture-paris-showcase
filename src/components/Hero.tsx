// src/components/Hero.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Paintbrush } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImageJpg from '@/assets/hero-painting.jpg';
import heroImageWebp from '@/assets/hero-painting.webp';

const Hero = () => {
  // Static values for stats
  const projects = 50;
  const clients = 48;
  const satisfaction = 96;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-[95vh] sm:min-h-[110vh] flex items-center justify-center overflow-hidden select-none px-4 sm:px-6"
    >
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 min-h-[95vh] sm:min-h-[110vh]"
        initial={{ scale: 1.08, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        <picture>
          <source srcSet={heroImageWebp} type="image/webp" />
          <source srcSet={heroImageJpg} type="image/jpeg" />
          <img
            // ✅ WebP by default, no lazy loading
            src={heroImageWebp}
            srcSet={`${heroImageWebp} 1x, ${heroImageJpg} 2x`}
            alt="Peintre professionnel réalisant des travaux de peinture intérieure et extérieure."
            className="w-full h-full min-h-[95vh] sm:min-h-[110vh] object-cover object-center sm:object-top"
            width="1920"
            height="1080"
          />
        </picture>
        {/* Glassy gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 min-h-[95vh] sm:min-h-[110vh]" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        {/* Heading */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight drop-shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7, type: 'spring' }}
        >
          Transformez Vos
          <span className="block bg-gradient-to-r from-accent via-yellow-400 to-accent bg-clip-text text-transparent animate-gradient">
            Espaces
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Peinture intérieure, extérieure, enduit et plâtrerie en France.
          <br />
          Qualité exceptionnelle et service dédié pour vos projets.
        </motion.p>

        {/* Assurance Décennale */}
        <div className="flex justify-center items-center mb-6">
          <span className="text-accent font-semibold text-base sm:text-lg bg-white/90 px-4 py-1 rounded shadow-sm">
            Protégé par l&apos;assurance décennale
          </span>
        </div>

        {/* Static Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-accent mb-1 drop-shadow">
              {projects}
              <span aria-hidden="true">{'\u002B'}</span>
            </div>
            <div className="text-xs sm:text-sm text-white/80">Projets Réalisés</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-accent mb-1 drop-shadow">
              <span suppressHydrationWarning>
                {clients}
                <span aria-hidden="true">+</span>
              </span>
            </div>
            <div className="text-xs sm:text-sm text-white/80">Clients Satisfaits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-accent mb-1 drop-shadow">
              {satisfaction}%
            </div>
            <div className="text-xs sm:text-sm text-white/80">Satisfaction</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 sm:px-8 py-3 shadow-xl hover:scale-105 transition-transform duration-200 w-full sm:w-auto"
            onClick={() => scrollToSection('portfolio')}
          >
            Voir Nos Réalisations
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white/40 text-black hover:bg-white/10 font-semibold px-6 sm:px-8 py-3 shadow hover:scale-105 transition-transform duration-200 w-full sm:w-auto"
            onClick={() => scrollToSection('contact')}
          >
            Devis Gratuit
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
