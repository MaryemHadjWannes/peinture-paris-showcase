import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Building, Palette, Brush, Clock, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import type { City } from "@/data/seo";
import { useIntersectionAnimation } from "@/hooks/useIntersectionAnimation";
import { scrollToSection } from "@/lib/scroll";

type ServicesProps = {
  city: City;
  serviceFocus?: string; // slug, optional (e.g. "enduit")
};

const baseServices = [
  {
    slug: "enduit",
    icon: Brush,
    title: "Enduit Professionnel",
    description: "Préparation parfaite des surfaces avec des enduits de haute qualité",
    features: [
      "Application de bandes calicot et bandes armées",
      "Ratissage précis pour une surface uniforme",
      "Rattrapage des irrégularités et finitions parfaites",
    ],
    popular: true,
  },
  {
    slug: "peinture-interieure",
    icon: Home,
    title: "Peinture Intérieure",
    description: "Revitalisez vos espaces intérieurs avec des finitions soignées et durables",
    features: ["Préparation des surfaces", "Application de peintures écologiques", "Finitions personnalisées"],
    popular: false,
  },
  {
    slug: "peinture-exterieure",
    icon: Building,
    title: "Peinture Extérieure",
    description: "Protégez et embellissez vos façades avec des revêtements résistants aux intempéries",
    features: ["Nettoyage haute pression", "Traitement anti-mousse longue durée", "Réparation des fissures et remise en état"],
    popular: false,
  },
  {
    slug: "platrerie",
    icon: Palette,
    title: "Plâtrerie et Finition",
    description: "Solutions complètes pour plâtrerie et aménagements décoratifs",
    features: ["Plâtrerie traditionnelle et placo décoratif", "Pose de parquet professionnel", "Finition esthétique sur mesure"],
    popular: false,
  },
];

// Service card component with animation
const ServiceCard: React.FC<{ service: (typeof baseServices)[number]; city: City; index: number; onScrollToSection: (id: string) => void }> = ({ service, city, index, onScrollToSection }) => {
  const { ref, isVisible } = useIntersectionAnimation();
  const IconComponent = service.icon;
  
  return (
    <div
      ref={ref}
      className={`relative h-full ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Card
        className={`relative hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-border/50 overflow-visible h-full w-full flex flex-col ${
          service.popular ? "bg-gradient-to-b from-accent/10 to-white border-accent/70 shadow-lg" : "border-border/50"
        }`}
      >
        {service.popular && (
          <div className="z-20">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground shadow-md text-sm px-3 py-1">
              Populaire
            </Badge>
          </div>
        )}

        <CardHeader className="text-center pb-4 relative z-10">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow ${
              service.popular ? "bg-accent/30" : "bg-accent/20"
            }`}
          >
            <IconComponent className={`h-8 w-8 ${service.popular ? "text-accent-foreground" : "text-accent-strong"}`} />
          </div>

          <CardTitle className="text-xl font-heading text-primary">
            {service.title} à {city.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10 flex flex-col flex-grow">
          <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>

          <div className="space-y-2 flex-grow">
            {service.features.map((feature: string, featureIndex: number) => (
              <div key={featureIndex} className="flex items-center space-x-2 text-sm">
                <CheckCircle className={`h-4 w-4 ${service.popular ? "text-accent-foreground" : "text-accent-strong"}`} />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border/60 mt-auto space-y-3">
            <Button className="w-full" variant="outline" asChild>
              <Link
                to={`/${service.slug}/${city.slug}`}
                title={`Voir la page ${service.title} à ${city.name}`}
              >
                Voir la page
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              className="w-full group relative overflow-hidden hover:bg-accent/20"
              variant={service.popular ? "default" : "outline"}
              onClick={() => onScrollToSection("contact")}
            >
              <span className="relative z-10">Demander un Devis</span>
              <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Services: React.FC<ServicesProps> = ({ city, serviceFocus }) => {
  const services = React.useMemo(() => {
    if (!serviceFocus) return baseServices;
    const focused = baseServices.find((s) => s.slug === serviceFocus);
    const others = baseServices.filter((s) => s.slug !== serviceFocus);
    return focused ? [focused, ...others] : baseServices;
  }, [serviceFocus]);

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-secondary/40 via-white/60 to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-4 py-2 mb-6">
              <Brush className="h-5 w-5 text-accent-strong" />
              <span className="text-accent-strong font-medium">Nos Services</span>
            </div>
            <h2 className="section-title mb-6">
              Services de peinture à {city.name}
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Peinture, enduit et plâtrerie à {city.name} ({city.postalCode}) pour particuliers et professionnels.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 relative">
            {services.map((service, index) => (
              <ServiceCard
                key={service.slug}
                service={service}
                city={city}
                index={index}
                onScrollToSection={scrollToSection}
              />
            ))}
          </div>

          <div className="flex justify-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent-strong" /> Intervention rapide
            </span>
            <span className="inline-flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent-strong" /> Garantie satisfaction
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-accent-strong" /> Devis gratuit
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
