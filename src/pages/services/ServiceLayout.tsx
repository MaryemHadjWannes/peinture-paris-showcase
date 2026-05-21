// src/pages/services/ServiceLayout.tsx
import React from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export type CitySeo = {
  slug: string;
  name: string;
  postalCode: string;
  department: string;
  nearby?: string[];
};

type Props = {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  noindex?: boolean;
  children: React.ReactNode;
};

export default function ServiceLayout({ title, description, canonical, ogImage, noindex, children }: Props) {
  const robots = noindex ? "noindex, nofollow" : "index, follow";
  const image = ogImage || "https://hn-renovation.fr/uploads/1759262842539-hero-painting.jpg";

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content={robots} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>

      <Navigation />
      <main className="pt-24">{children}</main>
      <Footer />
    </div>
  );
}
