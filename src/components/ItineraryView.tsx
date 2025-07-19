import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plane, Hotel, Camera, Utensils, Loader2, CheckCircle, Receipt, GripVertical, BarChart3, Sparkles, MapPin, Clock, Star } from "lucide-react";
import { ItineraryData } from "./CreateItinerary";
import { BookingDetails } from "./DocumentUpload";
import { ExpenseTracker } from "./ExpenseTracker";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ItineraryViewProps {
  onBack: () => void;
  itineraryData: ItineraryData;
  onAddDetails: (itemType: 'flight' | 'hotel' | 'activity' | 'restaurant', itemTitle: string, itemId: string) => void;
  onViewExpenses: () => void;
  bookingDetails: BookingDetails[];
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
  basePrice: number; // Price in INR
}

export function ItineraryView({ onBack, itineraryData, onAddDetails, onViewExpenses, bookingDetails }: ItineraryViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<ItineraryItem | null>(null);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [selectedItem, setSelectedItem] = useState<ItineraryItem | null>(null);
  const { formatPrice } = useCurrency();

  const getActivityImage = (type: string, index: number) => {
    const images = {
      flight: [
        'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1469899908283-0c3fbe949d6e?w=600&h=400&fit=crop'
      ],
      hotel: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop'
      ],
      activity: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&h=400&fit=crop'
      ],
      restaurant: [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop'
      ]
    };
    return images[type as keyof typeof images]?.[index % images[type as keyof typeof images].length] || images.activity[0];
  };

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
            price: formatPrice(37500),
            bookingStatus: "available",
            day: day + 1,
            date: currentDate,
            basePrice: 37500,
          });
          
          generatedItems.push({
            id: `${dayPrefix}-hotel`,
            time: "14:00",
            title: "Hotel Check-in",
            description: `Luxury accommodation in ${currentDestination}`,
            type: "hotel",
            price: formatPrice(23000) + "/night",
            bookingStatus: "available",
            day: day + 1,
            date: currentDate,
            basePrice: 23000,
          });
          
          generatedItems.push({
            id: `${dayPrefix}-activity`,
            time: "16:00",
            title: "City Orientation",
            description: `Explore the highlights of ${currentDestination}`,
            type: "activity",
            price: formatPrice(5000),
            bookingStatus: "available",
            day: day + 1,
            date: currentDate,
            basePrice: 5000,
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
            basePrice: 0,
          });
          
          generatedItems.push({
            id: `${dayPrefix}-departure`,
            time: "15:00",
            title: `Flight to ${itineraryData.fromLocation}`,
            description: "Return journey",
            type: "flight",
            price: formatPrice(37500),
            bookingStatus: "available",
            day: day + 1,
            date: currentDate,
            basePrice: 37500,
          });
        } else {
          // Middle days - activities
          const activities = [
            { time: "09:00", title: "Morning Adventure", description: `Exciting morning activity in ${currentDestination}`, type: "activity", basePrice: 4500 },
            { time: "12:30", title: "Local Lunch", description: "Authentic local cuisine experience", type: "restaurant", basePrice: 3750 },
            { time: "15:00", title: "Cultural Experience", description: `Immerse in ${currentDestination}'s culture`, type: "activity", basePrice: 6000 },
            { time: "19:00", title: "Evening Dining", description: "Fine dining experience", type: "restaurant", basePrice: 7000 },
          ];
          
          activities.forEach((activity, index) => {
            generatedItems.push({
              id: `${dayPrefix}-${index}`,
              time: activity.time,
              title: activity.title,
              description: activity.description,
              type: activity.type as 'flight' | 'hotel' | 'activity' | 'restaurant',
              price: formatPrice(activity.basePrice),
              bookingStatus: "available",
              day: day + 1,
              date: currentDate,
              basePrice: activity.basePrice,
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
            price: formatPrice(5400),
            bookingStatus: "available",
            day: day + 1,
            date: currentDate,
            basePrice: 5400,
          });
        }
      }
      
      setItems(generatedItems);
      setIsLoading(false);
    };

    generateItinerary();
  }, [itineraryData]);

  const handleDragStart = (e: React.DragEvent, item: ItineraryItem) => {
    // Don't allow dragging first and last day items
    if (item.day === 1 || item.day === Math.max(...items.map(i => i.day))) {
      e.preventDefault();
      return;
    }
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetDay: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Don't allow dropping on first or last day
    if (targetDay === 1 || targetDay === Math.max(...items.map(i => i.day))) {
      setDraggedItem(null);
      return;
    }

    setItems(prev => prev.map(item => 
      item.id === draggedItem.id 
        ? { ...item, day: targetDay, date: new Date(itineraryData.fromDate!.getTime() + (targetDay - 1) * 24 * 60 * 60 * 1000) }
        : item
    ));
    setDraggedItem(null);
  };

  const handleViewBookingDetails = (details: BookingDetails) => {
    console.log('Viewing booking details:', details);
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
    <div className="w-full min-h-screen bg-gradient-to-br from-sky/10 to-sand/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-soft border-b border-border/50 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg text-deep-blue">Your Itinerary</h1>
              <p className="text-sm text-muted-foreground">{itineraryData.destinations.join(" → ")}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onViewExpenses}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Expenses
          </Button>
        </div>
      </div>

      {/* Trip Summary */}
      <div className="max-w-7xl mx-auto p-4">
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="itinerary" className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">
                💡 Drag activities between days to rearrange your schedule
              </p>
            </div>

            {/* Clean Day-by-Day Layout */}
            <div className="space-y-8">
              {Array.from(new Set(items.map(item => item.day))).map((day) => {
                const dayItems = items.filter(item => item.day === day);
                const dayDate = dayItems[0]?.date;
                const isFirstOrLastDay = day === 1 || day === Math.max(...items.map(i => i.day));
                
                return (
                  <div 
                    key={day} 
                    className="space-y-4"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day)}
                  >
                    {/* Sticky Day Header with Regenerate Button */}
                    <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-border/20 p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                            {day}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground">
                              Day {day} - {dayDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {dayDate?.toLocaleDateString('en-US', { weekday: 'long' })}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-9 text-xs bg-white/80 hover:bg-white border-primary/30 hover:border-primary"
                          onClick={() => {
                            // TODO: Implement regenerate day functionality
                            console.log(`Regenerating Day ${day}`);
                          }}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          Regenerate Day
                        </Button>
                      </div>
                    </div>

                    {/* Compact Card Items */}
                    <div className="space-y-3">
                      {dayItems.map((item, itemIndex) => {
                        const Icon = getIcon(item.type);
                        const hasBookingDetails = bookingDetails.some(bd => bd.title === item.title);
                        const imageUrl = getActivityImage(item.type, itemIndex);
                        
                        return (
                          <Dialog key={item.id}>
                            <DialogTrigger asChild>
                              <div 
                                className={`group cursor-pointer ${!isFirstOrLastDay ? 'hover:cursor-move' : ''}`}
                                draggable={!isFirstOrLastDay}
                                onDragStart={(e) => handleDragStart(e, item)}
                                onClick={() => setSelectedItem(item)}
                              >
                                <Card className="bg-white/80 backdrop-blur-sm border border-border/20 hover:shadow-md transition-all duration-200 overflow-hidden">
                                  <CardContent className="p-3">
                                    <div className="flex items-center gap-3">
                                      {/* Circular Number/Icon */}
                                      <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                          <span className="text-sm font-semibold text-primary">{itemIndex + 1}</span>
                                        </div>
                                      </div>
                                      
                                      {/* Content */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-foreground truncate">{item.title}</h4>
                                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
                                            
                                            <div className="flex items-center gap-3 mt-2">
                                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {item.time}
                                              </div>
                                              
                                              {item.type === 'activity' && (
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                  <MapPin className="h-3 w-3" />
                                                  15 mins • 0.5 mi
                                                </div>
                                              )}
                                              
                                              {item.price && (
                                                <span className="text-xs font-medium text-primary">{item.price}</span>
                                              )}
                                            </div>
                                          </div>
                                          
                                          {/* Small Thumbnail Image */}
                                          <div className="flex-shrink-0 ml-3">
                                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted">
                                              <img 
                                                src={imageUrl} 
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Status and Actions */}
                                      <div className="flex-shrink-0 flex items-center gap-2">
                                        {hasBookingDetails && (
                                          <div className="p-1 rounded-full bg-green-100">
                                            <CheckCircle className="h-3 w-3 text-green-600" />
                                          </div>
                                        )}
                                        {!isFirstOrLastDay && (
                                          <div className="p-1 rounded-full bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <GripVertical className="h-3 w-3 text-muted-foreground" />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </DialogTrigger>
                            
                            {/* Detail Modal */}
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-3">
                                  <div className="p-2 rounded-full bg-primary/10">
                                    <Icon className="h-5 w-5 text-primary" />
                                  </div>
                                  {item.title}
                                </DialogTitle>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                {/* Large Image */}
                                <div className="relative h-64 rounded-lg overflow-hidden">
                                  <img 
                                    src={imageUrl} 
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-4 left-4">
                                    <Badge className="bg-white/90 text-gray-800 font-medium">
                                      {item.time}
                                    </Badge>
                                  </div>
                                </div>
                                
                                {/* Details */}
                                <div className="space-y-3">
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Description</h4>
                                    <p className="text-foreground mt-1">{item.description}</p>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Time</h4>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>{item.time}</span>
                                      </div>
                                    </div>
                                    
                                    {item.price && (
                                      <div>
                                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Price</h4>
                                        <span className="text-lg font-semibold text-primary mt-1 block">{item.price}</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {item.type === 'activity' && (
                                    <div>
                                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Location Details</h4>
                                      <div className="flex items-center gap-2 mt-1">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>15 minutes walk • 0.5 miles</span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Rating</h4>
                                    <div className="flex items-center gap-1 mt-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                      ))}
                                      <span className="ml-2 text-sm text-muted-foreground">4.8 (324 reviews)</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                  {hasBookingDetails ? (
                                    <Button 
                                      className="flex-1"
                                      variant="outline"
                                      onClick={() => {
                                        const details = bookingDetails.find(bd => bd.title === item.title);
                                        if (details) handleViewBookingDetails(details);
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      View Booking Details
                                    </Button>
                                  ) : (
                                    <Button 
                                      className="flex-1"
                                      onClick={() => onAddDetails(item.type, item.title, item.id)}
                                    >
                                      <Receipt className="h-4 w-4 mr-2" />
                                      Add Booking Details
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="expenses" className="space-y-4">
            <ExpenseTracker expenses={bookingDetails} onViewDetails={handleViewBookingDetails} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}