import React from "react";
import { CheckCircle, Award, Palette } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "Qualité Supérieure",
      description: "Utilisation de matériaux premium et techniques modernes pour des finitions impeccables",
    },
    {
      icon: Award,
      title: "Équipe Passionnée",
      description: "Une équipe dévouée, formée aux dernières innovations pour vos projets",
    },
    {
      icon: Palette,
      title: "Conseils Personnalisés",
      description: "Accompagnement sur mesure pour choisir couleurs et finitions parfaites",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-4 py-2 mb-6 mx-auto"
          >
            <Award className="h-5 w-5 text-accent" />
            <span className="text-accent font-medium">Notre Expertise</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-heading font-bold mb-6"
          >
            Votre Vision, Notre
            <span className="block text-accent">Savoir-Faire</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            NH Rénovation transforme vos espaces avec passion et précision.
            Nous apportons innovation et excellence à chaque projet.
          </motion.p>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                variants={item}
                className="bg-card p-6 rounded-xl shadow-soft hover-lift border border-border/50 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="font-heading font-semibold mb-2 text-primary">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="bg-primary/5 rounded-2xl p-8 border border-primary/20 text-center"
        >
          <h3 className="text-2xl font-heading font-semibold mb-4 text-primary">
            Notre Engagement
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Nous mettons tout en œuvre pour respecter vos délais, votre budget et vos attentes, avec un suivi personnalisé et une garantie de satisfaction.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;