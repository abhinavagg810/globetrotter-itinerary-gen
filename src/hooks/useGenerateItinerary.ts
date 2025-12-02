import { useState } from 'react';
import { ItineraryData } from '@/components/CreateItinerary';
import { useToast } from '@/hooks/use-toast';

export interface AIItineraryActivity {
  id: string;
  time: string;
  endTime?: string;
  title: string;
  description: string;
  type: 'flight' | 'hotel' | 'activity' | 'restaurant';
  price: number;
  location?: string;
  bookingStatus: 'available' | 'booked' | 'loading';
  tips?: string;
  rating?: number;
  duration?: string;
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
      differenceFromIST: string;
    };
    language: string;
    emergencyNumbers: {
      police: string;
      ambulance: string;
      tourist: string;
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
    avoidances: string[];
    localCustoms: string[];
  };
}

export function useGenerateItinerary() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<AIItinerary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateItinerary = async (data: ItineraryData): Promise<AIItinerary | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-itinerary`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            fromLocation: data.fromLocation,
            destinations: data.destinations.filter(d => d.trim() !== ''),
            travelType: data.travelType,
            fromDate: data.fromDate?.toISOString().split('T')[0],
            toDate: data.toDate?.toISOString().split('T')[0],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 429) {
          toast({
            title: "Rate Limited",
            description: "Too many requests. Please wait a moment and try again.",
            variant: "destructive",
          });
          throw new Error(errorData.error || "Rate limit exceeded");
        }
        
        if (response.status === 402) {
          toast({
            title: "Credits Exhausted",
            description: "Please add credits to continue using AI features.",
            variant: "destructive",
          });
          throw new Error(errorData.error || "Credits exhausted");
        }
        
        throw new Error(errorData.error || "Failed to generate itinerary");
      }

      const itinerary: AIItinerary = await response.json();
      setGeneratedItinerary(itinerary);
      
      toast({
        title: "Itinerary Generated!",
        description: `Your ${itinerary.days.length}-day ${data.travelType} trip is ready.`,
      });
      
      return itinerary;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate itinerary";
      setError(errorMessage);
      
      if (!errorMessage.includes("Rate") && !errorMessage.includes("Credits")) {
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

  return {
    generateItinerary,
    isGenerating,
    generatedItinerary,
    error,
    setGeneratedItinerary,
  };
}
