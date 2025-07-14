import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plane, Hotel, Camera, Utensils, Loader2, CheckCircle } from "lucide-react";
import { ItineraryData } from "./CreateItinerary";

interface ItineraryViewProps {
  onBack: () => void;
  itineraryData: ItineraryData;
  onBookingComplete: (itemId: string) => void;
}

interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'flight' | 'hotel' | 'activity' | 'restaurant';
  price?: string;
  bookingStatus: 'available' | 'booked' | 'loading';
}

export function ItineraryView({ onBack, itineraryData, onBookingComplete }: ItineraryViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<ItineraryItem[]>([]);

  useEffect(() => {
    const generateItinerary = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const sampleItems: ItineraryItem[] = [
        {
          id: "1",
          time: "08:00",
          title: `Flight from ${itineraryData.fromLocation}`,
          description: `Direct flight to ${itineraryData.destinations[0]}`,
          type: "flight",
          price: "$450",
          bookingStatus: "available",
        },
        {
          id: "2",
          time: "14:00",
          title: "Hotel Check-in",
          description: "Luxury Ocean View Resort",
          type: "hotel",
          price: "$280/night",
          bookingStatus: "available",
        },
        {
          id: "3",
          time: "16:00",
          title: "Beach Exploration",
          description: "Relax at pristine beaches",
          type: "activity",
          bookingStatus: "available"
        },
        {
          id: "4",
          time: "19:30",
          title: "Welcome Dinner",
          description: "Local cuisine experience",
          type: "restaurant",
          price: "$65",
          bookingStatus: "available",
        }
      ];
      
      setItems(sampleItems);
      setIsLoading(false);
    };

    generateItinerary();
  }, [itineraryData]);

  const handleBookNow = async (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, bookingStatus: 'loading' as const } : item
    ));

    await new Promise(resolve => setTimeout(resolve, 1500));

    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, bookingStatus: 'booked' as const } : item
    ));

    onBookingComplete(itemId);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'flight': return Plane;
      case 'hotel': return Hotel;
      case 'activity': return Camera;
      case 'restaurant': return Utensils;
      default: return Camera;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
            <h3 className="text-xl font-bold">Generating your perfect plan...</h3>
            <p className="text-gray-600">
              Our AI is crafting a personalized itinerary based on your preferences
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-bold text-lg">Your Itinerary</h1>
            <p className="text-sm text-gray-600">{itineraryData.destinations.join(" → ")}</p>
          </div>
        </div>
      </div>

      {/* Trip Summary */}
      <div className="p-4">
        <Card className="bg-gradient-to-r from-blue-500 to-orange-400 text-white mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-2">Day 1 - Arrival Day</h2>
            <p className="text-white/90">Welcome to {itineraryData.destinations[0]}!</p>
          </CardContent>
        </Card>

        {/* Itinerary Items */}
        <div className="space-y-4">
          {items.map((item) => {
            const Icon = getIcon(item.type);
            
            return (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-500 mt-1">
                        {item.time}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      
                      <div className="flex items-center justify-between">
                        {item.price && (
                          <span className="text-sm font-medium text-blue-600">
                            {item.price}
                          </span>
                        )}
                        
                        <div className="flex gap-2">
                          {item.bookingStatus === 'booked' ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Booked
                            </Badge>
                          ) : item.bookingStatus === 'loading' ? (
                            <Button disabled size="sm">
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              Booking...
                            </Button>
                          ) : item.price ? (
                            <Button 
                              size="sm"
                              onClick={() => handleBookNow(item.id)}
                              className="bg-orange-500 hover:bg-orange-600"
                            >
                              Book Now
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}