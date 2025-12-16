// src/pages/services/ArtisanPeintreContent.tsx
import React from "react";
import type { CitySeo } from "@/pages/services/ServiceLayout";
import SeoPhrasesAccordion from "@/components/SeoPhrasesAccordion";

export default function ArtisanPeintreContent({ city }: { city: CitySeo }) {
  const cityLower = city.name.toLowerCase();
  const deptLower = city.department.toLowerCase();

  return (
    <>
      <section className="container mx-auto px-4 py-10 max-w-5xl">
        <h1 className="text-3xl md:text-5xl font-heading font-bold">
          Artisan peintre à {city.name} – Peintre professionnel intérieur et extérieur dans le {city.department}
        </h1>

        <p className="mt-5 text-muted-foreground leading-relaxed">
          HN Rénovation est un artisan peintre à {city.name}, spécialisé dans les travaux de peinture intérieure, peinture
          extérieure, rénovation intérieure et ravalement de façade. Entreprise de peinture locale, nous intervenons
          à {city.name} et dans tout le {city.department} pour des prestations soignées et durables.
        </p>

        <p className="mt-4 text-muted-foreground leading-relaxed">
          En tant que peintre professionnel à {city.name}, nous assurons une préparation complète des surfaces : enduits
          professionnels, ratissage, bandes calicot et bandes armées. Nous utilisons des peintures professionnelles
          adaptées à chaque support, garantissant un rendu esthétique et une excellente tenue dans le temps.
        </p>

        <h2 className="mt-10 text-2xl font-heading font-semibold">
          Artisan peintre à {city.name} pour tous vos travaux de peinture
        </h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Maison, appartement, bureau, bâtiment : intervention locale, travail propre, préparation rigoureuse et finitions durables.
        </p>

        <h2 className="mt-10 text-2xl font-heading font-semibold">
          Devis gratuit peinture et rénovation à {city.name}
        </h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Devis gratuit, conseils personnalisés et respect des délais. Contactez-nous pour une estimation rapide.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a href="/realisations" className="inline-block underline hover:text-accent">
            Nos réalisations
          </a>
          <a href="/#contact" className="inline-block underline hover:text-accent">
            Demande de devis gratuit
          </a>
        </div>

        <h2 className="mt-10 text-2xl font-heading font-semibold">
          Contact artisan peintre à {city.name} ({city.department})
        </h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Téléphone, email et localisation — intervention locale dans le {city.department}.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <SeoPhrasesAccordion
          title={`Recherches fréquentes – Artisan peintre à ${city.name}`}
          groups={[
            {
              id: "ap-1",
              label: `Artisan / peintre (${city.name} / ${city.department})`,
              phrases: [
                `artisan peintre ${cityLower}`,
                `peintre ${cityLower}`,
                `entreprise de peinture ${cityLower}`,
                `peintre professionnel ${cityLower}`,
                `peintre ${deptLower}`,
                `artisan peintre ${deptLower}`,
              ],
            },
            {
              id: "ap-2",
              label: "Intérieur / extérieur / façade",
              phrases: [
                `peinture intérieure ${cityLower}`,
                `peinture extérieure ${cityLower}`,
                `ravalement façade ${cityLower}`,
                `peinture façade maison ${cityLower}`,
                `rénovation peinture maison ${deptLower}`,
              ],
            },
            {
              id: "ap-3",
              label: "Devis",
              phrases: [
                `devis peinture ${cityLower}`,
                `devis gratuit peintre ${cityLower}`,
                `prix peintre ${cityLower}`,
              ],
            },
          ]}
        />
      </section>
    </>
  );
}
