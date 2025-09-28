import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Building, Palette, Filter } from 'lucide-react';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'Tous', icon: Filter },
    { id: 'interior', label: 'Intérieur', icon: Home },
    { id: 'exterior', label: 'Extérieur', icon: Building },
    { id: 'decorative', label: 'Décoratif', icon: Palette },
  ];

  const projects = [
    {
      id: 1,
      title: 'Rénovation Salon Moderne',
      category: 'interior',
      description: 'Transformation complète avec couleurs contemporaines',
      image:
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tags: ['Résidentiel', 'Moderne'],
    },
    {
      id: 2,
      title: 'Façade Maison Provençale',
      category: 'exterior',
      description: 'Restauration façade avec enduits traditionnels',
      image:
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tags: ['Traditionnel', 'Patrimoine'],
    },
    {
      id: 3,
      title: 'Fresque Murale Artistique',
      category: 'decorative',
      description: 'Création sur-mesure pour espace commercial',
      image:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tags: ['Artistique', 'Commercial'],
    },
    {
      id: 4,
      title: 'Chambre Enfant Ludique',
      category: 'interior',
      description: 'Peinture créative et motifs personnalisés',
      image:
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tags: ['Familial', 'Créatif'],
    },
    {
      id: 5,
      title: 'Immeuble Haussmannien',
      category: 'exterior',
      description: 'Réfection complète avec respect architectural',
      image:
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tags: ['Haussmann', 'Prestige'],
    },
    {
      id: 6,
      title: 'Trompe-l’œil Restaurant',
      category: 'decorative',
      description: 'Ambiance méditerranéenne pour restaurant',
      image:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tags: ['Trompe-l’œil', 'Restauration'],
    },
  ];

  const filteredProjects =
    activeFilter === 'all' ? projects : projects.filter((project) => project.category === activeFilter);

  return (
    <section id="portfolio" className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-3 sm:px-4 py-2 mb-4 sm:mb-6">
              <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              <span className="text-accent font-medium text-sm sm:text-base">
                Nos Réalisations
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 sm:mb-6">
              Portfolio de Nos
              <span className="block text-accent">Créations</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Découvrez une sélection de nos projets les plus marquants, témoins de
              notre savoir-faire et de notre créativité.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeFilter === category.id ? 'default' : 'outline'}
                  onClick={() => setActiveFilter(category.id)}
                  className="hover-lift px-3 sm:px-4 py-2 text-sm sm:text-base w-full sm:w-auto"
                  aria-pressed={activeFilter === category.id}
                >
                  <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  {category.label}
                </Button>
              );
            })}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-card rounded-xl overflow-hidden shadow-soft hover-lift border border-border/50"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
                    {project.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs sm:text-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-lg sm:text-xl font-heading font-semibold mb-2 sm:mb-3 text-primary group-hover:text-accent transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-8 sm:mt-12">
            <Button
              size="lg"
              variant="outline"
              className="hover-lift px-6 sm:px-8 w-full sm:w-auto"
            >
              Voir Plus de Projets
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;