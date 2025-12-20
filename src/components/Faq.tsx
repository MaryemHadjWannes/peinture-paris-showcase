import React from "react";
import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";
import type { City } from "@/data/seo";

type FaqProps = {
  city: City;
};

const Faq: React.FC<FaqProps> = ({ city }) => {
  const nearbyText =
    city.nearby && city.nearby.length > 0 ? city.nearby.slice(0, 6).join(", ") : "les villes voisines";

  const faqs = [
    {
      question: `Intervenez-vous uniquement à ${city.name} ?`,
      answer: `Nous intervenons à ${city.name} (${city.postalCode}) et dans les alentours : ${nearbyText}. Pour un chantier plus éloigné, contactez-nous et nous vérifierons la faisabilité.`,
    },
    {
      question: `Proposez-vous des devis gratuits à ${city.name} ?`,
      answer: `Oui, nos devis sont gratuits et sans engagement. Contactez-nous par téléphone ou via le formulaire pour recevoir une estimation rapide.`,
    },
    {
      question: "Quels types de travaux réalisez-vous ?",
      answer:
        "Nous réalisons la peinture intérieure et extérieure, les enduits, la plâtrerie, le ratissage des murs, ainsi que la rénovation et les finitions (plafonds, boiseries, escaliers, etc.).",
    },
    {
      question: "Travaillez-vous pour les particuliers et les professionnels ?",
      answer:
        "Oui. Nous intervenons chez les particuliers (maisons, appartements) et pour des locaux professionnels (bureaux, commerces, cabinets, petites entreprises).",
    },
    {
      question: "Quels sont vos délais d’intervention ?",
      answer:
        "Les délais dépendent de l’ampleur du chantier et de notre planning. Pour les petits travaux, une intervention rapide est souvent possible.",
    },
    {
      question: "Quelles peintures utilisez-vous ?",
      answer:
        "Nous utilisons des peintures professionnelles adaptées aux supports : mate, satinée, lessivable, pièces humides, façades et boiseries, avec une priorité sur la durabilité et l’entretien facile.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section id="faq" className="py-12 sm:py-16 bg-secondary/20">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-4 py-2 mb-4 sm:mb-5">
            <HelpCircle className="h-5 w-5 text-accent" />
            <span className="text-accent font-medium text-sm sm:text-base">FAQ – Questions fréquentes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-3 sm:mb-4">
            FAQ peinture et rénovation à {city.name}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Réponses sur nos services de peinture, rénovation, enduit et plâtrerie à {city.name} ({city.postalCode}).
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-2 sm:space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border border-border/60 rounded-xl bg-card px-3 sm:px-4"
              >
                <AccordionTrigger className="text-left text-sm sm:text-base md:text-[15px] font-semibold py-3 sm:py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 sm:pb-5 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default Faq;
