import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, User } from 'lucide-react';

interface Review {
  author: string;
  text: string;
  rating: number;
  time: string;
  language: string;
}

interface GoogleReviewsResponse {
  reviews: Review[];
  total_reviews: number;
  five_star_count: number;
}

const GoogleReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching Google reviews...');
        const response = await fetch('http://localhost:5000/api/reviews');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data: GoogleReviewsResponse = await response.json();
        console.log('Reviews received:', data);
        
        setReviews(data.reviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des avis');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-8">
              Avis Google
            </h2>
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Chargement des avis...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-8">
              Avis Google
            </h2>
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6 text-center">
                <p className="text-red-600">{error}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Veuillez réessayer plus tard ou contacter notre équipe.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-8">
              Avis Google
            </h2>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  Aucun avis 5 étoiles disponible pour le moment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Avis Google
            </h2>
            <p className="text-muted-foreground">
              Découvrez ce que nos clients disent de notre travail
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              {renderStars(5)}
              <span className="text-sm text-muted-foreground ml-2">
                {reviews.length} avis 5 étoiles
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {reviews.map((review, index) => (
              <Card key={index} className="border-primary/20 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">
                          {review.author}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating)}
                          <span className="text-xs text-muted-foreground">
                            {review.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    "{review.text}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;