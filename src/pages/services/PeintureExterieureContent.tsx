// src/pages/services/PeintureExterieureContent.tsx
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
          alt={`Peinture extérieure à ${city.name} (${city.department}) : rénovation et protection de façade par artisan peintre HN Rénovation`}
          title={`Peinture extérieure à ${city.name} – rénovation façade`}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          width={1400}
          height={900}
          className="h-[260px] w-full object-cover"
        />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        Peinture extérieure et ravalement de façade vont souvent ensemble : nettoyage, traitement, réparation des fissures,
        puis mise en peinture pour une protection durable contre l’humidité, les UV, le gel et le vieillissement.
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

export default function PeintureExterieureContent({ city }: Props) {
  const cityLower = city.name.toLowerCase();
  const deptLower = city.department.toLowerCase();

  return (
    <>
      {/* HERO (H1 full width) */}
      <section className="container mx-auto px-4 pt-10 pb-8 max-w-5xl">
        <h1 className="text-3xl md:text-5xl font-heading font-bold leading-tight">
          Peinture extérieure à {city.name} – Entreprise de peinture dans le {city.department}
        </h1>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-stretch">
          {/* LEFT */}
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm flex flex-col">
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                HN Rénovation réalise vos travaux de peinture extérieure à {city.name} et dans tout le {city.department}
                pour protéger et rénover vos murs extérieurs. Une peinture de façade bien réalisée limite l’infiltration
                d’eau, ralentit le vieillissement des supports et améliore l’aspect de votre habitation.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Avant toute mise en peinture, nous assurons une préparation rigoureuse : nettoyage, traitement si
                nécessaire, correction des défauts et application de solutions adaptées au support (façade, pignon,
                murs extérieurs). Nous utilisons des peintures professionnelles résistantes aux UV, à la pluie, au gel
                et à l’humidité, pour un rendu durable.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Nous réalisons également le <strong>ravalement de façade</strong> lorsque c’est nécessaire :{" "}
                <strong>nettoyage</strong>, <strong>traitement anti-mousse</strong>,{" "}
                <strong>réparation des fissures</strong>, remise en état des supports et préparation avant finition.
                Cela garantit une meilleure accroche et une façade plus saine, avant peinture extérieure.
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
                title="Protection durable"
                desc="Peintures adaptées aux intempéries : UV, pluie, gel, humidité. Objectif : tenue dans le temps."
              />
              <Badge
                title="Préparation façade"
                desc="Nettoyage, traitement, reprises des défauts, application des sous-couches adaptées au support."
              />
              <Badge
                title="Ravalement si nécessaire"
                desc="Nettoyage, anti-mousse, réparation fissures, remise en état avant peinture pour une façade saine."
              />
              <Badge
                title="Devis clair"
                desc="Visite, diagnostic du support et estimation précise selon l’état de la façade et la surface."
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
          Peinture extérieure et ravalement de façade à {city.name} ({city.department})
        </h2>

        <div className="mt-6 grid gap-6">
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">Peinture façade maison à {city.name}</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Peinture de façade, pignons et murs extérieurs : protection durable, amélioration esthétique et entretien
              facilité. Nous adaptons le produit au support et à l’exposition (soleil, pluie, vent).
            </p>
          </div>

          {/* Added: ravalement services (absorbs RavalementFacade page topics) */}
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">Ravalement de façade à {city.name}</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Le ravalement permet de préserver les murs extérieurs, améliorer l’esthétique et protéger contre
              l’humidité, les salissures et le vieillissement. Selon l’état de la façade, nous réalisons un nettoyage
              adapté, les traitements nécessaires, puis les reprises avant finition.
            </p>
            <ul className="mt-4 list-disc pl-6 text-muted-foreground leading-relaxed">
              <li>Nettoyage de façade (haute pression adaptée au support)</li>
              <li>Traitement anti-mousse préventif/curatif</li>
              <li>Réparation des fissures et remise en état des zones dégradées</li>
              <li>Préparation avant mise en peinture extérieure</li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">
              Bâtiments et locaux professionnels à {city.name}
            </h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Prestations adaptées aux bâtiments, commerces et locaux : préparation des supports, choix des produits,
              finitions et protection longue durée, avec un planning organisé pour limiter la gêne.
            </p>
          </div>

          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">
              Peintures extérieures résistantes aux intempéries dans le {city.department}
            </h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Peintures résistantes aux UV, à l’humidité et au gel, pour préserver la façade des agressions climatiques
              et garder un aspect propre plus longtemps.
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
          Un chantier extérieur dépend de la météo et de l’état du support. Voici le déroulé le plus fréquent, avec des
          délais indicatifs.
        </p>

        <div className="mt-6 grid gap-4">
          <Step step="Étape 1" title="Visite / diagnostic & devis détaillé" duration="24–72h">
            Inspection de la façade (microfissures, encrassement, humidité, zones friables), mesure des surfaces,
            choix du type de peinture et des finitions. Devis clair et adapté.
          </Step>

          <Step step="Étape 2" title="Préparation (nettoyage + traitements)" duration="1–3 jours">
            Protection des abords, bâchage, masquage. Nettoyage (souvent haute pression adaptée), traitement anti-mousse
            si nécessaire, reprises d’enduits, réparation des fissures et correction des défauts.
          </Step>

          <Step step="Étape 3" title="Sous-couche / impression" duration="0,5–1 jour">
            Application d’une impression/fixateur selon support pour stabiliser et améliorer l’accroche, surtout sur
            fonds farinants ou irréguliers.
          </Step>

          <Step step="Étape 4" title="Mise en peinture" duration="1–3 jours">
            Application en 1–2 couches selon le produit et le support, respect des temps de séchage, contrôle de
            l’uniformité et des zones sensibles.
          </Step>

          <Step step="Étape 5" title="Contrôle finitions & nettoyage" duration="0,5 jour">
            Vérification finale, retouches si besoin, nettoyage du chantier et retrait des protections.
          </Step>
        </div>
      </section>

      {/* PRICE FACTORS + DEVIS */}
      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <h2 className="text-2xl font-heading font-semibold">
          Devis peinture extérieure / ravalement à {city.name} : facteurs qui influencent le prix
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Le devis dépend surtout de l’état de la façade et de la préparation nécessaire, ainsi que de l’accès et du
          type de peinture. Après visite, nous vous proposons une estimation claire et adaptée.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <PriceFactor
            title="État de la façade"
            desc="Microfissures, enduits abîmés, zones friables, encrassement : préparation plus ou moins importante."
          />
          <PriceFactor
            title="Nettoyage & traitements"
            desc="Nettoyage façade, traitement anti-mousse, traitements spécifiques selon humidité et état du support."
          />
          <PriceFactor
            title="Réparation des fissures"
            desc="Reprises d’enduit, correction des défauts, remise en état des zones dégradées avant finition."
          />
          <PriceFactor
            title="Accès & hauteur"
            desc="Échafaudage, hauteur, accès difficile : impact sur l’organisation et la sécurité."
          />
          <PriceFactor
            title="Type de peinture"
            desc="Peinture façade résistante UV/intempéries, microporeuse, anti-encrassement : choix selon support/exposition."
          />
          <PriceFactor
            title="Météo & planning"
            desc="Pluie, gel, chaleur : influence sur les délais et le respect des temps de séchage."
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
          Nous intervenons à {city.name} et dans les communes proches. Indiquez votre adresse (ou quartier) et l’état de
          la façade : nous confirmons rapidement la faisabilité et un créneau de visite.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">Ce que vous recevez</h3>
            <ul className="mt-3 list-disc pl-6 text-muted-foreground leading-relaxed">
              <li>Devis clair et détaillé, adapté à votre façade</li>
              <li>Préparation complète : nettoyage, traitements, reprises</li>
              <li>Peintures résistantes aux intempéries</li>
              <li>Planning avec étapes et contraintes météo</li>
              <li>Finitions soignées et contrôle qualité</li>
            </ul>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="/#contact" className="inline-block underline hover:text-accent">
                Demander un devis gratuit peinture extérieure / façade
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
            q={`Quelle différence entre ravalement de façade et peinture extérieure à ${city.name} ?`}
            a="Le ravalement inclut la remise en état du support (nettoyage, traitement, réparation des fissures) alors que la peinture est la finition/protection. Souvent, on réalise un ravalement partiel ou complet avant de peindre."
          />
          <FaqItem
            q={`Combien de temps dure un chantier extérieur à ${city.name} ?`}
            a="En général 2 à 7 jours selon la surface, l’état de la façade (préparation/réparations) et la météo."
          />
          <FaqItem
            q="Faut-il une météo spécifique pour peindre une façade ?"
            a="Oui. On évite la pluie, le gel et les fortes chaleurs. Les conditions météo influencent les temps de séchage et la tenue du produit."
          />
          <FaqItem
            q={`Proposez-vous le nettoyage et le traitement anti-mousse à ${city.name} ?`}
            a="Oui. Nous réalisons le nettoyage de façade et, si nécessaire, un traitement anti-mousse avant la mise en peinture."
          />
        </div>
      </section>

      {/* SEO Phrases (merged: Peinture extérieure + Ravalement façade keywords) */}
      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <SeoPhrasesAccordion
          title={`Recherches fréquentes – Peinture extérieure & ravalement de façade (${city.name} / ${city.department})`}
          groups={[
            {
              id: "pe-1",
              label: `Peinture extérieure (${city.name} / ${city.department})`,
              phrases: [
                `peinture extérieure ${cityLower}`,
                `peintre extérieur ${cityLower}`,
                `entreprise peinture extérieure ${cityLower}`,
                `peinture façade maison ${cityLower}`,
                `peinture murs extérieurs ${cityLower}`,
                `peinture extérieure ${deptLower}`,
              ],
            },
            {
              id: "rf-1",
              label: `Ravalement de façade (${city.name} / ${city.department})`,
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
                `devis peinture façade ${cityLower}`,
              ],
            },
          ]}
        />
      </section>
    </>
  );
}
