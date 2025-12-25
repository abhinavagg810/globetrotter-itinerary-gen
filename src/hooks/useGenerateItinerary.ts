import { useState } from "react";
import { api, AIItinerary } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { ItineraryData } from "@/components/CreateItinerarySteps";

export interface AIItineraryActivity {
  id: string;
  time: string;
  endTime?: string;
  title: string;
  description: string;
  type: "flight" | "hotel" | "activity" | "restaurant";
  price: number;
  location?: string;
  bookingStatus: "available" | "booked" | "loading";
  tips?: string;
  rating?: number;
  duration?: string;
  bookingRequired?: boolean;
  dressCode?: string;
}

export interface AIItineraryDay {
  dayNumber: number;
  date: string;
  theme: string;
  location: string;
  activities: AIItineraryActivity[];
}

export type { AIItinerary } from "@/services/api";

export interface SavedItinerary {
  id: string;
  aiItinerary: AIItinerary;
}

export function useGenerateItinerary() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<AIItinerary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateItinerary = async (data: ItineraryData): Promise<AIItinerary | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const { data: itinerary, error: apiError } = await api.generateItinerary({
        fromLocation: data.fromLocation,
        destinations: data.destinations.filter((d) => d.trim() !== ""),
        travelType: data.travelType,
        fromDate: data.fromDate?.toISOString().split("T")[0] || "",
        toDate: data.toDate?.toISOString().split("T")[0] || "",
        travelingWith: data.travelingWith,
        travelVibes: data.travelVibes,
        budget: data.budget,
        domesticOrInternational: data.domesticOrInternational,
        tripDuration: String(data.tripDuration),
        needsDestinationHelp: data.needsDestinationHelp,
      });

      if (apiError) {
        if (apiError.includes("Rate limit")) {
          toast({
            title: "Rate Limited",
            description: "Too many requests. Please wait a moment and try again.",
            variant: "destructive",
          });
        } else if (apiError.includes("credits")) {
          toast({
            title: "Credits Exhausted",
            description: "Please add credits to continue using AI features.",
            variant: "destructive",
          });
        }
        throw new Error(apiError);
      }

      if (!itinerary) throw new Error("Failed to generate itinerary");

      setGeneratedItinerary(itinerary);

      toast({
        title: "Itinerary Generated",
        description: `Your ${itinerary.tripName} is ready.`,
      });

      return itinerary;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate itinerary";
      setError(errorMessage);

      if (!errorMessage.includes("Rate") && !errorMessage.includes("credits")) {
        toast({
          title: "Generation Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }

      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const saveItineraryToDatabase = async (
    data: ItineraryData,
    aiItinerary: AIItinerary,
    _userId: string
  ): Promise<SavedItinerary | null> => {
    setIsSaving(true);

    try {
      // Create the main itinerary record
      const { data: itineraryRecord, error: itineraryError } = await api.createItinerary({
        name: aiItinerary.tripName,
        destinations: data.destinations.filter((d) => d),
        startDate: data.fromDate?.toISOString().split("T")[0] || "",
        endDate: data.toDate?.toISOString().split("T")[0] || "",
        travelType: data.travelType,
        status: "planning",
      });

      if (itineraryError) {
        console.error("Error creating itinerary:", itineraryError);
        throw new Error("Failed to save itinerary");
      }

      if (!itineraryRecord) throw new Error("Failed to save itinerary");

      const itineraryId = itineraryRecord.id;

      // Note: Days and activities would need to be created via the Spring Boot backend
      // This would typically be handled by a dedicated endpoint that saves the full AI itinerary

      toast({
        title: "Trip Saved",
        description: "Your itinerary has been saved to your trips.",
      });

      return {
        id: itineraryId,
        aiItinerary,
      };
    } catch (error) {
      console.error("Error saving itinerary:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save itinerary. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    generateItinerary,
    saveItineraryToDatabase,
    isGenerating,
    isSaving,
    generatedItinerary,
    error,
    setGeneratedItinerary,
  };
}
