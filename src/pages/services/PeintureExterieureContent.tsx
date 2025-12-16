// src/pages/services/PeintureExterieureContent.tsx
import React from "react";
import type { CitySeo } from "@/pages/services/ServiceLayout";
import SeoPhrasesAccordion from "@/components/SeoPhrasesAccordion";

export default function PeintureExterieureContent({ city }: { city: CitySeo }) {
  return (
    <>
      <section className="container mx-auto px-4 py-10 max-w-5xl">
        <h1 className="text-3xl md:text-5xl font-heading font-bold">
          Peinture extérieure à {city.name} – Entreprise de peinture dans le {city.department}
        </h1>

        <p className="mt-5 text-muted-foreground leading-relaxed">
          HN Rénovation est une entreprise de peinture extérieure à {city.name}, intervenant dans tout le{" "}
          {city.department} pour la protection et la rénovation des murs extérieurs. La peinture extérieure est
          essentielle pour préserver votre habitation des intempéries, de l’humidité et du vieillissement.
        </p>

        <p className="mt-4 text-muted-foreground leading-relaxed">
          Avant toute mise en peinture, nous assurons une préparation rigoureuse : nettoyage, traitement si nécessaire,
          correction des défauts, et application de solutions adaptées aux supports. Nous utilisons des peintures
          professionnelles résistantes aux UV, au gel et à l’humidité, pour un rendu durable.
        </p>

        <h2 className="mt-10 text-2xl font-heading font-semibold">
          Travaux de peinture extérieure à {city.name} ({city.department})
        </h2>

        <h3 className="mt-6 text-xl font-heading font-semibold">
          Peinture extérieure façade maison à {city.name}
        </h3>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Peinture façade maison, murs extérieurs, protection durable, rendu esthétique, entretien et rénovation des
          surfaces extérieures.
        </p>

        <h3 className="mt-6 text-xl font-heading font-semibold">
          Peinture extérieure bâtiment et locaux professionnels à {city.name}
        </h3>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Prestations adaptées aux bâtiments, commerces et locaux professionnels : préparation des supports, choix de
          produits, finitions et protection long terme.
        </p>

        <h3 className="mt-6 text-xl font-heading font-semibold">
          Peintures extérieures résistantes aux intempéries dans le {city.department}
        </h3>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Peintures extérieures anti-humidité, résistance UV, tenue dans le temps, protection contre les agressions
          climatiques.
        </p>

        <h2 className="mt-10 text-2xl font-heading font-semibold">
          Devis gratuit peinture extérieure à {city.name}
        </h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Devis gratuit, conseils personnalisés, accompagnement sur mesure et respect des délais.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a href="/realisations" className="inline-block underline hover:text-accent">
            Nos réalisations peinture extérieure
          </a>
          <a href="/#contact" className="inline-block underline hover:text-accent">
            Demander un devis gratuit
          </a>
        </div>

        <h2 className="mt-10 text-2xl font-heading font-semibold">
          Contact entreprise de peinture extérieure à {city.name} ({city.department})
        </h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Téléphone, email et intervention locale à {city.name} et alentours.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <SeoPhrasesAccordion
          title={`Recherches fréquentes – Peinture extérieure (${city.name} / ${city.department})`}
          groups={[
            {
              id: "pe-1",
              label: `Peinture extérieure (${city.name} / ${city.department})`,
              phrases: [
                `peinture extérieure ${city.name.toLowerCase()}`,
                `peintre extérieur ${city.name.toLowerCase()}`,
                `entreprise peinture extérieure ${city.name.toLowerCase()}`,
                `peinture façade maison ${city.name.toLowerCase()}`,
                `peinture murs extérieurs ${city.name.toLowerCase()}`,
                `peinture extérieure ${city.department.toLowerCase()}`,
              ],
            },
            {
              id: "pe-2",
              label: "Façade / protection / résistance",
              phrases: [
                "peinture anti-humidité façade",
                "peinture façade résistance uv",
                `protection façade ${city.name.toLowerCase()}`,
                `rénovation peinture extérieure ${city.name.toLowerCase()}`,
              ],
            },
            {
              id: "pe-3",
              label: "Devis et intervention",
              phrases: [
                `devis peinture extérieure ${city.name.toLowerCase()}`,
                `prix peinture façade ${city.name.toLowerCase()}`,
                `artisan peintre extérieur ${city.name.toLowerCase()} devis gratuit`,
                `intervention rapide façade ${city.department.toLowerCase()}`,
              ],
            },
          ]}
        />
      </section>
    </>
  );
}
