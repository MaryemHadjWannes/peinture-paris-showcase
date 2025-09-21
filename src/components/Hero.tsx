import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Paintbrush, Award, Users, Palette, Brush, Droplets } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import heroBackground from '@/assets/hero-background.jpg';

const Hero = () => {
  const { t } = useLanguage();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Animation variants for floating elements
  const floatingVariants = {
    float: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const paintDropVariants = {
    drop: {
      y: [0, 10, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const brushStrokeVariants = {
    draw: {
      pathLength: [0, 1],
      opacity: [0, 1, 0.7],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img 
          src={heroBackground} 
          alt="Professional painting workspace" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/70"></div>
        
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Original geometric shapes with enhanced animations */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-accent/20 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-primary/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 0.8, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div 
            className="absolute top-1/2 right-1/3 w-24 h-24 bg-accent/30 rounded-full blur-xl"
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />

          {/* Paint Splash Animations */}
          <motion.div 
            className="absolute top-1/6 right-1/6 w-16 h-16 bg-gradient-to-br from-yellow-400/40 to-orange-500/40 rounded-full blur-sm"
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeOut",
              delay: 2
            }}
          />
          
          <motion.div 
            className="absolute bottom-1/6 left-1/6 w-20 h-20 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full blur-sm"
            animate={{
              scale: [0, 1.2, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeOut",
              delay: 3.5
            }}
          />

          {/* Paint Stroke SVG Animations */}
          <motion.svg
            className="absolute top-1/3 left-1/6 w-32 h-8 opacity-30"
            viewBox="0 0 100 20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          >
            <motion.path
              d="M10,10 Q30,5 50,10 T90,10"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-accent"
              variants={brushStrokeVariants}
              animate="draw"
            />
          </motion.svg>

          <motion.svg
            className="absolute bottom-1/4 right-1/8 w-24 h-6 opacity-25"
            viewBox="0 0 80 15"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 2.5 }}
          >
            <motion.path
              d="M5,8 Q20,3 40,8 T75,8"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-yellow-300"
              variants={brushStrokeVariants}
              animate="draw"
            />
          </motion.svg>
        </div>

        {/* Floating Painting Tools */}
        <div className="absolute inset-0">
          {/* Floating Brush */}
          <motion.div
            className="absolute top-1/5 left-1/12 text-accent/30"
            variants={floatingVariants}
            animate="float"
            style={{ rotate: 45 }}
          >
            <Brush className="w-8 h-8" />
          </motion.div>

          {/* Floating Palette */}
          <motion.div
            className="absolute top-2/3 right-1/12 text-yellow-300/40"
            variants={floatingVariants}
            animate="float"
            transition={{ delay: 1, duration: 5 }}
          >
            <Palette className="w-10 h-10" />
          </motion.div>

          {/* Floating Paint Drops */}
          <motion.div
            className="absolute top-1/2 left-1/8 text-orange-400/50"
            variants={paintDropVariants}
            animate="drop"
            transition={{ delay: 0.5 }}
          >
            <Droplets className="w-6 h-6" />
          </motion.div>

          <motion.div
            className="absolute bottom-1/4 left-1/3 text-blue-400/40"
            variants={paintDropVariants}
            animate="drop"
            transition={{ delay: 2, duration: 3 }}
          >
            <Droplets className="w-5 h-5" />
          </motion.div>

          <motion.div
            className="absolute top-1/4 right-1/4 text-green-400/35"
            variants={paintDropVariants}
            animate="drop"
            transition={{ delay: 1.5, duration: 2.5 }}
          >
            <Droplets className="w-4 h-4" />
          </motion.div>

          {/* Additional Floating Tools */}
          <motion.div
            className="absolute bottom-1/6 right-1/6 text-red-400/30"
            variants={floatingVariants}
            animate="float"
            transition={{ delay: 2.5, duration: 4.5 }}
            style={{ rotate: -30 }}
          >
            <Paintbrush className="w-7 h-7" />
          </motion.div>

          <motion.div
            className="absolute top-3/4 left-1/5 text-purple-400/25"
            variants={paintDropVariants}
            animate="drop"
            transition={{ delay: 3, duration: 2.8 }}
          >
            <Droplets className="w-3 h-3" />
          </motion.div>
        </div>

        {/* Paint Particle System */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Animated paint particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${
                i % 4 === 0 ? 'bg-accent/30' : 
                i % 4 === 1 ? 'bg-yellow-400/25' : 
                i % 4 === 2 ? 'bg-orange-500/20' : 
                'bg-blue-400/20'
              }`}
              style={{
                left: `${10 + (i * 7)}%`,
                top: `${20 + (i * 5)}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.sin(i) * 50, 0],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 8 + (i * 0.5),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Paint Palette Color Picker Visual */}
        <motion.div
          className="absolute bottom-10 left-10 opacity-20"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ 
            scale: [0.8, 1, 0.8],
            rotate: [-45, -35, -45]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        >
          <div className="relative w-16 h-12 bg-gray-800/30 rounded-lg backdrop-blur-sm border border-white/10">
            {/* Color spots on the palette */}
            <div className="absolute top-2 left-2 w-2 h-2 bg-red-400 rounded-full"></div>
            <div className="absolute top-2 left-6 w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="absolute top-2 left-10 w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="absolute bottom-2 left-6 w-2 h-2 bg-purple-400 rounded-full"></div>
            <div className="absolute bottom-2 left-10 w-2 h-2 bg-orange-400 rounded-full"></div>
            {/* Paint brush on palette */}
            <motion.div
              className="absolute -top-1 -right-2 text-amber-600/60"
              animate={{ rotate: [0, 10, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Paintbrush className="w-4 h-4" />
            </motion.div>
          </div>
        </motion.div>

        {/* Paint Drip Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Paint drips from top */}
          <motion.div
            className="absolute top-0 left-1/4 w-0.5 h-20 bg-gradient-to-b from-accent/40 to-transparent"
            animate={{
              scaleY: [0, 1, 0],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeOut",
              delay: 4
            }}
          />
          <motion.div
            className="absolute top-0 right-1/3 w-0.5 h-16 bg-gradient-to-b from-yellow-400/30 to-transparent"
            animate={{
              scaleY: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 7
            }}
          />
          <motion.div
            className="absolute top-0 left-2/3 w-0.5 h-12 bg-gradient-to-b from-blue-400/25 to-transparent"
            animate={{
              scaleY: [0, 1, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 9
            }}
          />
        </div>
      </div>
      
      {/* Content */}
      <motion.div 
        className="relative z-10 text-center text-white px-4 sm:px-6 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div 
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div 
            className="inline-flex items-center space-x-2 bg-accent/20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 border border-accent/30"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "hsl(43 74% 66% / 0.3)",
              borderColor: "hsl(43 74% 66% / 0.5)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Paintbrush className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
            </motion.div>
            <span className="text-accent font-medium text-sm sm:text-base">{t('experts')}</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 sm:mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {t('transform')}
            <motion.span 
              className="block bg-gradient-to-r from-accent via-yellow-300 to-accent bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              {t('spaces')}
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {t('heroDescription')}
          </motion.p>
        </motion.div>
        
        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-14 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div 
            className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover-lift"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "hsl(0 0% 100% / 0.15)",
              borderColor: "hsl(43 74% 66% / 0.4)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              500+
            </motion.div>
            <div className="text-sm sm:text-base text-white/90 font-medium">{t('projectsCompleted')}</div>
          </motion.div>
          <motion.div 
            className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover-lift"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "hsl(0 0% 100% / 0.15)",
              borderColor: "hsl(43 74% 66% / 0.4)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            >
              15
            </motion.div>
            <div className="text-sm sm:text-base text-white/90 font-medium">{t('yearsExperience')}</div>
          </motion.div>
          <motion.div 
            className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover-lift"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "hsl(0 0% 100% / 0.15)",
              borderColor: "hsl(43 74% 66% / 0.4)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            >
              98%
            </motion.div>
            <div className="text-sm sm:text-base text-white/90 font-medium">{t('satisfaction')}</div>
          </motion.div>
        </motion.div>
        
        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 text-lg hover-lift shadow-large border-2 border-accent hover:border-accent/80 transition-all duration-300 relative overflow-hidden group"
              onClick={() => scrollToSection('portfolio')}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">{t('viewWork')}</span>
              <motion.div
                className="relative z-10"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.div>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto border-2 border-white/50 text-white hover:bg-white/20 hover:border-white font-semibold px-8 py-4 text-lg hover-lift backdrop-blur-sm transition-all duration-300 relative overflow-hidden group"
              onClick={() => scrollToSection('contact')}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">{t('freeQuote')}</span>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;