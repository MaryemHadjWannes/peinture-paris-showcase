import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Compass } from "lucide-react";
import { locationProfiles } from "@/data/locationProfiles";

const AreasServed = () => {
  return (
    <section id="zones-desservies" className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-4 py-2 mb-4">
            <MapPin className="h-5 w-5 text-accent" />
            <span className="text-accent font-medium text-sm sm:text-base">
              Zones desservies
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Peintre professionnel à Cambrai et dans tout le Nord
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Basés au 103 rue Saint Ladre à Cambrai, nous accompagnons les
            particuliers et professionnels dans un rayon de 70&nbsp;km. Que
            vous cherchiez une peinture intérieure complète, la rénovation d’une
            façade à Valenciennes ou un rafraîchissement d’appartement à Arras,
            nous garantissons le même niveau d’exigence, de conseil couleur et
            de suivi de chantier.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card rounded-2xl shadow-soft border border-border/40 p-6">
            <h3 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
              <Compass className="h-5 w-5 text-accent" />
              Villes les plus demandées
            </h3>
            <p className="text-muted-foreground mb-4">
              Nous réalisons chaque mois des projets de peinture décorative,
              d’enduit et de plâtrerie dans les communes suivantes :
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
              {locationProfiles.map((city) => (
                <li key={city.id} className="pl-3 relative">
                  <span className="absolute left-0 top-1 h-1.5 w-1.5 rounded-full bg-accent" />
                  <Link
                    to={`/peinture/${city.id}`}
                    className="hover:text-primary underline underline-offset-2"
                  >
                    {city.name} &bull; {city.postalCodes[0]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card rounded-2xl shadow-soft border border-border/40 p-6">
            <h3 className="text-xl font-semibold text-primary mb-3">
              Pourquoi les clients nous choisissent ?
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nous intervenons rapidement pour établir un devis peinture
              gratuit, proposons des matériaux adaptés à chaque pièce (cuisine,
              salle de bain, façades) et accompagnons nos clients sur la durée
              avec une garantie décennale. Nos équipes mobiles se déplacent avec
              tout l’équipement nécessaire pour limiter le dérangement et
              livrer un résultat propre et durable.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Besoin d’un peintre à Cambrai, Valenciennes, Douai ou dans les
              villages avoisinants ? Contactez-nous pour programmer une visite
              technique et recevoir votre proposition détaillée sous 24&nbsp;h.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AreasServed;
