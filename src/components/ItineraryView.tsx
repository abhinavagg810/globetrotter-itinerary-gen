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
  day: number;
  date: Date;
}

export function ItineraryView({ onBack, itineraryData, onBookingComplete }: ItineraryViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<ItineraryItem[]>([]);

  useEffect(() => {
    const generateItinerary = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const getDaysDifference = () => {
        if (!itineraryData.fromDate || !itineraryData.toDate) return 1;
        const timeDiff = itineraryData.toDate.getTime() - itineraryData.fromDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
      };

      const numberOfDays = getDaysDifference();
      const generatedItems: ItineraryItem[] = [];

      for (let day = 0; day < numberOfDays; day++) {
        const currentDate = new Date(itineraryData.fromDate!);
        currentDate.setDate(currentDate.getDate() + day);
        
        const dayPrefix = `day-${day}`;
        const destinationIndex = day % itineraryData.destinations.length;
        const currentDestination = itineraryData.destinations[destinationIndex];

        if (day === 0) {
          // First day - arrival
          generatedItems.push({
            id: `${dayPrefix}-flight`,
            time: "08:00",
            title: `Flight from ${itineraryData.fromLocation}`,
            description: `Direct flight to ${currentDestination}`,
            type: "flight",
            price: "$450",
            bookingStatus: "available",
            day: day + 1,
            date: currentDate,
          });
          
          generatedItems.push({
            id: `${dayPrefix}-hotel`,
            time: "14:00",
            title: "Hotel Check-in",
            description: `Luxury accommodation in ${currentDestination}`,
            type: "hotel",
            price: "$280/night",
            bookingStatus: "available",
            day: day + 1,
            date: currentDate,
          });
          
          generatedItems.push({
            id: `${dayPrefix}-activity`,
            time: "16:00",
            title: "City Orientation",
            description: `Explore the highlights of ${currentDestination}`,
            type: "activity",
            bookingStatus: "available",
            day: day + 1,
            date: currentDate,
          });
        } else if (day === numberOfDays - 1) {
          // Last day - departure
          generatedItems.push({
            id: `${dayPrefix}-checkout`,
            time: "10:00",
            title: "Hotel Check-out",
            description: "Check out and prepare for departure",
            type: "hotel",
            bookingStatus: "available",
            day: day + 1,
            date: currentDate,
          });
          
          generatedItems.push({
            id: `${dayPrefix}-departure`,
            time: "15:00",
            title: `Flight to ${itineraryData.fromLocation}`,
            description: "Return journey",
            type: "flight",
            price: "$450",
            bookingStatus: "available",
            day: day + 1,
            date: currentDate,
          });
        } else {
          // Middle days - activities
          const activities = [
            { time: "09:00", title: "Morning Adventure", description: `Exciting morning activity in ${currentDestination}`, type: "activity" },
            { time: "12:30", title: "Local Lunch", description: "Authentic local cuisine experience", type: "restaurant", price: "$45" },
            { time: "15:00", title: "Cultural Experience", description: `Immerse in ${currentDestination}'s culture`, type: "activity" },
            { time: "19:00", title: "Evening Dining", description: "Fine dining experience", type: "restaurant", price: "$85" },
          ];
          
          activities.forEach((activity, index) => {
            generatedItems.push({
              id: `${dayPrefix}-${index}`,
              time: activity.time,
              title: activity.title,
              description: activity.description,
              type: activity.type as 'flight' | 'hotel' | 'activity' | 'restaurant',
              price: activity.price,
              bookingStatus: "available",
              day: day + 1,
              date: currentDate,
            });
          });
        }
        
        if (day < numberOfDays - 1) {
          generatedItems.push({
            id: `${dayPrefix}-dinner`,
            time: "19:30",
            title: "Welcome Dinner",
            description: `Local cuisine in ${currentDestination}`,
            type: "restaurant",
            price: "$65",
            bookingStatus: "available",
            day: day + 1,
            date: currentDate,
          });
        }
      }
      
      setItems(generatedItems);
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
    <div className="min-h-screen bg-gradient-to-br from-sky/10 to-sand/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-soft border-b border-border/50 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-bold text-lg text-deep-blue">Your Itinerary</h1>
            <p className="text-sm text-muted-foreground">{itineraryData.destinations.join(" → ")}</p>
          </div>
        </div>
      </div>

      {/* Trip Summary */}
      <div className="p-4">
        <Card className="bg-gradient-ocean text-white mb-6 shadow-premium border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {Math.ceil((itineraryData.toDate!.getTime() - itineraryData.fromDate!.getTime()) / (1000 * 3600 * 24))} Day Journey
                </h2>
                <p className="text-white/90 text-lg">Welcome to {itineraryData.destinations[0]}!</p>
                <p className="text-white/70 text-sm mt-1">
                  {itineraryData.fromDate?.toLocaleDateString()} - {itineraryData.toDate?.toLocaleDateString()}
                </p>
              </div>
              <div className="text-4xl">✈️</div>
            </div>
          </CardContent>
        </Card>

        {/* Multi-Day Itinerary */}
        <div className="space-y-6">
          {Array.from(new Set(items.map(item => item.day))).map((day) => {
            const dayItems = items.filter(item => item.day === day);
            const dayDate = dayItems[0]?.date;
            
            return (
              <div key={day} className="space-y-4">
                {/* Day Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-premium rounded-full flex items-center justify-center text-white font-bold">
                    {day}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-deep-blue">Day {day}</h3>
                    <p className="text-muted-foreground">
                      {dayDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Day Items */}
                <div className="space-y-3 pl-6 border-l-2 border-primary/20">
                  {dayItems.map((item) => {
                    const Icon = getIcon(item.type);
                    
                    return (
                      <Card key={item.id} className="bg-gradient-card backdrop-blur-sm border-0 shadow-soft hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="text-sm font-medium text-deep-blue mt-1">
                                {item.time}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1 text-deep-blue">{item.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                              
                              <div className="flex items-center justify-between">
                                {item.price && (
                                  <span className="text-sm font-medium text-primary">
                                    {item.price}
                                  </span>
                                )}
                                
                                <div className="flex gap-2">
                                  {item.bookingStatus === 'booked' ? (
                                    <Badge className="bg-mint/20 text-mint border-0">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Booked
                                    </Badge>
                                  ) : item.bookingStatus === 'loading' ? (
                                    <Button disabled size="sm" variant="outline">
                                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                      Booking...
                                    </Button>
                                  ) : item.price ? (
                                    <Button 
                                      size="sm"
                                      onClick={() => handleBookNow(item.id)}
                                      variant="coral"
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
            );
          })}
        </div>
      </div>
    </div>
  );
}