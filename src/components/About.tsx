import React from 'react';
import { CheckCircle, Award, Users, Palette } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();
  const features = [
    {
      icon: CheckCircle,
      title: t('qualityMaterials'),
      description: t('qualityDesc')
    },
    {
      icon: Award,
      title: t('experiencedTeam'),
      description: t('teamDesc')
    },
    {
      icon: Users,
      title: "Équipe Professionnelle",
      description: "Artisans qualifiés et passionnés par leur métier"
    },
    {
      icon: Palette,
      title: t('guarantee'),
      description: t('guaranteeDesc')
    }
  ];

  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-4 py-2 mb-6">
              <Award className="h-5 w-5 text-accent" />
              <span className="text-accent font-medium">{t('whyChooseUs')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              {t('aboutTitle')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('aboutDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-heading font-semibold mb-6 text-primary">
                Une Approche Professionnelle
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Nous croyons que chaque projet est unique. C'est pourquoi nous prenons le temps 
                d'écouter vos besoins, d'analyser votre espace et de vous proposer des solutions 
                sur-mesure qui reflètent votre personnalité.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                De la préparation minutieuse des surfaces à la finition parfaite, 
                chaque étape est réalisée avec le plus grand soin. Nous utilisons exclusivement 
                des peintures de qualité supérieure pour garantir un résultat durable et esthétique.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div 
                    key={index} 
                    className="bg-card p-6 rounded-xl shadow-soft hover-lift border border-border/50"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                        <IconComponent className="h-6 w-6 text-accent" />
                      </div>
                      <h4 className="font-heading font-semibold mb-2 text-primary">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
            <div className="text-center">
              <h3 className="text-2xl font-heading font-semibold mb-4 text-primary">
                Notre Engagement
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Nous nous engageons à respecter vos délais, votre budget et vos attentes. 
                Chaque projet bénéficie d'un suivi personnalisé et d'une garantie de satisfaction. 
                Votre confiance est notre plus belle récompense.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;