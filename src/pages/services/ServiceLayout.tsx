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
  children: React.ReactNode;
};

export default function ServiceLayout({ title, description, canonical, children }: Props) {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Navigation />
      <main className="pt-24">{children}</main>
      <Footer />
    </div>
  );
}
