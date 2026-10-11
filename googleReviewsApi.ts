import express from "express";
import axios from "axios";

const router = express.Router();

const PLACE_ID = "ChIJiQ7z-Zu8wkcRlBqQVpTgJpE"; // Your Place ID

type PlaceReview = { rating?: number };

router.get("/reviews", async (req, res) => {
  try {
    // Read at request time: this module is imported before dotenv runs in server.ts.
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    if (!GOOGLE_API_KEY) {
      console.error("❌ Missing GOOGLE_API_KEY");
      return res.status(500).json({ error: "Server misconfigured: no API key" });
    }

    const response = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
      params: { place_id: PLACE_ID, fields: "reviews", key: GOOGLE_API_KEY, language: "fr" },
    });

    const allReviews: PlaceReview[] = response.data.result?.reviews || [];
    const fiveStarReviews = allReviews.filter((r) => r.rating === 5);

    res.json(fiveStarReviews);
  } catch (error) {
    // Only the message: the request config contains the API key.
    console.error("❌ Error fetching reviews:", error instanceof Error ? error.message : error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

export default router;
