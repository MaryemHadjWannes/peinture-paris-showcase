// src/pages/services/RavalementFacadeContent.tsx
import React from "react";
import type { CitySeo } from "@/pages/services/ServiceLayout";
import SeoPhrasesAccordion from "@/components/SeoPhrasesAccordion";

export default function RavalementFacadeContent({ city }: { city: CitySeo }) {
  const cityLower = city.name.toLowerCase();
  const deptLower = city.department.toLowerCase();

  return (
    <>
      <section className="container mx-auto px-4 py-10 max-w-5xl">
        <h1 className="text-3xl md:text-5xl font-heading font-bold">
          Ravalement de façade à {city.name} – Entreprise de peinture dans le {city.department}
        </h1>

        <p className="mt-5 text-muted-foreground leading-relaxed">
          HN Rénovation réalise le ravalement de façade à {city.name} et dans tout le {city.department}. Le ravalement
          permet de préserver les murs extérieurs, améliorer l’esthétique, et protéger votre habitation contre
          l’humidité, les salissures et le vieillissement.
        </p>

        <p className="mt-4 text-muted-foreground leading-relaxed">
          Notre approche inclut une préparation complète : nettoyage, traitement, réparation des défauts, remise en état
          des supports et finitions adaptées. L’objectif est d’obtenir une façade saine, durable et prête à recevoir une
          protection ou une mise en peinture.
        </p>

        <h2 className="mt-10 text-2xl font-heading font-semibold">
          Ravalement de façade à {city.name} ({city.department})
        </h2>

        <h3 className="mt-6 text-xl font-heading font-semibold">
          Nettoyage haute pression des façades à {city.name}
        </h3>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Élimination des salissures, préparation du support, nettoyage adapté à l’état de la façade et aux matériaux.
        </p>

        <h3 className="mt-6 text-xl font-heading font-semibold">
          Traitement anti-mousse longue durée à {city.name}
        </h3>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Traitement préventif et curatif contre mousses et micro-organismes, protection durable, support prêt à rénover.
        </p>

        <h3 className="mt-6 text-xl font-heading font-semibold">
          Réparation des fissures et remise en état des façades à {city.name}
        </h3>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Rattrapage des fissures, correction des défauts, remise en état des zones dégradées, préparation avant finition.
        </p>

        <h2 className="mt-10 text-2xl font-heading font-semibold">
          Devis gratuit ravalement de façade à {city.name}
        </h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Devis gratuit, conseils personnalisés et accompagnement complet.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a href="/realisations" className="inline-block underline hover:text-accent">
            Nos réalisations façade
          </a>
          <a href="/#contact" className="inline-block underline hover:text-accent">
            Demander un devis gratuit
          </a>
        </div>

        <h2 className="mt-10 text-2xl font-heading font-semibold">
          Contact ravalement de façade à {city.name} ({city.department})
        </h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Téléphone, email et intervention locale à {city.name} et alentours.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <SeoPhrasesAccordion
          title={`Recherches fréquentes – Ravalement de façade (${city.name} / ${city.department})`}
          groups={[
            {
              id: "rf-1",
              label: `Ravalement façade (${city.name} / ${city.department})`,
              phrases: [
                `ravalement façade ${cityLower}`,
                `entreprise ravalement façade ${cityLower}`,
                `artisan ravalement façade ${deptLower}`,
                `rénovation façade maison ${cityLower}`,
                `ravalement maison ${deptLower}`,
              ],
            },
            {
              id: "rf-2",
              label: "Nettoyage / anti-mousse / fissures",
              phrases: [
                `nettoyage façade haute pression ${cityLower}`,
                `traitement anti-mousse façade ${cityLower}`,
                `réparation fissures façade ${cityLower}`,
                `remise en état façade ${cityLower}`,
              ],
            },
            {
              id: "rf-3",
              label: "Devis",
              phrases: [
                `devis ravalement façade ${cityLower}`,
                `prix ravalement façade ${cityLower}`,
                `devis gratuit façade ${deptLower}`,
              ],
            },
          ]}
        />
      </section>
    </>
  );
}
