import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Building,
  Palette,
  Brush,
  Clock,
  Shield,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

// Animated Paint Splash SVG
const PaintSplash = ({ color, className = "" }) => (
  <motion.svg
    width="50"
    height="50"
    viewBox="0 0 100 100"
    fill="none"
    className={`absolute -top-6 -right-6 opacity-40 z-0 pointer-events-none ${className}`}
    initial={{ scale: 0.8, rotate: 0, opacity: 0.25 }}
    animate={{ scale: [0.8, 1.05, 0.95, 1], rotate: [0, 15, -10, 0], opacity: [0.3, 0.5, 0.25, 0.4] }}
    transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: Math.random() }}
  >
    <path d="M31 17C37 7 61 8 67 17C73 27 95 33 86 47C77 61 62 70 50 68C38 66 18 60 14 47C10 34 25 27 31 17Z" fill={color} />
  </motion.svg>
);

const services = [
  {
    icon: Brush,
    title: "Enduit Professionnel",
    description: "Préparation parfaite des surfaces avec des enduits de haute qualité",
    features: ["Application de bandes calicot et bandes armées", "Ratissage précis pour une surface uniforme", "Rattrapage des irrégularités et finitions parfaites"],
    splash: "#10b981",
    popular: true
  },
  {
    icon: Home,
    title: "Peinture Intérieure",
    description: "Revitalisez vos espaces intérieurs avec des finitions soignées et durables",
    features: ["Préparation des surfaces", "Application de peintures écologiques", "Finitions personnalisées"],
    splash: "#fbbf24",
    popular: false
  },
  {
    icon: Building,
    title: "Peinture Extérieure",
    description: "Protégez et embellissez vos façades avec des revêtements résistants aux intempéries",
    features: ["Nettoyage haute pression", "Traitement anti-mousse longue durée", "Réparation des fissures et remise en état des façades"],
    splash: "#3b82f6",
    popular: false
  },
  {
    icon: Palette,
    title: "Plâtrerie et Finition",
    description: "Solutions complètes pour plâtrerie et aménagements décoratifs",
    features: ["Plâtrerie traditionnelle et placo décoratif", "Pose de parquet professionnel", "Finition esthétique sur mesure"],
    splash: "#a21caf",
    popular: false
  }
];

const advantages = [
  { icon: Clock, text: "Intervention rapide" },
  { icon: Shield, text: "Garantie satisfaction" },
  { icon: CheckCircle, text: "Devis gratuit" },
];

const cardVariants = {
  offscreen: { opacity: 0, y: 40 },
  onscreen: { opacity: 1, y: 0 }
};

const Services = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-secondary/40 via-white/60 to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-4 py-2 mb-6">
              <Brush className="h-5 w-5 text-accent" />
              <span className="text-accent font-medium">Nos Services</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Services
              <span className="block text-accent">Professionnels</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Découvrez nos services experts en peinture, enduit et plâtrerie pour transformer vos espaces résidentiels et commerciaux.
            </p>
          </div>
          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 relative">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  className="relative h-full"
                  initial="offscreen"
                  whileInView="onscreen"
                  viewport={{ once: true, amount: 0.22 }}
                  variants={cardVariants}
                  custom={index}
                >
                  <Card
                    className={`relative hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-border/50 overflow-visible h-full w-full flex flex-col ${service.popular ? 'bg-gradient-to-b from-accent/10 to-white border-accent/70 shadow-lg' : 'border-border/50'}`}
                  >
                    {service.popular && (
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
                        className="z-20"
                      >
                        <Badge
                          className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground shadow-md animate-bounce text-sm px-3 py-1"
                        >
                          Populaire
                        </Badge>
                      </motion.div>
                    )}
                    {/* Animated Paint Splash */}
                    <PaintSplash color={service.splash} className={service.popular ? 'opacity-60 scale-110' : ''} />
                    <CardHeader className="text-center pb-4 relative z-10">
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: [0, 12, -12, 0] }}
                        transition={{ duration: 0.45 }}
                        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow ${service.popular ? 'bg-accent/30' : 'bg-accent/20'}`}
                      >
                        <IconComponent className={`h-8 w-8 ${service.popular ? 'text-accent-foreground' : 'text-accent'}`} />
                      </motion.div>
                      <CardTitle className="text-xl font-heading text-primary">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 relative z-10 flex flex-col flex-grow">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {service.description}
                      </p>
                      <div className="space-y-2 flex-grow">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className={`h-4 w-4 ${service.popular ? 'text-accent-foreground' : 'text-accent'}`} />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-border/60 mt-auto">
                        <Button
                          className="w-full group relative overflow-hidden"
                          variant={service.popular ? "default" : "outline"}
                          onClick={() => scrollToSection('contact')}
                        >
                          <span className="relative z-10">Demander un Devis</span>
                          <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
                          {/* Button Paint Effect */}
                          <motion.span
                            className="absolute inset-0 bg-accent/10 group-hover:bg-accent/20 rounded transition-all duration-300 z-0"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          <div className="bg-card/70 border border-border/60 rounded-2xl p-8 text-center shadow-soft">
            <h3 className="text-2xl font-heading font-semibold mb-4 text-primary">
              Une approche complète pour vos travaux
            </h3>
            <p className="text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Nous analysons chaque support avant intervention, réalisons les préparations nécessaires
              (rebouchage, ponçage, sous-couches adaptées), sécurisons les zones de passage et livrons
              des peintures faciles d&apos;entretien. Que votre chantier soit situé à Cambrai, Valenciennes,
              Arras ou dans un village voisin, nous déplaçons notre équipe avec tout le matériel nécessaire
              et un interlocuteur unique jusqu&apos;à la réception.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
