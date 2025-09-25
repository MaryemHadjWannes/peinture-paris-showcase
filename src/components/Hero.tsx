import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Paintbrush } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-painting.jpg';

// Animated Counter Hook for Stats
function useCountUp(to: number, duration = 1.2) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / (duration * 60));
    const id = setInterval(() => {
      start += step;
      if (start >= to) {
        setCount(to);
        clearInterval(id);
      } else {
        setCount(start);
      }
    }, 1000 / 60);
    return () => clearInterval(id);
  }, [to, duration]);
  return count;
}

const Hero = () => {
  const projects = useCountUp(50, 1.5); // Reduced for a new company
  const clients = useCountUp(30, 1.8); // Replaced years with client count
  const satisfaction = useCountUp(95, 2); // Slightly lower but still high

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden select-none pt-20 md:pt-24">
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        <img
          src={heroImage}
          alt="Travaux de peinture professionnels"
          className="w-full h-full object-cover object-center"
        />
        {/* Glassy gradient overlay */}
        <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm" />
      </motion.div>
      {/* Main Content */}
      <div className="relative z-10 px-4 max-w-4xl mx-auto text-center text-white">
        {/* Heading */}
        <motion.h1
          className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight drop-shadow-2xl"
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
          className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Peinture intérieure, extérieure, enduit et plâtrerie en France.<br />
          Qualité exceptionnelle et service dédié pour vos projets.
        </motion.p>
        {/* Animated Stats */}
        <motion.div
          className="grid grid-cols-3 gap-8 mb-12 max-w-md mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.23 } }
          }}
        >
          <motion.div
            className="text-center"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div className="text-3xl md:text-4xl font-heading font-bold text-accent mb-1 drop-shadow">{projects}+</div>
            <div className="text-sm text-white/80">Projets Réalisés</div>
          </motion.div>
          <motion.div
            className="text-center"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div className="text-3xl md:text-4xl font-heading font-bold text-accent mb-1 drop-shadow">{clients}+</div>
            <div className="text-sm text-white/80">Clients Satisfaits</div>
          </motion.div>
          <motion.div
            className="text-center"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div className="text-3xl md:text-4xl font-heading font-bold text-accent mb-1 drop-shadow">{satisfaction}%</div>
            <div className="text-sm text-white/80">Satisfaction</div>
          </motion.div>
        </motion.div>
        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-3 shadow-xl hover:scale-105 transition-transform duration-200"
            onClick={() => scrollToSection('portfolio')}
          >
            Voir Nos Réalisations
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white/40 text-black/90 hover:bg-white/10 font-semibold px-8 py-3 shadow hover:scale-105 transition-transform duration-200"
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