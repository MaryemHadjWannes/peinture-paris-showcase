import express from "express";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const router = express.Router();

interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  original_language?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated?: boolean;
}

interface GooglePlaceDetailsResponse {
  result?: {
    reviews?: GoogleReview[];
  };
  status: string;
  error_message?: string;
}

// GET endpoint for Google Reviews
router.get("/", async (req, res) => {
  console.log("=== /api/reviews endpoint hit ===");
  
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const placeId = "ChIJiQ7z-Zu8wkcRlBqQVpTgJpE";
    
    if (!apiKey) {
      console.error("Google API key not found in environment variables");
      return res.status(500).json({ 
        error: "Configuration manquante", 
        message: "La clé API Google n'est pas configurée" 
      });
    }

    // Construct Google Places API URL
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&language=fr`;
    
    console.log("Fetching reviews from Google Places API...");
    
    // Fetch reviews from Google Places API
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: GooglePlaceDetailsResponse = await response.json();
    
    if (data.status !== "OK") {
      console.error("Google API error:", data.status, data.error_message);
      return res.status(500).json({ 
        error: "Erreur API Google", 
        message: data.error_message || "Une erreur est survenue lors de la récupération des avis" 
      });
    }

    if (!data.result?.reviews) {
      console.log("No reviews found in response");
      return res.json({ reviews: [] });
    }

    // Filter for 5-star reviews
    const fiveStarReviews = data.result.reviews
      .filter((review: GoogleReview) => review.rating === 5)
      .map((review: GoogleReview) => ({
        author: review.author_name,
        text: review.text,
        rating: review.rating,
        time: review.relative_time_description,
        language: review.language
      }));

    console.log(`Found ${fiveStarReviews.length} five-star reviews out of ${data.result.reviews.length} total reviews`);

    res.json({ 
      reviews: fiveStarReviews,
      total_reviews: data.result.reviews.length,
      five_star_count: fiveStarReviews.length
    });

  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    res.status(500).json({ 
      error: "Erreur serveur", 
      message: "Impossible de récupérer les avis Google" 
    });
  }
});

export default router;