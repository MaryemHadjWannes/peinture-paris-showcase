import { useEffect, useState } from "react";
import googleReviewsUrl from "/data/google-reviews.json?url";

export type GoogleReview = {
  authorName: string;
  rating: number;
  relativeDate?: string | null;
  text?: string | null;
  authorMeta?: string | null;
  visited?: string | null;
  title?: string | null;
  ownerReply?: { relativeDate?: string | null; text: string } | null;
};

export type GoogleReviewsSummary = {
  rating?: number;
  totalReviews?: number;
};

export type GoogleReviewsData = {
  reviews?: GoogleReview[];
  summary?: GoogleReviewsSummary;
  googleMapsUrl?: string;
};

type GoogleReviewsState = {
  data: GoogleReviewsData | null;
  isLoading: boolean;
  error: Error | null;
};

const coerceData = (value: unknown): GoogleReviewsData | null => {
  if (!value || typeof value !== "object") return null;
  return value as GoogleReviewsData;
};

export const useGoogleReviews = (): GoogleReviewsState => {
  const [data, setData] = useState<GoogleReviewsData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(googleReviewsUrl);
        if (!response.ok) {
          throw new Error(`Failed to load reviews: ${response.status}`);
        }
        const json = await response.json();
        if (isActive) {
          setData(coerceData(json));
          setError(null);
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err : new Error("Failed to load reviews"));
          setData(null);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, []);

  return { data, isLoading, error };
};
