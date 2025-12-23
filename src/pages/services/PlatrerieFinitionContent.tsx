// src/pages/services/PlatrerieFinitionContent.tsx
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
  // Re-use existing images to avoid adding new assets
  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-2xl border shadow-sm bg-white/60">
        <img
          src="/enduit2.webp"
          alt={`Plâtrerie à ${city.name} (${city.department}) : finitions propres, surfaces lisses et préparation avant peinture`}
          title={`Plâtrerie et finitions à ${city.name}`}
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
            src="/enduit3.webp"
            alt={`Finitions plâtrerie à ${city.name} : joints, bandes, reprise des angles et préparation des supports`}
            title={`Finitions plâtrerie à ${city.name} – joints / bandes`}
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
            src="/enduit1.webp"
            alt={`Enduits et finitions intérieures à ${city.name} : rendu lisse, prêt à peindre, contrôle qualité`}
            title={`Finition intérieure à ${city.name} – prêt à peindre`}
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
        La plâtrerie et les finitions (joints, angles, reprises) sont déterminantes pour un rendu net, durable, et une
        peinture qui “tombe bien”.
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

export default function PlatrerieFinitionContent({ city }: Props) {
  const cityLower = city.name.toLowerCase();
  const deptLower = city.department.toLowerCase();

  return (
    <>
      {/* HERO (H1 full width) */}
      <section className="container mx-auto px-4 pt-10 pb-8 max-w-5xl">
        <h1 className="text-3xl md:text-5xl font-heading font-bold leading-tight">
          Plâtrerie et finitions à {city.name} ({city.postalCode})
        </h1>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-stretch">
          {/* LEFT */}
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm flex flex-col">
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                HN Rénovation réalise vos travaux de plâtrerie et finitions à {city.name} et alentours : joints placo,
                bandes, reprise d’angles, corrections des irrégularités et finitions soignées pour obtenir des surfaces
                nettes et prêtes à peindre.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Que ce soit après une pose de plaques de plâtre (placo), une rénovation intérieure, ou une reprise de murs
                abîmés, nous assurons une préparation propre : application des bandes, enduits adaptés, ponçage, et
                contrôle à la lumière pour un rendu homogène.
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
                title="Joints placo nets"
                desc="Bandes, enduits, passes régulières et ponçage pour des joints discrets et homogènes."
              />
              <Badge
                title="Angles & arêtes"
                desc="Reprises d’angles, cornières si nécessaire, finitions propres et alignement des surfaces."
              />
              <Badge
                title="Rendu prêt à peindre"
                desc="Supports lisses, dépoussiérés et contrôlés à la lumière avant sous-couche/peinture."
              />
              <Badge
                title="Chantier propre"
                desc="Protection, gestion de la poussière et nettoyage de fin de travaux."
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
          Travaux de plâtrerie et finitions à {city.name} ({city.department})
        </h2>

        <div className="mt-6 grid gap-6">
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">
              Joints placo / bandes (calicot) et enduits de jointoiement à {city.name}
            </h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Pose des bandes (calicot), passes d’enduit adaptées, correction des défauts et ponçage pour obtenir des joints
              lisses et invisibles après peinture.
            </p>
          </div>

          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">
              Reprises d’angles, arêtes et petites réparations de plâtrerie à {city.name}
            </h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Reprise des angles abîmés, arêtes fragiles, impacts et irrégularités. Si besoin, mise en place de cornières
              pour protéger et garantir des lignes nettes.
            </p>
          </div>

          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">
              Ponçage, dépoussiérage et contrôle à la lumière pour un rendu homogène à {city.name}
            </h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Ponçage soigné (grain adapté), dépoussiérage, puis contrôle à la lumière : l’objectif est un support propre
              et uniforme, prêt pour sous-couche et peinture.
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
          Les délais varient selon la surface, le nombre de joints/angles, et les temps de séchage entre passes d’enduit.
        </p>

        <div className="mt-6 grid gap-4">
          <Step step="Étape 1" title="Visite / diagnostic & devis détaillé" duration="24–72h">
            Mesure des surfaces (murs/plafonds), état des supports, niveau de finition attendu (standard ou très soigné),
            estimation du nombre de passes nécessaires.
          </Step>

          <Step step="Étape 2" title="Protection & préparation" duration="0,5–1 jour">
            Protection des sols/mobilier, masquage, préparation des joints/angles, dépoussiérage et organisation de zone
            pour limiter la gêne.
          </Step>

          <Step step="Étape 3" title="Bandes + première passe d’enduit" duration="0,5–1,5 jour">
            Pose des bandes (calicot) et première passe d’enduit. Traitement des angles et reprises selon la configuration.
          </Step>

          <Step step="Étape 4" title="Passes de finition + temps de séchage" duration="1–3 jours">
            Une ou plusieurs passes pour obtenir un rendu régulier. Séchage entre passes selon le produit et les conditions.
          </Step>

          <Step step="Étape 5" title="Ponçage, contrôle & nettoyage" duration="0,5–1 jour">
            Ponçage soigné, dépoussiérage, contrôle à la lumière et nettoyage de fin de chantier.
          </Step>
        </div>
      </section>

      {/* PRICE FACTORS + DEVIS */}
      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <h2 className="text-2xl font-heading font-semibold">
          Devis plâtrerie et finitions à {city.name} : facteurs qui influencent le prix
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Le devis dépend de la surface, du nombre de joints/angles, du niveau de finition attendu, et des contraintes
          d’accès. Après visite, nous vous proposons une estimation claire et adaptée.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <PriceFactor
            title="Surface & complexité"
            desc="Murs/plafonds, hauteur, pièces encombrées : plus la configuration est complexe, plus le temps augmente."
          />
          <PriceFactor
            title="Nombre de joints / bandes"
            desc="Joints placo, bandes, reprises : la quantité de jonctions et leur état influencent l’intervention."
          />
          <PriceFactor
            title="Angles & cornières"
            desc="Angles fragiles ou abîmés : reprise ou pose de cornières pour des lignes nettes et durables."
          />
          <PriceFactor
            title="Niveau de finition"
            desc="Standard ou finition très lisse : plus de passes et plus de ponçage pour un rendu premium."
          />
          <PriceFactor
            title="Séchage & organisation"
            desc="Temps de séchage entre passes : peut allonger le planning sans compromis sur la qualité."
          />
          <PriceFactor
            title="Préparation & propreté"
            desc="Protections, gestion de la poussière, nettoyage : indispensables pour un chantier propre."
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
          Nous intervenons à {city.name} et dans les communes proches. Indiquez votre adresse (ou quartier) et le type de
          travaux (joints placo, angles, reprises) : nous confirmons rapidement la faisabilité et un créneau de visite.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">Ce que vous recevez</h3>
            <ul className="mt-3 list-disc pl-6 text-muted-foreground leading-relaxed">
              <li>Devis clair et détaillé, adapté à vos surfaces</li>
              <li>Joints placo et bandes réalisés proprement</li>
              <li>Reprises d’angles et finitions soignées</li>
              <li>Ponçage, dépoussiérage et contrôle qualité</li>
              <li>Supports prêts à peindre</li>
            </ul>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="/#contact" className="inline-block underline hover:text-accent">
                Demander un devis gratuit plâtrerie
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
            q={`Faites-vous les joints placo et bandes à ${city.name} ?`}
            a="Oui. Nous réalisons les joints placo avec bandes (calicot), enduits, passes de finition et ponçage pour un rendu prêt à peindre."
          />
          <FaqItem
            q="Combien de passes d’enduit faut-il pour une belle finition ?"
            a="Cela dépend du support et du niveau attendu. Le plus courant est 2 à 3 passes (incluant la finition), avec ponçage entre les étapes si nécessaire."
          />
          <FaqItem
            q={`Combien de temps pour des finitions plâtrerie à ${city.name} ?`}
            a="Souvent 1 à 4 jours selon la surface, le nombre de joints/angles et les temps de séchage entre passes."
          />
          <FaqItem
            q="Peut-on peindre immédiatement après plâtrerie ?"
            a="On respecte le séchage, puis on ponce et dépoussière. Ensuite, une sous-couche est recommandée avant la peinture de finition."
          />
        </div>
      </section>

      {/* SEO Phrases */}
      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <SeoPhrasesAccordion
          title={`Recherches fréquentes – Plâtrerie et finitions (${city.name} / ${city.department})`}
          groups={[
            {
              id: "pf-1",
              label: `Plâtrerie (${city.name} / ${city.department})`,
              phrases: [
                `plâtrerie ${cityLower}`,
                `artisan plâtrier ${cityLower}`,
                `entreprise plâtrerie ${cityLower}`,
                `travaux plâtrerie ${cityLower}`,
                `plâtrerie ${deptLower}`,
              ],
            },
            {
              id: "pf-2",
              label: "Joints placo / bandes / finitions",
              phrases: [
                `joints placo ${cityLower}`,
                `bandes placo ${cityLower}`,
                `bandes calicot ${cityLower}`,
                `enduit joints placo ${cityLower}`,
                `finitions intérieures ${cityLower}`,
                `reprise angles placo ${cityLower}`,
              ],
            },
            {
              id: "pf-3",
              label: "Devis",
              phrases: [
                `devis plâtrerie ${cityLower}`,
                `devis joints placo ${cityLower}`,
                `devis gratuit plâtrerie ${cityLower}`,
                `prix joints placo ${cityLower}`,
              ],
            },
          ]}
        />
      </section>
    </>
  );
}
