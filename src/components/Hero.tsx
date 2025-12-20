import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImageJpg from "@/assets/hero-painting.jpg";
import heroImageWebp from "@/assets/hero-painting.webp";
import type { City } from "@/data/seo";
import { useNavigate } from "react-router-dom";

type HeroProps = {
  city: City;
  serviceLabel?: string; // optional for /:serviceSlug/:citySlug
  priority?: boolean;
};

const Hero: React.FC<HeroProps> = ({ city, serviceLabel, priority = false }) => {
  const navigate = useNavigate();

  const projects = 50;
  const clients = 48;
  const satisfaction = 96;

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const goToRealisations = useCallback(() => {
    navigate("/realisations");
  }, [navigate]);

  const title = serviceLabel
    ? `${serviceLabel} à ${city.name}`
    : `Entreprise de peinture et rénovation à ${city.name}`;

  const subtitle = serviceLabel
    ? `Interventions à ${city.name} (${city.postalCode}) et alentours. Devis gratuit.`
    : "Peinture intérieure, extérieure, enduit et plâtrerie.";

  return (
    <section
      id="home"
      className="relative min-h-[95vh] sm:min-h-[110vh] flex items-center justify-center overflow-hidden select-none px-4 sm:px-6"
      aria-label={`HN Rénovation - ${serviceLabel ? serviceLabel : "Peinture et rénovation"} à ${city.name} (${city.postalCode})`}
    >
      {/* Background (no motion) */}
      <div className="absolute inset-0 min-h-[95vh] sm:min-h-[110vh]">
        <picture>
          <source srcSet={heroImageWebp} type="image/webp" />
          <source srcSet={heroImageJpg} type="image/jpeg" />
          <img
            src={heroImageWebp}
            alt={`Travaux de peinture et rénovation à ${city.name} (${city.postalCode}).`}
            className="w-full h-full min-h-[95vh] sm:min-h-[110vh] object-cover object-center sm:object-top"
            width="1920"
            height="1080"
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            loading={priority ? "eager" : "lazy"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
          />
        </picture>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 min-h-[95vh] sm:min-h-[110vh]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-heading font-bold mb-4 leading-tight drop-shadow-2xl">
          {title} ({city.postalCode})
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal text-white/90 leading-relaxed max-w-xl mx-auto mb-8">
          {subtitle}
        </p>

        <div className="flex justify-center items-center mb-6">
          <p className="text-accent font-semibold text-base sm:text-lg bg-white/90 px-4 py-1 rounded shadow-sm">
            Protégé par l&apos;assurance décennale
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-accent mb-1 drop-shadow">
              {projects}
              <span aria-hidden="true">+</span>
            </div>
            <div className="text-xs sm:text-sm text-white/80">Projets Réalisés</div>
          </div>

          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-accent mb-1 drop-shadow">
              {clients}
              <span aria-hidden="true">+</span>
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

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 sm:px-8 py-3 shadow-xl hover:scale-105 transition-transform duration-200 w-full sm:w-auto"
            onClick={goToRealisations}
          >
            Voir Nos Réalisations
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-white/40 text-black hover:bg-white/10 font-semibold px-6 sm:px-8 py-3 shadow hover:scale-105 transition-transform duration-200 w-full sm:w-auto"
            onClick={() => scrollToSection("contact")}
          >
            Devis Gratuit
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
