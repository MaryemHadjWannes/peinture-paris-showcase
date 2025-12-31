// src/components/SeoPhrasesAccordion.tsx
import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type Props = {
  title?: string;
  intro?: string;
  groups: Array<{
    id: string;
    label: string;
    phrases: string[];
  }>;
};

export default function SeoPhrasesAccordion({
  title = "Recherches fréquentes",
  intro = "Exemples de recherches courantes liées à nos prestations (affichage repliable).",
  groups,
}: Props) {
  return (
    <section className="container mx-auto px-4 py-10 max-w-5xl">
      <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3">{title}</h2>
      <p className="text-muted-foreground mb-6">{intro}</p>

      <Accordion type="multiple" className="w-full space-y-3">
        {groups.map((g) => (
          <AccordionItem
            key={g.id}
            value={g.id}
            className="border border-border/60 rounded-xl bg-card px-3 sm:px-4"
          >
            <AccordionTrigger className="text-left text-sm sm:text-base font-semibold py-3 sm:py-4">
              {g.label}
            </AccordionTrigger>
            <AccordionContent className="pb-4 sm:pb-5 text-sm sm:text-base text-muted-foreground leading-relaxed">
              <ul className="list-disc pl-5 space-y-1">
                {g.phrases.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
