// src/pages/services/ServiceLayout.tsx
import React from "react";
import SeoHead from "@/components/SeoHead";
import type { RouteMeta } from "@/data/routeMeta";
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
  meta: RouteMeta;
  children: React.ReactNode;
};

export default function ServiceLayout({ meta, children }: Props) {
  return (
    <div className="min-h-screen">
      <SeoHead meta={meta} />

      <Navigation />
      <main className="pt-24">{children}</main>
      <Footer />
    </div>
  );
}
