import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Animated Paint Splash SVG
const PaintSplash = ({ color, className = "" }) => (
  <motion.svg
    width="50"
    height="50"
    viewBox="0 0 100 100"
    fill="none"
    className={`absolute -top-6 -right-6 opacity-40 z-0 pointer-events-none ${className}`}
    initial={{ scale: 0.8, rotate: 0, opacity: 0.25 }}
    animate={{ scale: [0.8, 1.05, 0.95, 1], rotate: [0, 15, -10, 0], opacity: [0.3, 0.5, 0.25, 0.4] }}
    transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: Math.random() }}
  >
    <path d="M31 17C37 7 61 8 67 17C73 27 95 33 86 47C77 61 62 70 50 68C38 66 18 60 14 47C10 34 25 27 31 17Z" fill={color} />
  </motion.svg>
);

interface Review {
  author_name: string;
  text: string;
  rating: number;
}

const cardVariants = {
  offscreen: { opacity: 0, y: 40 },
  onscreen: { opacity: 1, y: 0 }
};

const GoogleReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/data/reviews.json")
      .then((res) => res.json())
      .then((data) => setReviews(data.filter((r: Review) => r.rating === 5))); // Only 5-star reviews
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="reviews" className="py-20 bg-gradient-to-b from-secondary/40 via-white/60 to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-4 py-2 mb-6">
              <Star className="h-5 w-5 text-accent" />
              <span className="text-accent font-medium">Avis Clients</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Avis 5 Étoiles
              <span className="block text-accent">de Nos Clients</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Découvrez ce que nos clients satisfaits disent de nos services de peinture et de plâtrerie.
            </p>
          </div>
          {/* Reviews Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 relative">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                className="relative h-full"
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.22 }}
                variants={cardVariants}
                custom={index}
              >
                <Card className="relative hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-border/50 overflow-visible h-full w-full flex flex-col">
                  <PaintSplash color="#f59e0b" />
                  <CardHeader className="text-center pb-4 relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: [0, 12, -12, 0] }}
                      transition={{ duration: 0.45 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow bg-accent/20"
                    >
                      <Quote className="h-8 w-8 text-accent" />
                    </motion.div>
                    <CardTitle className="text-xl font-heading text-primary">
                      {review.author_name}
                    </CardTitle>
                    <div className="flex justify-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10 flex flex-col flex-grow">
                    <p className="text-muted-foreground text-sm leading-relaxed italic">
                      "{review.text}"
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;