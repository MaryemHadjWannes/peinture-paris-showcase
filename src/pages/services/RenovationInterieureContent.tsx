// src/pages/services/RenovationInterieureContent.tsx
import React from "react";
import type { CitySeo } from "@/pages/services/ServiceLayout";
import SeoPhrasesAccordion from "@/components/SeoPhrasesAccordion";

export default function RenovationInterieureContent({ city }: { city: CitySeo }) {
  const cityLower = city.name.toLowerCase();
  const deptLower = city.department.toLowerCase();

  return (
    <>
      <section className="container mx-auto px-4 py-10 max-w-5xl">
        <h1 className="text-3xl md:text-5xl font-heading font-bold">
          Rénovation intérieure à {city.name} – Maison et appartement dans le {city.department}
        </h1>

        <p className="mt-5 text-muted-foreground leading-relaxed">
          HN Rénovation est une entreprise spécialisée en rénovation intérieure à {city.name}, intervenant pour la rénovation
          de maisons et d’appartements dans tout le {city.department}. Nous accompagnons nos clients sur des rénovations
          complètes ou partielles, avec un haut niveau d’exigence sur les finitions.
        </p>

        <p className="mt-4 text-muted-foreground leading-relaxed">
          Nos travaux incluent la rénovation peinture intérieure, les enduits professionnels, la plâtrerie traditionnelle,
          la pose de placo décoratif, ainsi que les finitions esthétiques. Chaque projet est étudié afin de proposer
          des solutions adaptées à vos besoins et à votre budget.
        </p>

        <h2 className="mt-10 text-2xl font-heading font-semibold">
          Travaux de rénovation intérieure à {city.name} ({city.department})
        </h2>

        <h3 className="mt-6 text-xl font-heading font-semibold">
          Rénovation peinture intérieure maison et appartement à {city.name}
        </h3>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Remise en état murs et plafonds, reprise des défauts, modernisation des pièces, préparation et finitions durables.
        </p>

        <h3 className="mt-6 text-xl font-heading font-semibold">
          Préparation des supports intérieurs et enduits professionnels à {city.name}
        </h3>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Enduits professionnels, ratissage, bandes calicot et bandes armées, correction fissures et irrégularités,
          supports prêts à peindre.
        </p>

        <h3 className="mt-6 text-xl font-heading font-semibold">
          Plâtrerie traditionnelle et placo décoratif à {city.name}
        </h3>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Plâtrerie intérieure, aménagement, cloisons, finitions modernes, rendu propre et harmonieux.
        </p>

        <h3 className="mt-6 text-xl font-heading font-semibold">
          Finitions esthétiques sur mesure pour rénovation intérieure à {city.name}
        </h3>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Travail de finition, rendu haut de gamme, harmonisation des couleurs, détails soignés.
        </p>

        <h2 className="mt-10 text-2xl font-heading font-semibold">
          Devis gratuit rénovation intérieure à {city.name} ({city.department})
        </h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Devis gratuit, conseils personnalisés et accompagnement complet, avec respect des délais.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a href="/realisations" className="inline-block underline hover:text-accent">
            Nos réalisations rénovation intérieure
          </a>
          <a href="/#contact" className="inline-block underline hover:text-accent">
            Demander un devis gratuit
          </a>
        </div>

        <h2 className="mt-10 text-2xl font-heading font-semibold">
          Contact rénovation intérieure à {city.name} ({city.department})
        </h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Téléphone, email et intervention locale à {city.name} et alentours.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <SeoPhrasesAccordion
          title={`Recherches fréquentes – Rénovation intérieure (${city.name} / ${city.department})`}
          groups={[
            {
              id: "ri-1",
              label: `Rénovation intérieure (${city.name} / ${city.department})`,
              phrases: [
                `rénovation intérieure ${cityLower}`,
                `rénovation maison ${cityLower}`,
                `rénovation appartement ${cityLower}`,
                `artisan rénovation intérieure ${cityLower}`,
                `entreprise rénovation intérieure ${deptLower}`,
              ],
            },
            {
              id: "ri-2",
              label: "Enduits / plâtrerie / finitions",
              phrases: [
                `plâtrerie ${cityLower}`,
                `pose placo ${cityLower}`,
                `enduit intérieur ${cityLower}`,
                `ratissage murs ${cityLower}`,
                `bandes calicot ${cityLower}`,
                `finitions rénovation intérieure ${cityLower}`,
              ],
            },
            {
              id: "ri-3",
              label: "Devis",
              phrases: [
                `devis rénovation intérieure ${cityLower}`,
                `devis gratuit rénovation ${cityLower}`,
                `prix rénovation intérieure ${cityLower}`,
              ],
            },
          ]}
        />
      </section>
    </>
  );
}
