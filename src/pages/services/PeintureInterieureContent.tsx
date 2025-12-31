// src/pages/services/PeintureInterieureContent.tsx
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
          src="/interieur3.webp"
          alt={`Peinture intérieure à ${city.name} (${city.department}) : peinture murs et plafonds par artisan peintre HN Rénovation`}
          title={`Peinture intérieure à ${city.name} – murs et plafonds`}
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
            src="/interieur1.webp"
            alt={`Préparation des murs avant peinture intérieure à ${city.name} : enduit, ratissage et ponçage pour un rendu lisse`}
            title={`Préparation des murs à ${city.name} (enduit / ratissage)`}
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
            src="/interieur2.webp"
            alt={`Finition peinture intérieure à ${city.name} : application soignée, lignes nettes et finition mate/satin/velours`}
            title={`Finition peinture intérieure à ${city.name}`}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
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

export default function PeintureInterieureContent({ city }: Props) {
  const cityLower = city.name.toLowerCase();
  const deptLower = city.department.toLowerCase();

  return (
    <>
      {/* HERO (H1 full width) */}
      <section className="container mx-auto px-4 pt-10 pb-8 max-w-5xl">
        <h1 className="text-3xl md:text-5xl font-heading font-bold leading-tight">
          Peinture intérieure à {city.name} ({city.postalCode})
        </h1>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-stretch">
          {/* LEFT */}
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm flex flex-col">
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                HN Rénovation réalise vos travaux de peinture intérieure à {city.name} et alentours, pour maisons et
                appartements. Nous intervenons sur murs et plafonds, avec une préparation soignée (enduits, ratissage,
                bandes) afin d’obtenir un rendu net et durable, adapté à chaque pièce (salon, chambre, cuisine, salle
                de bain).
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Nous privilégions la qualité de finition et la propreté du chantier : protection des sols et mobilier,
                respect des temps de séchage, et choix de peintures adaptées (lessivables, anti-humidité si nécessaire).
                Objectif : un intérieur propre, harmonieux et facile à entretenir.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Notre savoir-faire couvre aussi la <strong>rénovation intérieure</strong> : enduits professionnels,
                ratissage, bandes calicot et bandes armées, correction des fissures, <strong>plâtrerie</strong> et
                travaux de finition. Si vos murs sont abîmés ou irréguliers, nous proposons une remise à niveau complète
                avant peinture pour un rendu propre.
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
                title="Préparation sérieuse"
                desc="Enduits, ratissage, bandes calicot / armées, correction des fissures et mise à niveau des supports."
              />
              <Badge
                title="Finitions au choix"
                desc="Mat, satin, velours. Conseils couleurs selon la lumière et l’usage de la pièce."
              />
              <Badge
                title="Rénovation des supports"
                desc="Remise en état murs/plafonds, reprises des défauts, plâtrerie et finitions pour un intérieur modernisé."
              />
              <Badge
                title="Délais annoncés"
                desc="Planning clair, étapes détaillées, gestion du séchage et des reprises."
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <ServicePhotos city={city} />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Pour une rénovation intérieure réussie, la préparation (enduits/ratissage) est aussi importante que la
              peinture : elle conditionne le rendu final et la durabilité.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES DETAIL */}
      <section className="container mx-auto px-4 py-10 max-w-5xl">
        <h2 className="text-2xl font-heading font-semibold">
          Travaux de peinture intérieure à {city.name} ({city.department})
        </h2>

        <div className="mt-6 grid gap-6">
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">
              Préparation des murs et enduits professionnels à {city.name}
            </h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              La préparation fait la différence entre un rendu correct et une finition premium. Selon l’état des
              supports, nous réalisons : rebouchage, traitement des fissures, pose de bandes calicot / bandes armées,
              ratissage partiel ou complet, puis ponçage et dépoussiérage.
            </p>
            <ul className="mt-4 list-disc pl-6 text-muted-foreground leading-relaxed">
              <li>Reprises localisées (trous, fissures, éclats, joints)</li>
              <li>Ratissage et mise à niveau des surfaces</li>
              <li>Ponçage, aspiration, protection et masquage soignés</li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">
              Peintures adaptées (lessivable, anti-humidité) et finitions durables à {city.name}
            </h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Nous appliquons des peintures intérieures professionnelles adaptées à l’usage de la pièce : lessivables
              pour les zones sollicitées, solutions spécifiques pour cuisine et salle de bain, et finitions mates,
              satinées ou velours selon le rendu souhaité.
            </p>
            <ul className="mt-4 list-disc pl-6 text-muted-foreground leading-relaxed">
              <li>Peinture murs et plafonds (1–2 couches selon support/couleur)</li>
              <li>Conseils sur la teinte, la luminosité et l’entretien</li>
              <li>Protection des angles, finitions propres, lignes nettes</li>
            </ul>
          </div>

          {/* Added: Renovation-related block (absorbs RenovationInterieure keywords) */}
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">
              Rénovation intérieure : plâtrerie, placo et finitions à {city.name}
            </h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Pour une rénovation de maison ou d’appartement, nous intervenons aussi en plâtrerie et remise en état des
              supports : enduits professionnels, ratissage, bandes, correction des fissures et irrégularités. Selon le
              besoin, nous réalisons également des travaux de placo et des finitions esthétiques pour moderniser vos
              pièces avant la mise en peinture.
            </p>
            <ul className="mt-4 list-disc pl-6 text-muted-foreground leading-relaxed">
              <li>Rénovation peinture intérieure : remise en état + mise en peinture</li>
              <li>Enduits, ratissage, bandes calicot / armées</li>
              <li>Plâtrerie, petits aménagements, finitions propres et harmonieuses</li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">
              Finitions personnalisées (mat, satin, velours) pour maison ou appartement à {city.name}
            </h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Le choix de la finition dépend de l’effet recherché et de l’entretien. Nous vous orientons vers la
              solution la plus cohérente : mat pour un rendu doux, satin pour un bon compromis, velours pour une
              finition élégante.
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
          Voici un déroulé clair d’un chantier de peinture intérieure. Les délais varient selon la surface, l’état des
          murs, et le temps de séchage.
        </p>

        <div className="mt-6 grid gap-4">
          <Step step="Étape 1" title="Visite / diagnostic & devis détaillé" duration="24–72h">
            Relevé des surfaces, état des supports, choix des finitions et du niveau de préparation. Vous recevez un
            devis clair, poste par poste.
          </Step>

          <Step step="Étape 2" title="Protection & préparation du chantier" duration="0,5–1 jour">
            Bâchage des sols et mobilier, masquage. Ensuite : rebouchage, bandes si nécessaire, ratissage, ponçage et
            dépoussiérage.
          </Step>

          <Step step="Étape 3" title="Sous-couche / primaire si nécessaire" duration="0,5 jour">
            Application d’un primaire d’accrochage ou isolant (selon support) pour stabiliser le mur et régulariser le
            rendu.
          </Step>

          <Step step="Étape 4" title="Application peinture (murs / plafonds)" duration="1–3 jours">
            Application en couches régulières, respect des temps de séchage, finitions et reprises de détails.
          </Step>

          <Step step="Étape 5" title="Contrôle finitions & nettoyage" duration="0,5 jour">
            Vérification à la lumière, corrections si besoin, retrait des protections et nettoyage de fin de chantier.
          </Step>
        </div>
      </section>

      {/* PRICE FACTORS + DEVIS */}
      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <h2 className="text-2xl font-heading font-semibold">
          Devis peinture intérieure à {city.name} : facteurs qui influencent le prix
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Chaque chantier est différent. Le devis dépend notamment de l’état des murs, de la surface à traiter, du type
          de peinture, et des contraintes sur place. Après visite, nous vous proposons une estimation claire et adaptée.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <PriceFactor
            title="État des supports"
            desc="Fissures, irrégularités, anciens revêtements : le niveau de préparation (enduit/ratissage) impacte fortement le devis."
          />
          <PriceFactor
            title="Surface & hauteur"
            desc="Murs, plafonds, cage d’escalier, accès difficile : plus la configuration est complexe, plus le temps d’intervention augmente."
          />
          <PriceFactor
            title="Type de peinture"
            desc="Mat/satin/velours, lessivable, pièces humides : le choix du produit doit être adapté à l’usage de la pièce."
          />
          <PriceFactor
            title="Couleurs & reprises"
            desc="Couleurs foncées, changements de teintes, reprises locales : peuvent nécessiter des couches supplémentaires."
          />
          <PriceFactor
            title="Protection & finitions"
            desc="Protection des sols/mobilier, lignes nettes, détails : ces finitions garantissent un rendu propre et durable."
          />
          <PriceFactor
            title="Délais & organisation"
            desc="Urgence, disponibilité, séchage entre couches : le planning se construit pour éviter les compromis sur la qualité."
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
          Nous intervenons à {city.name} et dans les communes proches. Indiquez votre adresse (ou quartier) et l’état
          des murs/plafonds : nous confirmons rapidement la faisabilité et un créneau de visite.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
            <h3 className="text-xl font-heading font-semibold">Ce que vous recevez</h3>
            <ul className="mt-3 list-disc pl-6 text-muted-foreground leading-relaxed">
              <li>Devis clair et détaillé, adapté à votre logement</li>
              <li>Conseils finitions et couleurs</li>
              <li>Chantier protégé et nettoyage de fin</li>
              <li>Planning avec étapes et temps de séchage</li>
              <li>Finitions soignées et contrôle qualité en fin de chantier</li>
            </ul>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="/#contact" className="inline-block underline hover:text-accent">
                Demander un devis gratuit peinture intérieure
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
            q={`Combien de temps dure un chantier de peinture intérieure à ${city.name} ?`}
            a={`Pour une pièce, comptez souvent 1 à 3 jours selon la préparation (enduits/ratissage), le nombre de couches et le temps de séchage. Pour un logement complet, le planning se construit pièce par pièce pour limiter la gêne.`}
          />
          <FaqItem
            q="Faut-il quitter le logement pendant les travaux ?"
            a="Pas forcément. Nous pouvons organiser le chantier par zones (pièce par pièce) et protéger les espaces. Pour certaines phases (ponçage), une aération régulière est recommandée."
          />
          <FaqItem
            q="Quelle finition choisir (mat, satin, velours) ?"
            a="Le mat offre un rendu doux, le satin est un bon compromis entretien/esthétique, et le velours apporte un rendu élégant. Le choix dépend de la lumière, de l’usage et des contraintes d’entretien."
          />
          <FaqItem
            q={`Proposez-vous des peintures adaptées cuisine / salle de bain à ${city.name} ?`}
            a="Oui. Pour les pièces humides, nous privilégions des produits adaptés (résistance à l’humidité/condensation et entretien simplifié) selon la situation observée sur place."
          />
        </div>
      </section>

      {/* SEO Phrases (merged: Peinture intérieure + Rénovation intérieure keywords) */}
      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <SeoPhrasesAccordion
          title={`Recherches fréquentes – Peinture & rénovation intérieure (${city.name} / ${city.department})`}
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
              label: "Enduits / plâtrerie / placo / finitions",
              phrases: [
                `enduit intérieur ${cityLower}`,
                `enduit professionnel ${cityLower}`,
                `ratissage murs ${cityLower}`,
                `bandes calicot ${cityLower}`,
                `bandes armées ${cityLower}`,
                `réparation fissures murs intérieurs ${cityLower}`,
                `plâtrerie ${cityLower}`,
                `pose placo ${cityLower}`,
                `finitions rénovation intérieure ${cityLower}`,
              ],
            },
            {
              id: "ri-3",
              label: "Devis",
              phrases: [
                `devis peinture intérieure ${cityLower}`,
                `devis rénovation intérieure ${cityLower}`,
                `devis gratuit rénovation ${cityLower}`,
                `artisan peintre ${cityLower} devis gratuit`,
              ],
            },
          ]}
        />
      </section>
    </>
  );
}
