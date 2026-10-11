import { Helmet } from "react-helmet-async";
import { getBreadcrumbJsonLd, getHeadTags, type RouteMeta } from "@/data/routeMeta";

// Renders the same tags that server.ts injects into the initial HTML
// (see src/data/routeMeta.ts), so Helmet takes them over without duplicates.
const SeoHead = ({ meta }: { meta: RouteMeta }) => {
  const breadcrumbJsonLd = getBreadcrumbJsonLd(meta);
  return (
    <Helmet>
      <title>{meta.title}</title>
      {getHeadTags(meta).map(({ tag, attrs }) => {
        const key = `${attrs.name ?? attrs.property ?? attrs.rel}`;
        return tag === "link" ? <link key={key} {...attrs} /> : <meta key={key} {...attrs} />;
      })}
      {breadcrumbJsonLd ? <script type="application/ld+json">{breadcrumbJsonLd}</script> : null}
    </Helmet>
  );
};

export default SeoHead;
