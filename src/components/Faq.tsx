// src/components/Faq.tsx
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

const faqs = [
  {
    question: "Intervenez-vous uniquement à Cambrai ?",
    answer:
      "Nous sommes basés à Cambrai (59400) et nous intervenons comme peintre professionnel dans un rayon d’environ 70 km : Proville, Escaudœuvres, Caudry, Le Cateau, Valenciennes, Douai, Arras, Denain et tous les villages alentours. Si vous cherchez un peintre à Cambrai ou dans le Nord, nous pouvons nous déplacer.",
  },
  {
    question: "Proposez-vous des devis peinture gratuits à Cambrai ?",
    answer:
      "Oui, tous nos devis de peinture et rénovation à Cambrai et alentours sont entièrement gratuits et sans engagement. Il suffit de nous contacter par téléphone ou via le formulaire du site pour recevoir une estimation rapide et personnalisée.",
  },
  {
    question: "Quels types de travaux de peinture réalisez-vous ?",
    answer:
      "Nous prenons en charge la peinture intérieure et extérieure, les enduits, la plâtrerie, le ratissage des murs, ainsi que le rafraîchissement des plafonds, escaliers, portes et boiseries. H.N. Rénovation est spécialisée dans la rénovation complète des pièces de vie, chambres, couloirs et façades.",
  },
  {
    question: "Travaillez-vous pour les particuliers et les professionnels ?",
    answer:
      "Oui, nous intervenons à la fois chez les particuliers (maisons, appartements) et pour les locaux professionnels (bureaux, commerces, restaurants, cabinets, petites entreprises). Que vous soyez un particulier ou un professionnel à Cambrai, nous proposons des solutions de peinture adaptées à vos besoins.",
  },
  {
    question: "Quels sont vos délais d’intervention pour des travaux de peinture ?",
    answer:
      "En général, nous pouvons intervenir sous quelques jours selon la disponibilité et l’ampleur du projet. Pour les petits travaux de peinture ou les urgences (rafraîchissement d’une pièce, retouches), une intervention rapide est souvent possible à Cambrai et dans le Nord.",
  },
  {
    question: "Comment se déroule une demande de devis peinture ?",
    answer:
      "Après votre prise de contact, nous échangeons sur votre projet, puis nous pouvons effectuer une visite sur place ou une estimation à distance selon les cas. Vous recevez ensuite un devis peinture clair, détaillé et transparent avec le prix de la main d’œuvre et des matériaux.",
  },
  {
    question: "Quelles peintures utilisez-vous pour vos chantiers ?",
    answer:
      "Nous utilisons des peintures professionnelles de haute qualité, adaptées à chaque surface : peinture acrylique, mate, satinée ou lessivable, peintures spéciales pour cuisine et salle de bain, ainsi que des produits adaptés aux façades et boiseries extérieures. Notre objectif est de garantir une finition durable et facile d’entretien.",
  },
];

const Faq: React.FC = () => {
  // ✅ JSON-LD pour FAQPage (important pour SEO)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section id="faq" className="py-12 sm:py-16 bg-secondary/20">
      {/* Helmet pour injecter le JSON-LD FAQ */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqJsonLd)}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-4 py-2 mb-4 sm:mb-5">
            <HelpCircle className="h-5 w-5 text-accent" />
            <span className="text-accent font-medium text-sm sm:text-base">
              FAQ – Questions fréquentes
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-3 sm:mb-4">
            Vos questions les plus
            <span className="block text-accent">fréquentes</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Retrouvez ici les réponses aux questions que nos clients posent le
            plus souvent sur nos services de peinture, rénovation et plâtrerie
            à Cambrai et dans tout le Nord.
          </p>
        </div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-2 sm:space-y-3"
          >
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
