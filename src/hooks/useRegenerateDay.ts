import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AIItineraryDay, AIItineraryActivity } from "./useGenerateItinerary";

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

  const regenerateDay = async (params: RegenerateDayParams): Promise<AIItineraryDay | null> => {
    setIsRegenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("regenerate-day", {
        body: params,
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to regenerate day");
      }

      if (data?.error) {
        if (data.error.includes("Rate limit")) {
          toast.error("Too many requests. Please wait a moment and try again.");
        } else if (data.error.includes("credits")) {
          toast.error("Please add credits to continue using AI features.");
        } else {
          toast.error(data.error);
        }
        throw new Error(data.error);
      }

      toast.success(`Day ${params.dayNumber} regenerated successfully!`);
      return data as AIItineraryDay;
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
    regeneratedDay: AIItineraryDay
  ): Promise<boolean> => {
    try {
      // Find the day record
      const { data: dayRecord, error: dayError } = await supabase
        .from("itinerary_days")
        .select("id")
        .eq("itinerary_id", itineraryId)
        .eq("day_number", dayNumber)
        .single();

      if (dayError || !dayRecord) {
        console.error("Error finding day:", dayError);
        return false;
      }

      // Update day details
      const { error: updateError } = await supabase
        .from("itinerary_days")
        .update({
          notes: regeneratedDay.theme,
          location: regeneratedDay.location,
        })
        .eq("id", dayRecord.id);

      if (updateError) {
        console.error("Error updating day:", updateError);
        return false;
      }

      // Delete existing activities
      const { error: deleteError } = await supabase
        .from("activities")
        .delete()
        .eq("itinerary_day_id", dayRecord.id);

      if (deleteError) {
        console.error("Error deleting activities:", deleteError);
        return false;
      }

      // Insert new activities
      const activitiesInsert = regeneratedDay.activities.map((activity) => ({
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
        const { error: insertError } = await supabase
          .from("activities")
          .insert(activitiesInsert);

        if (insertError) {
          console.error("Error inserting activities:", insertError);
          return false;
        }
      }

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
