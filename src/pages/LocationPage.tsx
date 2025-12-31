import { useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Paintbrush,
  Building2,
  Brush,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  locationProfiles,
  getLocationById,
  type LocationProfile,
} from "@/data/locationProfiles";

const LocationPage = () => {
  const params = useParams<{ cityId?: string }>();
  const [searchParams] = useSearchParams();

  const requestedId =
    params.cityId ?? searchParams.get("id") ?? undefined;

  const location = useMemo(
    () => getLocationById(requestedId),
    [requestedId]
  );

  if (!location) {
    return (
      <LocationDirectory
        highlightId={requestedId ?? undefined}
      />
    );
  }

  const serviceBlocks = buildServiceBlocks(location);
  const otherLocations = locationProfiles.filter(
    (item) => item.id !== location.id
  );

  return (
    <div className="pt-28 pb-16 bg-background min-h-screen">
      <Helmet>
        <title>
          Peintre à {location.name} | Rénovation &amp; peinture intérieure
        </title>
        <meta
          name="description"
          content={`HN Rénovation intervient à ${location.name} (${location.postalCodes.join(
            ", "
          )}) et dans tout le ${location.department} pour vos travaux de peinture intérieure, extérieure, enduits et rénovation complète.`}
        />
        <meta
          name="keywords"
          content={location.keywords.join(", ")}
        />
        <link
          rel="canonical"
          href={`https://hn-renovation.fr/peinture/${location.id}`}
        />
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <header className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-4 py-2 mb-4">
            <Paintbrush className="h-5 w-5 text-accent" />
            <span className="text-accent font-medium">
              Peintre local à {location.name}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
            {location.tagline}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Artisan peintre certifié pour les particuliers, professionnels et
            syndics à {location.name} et dans un rayon de{" "}
            {location.serviceRadiusKm} km. Préparation complète des murs,
            enduits, plâtrerie décorative, peinture minérale ou acrylique,
            ravalement de façade et finitions premium garanties décennale.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <InfoCard
            icon={<MapPin className="h-5 w-5 text-accent" />}
            title="Zones couvertes"
            content={`${location.name} (${location.postalCodes.join(
              ", "
            )}) et communes voisines : ${location.nearby.join(", ")}.`}
          />
          <InfoCard
            icon={<Brush className="h-5 w-5 text-accent" />}
            title="Prestations"
            content="Peinture intérieure & extérieure, enduit, ratissage, plâtrerie, boiseries, rénovation complète."
          />
          <InfoCard
            icon={<ShieldCheck className="h-5 w-5 text-accent" />}
            title="Engagement"
            content="Visite sous 48h, devis gratuit, protection totale des surfaces, garantie décennale."
          />
        </div>

        <section className="mb-16">
          <div className="grid gap-6 md:grid-cols-2">
            {serviceBlocks.map((block) => (
              <Card key={block.title} className="h-full border-border/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    {block.icon}
                    {block.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {block.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {block.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" />
                      {point}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16 bg-secondary/20 p-8 rounded-3xl border border-border/60">
          <h2 className="text-2xl font-heading font-semibold mb-4">
            Intervention dans tous les quartiers de {location.name}
          </h2>
          <p className="text-muted-foreground mb-6">
            Nos équipes mobiles interviennent sur les maisons individuelles,
            appartements, commerces et bâtiments tertiaires dans les quartiers
            suivants :
          </p>
          <div className="flex flex-wrap gap-3">
            {location.neighborhoods.map((district) => (
              <Badge
                key={district}
                variant="secondary"
                className="text-sm py-1 px-3"
              >
                {district}
              </Badge>
            ))}
          </div>
        </section>

        <section className="mb-16 grid gap-8 md:grid-cols-2">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-xl">
                Pourquoi choisir H.N. Rénovation à {location.name} ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Nous accompagnons les particuliers, entreprises, agences
                immobilières et architectes du {location.department} pour des
                chantiers rapides et impeccables. Chaque devis inclut la
                préparation des supports, la fourniture des peintures adaptées
                (respirantes, lessivables, hydrofuges), la protection des sols
                et une réception détaillée.
              </p>
              <p>
                Intervention possible sur rendez-vous ou en urgence pour des
                dégâts des eaux, finitions de chantier, rafraîchissements avant
                relocation et rénovation énergétique. Nos produits sont choisis
                pour résister à l&apos;humidité, aux passages intensifs et aux
                UV, idéal pour les maisons du {location.region}.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-xl">Contact direct</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent" />
                <a
                  href="tel:+330602228001"
                  className="text-base font-semibold text-primary"
                >
                  +33 06 02 22 80 01
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent" />
                <a
                  href="mailto:hn.renovation.fr@gmail.com"
                  className="text-base font-semibold text-primary"
                >
                  hn.renovation.fr@gmail.com
                </a>
              </div>
              <p>
                Envoyez-nous vos photos, plans ou métrés, nous préparons votre
                devis peintre à {location.name} sous 24 h avec planning
                d’intervention et conseils techniques.
              </p>
              <Button asChild className="w-full">
                <Link to="/#contact">Demander un devis</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section>
          <h3 className="text-xl font-heading font-semibold mb-4">
            Autres villes desservies dans le {location.region}
          </h3>
          <div className="flex flex-wrap gap-3">
            {otherLocations.map((city) => (
              <Link
                key={city.id}
                to={`/peinture/${city.id}`}
                className="px-4 py-2 rounded-full border border-border/60 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Peintre à {city.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const LocationDirectory = ({
  highlightId,
}: {
  highlightId?: string;
}) => {
  return (
    <div className="pt-28 pb-16 bg-background min-h-screen">
      <Helmet>
        <title>Zones de peinture locales | H.N. Rénovation</title>
        <meta
          name="description"
          content="Découvrez toutes nos pages locales : Cambrai, Douai, Valenciennes, Denain, Arras, Saint-Quentin et plus. Devis peinture gratuit en 24h."
        />
        <link
          rel="canonical"
          href="https://hn-renovation.fr/peinture"
        />
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <header className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-4 py-2 mb-4">
            <Layers className="h-5 w-5 text-accent" />
            <span className="text-accent font-medium">
              Pages locales
            </span>
          </div>
          <h1 className="text-4xl font-heading font-bold mb-4">
            Peinture professionnelle dans tout le Nord
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Sélectionnez votre ville pour afficher une page dédiée avec les
            mots-clés locaux, les quartiers couverts et les services de peinture
            intérieure, extérieure et rénovation complète.
          </p>
          {highlightId && (
            <p className="mt-4 text-sm text-red-600">
              Aucun profil trouvé pour “{highlightId}”. Choisissez une ville
              ci-dessous.
            </p>
          )}
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {locationProfiles.map((location) => (
            <Card
              key={location.id}
              className="border border-border/60 hover:border-accent/70 transition-colors"
            >
              <CardHeader>
                <CardTitle className="text-2xl flex flex-wrap gap-2">
                  {location.name}
                  <Badge variant="secondary">
                    {location.department}
                  </Badge>
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  {location.tagline}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <strong>Codes postaux :</strong>{" "}
                  {location.postalCodes.join(", ")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {location.nearby.slice(0, 5).map((city) => (
                    <Badge key={city} variant="outline">
                      {city}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="flex-1">
                    <Link to={`/peinture/${location.id}`}>
                      Voir la page
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to={`/peinture?id=${location.id}`}>
                      Version ?id
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
}) => (
  <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-soft h-full">
    <div className="flex items-center gap-3 mb-3 text-primary">
      {icon}
      <h3 className="font-semibold">{title}</h3>
    </div>
    <p className="text-sm text-muted-foreground">{content}</p>
  </div>
);

const buildServiceBlocks = (location: LocationProfile) => {
  return [
    {
      title: `Peinture intérieure à ${location.name}`,
      description:
        "Finitions lessivables, mates, velours ou satinées adaptées aux pièces de vie, commerces et bureaux.",
      icon: <Brush className="h-5 w-5 text-accent" />,
      points: [
        `Ratissage complet et enduit décoratif pour appartements de ${location.name}.`,
        "Préparation des murs : ponçage, reprise d'enduits, traitement anti-humidité.",
        "Application de peintures biosourcées ou haute résistance pour cuisines et salles de bain.",
        "Conseils couleurs et harmonies adaptés aux maisons flamandes."
      ]
    },
    {
      title: `Peinture extérieure & façades (${location.department})`,
      description:
        "Protection longue durée contre la pluie, la pollution et les UV pour façades, boiseries et ferronneries.",
      icon: <Building2 className="h-5 w-5 text-accent" />,
      points: [
        `Nettoyage haute pression et reprise des fissures sur maisons à ${location.name}.`,
        "Traitements anti-mousse, anti-salpêtre et protection des briques rouges.",
        "Peinture de volets, pergolas, portails et menuiseries extérieures.",
        "Mise aux normes DTU avec finitions hydrofuges ou minérales."
      ]
    },
    {
      title: `Rénovation complète & dégâts des eaux`,
      description:
        "Gestion globale de vos chantiers : plâtrerie, cloisons, bandes, reprise après sinistre.",
      icon: <ShieldCheck className="h-5 w-5 text-accent" />,
      points: [
        "Dépose de papiers peints, réparation plafonds fissurés, pose de toiles de verre.",
        "Remise en état rapide après dégât des eaux ou infiltration.",
        "Coordination avec assurances et maîtres d'œuvre locaux.",
        "Livraison clés en main avec nettoyage et reprise des finitions."
      ]
    },
    {
      title: `Professionnels & commerces à ${location.name}`,
      description:
        "Planning de nuit ou week-end pour limiter l'impact sur votre activité.",
      icon: <Paintbrush className="h-5 w-5 text-accent" />,
      points: [
        "Bureaux, boutiques, cabinets médicaux, restaurants, hôtels.",
        "Peintures classées ERP, sans odeur et temps de séchage rapide.",
        "Signalétique et teintes personnalisées aux couleurs de votre marque.",
        "Maintenance annuelle pour conserver une image impeccable."
      ]
    }
  ];
};

export default LocationPage;
