// src/pages/services/ArtisanPeintreContent.tsx
import React from "react";
import type { CitySeo } from "@/pages/services/ServiceLayout";
import SeoPhrasesAccordion from "@/components/SeoPhrasesAccordion";

type Props = { city: CitySeo };

const Badge = ({ title, desc }: { title: string; desc: string }) => (
  <div className="rounded-2xl border bg-white/60 p-4 shadow-sm">
    <div className="font-heading font-semibold">{title}</div>
    <div className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</div>
  </div>
);

const Step = ({
  step,
  title,
  duration,
  children,
}: {
  step: string;
  title: string;
  duration: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border p-5 bg-white/60 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-sm text-muted-foreground">{step}</div>
        <div className="font-heading text-lg font-semibold">{title}</div>
      </div>
      <div className="text-sm font-medium text-muted-foreground whitespace-nowrap">{duration}</div>
    </div>
    <div className="mt-3 text-muted-foreground leading-relaxed">{children}</div>
  </div>
);

const FaqItem = ({ q, a }: { q: string; a: string }) => (
  <details className="rounded-2xl border bg-white/60 p-5 shadow-sm">
    <summary className="cursor-pointer font-heading font-semibold">{q}</summary>
    <p className="mt-3 text-muted-foreground leading-relaxed">{a}</p>
  </details>
);

function MapEmbed({ city }: { city: CitySeo }) {
  const q = encodeURIComponent(`${city.name} ${city.department} France`);
  const src = `https://www.google.com/maps?q=${q}&output=embed`;
  return (
    <div className="overflow-hidden rounded-2xl border shadow-sm bg-white/60">
      <iframe
        title={`Carte - ${city.name}`}
        src={src}
        loading="lazy"
        className="h-[320px] w-full"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

function ServicePhotos({ city }: { city: CitySeo }) {
  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-2xl border shadow-sm bg-white/60">
        <img
          src="/exterieur1.webp"
          alt={`Artisan peintre à ${city.name} (${city.department}) : préparation des murs et finitions soignées`}
          title={`Artisan peintre à ${city.name} – préparation et finitions`}
          loading="eager"
          width={1400}
          height={900}
          className="h-[260px] w-full object-cover"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border shadow-sm bg-white/60">
          <img
            src="/enduit3.webp"
            alt={`Peinture intérieure à ${city.name} : murs prêts à peindre, enduits et ratissage`}
            title={`Peinture intérieure à ${city.name}`}
            loading="lazy"
            width={900}
            height={700}
            className="h-[180px] w-full object-cover"
          />
        </div>
        <div className="overflow-hidden rounded-2xl border shadow-sm bg-white/60">
          <img
            src="/interieur2.webp"
            alt={`Finitions à ${city.name} : plâtrerie, reprise des défauts et rendu lisse`}
            title={`Finitions à ${city.name}`}
            loading="lazy"
            width={900}
            height={700}
            className="h-[180px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

const PriceFactor = ({ title, desc }: { title: string; desc: string }) => (
  <div className="rounded-2xl border bg-white/60 p-5 shadow-sm">
    <div className="font-heading font-semibold">{title}</div>
    <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</div>
  </div>
);

export default function ArtisanPeintreContent({ city }: Props) {
  const cityLower = city.name.toLowerCase();
  const deptLower = city.department.toLowerCase();

  return (
    <>
      <section className="container mx-auto px-4 pt-10 pb-8 max-w-5xl">
        <h1 className="text-3xl md:text-5xl font-heading font-bold leading-tight">
          Artisan peintre à {city.name} – Peinture intérieure et extérieure dans le {city.department}
        </h1>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-stretch">
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm flex flex-col">
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                HN Rénovation intervient à {city.name} et dans le {city.department} pour vos travaux de peinture
                intérieure et extérieure. Nous accompagnons particuliers et professionnels avec un haut niveau
                d’exigence sur la préparation des supports, les finitions et la durabilité des peintures.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Notre travail commence par une préparation soignée : enduits professionnels, ratissage, bandes calicot
                ou bandes armées si nécessaire. Cette étape garantit une surface lisse et une meilleure tenue dans le
                temps.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nous réalisons également la plâtrerie et les finitions : reprises des défauts, ajustements des
                boiseries, plafonds et détails décoratifs. Le résultat : un rendu propre, durable et harmonieux.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a href="/#contact" className="inline-block underline hover:text-accent">
                  Demander un devis gratuit
                </a>
                <a href="/realisations" className="inline-block underline hover:text-accent">
                  Voir des réalisations (photos)
                </a>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Badge
                title="Préparation rigoureuse"
                desc="Enduits, ratissage et reprises pour des murs prêts à peindre."
              />
              <Badge
                title="Finitions soignées"
                desc="Peinture intérieure, boiseries, plafonds et détails décoratifs."
              />
              <Badge
                title="Peintures durables"
                desc="Produits adaptés aux supports, tenue et entretien facilités."
              />
              <Badge
                title="Devis clair"
                desc="Diagnostic sur site et estimation précise selon votre besoin."
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <ServicePhotos city={city} />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 max-w-5xl">
        <h2 className="text-2xl font-heading font-semibold">
          Services de peinture à {city.name} ({city.department})
        </h2>

        <div className="mt-6 grid gap-6">
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">Peinture intérieure à {city.name}</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Murs et plafonds : préparation, sous-couche, peintures adaptées aux pièces de vie et finitions mates,
              satinées ou velours.
            </p>
          </div>
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">Peinture extérieure à {city.name}</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Protection des façades, pignons et murs extérieurs avec des produits résistants aux intempéries et aux UV.
            </p>
          </div>
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">Enduits et ratissage</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Rebouchage, bandes et ratissage complet pour obtenir des murs lisses et prêts à peindre.
            </p>
          </div>
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">Plâtrerie et finitions</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Cloisons, plafonds, reprises des défauts et finitions décoratives pour un rendu net et harmonieux.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <h2 className="text-2xl font-heading font-semibold">
          Notre méthode de travail à {city.name}
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Chaque chantier commence par un diagnostic précis des supports et un devis détaillé.
        </p>

        <div className="mt-6 grid gap-4">
          <Step step="Étape 1" title="Visite et devis détaillé" duration="24–72h">
            Analyse de l’état des murs, choix des finitions, estimation claire et adaptée à votre projet.
          </Step>
          <Step step="Étape 2" title="Protection et préparation" duration="0,5–1 jour">
            Protection des sols et du mobilier, préparation des supports et premières reprises.
          </Step>
          <Step step="Étape 3" title="Enduits et ratissage" duration="1–3 jours">
            Enduits, bandes et ratissage pour un support uniforme, prêt à peindre.
          </Step>
          <Step step="Étape 4" title="Peinture et finitions" duration="1–3 jours">
            Application des peintures, finitions propres et contrôle du rendu.
          </Step>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <h2 className="text-2xl font-heading font-semibold">
          Devis artisan peintre à {city.name} : facteurs de prix
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Le coût dépend des surfaces, de l’état des supports et des finitions choisies.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <PriceFactor
            title="État des supports"
            desc="Plus il y a de reprises, plus la préparation est longue."
          />
          <PriceFactor
            title="Surface et accès"
            desc="Hauteur, escaliers et pièces meublées influencent l’organisation."
          />
          <PriceFactor
            title="Niveau de finition"
            desc="Mate, satinée, velours : chaque finition demande un travail spécifique."
          />
          <PriceFactor
            title="Type de travaux"
            desc="Peinture intérieure, extérieure, enduits ou plâtrerie."
          />
          <PriceFactor
            title="Temps de séchage"
            desc="Certaines étapes nécessitent des temps d’attente."
          />
          <PriceFactor
            title="Délais souhaités"
            desc="Une intervention rapide peut ajuster l’organisation du chantier."
          />
        </div>
      </section>

      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <h2 className="text-2xl font-heading font-semibold">
          Intervention locale à {city.name} et alentours ({city.department})
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Nous nous déplaçons à {city.name} et dans les communes proches pour vos projets de peinture et de finitions.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">Ce que vous recevez</h3>
            <ul className="mt-3 list-disc pl-6 text-muted-foreground leading-relaxed">
              <li>Devis clair et détaillé</li>
              <li>Conseils sur les finitions et couleurs</li>
              <li>Préparation soignée des supports</li>
              <li>Peintures professionnelles adaptées</li>
              <li>Chantier propre et finitions soignées</li>
            </ul>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="/#contact" className="inline-block underline hover:text-accent">
                Demander un devis gratuit
              </a>
              <a href="/realisations" className="inline-block underline hover:text-accent">
                Voir nos réalisations
              </a>
            </div>
          </div>
          <div>
            <MapEmbed city={city} />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <h2 className="text-2xl font-heading font-semibold">Questions fréquentes</h2>
        <div className="mt-6 grid gap-4">
          <FaqItem
            q={`Intervenez-vous rapidement à ${city.name} ?`}
            a="Nous faisons le maximum pour proposer un rendez-vous rapide. Les délais varient selon la période et la taille du chantier."
          />
          <FaqItem
            q="Faut-il préparer la maison avant intervention ?"
            a="Nous protégeons les sols et le mobilier, mais vous pouvez dégager les accès pour faciliter la mise en place."
          />
          <FaqItem
            q={`Proposez-vous un devis gratuit à ${city.name} ?`}
            a="Oui, le devis est gratuit et sans engagement. Un diagnostic permet une estimation précise."
          />
          <FaqItem
            q="Quels types de peintures utilisez-vous ?"
            a="Nous utilisons des peintures professionnelles adaptées aux pièces (mates, satinées, lessivables, etc.)."
          />
        </div>
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
              label: "Peinture intérieure / extérieure",
              phrases: [
                `peinture intérieure ${cityLower}`,
                `peinture extérieure ${cityLower}`,
                `peinture façade ${cityLower}`,
                `peinture murs ${cityLower}`,
                `peinture maison ${deptLower}`,
              ],
            },
            {
              id: "ap-3",
              label: "Enduit / plâtrerie",
              phrases: [
                `enduit ${cityLower}`,
                `ratissage ${cityLower}`,
                `plâtrerie ${cityLower}`,
                `finitions ${cityLower}`,
                `bandes calicot ${cityLower}`,
              ],
            },
            {
              id: "ap-4",
              label: "Devis",
              phrases: [
                `devis peinture ${cityLower}`,
                `devis gratuit peintre ${cityLower}`,
                `prix peintre ${cityLower}`,
                `artisan peintre ${cityLower} devis`,
              ],
            },
          ]}
        />
      </section>
    </>
  );
}
