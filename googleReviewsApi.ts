import express from "express";
import axios from "axios";

const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const PLACE_ID = "ChIJiQ7z-Zu8wkcRlBqQVpTgJpE"; // Your Place ID

router.get("/reviews", async (req, res) => {
  try {
    if (!GOOGLE_API_KEY) {
      console.error("❌ Missing GOOGLE_API_KEY");
      return res.status(500).json({ error: "Server misconfigured: no API key" });
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${GOOGLE_API_KEY}&language=fr`;

    const response = await axios.get(url);
    console.log("✅ Google API response:", response.data);

    const allReviews = response.data.result?.reviews || [];
    const fiveStarReviews = allReviews.filter((r: any) => r.rating === 5);

    res.json(fiveStarReviews);
  } catch (error: any) {
    console.error("❌ Error fetching reviews:", error.message);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

export default router;
