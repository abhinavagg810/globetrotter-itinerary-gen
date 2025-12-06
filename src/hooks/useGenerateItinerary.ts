import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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

export interface AIItinerary {
  tripName: string;
  destination?: string;
  summary: string;
  estimatedBudget: {
    total: number;
    breakdown: {
      flights: number;
      accommodation: number;
      activities: number;
      food: number;
      transportation: number;
      miscellaneous: number;
    };
    perPerson: number;
    currency: string;
    budgetLevel?: string;
  };
  importantInfo: {
    localCurrency: {
      code: string;
      name: string;
      symbol: string;
      exchangeRate: string;
    };
    timezone: {
      name: string;
      offset: string;
      differenceFromOrigin?: string;
      differenceFromIST?: string;
    };
    language: string;
    emergencyNumbers: {
      police: string;
      ambulance: string;
      tourist?: string;
    };
    bestTimeToVisit: string;
    visaRequirements: string;
    travelTips: string[];
  };
  weather: {
    temperature: {
      min: number;
      max: number;
      unit: string;
    };
    condition: string;
    humidity: string;
    packingTips: string[];
  };
  days: AIItineraryDay[];
  recommendations: {
    mustTry: string[];
    hiddenGems?: string[];
    avoidances: string[];
    localCustoms: string[];
    photoSpots?: string[];
  };
  practicalInfo?: {
    transportation?: string;
    simCard?: string;
    safety?: string;
    tipping?: string;
  };
}

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
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        "generate-itinerary",
        {
          body: {
            fromLocation: data.fromLocation,
            destinations: data.destinations.filter((d) => d.trim() !== ""),
            travelType: data.travelType,
            fromDate: data.fromDate?.toISOString().split("T")[0],
            toDate: data.toDate?.toISOString().split("T")[0],
            travelingWith: data.travelingWith,
            travelVibes: data.travelVibes,
            budget: data.budget,
            domesticOrInternational: data.domesticOrInternational,
            tripDuration: data.tripDuration,
            needsDestinationHelp: data.needsDestinationHelp,
          },
        }
      );

      if (functionError) {
        console.error("Edge function error:", functionError);
        throw new Error(functionError.message || "Failed to generate itinerary");
      }

      if (functionData?.error) {
        if (functionData.error.includes("Rate limit")) {
          toast({
            title: "Rate Limited",
            description: "Too many requests. Please wait a moment and try again.",
            variant: "destructive",
          });
        } else if (functionData.error.includes("credits")) {
          toast({
            title: "Credits Exhausted",
            description: "Please add credits to continue using AI features.",
            variant: "destructive",
          });
        }
        throw new Error(functionData.error);
      }

      const itinerary: AIItinerary = functionData;
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
    userId: string
  ): Promise<SavedItinerary | null> => {
    setIsSaving(true);

    try {
      // 1. Create the main itinerary record
      const { data: itineraryRecord, error: itineraryError } = await supabase
        .from("itineraries")
        .insert({
          user_id: userId,
          name: aiItinerary.tripName,
          destinations: data.destinations.filter((d) => d),
          start_date: data.fromDate?.toISOString().split("T")[0],
          end_date: data.toDate?.toISOString().split("T")[0],
          travel_type: data.travelType,
          status: "planning",
        })
        .select()
        .single();

      if (itineraryError) {
        console.error("Error creating itinerary:", itineraryError);
        throw new Error("Failed to save itinerary");
      }

      const itineraryId = itineraryRecord.id;

      // 2. Create itinerary days and activities
      for (const day of aiItinerary.days) {
        const { data: dayRecord, error: dayError } = await supabase
          .from("itinerary_days")
          .insert({
            itinerary_id: itineraryId,
            day_number: day.dayNumber,
            date: day.date,
            location: day.location,
            notes: day.theme,
          })
          .select()
          .single();

        if (dayError) {
          console.error("Error creating day:", dayError);
          continue;
        }

        // Create activities for this day
        const activitiesInsert = day.activities.map((activity) => ({
          itinerary_day_id: dayRecord.id,
          title: activity.title,
          description: activity.description,
          start_time: activity.time,
          end_time: activity.endTime || null,
          category: activity.type,
          cost: activity.price,
          location: activity.location || null,
          booking_status: activity.bookingStatus,
        }));

        if (activitiesInsert.length > 0) {
          const { error: activitiesError } = await supabase
            .from("activities")
            .insert(activitiesInsert);

          if (activitiesError) {
            console.error("Error creating activities:", activitiesError);
          }
        }
      }

      // 3. Add the trip owner as the first participant
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", userId)
        .single();

      await supabase.from("trip_participants").insert({
        itinerary_id: itineraryId,
        user_id: userId,
        name: userProfile?.full_name || "You",
        email: userProfile?.email || null,
        total_paid: 0,
        total_owed: 0,
      });

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
