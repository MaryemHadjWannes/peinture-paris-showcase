// src/pages/services/EnduitContent.tsx
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
  // Re-use your existing interior images (no new files required)
  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-2xl border shadow-sm bg-white/60">
        <img
          src="/enduit2.webp"
          alt={`Enduit intérieur à ${city.name} (${city.department}) : murs lisses avant peinture, préparation et finitions par artisan`}
          title={`Enduit intérieur à ${city.name} – murs lisses`}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          width={1400}
          height={900}
          className="h-[260px] w-full object-cover"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border shadow-sm bg-white/60">
          <img
            src="/enduit1.webp"
            alt={`Préparation des murs à ${city.name} : ratissage, bandes calicot et ponçage avant enduit`}
            title={`Préparation murs à ${city.name} – ratissage / bandes`}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            width={900}
            height={700}
            className="h-[180px] w-full object-cover"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border shadow-sm bg-white/60">
          <img
            src="/enduit3.webp"
            alt={`Enduit de finition à ${city.name} : correction des défauts, rendu lisse et prêt à peindre`}
            title={`Enduit de finition à ${city.name} – prêt à peindre`}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            width={900}
            height={700}
            className="h-[180px] w-full object-cover"
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        Un enduit bien réalisé améliore l’aspect des murs, corrige les défauts et garantit une finition peinture plus nette
        et durable.
      </p>
    </div>
  );
}

const PriceFactor = ({ title, desc }: { title: string; desc: string }) => (
  <div className="rounded-2xl border bg-white/60 p-5 shadow-sm">
    <div className="font-heading font-semibold">{title}</div>
    <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</div>
  </div>
);

