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
import { useLanguage } from '@/contexts/LanguageContext';

const Services = () => {
  const { t } = useLanguage();
  
  const services = [
    {
      icon: Home,
      title: t('interiorPainting'),
      description: "Transformation complète de vos espaces intérieurs avec des finitions impeccables",
      features: ["Préparation des surfaces", "Peintures écologiques", "Finitions décoratives"],
      price: "À partir de 25€/m²",
      popular: false
    },
    {
      icon: Building,
      title: t('exteriorPainting'),
      description: "Protection et embellissement de vos façades avec des produits résistants",
      features: ["Nettoyage haute pression", "Traitement anti-mousse", "Garantie 10 ans"],
      price: "À partir de 35€/m²",
      popular: true
    },
    {
      icon: Palette,
      title: t('decorativePainting'),
      description: "Créations artistiques personnalisées pour des espaces uniques",
      features: ["Trompe-l'œil", "Fresques murales", "Effets de matière"],
      price: "Sur devis",
      popular: false
    },
    {
      icon: Brush,
      title: "Rénovation Complète",
      description: "Service complet de A à Z pour vos projets de rénovation",
      features: ["Diagnostic gratuit", "Coordination artisans", "Suivi personnalisé"],
      price: "Forfait projet",
      popular: false
    }
  ];

  const advantages = [
    { icon: Clock, text: "Intervention rapide" },
    { icon: Shield, text: "Garantie satisfaction" },
    { icon: CheckCircle, text: "Devis gratuit" },
  ];

  return (
    <section id="services" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-4 py-2 mb-6">
              <Brush className="h-5 w-5 text-accent" />
              <span className="text-accent font-medium">Nos Services</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              {t('servicesTitle')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('servicesDescription')}
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={index} 
                  className={`relative hover-lift border-border/50 ${
                    service.popular ? 'border-accent border-2' : ''
                  }`}
                >
                  {service.popular && (
                    <Badge 
                      className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground"
                    >
                      Populaire
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-accent" />
                    </div>
                    <CardTitle className="text-xl font-heading text-primary">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-accent" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <div className="text-lg font-heading font-semibold text-accent mb-3">
                        {service.price}
                      </div>
                      <Button 
                        className="w-full" 
                        variant={service.popular ? "default" : "outline"}
                      >
                        Demander un Devis
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Advantages */}
          <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-heading font-semibold text-primary mb-4">
                Pourquoi Nous Choisir ?
              </h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {advantages.map((advantage, index) => {
                const IconComponent = advantage.icon;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-accent" />
                    </div>
                    <span className="font-medium">{advantage.text}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center mt-8">
              <Button size="lg" className="hover-lift">
                Obtenir un Devis Gratuit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;