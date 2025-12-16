// src/pages/services/PeintureInterieureContent.tsx
import React from "react";
import type { CitySeo } from "@/pages/services/ServiceLayout";
import SeoPhrasesAccordion from "@/components/SeoPhrasesAccordion";

export default function PeintureInterieureContent({ city }: { city: CitySeo }) {
  const cityLower = city.name.toLowerCase();
  const deptLower = city.department.toLowerCase();

  return (
    <>
      <section className="container mx-auto px-4 py-10 max-w-5xl">
        <h1 className="text-3xl md:text-5xl font-heading font-bold">
          Peinture intérieure à {city.name} – Peintre professionnel dans le {city.department}
        </h1>

        <p className="mt-5 text-muted-foreground leading-relaxed">
          HN Rénovation est une entreprise de peinture spécialisée en peinture intérieure à {city.name} et dans le{" "}
          {city.department}, intervenant pour la rénovation intérieure de maisons et d’appartements. En tant que peintre
          professionnel à {city.name}, nous réalisons des travaux soignés et durables, adaptés à chaque pièce de vie.
        </p>

        <p className="mt-4 text-muted-foreground leading-relaxed">
          Chaque chantier débute par une préparation complète des surfaces : application d’enduits professionnels,
          ratissage des murs, pose de bandes calicot et bandes armées, rattrapage des défauts et mise à niveau des
          supports. Cette étape essentielle permet d’obtenir des murs lisses et uniformes, prêts à recevoir la peinture.
        </p>

        <p className="mt-4 text-muted-foreground leading-relaxed">
          Nous utilisons des peintures intérieures professionnelles, y compris des peintures écologiques, pour les murs
          et plafonds de votre salon, chambre, cuisine ou salle de bain. Les finitions sont personnalisées (mate,
          satinée ou velours) avec un accompagnement dans le choix des couleurs.
        </p>

        <h2 className="mt-10 text-2xl font-heading font-semibold">
          Travaux de peinture intérieure à {city.name} ({city.department})
        </h2>

        <h3 className="mt-6 text-xl font-heading font-semibold">
          Préparation des murs et enduits professionnels à {city.name}
        </h3>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Enduits professionnels, ratissage précis, bandes calicot, bandes armées, correction des fissures et défauts,
          supports uniformes pour un rendu final net.
        </p>

        <h3 className="mt-6 text-xl font-heading font-semibold">
          Application de peintures écologiques et durables à {city.name}
        </h3>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Peinture intérieure murs et plafonds, peintures lessivables si nécessaire, solutions adaptées aux cuisines et
          salles de bain, durabilité et entretien facilité.
        </p>

        <h3 className="mt-6 text-xl font-heading font-semibold">
          Finitions soignées et personnalisées à {city.name}
        </h3>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Finition mate, satinée ou velours, rendu esthétique durable, harmonisation des couleurs et finitions adaptées
          à votre maison ou appartement.
        </p>

        <h2 className="mt-10 text-2xl font-heading font-semibold">
          Devis gratuit pour vos travaux de peinture intérieure à {city.name}
        </h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Décrivez votre besoin et recevez une estimation claire, avec conseils personnalisés et respect des délais.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a href="/realisations" className="inline-block underline hover:text-accent">
            Nos réalisations
          </a>
          <a href="/#contact" className="inline-block underline hover:text-accent">
            Devis gratuit peinture intérieure
          </a>
        </div>

        <h2 className="mt-10 text-2xl font-heading font-semibold">
          Contact peintre intérieur à {city.name} ({city.department})
        </h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Téléphone, email et intervention locale à {city.name} et alentours.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <SeoPhrasesAccordion
          title={`Recherches fréquentes – Peinture intérieure (${city.name} / ${city.department})`}
          groups={[
            {
              id: "pi-1",
              label: `Peinture intérieure (${city.name} / ${city.department})`,
              phrases: [
                `peinture intérieure ${cityLower}`,
                `peintre intérieur ${cityLower}`,
                `entreprise peinture intérieure ${cityLower}`,
                `artisan peintre intérieur ${cityLower}`,
                `peinture salon ${cityLower}`,
                `peinture chambre ${cityLower}`,
                `peinture cuisine ${cityLower}`,
                `peinture salle de bain ${cityLower}`,
                `peinture murs plafonds ${cityLower}`,
                `peintre ${deptLower} peinture intérieure`,
              ],
            },
            {
              id: "pi-2",
              label: "Enduit / ratissage / bandes",
              phrases: [
                `enduit professionnel ${cityLower}`,
                `ratissage murs ${cityLower}`,
                `bandes calicot ${cityLower}`,
                `bandes armées ${cityLower}`,
                `murs lisses avant peinture ${cityLower}`,
                `réparation fissures murs intérieurs ${cityLower}`,
              ],
            },
            {
              id: "pi-3",
              label: "Devis et prix",
              phrases: [
                `devis peinture intérieure ${cityLower}`,
                `prix peinture intérieure ${cityLower}`,
                `artisan peintre ${cityLower} devis gratuit`,
                `intervention rapide peinture ${cityLower}`,
              ],
            },
          ]}
        />
      </section>
    </>
  );
}