export default function EnduitContent({ city }: Props) {
  const cityLower = city.name.toLowerCase();
  const deptLower = city.department.toLowerCase();

  return (
    <>
      {/* HERO (H1 full width) */}
      <section className="container mx-auto px-4 pt-10 pb-8 max-w-5xl">
        <h1 className="text-3xl md:text-5xl font-heading font-bold leading-tight">
          Enduit intérieur à {city.name} – Murs lisses et préparation avant peinture ({city.department})
        </h1>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-stretch">
          {/* LEFT */}
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm flex flex-col">
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                HN Rénovation réalise vos travaux d’enduit intérieur à {city.name} et alentours : rebouchage, ratissage,
                reprise des fissures et enduit de finition pour obtenir des murs propres, lisses et prêts à peindre.
                L’enduit est une étape clé pour une peinture intérieure réussie.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Selon l’état des supports (anciens revêtements, microfissures, irrégularités), nous adaptons la méthode :
                préparation, bandes calicot ou bandes armées si besoin, ratissage partiel ou complet, puis ponçage et
                dépoussiérage avant mise en peinture.
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
                title="Murs lisses"
                desc="Correction des défauts et mise à niveau pour un rendu propre, sans bosses ni marques."
              />
              <Badge
                title="Reprise fissures"
                desc="Traitement des fissures, joints et trous, avec renfort si nécessaire (bandes)."
              />
              <Badge
                title="Ratissage & finition"
                desc="Ratissage partiel/complet, enduit de finition, ponçage soigné et dépoussiérage."
              />
              <Badge
                title="Prêt à peindre"
                desc="Supports préparés pour une peinture durable : meilleure accroche et meilleure esthétique."
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <ServicePhotos city={city} />
          </div>
        </div>
      </section>

      {/* SERVICES DETAIL */}
      <section className="container mx-auto px-4 py-10 max-w-5xl">
        <h2 className="text-2xl font-heading font-semibold">
          Travaux d’enduit intérieur à {city.name} ({city.department})
        </h2>

        <div className="mt-6 grid gap-6">
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">
              Rebouchage des trous et réparation des fissures à {city.name}
            </h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Rebouchage des impacts, reprise des fissures et corrections localisées. Si nécessaire, pose de bandes calicot
              ou bandes armées pour stabiliser et éviter les réapparitions.
            </p>
          </div>

          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">
              Ratissage des murs (partiel ou complet) à {city.name}
            </h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Le ratissage sert à uniformiser le mur et supprimer les irrégularités. Selon le support, on réalise un
              ratissage partiel (zones) ou complet (murs entiers) pour un rendu plus qualitatif.
            </p>
          </div>

          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">
              Enduit de finition & ponçage pour murs prêts à peindre à {city.name}
            </h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Application d’un enduit de finition puis ponçage soigné, dépoussiérage et contrôle à la lumière : objectif
              “murs lisses”, prêt pour sous-couche et peinture.
            </p>
          </div>
        </div>
      </section>

      {/* PROCESS + TIMELINE */}
      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <h2 className="text-2xl font-heading font-semibold">
          Notre méthode de travail à {city.name} (process + délais)
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Les délais varient selon l’état des murs et le temps de séchage entre les passes. Voici un déroulé type.
        </p>

        <div className="mt-6 grid gap-4">
          <Step step="Étape 1" title="Visite / diagnostic & devis détaillé" duration="24–72h">
            Analyse des supports (fissures, creux, ancien revêtement), définition du niveau de préparation (rebouchage,
            bandes, ratissage partiel/complet). Devis clair, poste par poste.
          </Step>

          <Step step="Étape 2" title="Protection & préparation" duration="0,5–1 jour">
            Protection sols/mobilier, masquage. Grattage si nécessaire, dépoussiérage, préparation des zones à reprendre.
          </Step>

          <Step step="Étape 3" title="Rebouchage / bandes (si besoin)" duration="0,5–1,5 jour">
            Rebouchage des trous, reprise fissures. Pose de bandes calicot/armées selon la nature des fissures et des joints.
          </Step>

          <Step step="Étape 4" title="Ratissage + enduit de finition" duration="1–3 jours">
            Application des passes d’enduit, temps de séchage, puis enduit de finition pour un rendu homogène.
          </Step>

          <Step step="Étape 5" title="Ponçage, dépoussiérage & contrôle" duration="0,5–1 jour">
            Ponçage soigné, dépoussiérage et contrôle à la lumière. Le support est prêt pour sous-couche et peinture.
          </Step>
        </div>
      </section>

      {/* PRICE FACTORS + DEVIS */}
      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <h2 className="text-2xl font-heading font-semibold">
          Devis enduit intérieur à {city.name} : facteurs qui influencent le prix
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Chaque mur est différent. Le devis dépend de l’état du support, du niveau de finition attendu et du temps de
          préparation. Après visite, nous vous proposons une estimation claire et adaptée.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <PriceFactor
            title="État des murs"
            desc="Trous, fissures, supports irréguliers : plus il y a de reprises, plus le temps d’intervention augmente."
          />
          <PriceFactor
            title="Ratissage partiel ou complet"
            desc="Sur quelques zones ou sur l’ensemble des murs : le niveau d’uniformisation impacte le devis."
          />
          <PriceFactor
            title="Bandes (calicot/armées)"
            desc="Selon les fissures et joints : renforts nécessaires pour stabiliser le support."
          />
          <PriceFactor
            title="Niveau de finition"
            desc="Finition standard ou rendu très lisse : le ponçage et les passes supplémentaires jouent sur le temps."
          />
          <PriceFactor
            title="Surface & contraintes"
            desc="Hauteur, accès, escaliers, pièces meublées : organisation et protection influencent l’intervention."
          />
          <PriceFactor
            title="Séchage & planning"
            desc="Les temps de séchage entre passes peuvent allonger le planning, surtout en rénovation."
          />
        </div>

        <div className="mt-6">
          <a href="/#contact" className="inline-block underline hover:text-accent">
            Demander un devis gratuit après visite
          </a>
        </div>
      </section>

      {/* LOCAL TRUST + MAP */}
      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <h2 className="text-2xl font-heading font-semibold">
          Intervention à {city.name} et alentours ({city.department})
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Nous intervenons à {city.name} et dans les communes proches. Indiquez votre adresse (ou quartier) et l’état des
          murs : nous confirmons rapidement la faisabilité et un créneau de visite.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">Ce que vous recevez</h3>
            <ul className="mt-3 list-disc pl-6 text-muted-foreground leading-relaxed">
              <li>Devis clair et détaillé, adapté à vos murs</li>
              <li>Protection des sols et mobilier</li>
              <li>Reprises fissures et mise à niveau</li>
              <li>Ratissage et finition, ponçage soigné</li>
              <li>Supports prêts à peindre</li>
            </ul>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="/#contact" className="inline-block underline hover:text-accent">
                Demander un devis gratuit enduit intérieur
              </a>
              <a href="/realisations" className="inline-block underline hover:text-accent">
                Photos avant / après
              </a>
            </div>
          </div>

          <div>
            <MapEmbed city={city} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <h2 className="text-2xl font-heading font-semibold">Questions fréquentes</h2>
        <div className="mt-6 grid gap-4">
          <FaqItem
            q={`Pourquoi faire un ratissage avant peinture à ${city.name} ?`}
            a="Le ratissage uniformise le mur, supprime les irrégularités et améliore le rendu final. La peinture révèle les défauts : un mur préparé donne une finition plus nette."
          />
          <FaqItem
            q="Quelle différence entre rebouchage et enduit de finition ?"
            a="Le rebouchage corrige localement (trous, fissures). L’enduit de finition sert à lisser et uniformiser, souvent après ratissage, pour obtenir un support prêt à peindre."
          />
          <FaqItem
            q={`Combien de temps durent les travaux d’enduit intérieur à ${city.name} ?`}
            a="Souvent 1 à 4 jours selon l’état des murs, la surface, le nombre de passes et les temps de séchage."
          />
          <FaqItem
            q="Faut-il poncer après enduit ?"
            a="Oui, le ponçage est généralement indispensable pour obtenir un rendu homogène. Il est suivi d’un dépoussiérage soigné avant sous-couche/peinture."
          />
        </div>
      </section>

      {/* SEO Phrases */}
      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <SeoPhrasesAccordion
          title={`Recherches fréquentes – Enduit intérieur (${city.name} / ${city.department})`}
          groups={[
            {
              id: "en-1",
              label: `Enduit intérieur (${city.name} / ${city.department})`,
              phrases: [
                `enduit intérieur ${cityLower}`,
                `artisan enduit ${cityLower}`,
                `entreprise enduit ${cityLower}`,
                `enduit murs ${cityLower}`,
                `enduit de finition ${cityLower}`,
                `enduit intérieur ${deptLower}`,
              ],
            },
            {
              id: "en-2",
              label: "Ratissage / fissures / bandes",
              phrases: [
                `ratissage murs ${cityLower}`,
                `rebouchage trous murs ${cityLower}`,
                `réparation fissures murs ${cityLower}`,
                `bandes calicot ${cityLower}`,
                `bandes armées ${cityLower}`,
                `murs lisses avant peinture ${cityLower}`,
              ],
            },
            {
              id: "en-3",
              label: "Devis",
              phrases: [
                `devis enduit ${cityLower}`,
                `devis enduit intérieur ${cityLower}`,
                `devis gratuit enduit ${cityLower}`,
                `prix ratissage ${cityLower}`,
              ],
            },
          ]}
        />
      </section>
    </>
  );
}
