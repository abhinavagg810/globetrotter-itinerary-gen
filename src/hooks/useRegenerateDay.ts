import { useState } from "react";
import { api, AIItineraryDay } from "@/services/api";
import { toast } from "sonner";
import { AIItineraryActivity } from "./useGenerateItinerary";

interface RegenerateDayParams {
  dayNumber: number;
  date: string;
  location: string;
  currentActivities: AIItineraryActivity[];
  changeRequest: string;
  destination?: string;
  travelVibes?: string[];
  travelingWith?: string;
}

export function useRegenerateDay() {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const regenerateDay = async (params: RegenerateDayParams, itineraryId?: string): Promise<AIItineraryDay | null> => {
    setIsRegenerating(true);

    try {
      if (!itineraryId) {
        throw new Error("Itinerary ID is required");
      }

      const { data, error } = await api.regenerateDay(itineraryId, {
        dayNumber: params.dayNumber,
        date: params.date,
        location: params.location,
        changeRequest: params.changeRequest,
        destination: params.destination,
        travelVibes: params.travelVibes,
        travelingWith: params.travelingWith,
      });

      if (error) {
        if (error.includes("Rate limit")) {
          toast.error("Too many requests. Please wait a moment and try again.");
        } else if (error.includes("credits")) {
          toast.error("Please add credits to continue using AI features.");
        } else {
          toast.error(error);
        }
        throw new Error(error);
      }

      if (!data) throw new Error("Failed to regenerate day");

      toast.success(`Day ${params.dayNumber} regenerated successfully!`);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to regenerate day";
      console.error("Error regenerating day:", errorMessage);
      
      if (!errorMessage.includes("Rate") && !errorMessage.includes("credits")) {
        toast.error(errorMessage);
      }
      
      return null;
    } finally {
      setIsRegenerating(false);
    }
  };

  const updateDayInDatabase = async (
    itineraryId: string,
    dayNumber: number,
    _regeneratedDay: AIItineraryDay
  ): Promise<boolean> => {
    try {
      // This would need a dedicated endpoint in Spring Boot
      // For now, we can call the regenerate endpoint which should handle the update
      console.log(`Updating day ${dayNumber} for itinerary ${itineraryId}`);
      return true;
    } catch (error) {
      console.error("Error updating day in database:", error);
      return false;
    }
  };

  return {
    regenerateDay,
    updateDayInDatabase,
    isRegenerating,
  };
}
