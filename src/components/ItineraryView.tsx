import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, Plane, Hotel, Camera, Utensils, Loader2, CheckCircle, Receipt, GripVertical, BarChart3, Sparkles, MapPin, Clock, Star, DollarSign, Info, CloudSun, FileText, Calendar, ChevronDown, Navigation, Car, Upload, Plus, X, Route, FootprintsIcon, Paperclip, Download, Eye } from "lucide-react";
import { ItineraryData } from "./CreateItinerary";
import { BookingDetails } from "./DocumentUpload";
import { ExpenseTracker } from "./ExpenseTracker";
import { TripMate } from "./TripMateManager";
import { ExpenseSplit } from "./ExpenseSplitter";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ItineraryViewProps {
  onBack: () => void;
  itineraryData: ItineraryData;
  onAddDetails: (itemType: 'flight' | 'hotel' | 'activity' | 'restaurant', itemTitle: string, itemId: string) => void;
  onViewExpenses: () => void;
  tripMates?: TripMate[];
  onUpdateTripMates?: (tripMates: TripMate[]) => void;
  expenseSplits?: ExpenseSplit[];
  onUpdateExpenseSplits?: (splits: ExpenseSplit[]) => void;
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
  location?: string;
  coordinates?: { lat: number; lng: number };
}

interface TransportationInfo {
  mode: 'flight' | 'car' | 'walk' | 'train' | 'bus';
  duration: string;
  distance: string;
}

export function ItineraryView({ 
  onBack, 
  itineraryData, 
  onAddDetails, 
  onViewExpenses, 
  bookingDetails,
  tripMates,
  onUpdateTripMates,
  expenseSplits,
  onUpdateExpenseSplits 
}: ItineraryViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<ItineraryItem | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedItem, setSelectedItem] = useState<ItineraryItem | null>(null);
  const [openSections, setOpenSections] = useState({
    budget: true,
    info: false,
    weather: false,
    visa: false,
    flights: false,
    hotels: false,
    documents: false
  });
  const { formatPrice, currentCurrency } = useCurrency();

  // Currency and timezone data for common destinations
  const destinationData: Record<string, { currency: { code: string; name: string; symbol: string; rate: number }; timezone: { name: string; offset: string; offsetHours: number } }> = {
    'Dubai': { currency: { code: 'AED', name: 'UAE Dirham', symbol: 'AED', rate: 3.67 }, timezone: { name: 'GST', offset: 'UTC+4', offsetHours: 4 } },
    'Singapore': { currency: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.35 }, timezone: { name: 'SGT', offset: 'UTC+8', offsetHours: 8 } },
    'London': { currency: { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 }, timezone: { name: 'GMT', offset: 'UTC+0', offsetHours: 0 } },
    'New York': { currency: { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 }, timezone: { name: 'EST', offset: 'UTC-5', offsetHours: -5 } },
    'Paris': { currency: { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 }, timezone: { name: 'CET', offset: 'UTC+1', offsetHours: 1 } },
    'Tokyo': { currency: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110 }, timezone: { name: 'JST', offset: 'UTC+9', offsetHours: 9 } },
    'Sydney': { currency: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.45 }, timezone: { name: 'AEDT', offset: 'UTC+11', offsetHours: 11 } },
    'Bangkok': { currency: { code: 'THB', name: 'Thai Baht', symbol: '฿', rate: 33 }, timezone: { name: 'ICT', offset: 'UTC+7', offsetHours: 7 } },
    'Mumbai': { currency: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 1 }, timezone: { name: 'IST', offset: 'UTC+5:30', offsetHours: 5.5 } },
    'Delhi': { currency: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 1 }, timezone: { name: 'IST', offset: 'UTC+5:30', offsetHours: 5.5 } },
  };

  const getDestinationCurrencyInfo = () => {
    if (!itineraryData.destinations || itineraryData.destinations.length === 0) return null;
    
    const destination = itineraryData.destinations[0];
    const data = Object.keys(destinationData).find(key => 
      destination.toLowerCase().includes(key.toLowerCase())
    );
    
    if (data) {
      const currencyInfo = destinationData[data].currency;
      // Calculate conversion rate from user's currency to destination currency
      const userToUsd = currentCurrency.code === 'USD' ? 1 : (1 / currentCurrency.rate);
      const usdToDestination = currencyInfo.rate;
      const conversionRate = (userToUsd * usdToDestination).toFixed(2);
      
      return {
        ...currencyInfo,
        rate: conversionRate
      };
    }
    
    return null;
  };

  const getTimezoneInfo = () => {
    if (!itineraryData.destinations || itineraryData.destinations.length === 0) return null;
    
    const destination = itineraryData.destinations[0];
    const data = Object.keys(destinationData).find(key => 
      destination.toLowerCase().includes(key.toLowerCase())
    );
    
    if (data) {
      const timezoneInfo = destinationData[data].timezone;
      // Assuming user is in IST (UTC+5:30) by default
      const userOffsetHours = 5.5;
      const timeDifference = timezoneInfo.offsetHours - userOffsetHours;
      
      let differenceText = '';
      if (timeDifference > 0) {
        differenceText = `${timeDifference} hours ahead`;
      } else if (timeDifference < 0) {
        differenceText = `${Math.abs(timeDifference)} hours behind`;
      } else {
        differenceText = 'Same time zone';
      }
      
      return {
        timezone: timezoneInfo.name,
        offset: timezoneInfo.offset,
        difference: differenceText
      };
    }
    
    return null;
  };

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

  const handleSave = (details: BookingDetails) => {
    setBookingDetailsDialogOpen(false);
    // Add logic to save edited booking details
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

  const [selectedBookingDetails, setSelectedBookingDetails] = useState<BookingDetails | null>(null);
  const [bookingDetailsDialogOpen, setBookingDetailsDialogOpen] = useState(false);

  const handleViewBookingDetails = (details: BookingDetails) => {
    setSelectedBookingDetails(details);
    setBookingDetailsDialogOpen(true);
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

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'flight': return Plane;
      case 'car': return Car;
      case 'walk': return FootprintsIcon;
      case 'train': return Route;
      case 'bus': return Navigation;
      default: return Car;
    }
  };

  const getTransportationBetween = (item1: ItineraryItem, item2: ItineraryItem): TransportationInfo => {
    // Simple logic to determine transportation mode
    if (item1.type === 'flight' || item2.type === 'flight') {
      return { mode: 'flight', duration: '2h 30m', distance: '450 km' };
    }
    
    // Random duration and distance for demo
    const durations = ['5 mins', '10 mins', '15 mins', '20 mins', '30 mins'];
    const distances = ['0.5 km', '1.2 km', '2.5 km', '3.8 km', '5.1 km'];
    const modes: ('car' | 'walk' | 'train' | 'bus')[] = ['car', 'walk', 'train', 'bus'];
    
    const mode = modes[Math.floor(Math.random() * modes.length)];
    const duration = durations[Math.floor(Math.random() * durations.length)];
    const distance = distances[Math.floor(Math.random() * distances.length)];
    
    return { mode, duration, distance };
  };

  const addNewPlace = (day: number) => {
    const newPlace: ItineraryItem = {
      id: `day-${day}-new-${Date.now()}`,
      time: "12:00",
      title: "New Activity",
      description: "Exciting new place to explore",
      type: "activity",
      price: "₹3,000",
      bookingStatus: "available",
      day: day,
      date: new Date(itineraryData.fromDate!.getTime() + (day - 1) * 24 * 60 * 60 * 1000),
      basePrice: 3000,
      location: "City Center"
    };
    
    setItems(prev => [...prev, newPlace]);
  };

  const removePlace = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
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
      {/* Booking Details Dialog */}
      <Dialog open={bookingDetailsDialogOpen} onOpenChange={setBookingDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                {selectedBookingDetails?.type === 'flight' && <Plane className="h-5 w-5 text-primary" />}
                {selectedBookingDetails?.type === 'hotel' && <Hotel className="h-5 w-5 text-primary" />}
                {selectedBookingDetails?.type === 'activity' && <Camera className="h-5 w-5 text-primary" />}
                {selectedBookingDetails?.type === 'restaurant' && <Utensils className="h-5 w-5 text-primary" />}
              </div>
              Booking Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedBookingDetails?.type === 'flight' && (
            <div className="space-y-5">
              {/* Upload Button at Top */}
              <div className="flex justify-end">
                <Button 
                  size="sm"
                  variant="outline" 
                  onClick={() => onAddDetails('flight', selectedBookingDetails.title, selectedBookingDetails.id)}
                  className="text-xs"
                >
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Upload Documents
                </Button>
              </div>
              
              {/* Airline Details */}
              <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-deep-blue text-lg">{selectedBookingDetails.provider}</h3>
                  <Badge variant="outline" className="bg-white/80">
                    {selectedBookingDetails.flightNumber || 'Flight Number N/A'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="text-center flex-1">
                    <div className="text-sm text-muted-foreground">Departure</div>
                    <div className="font-bold text-xl text-deep-blue">
                      {selectedBookingDetails.departureAirport || selectedBookingDetails.departure?.split(' ')[0] || 'N/A'}
                    </div>
                    <div className="text-sm font-medium">
                      {selectedBookingDetails.departureTime 
                        ? new Date(selectedBookingDetails.departureTime).toLocaleDateString() 
                        : selectedBookingDetails.departure?.split(' ')[1] || 'Date N/A'}
                    </div>
                    <div className="text-sm text-primary">
                      {selectedBookingDetails.departureTime 
                        ? new Date(selectedBookingDetails.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                        : 'Time N/A'}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-0.5 bg-primary/20 relative">
                      <Plane className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-primary h-5 w-5" />
                    </div>
                  </div>
                  
                  <div className="text-center flex-1">
                    <div className="text-sm text-muted-foreground">Arrival</div>
                    <div className="font-bold text-xl text-deep-blue">
                      {selectedBookingDetails.arrivalAirport || selectedBookingDetails.arrival?.split(' ')[0] || 'N/A'}
                    </div>
                    <div className="text-sm font-medium">
                      {selectedBookingDetails.arrivalTime 
                        ? new Date(selectedBookingDetails.arrivalTime).toLocaleDateString() 
                        : selectedBookingDetails.arrival?.split(' ')[1] || 'Date N/A'}
                    </div>
                    <div className="text-sm text-primary">
                      {selectedBookingDetails.arrivalTime 
                        ? new Date(selectedBookingDetails.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                        : 'Time N/A'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Cost and Reference */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-border/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Cost</div>
                  <div className="text-xl font-bold text-primary">{formatPrice(selectedBookingDetails.cost)}</div>
                </div>
                <div className="p-4 border border-border/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Booking Reference</div>
                  <div className="font-semibold text-deep-blue">{selectedBookingDetails.bookingReference}</div>
                </div>
              </div>
              
              {/* Additional Notes */}
              {selectedBookingDetails.notes && (
                <div className="p-4 border border-border/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Additional Notes</div>
                  <div className="text-sm text-deep-blue">{selectedBookingDetails.notes}</div>
                </div>
              )}
              
              {/* Document Preview */}
              {selectedBookingDetails.documentUrl && (
                <div className="border border-border/30 rounded-lg overflow-hidden">
                  <div className="bg-muted/20 p-3 border-b border-border/30">
                    <div className="text-sm font-medium">Uploaded Document</div>
                  </div>
                  <div className="p-4 flex justify-center">
                    <img 
                      src={selectedBookingDetails.documentUrl} 
                      alt="Document preview" 
                      className="max-h-64 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {selectedBookingDetails?.type === 'hotel' && (
            <div className="space-y-5">
              {/* Upload Button at Top */}
              <div className="flex justify-end">
                <Button 
                  size="sm"
                  variant="outline" 
                  onClick={() => onAddDetails('hotel', selectedBookingDetails.title, selectedBookingDetails.id)}
                  className="text-xs"
                >
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Upload Documents
                </Button>
              </div>
              
              {/* Hotel Details */}
              <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-deep-blue text-lg">{selectedBookingDetails.provider}</h3>
                    {selectedBookingDetails.address && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedBookingDetails.address}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="bg-white/80">
                    Confirmation: {selectedBookingDetails.bookingReference}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/80 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Check-in</div>
                    <div className="font-bold text-deep-blue">
                      {selectedBookingDetails.checkIn 
                        ? new Date(selectedBookingDetails.checkIn).toLocaleDateString()
                        : 'Date not specified'}
                    </div>
                    <div className="text-sm text-primary">
                      {selectedBookingDetails.checkIn 
                        ? new Date(selectedBookingDetails.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                        : 'Time not specified'}
                    </div>
                  </div>
                  
                  <div className="bg-white/80 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Check-out</div>
                    <div className="font-bold text-deep-blue">
                      {selectedBookingDetails.checkOut
                        ? new Date(selectedBookingDetails.checkOut).toLocaleDateString()
                        : 'Date not specified'}
                    </div>
                    <div className="text-sm text-primary">
                      {selectedBookingDetails.checkOut
                        ? new Date(selectedBookingDetails.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                        : 'Time not specified'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Cost */}
              <div className="p-4 border border-border/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Total Cost</div>
                <div className="text-xl font-bold text-primary">{formatPrice(selectedBookingDetails.cost)}</div>
              </div>
              
              {/* Additional Notes */}
              {selectedBookingDetails.notes && (
                <div className="p-4 border border-border/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Additional Notes</div>
                  <div className="text-sm text-deep-blue">{selectedBookingDetails.notes}</div>
                </div>
              )}
              
              {/* Document Preview */}
              {selectedBookingDetails.documentUrl && (
                <div className="border border-border/30 rounded-lg overflow-hidden">
                  <div className="bg-muted/20 p-3 border-b border-border/30">
                    <div className="text-sm font-medium">Uploaded Document</div>
                  </div>
                  <div className="p-4 flex justify-center">
                    <img 
                      src={selectedBookingDetails.documentUrl} 
                      alt="Document preview" 
                      className="max-h-64 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Restaurant booking details */}
          {selectedBookingDetails?.type === 'restaurant' && (
            <div className="space-y-5">
              {/* Upload Button at Top */}
              <div className="flex justify-end">
                <Button 
                  size="sm"
                  variant="outline" 
                  onClick={() => onAddDetails('restaurant', selectedBookingDetails.title, selectedBookingDetails.id)}
                  className="text-xs"
                >
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Upload Documents
                </Button>
              </div>
              
              {/* Restaurant Details */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-deep-blue text-lg">{selectedBookingDetails.restaurantName || selectedBookingDetails.provider}</h3>
                  <Badge variant="outline" className="bg-white/80">
                    Restaurant
                  </Badge>
                </div>
                
                {selectedBookingDetails.address && (
                  <div className="text-sm text-muted-foreground mb-3">
                    📍 {selectedBookingDetails.address}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Date & Time</div>
                    <div className="font-semibold text-deep-blue">
                      {selectedBookingDetails.dateTime 
                        ? new Date(selectedBookingDetails.dateTime).toLocaleDateString() 
                        : 'Not specified'}
                    </div>
                    <div className="text-sm text-primary">
                      {selectedBookingDetails.dateTime 
                        ? new Date(selectedBookingDetails.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                        : ''}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Bill</div>
                    <div className="font-bold text-xl text-deep-blue">
                      {selectedBookingDetails.currency ? `${selectedBookingDetails.currency} ` : ''}
                      {selectedBookingDetails.totalBill || 'Not specified'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-border/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Booking Reference</div>
                  <div className="font-semibold text-deep-blue">{selectedBookingDetails?.bookingReference}</div>
                </div>
                <div className="p-4 border border-border/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">System Cost</div>
                  <div className="text-xl font-bold text-primary">{formatPrice(selectedBookingDetails.cost)}</div>
                </div>
              </div>
              
              {selectedBookingDetails?.notes && (
                <div className="p-4 border border-border/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Notes</div>
                  <div className="text-sm text-deep-blue">{selectedBookingDetails.notes}</div>
                </div>
              )}
              
              {selectedBookingDetails?.billUrl && (
                <div className="border border-border/30 rounded-lg overflow-hidden">
                  <div className="bg-muted/20 p-3 border-b border-border/30">
                    <div className="text-sm font-medium">Uploaded Bill</div>
                  </div>
                  <div className="p-4 flex justify-center">
                    <img 
                      src={selectedBookingDetails.billUrl} 
                      alt="Bill preview" 
                      className="max-h-64 object-contain"
                    />
                  </div>
                </div>
              )}
              
              {selectedBookingDetails?.documentUrl && (
                <div className="border border-border/30 rounded-lg overflow-hidden">
                  <div className="bg-muted/20 p-3 border-b border-border/30">
                    <div className="text-sm font-medium">Uploaded Document</div>
                  </div>
                  <div className="p-4 flex justify-center">
                    <img 
                      src={selectedBookingDetails.documentUrl} 
                      alt="Document preview" 
                      className="max-h-64 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Activity booking details */}
          {selectedBookingDetails?.type === 'activity' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-border/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Provider</div>
                  <div className="font-semibold text-deep-blue">{selectedBookingDetails?.provider}</div>
                </div>
                <div className="p-4 border border-border/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Booking Reference</div>
                  <div className="font-semibold text-deep-blue">{selectedBookingDetails?.bookingReference}</div>
                </div>
              </div>
              
              <div className="p-4 border border-border/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Cost</div>
                <div className="text-xl font-bold text-primary">{formatPrice(selectedBookingDetails.cost)}</div>
              </div>
              
              {selectedBookingDetails?.notes && (
                <div className="p-4 border border-border/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Notes</div>
                  <div className="text-sm text-deep-blue">{selectedBookingDetails.notes}</div>
                </div>
              )}
              
              {selectedBookingDetails?.documentUrl && (
                <div className="border border-border/30 rounded-lg overflow-hidden">
                  <div className="bg-muted/20 p-3 border-b border-border/30">
                    <div className="text-sm font-medium">Uploaded Document</div>
                  </div>
                  <div className="p-4 flex justify-center">
                    <img 
                      src={selectedBookingDetails.documentUrl} 
                      alt="Document preview" 
                      className="max-h-64 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
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
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Estimated Budget */}
            <Collapsible 
              open={openSections.budget} 
              onOpenChange={(open) => setOpenSections(prev => ({ ...prev, budget: open }))}
            >
              <Card className="bg-white/80 backdrop-blur-sm border border-border/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <CardTitle className="text-lg">Estimated Budget</CardTitle>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${openSections.budget ? 'rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">{formatPrice(150000)} - {formatPrice(200000)}</div>
                          <p className="text-sm text-muted-foreground mt-1">For {Math.ceil((itineraryData.toDate!.getTime() - itineraryData.fromDate!.getTime()) / (1000 * 3600 * 24))} days</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-lg font-semibold">{formatPrice(75000)}</div>
                          <div className="text-xs text-muted-foreground">Flights</div>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-lg font-semibold">{formatPrice(80000)}</div>
                          <div className="text-xs text-muted-foreground">Accommodation</div>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-lg font-semibold">{formatPrice(25000)}</div>
                          <div className="text-xs text-muted-foreground">Activities</div>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-lg font-semibold">{formatPrice(20000)}</div>
                          <div className="text-xs text-muted-foreground">Food & Dining</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Important Info */}
            <Collapsible 
              open={openSections.info} 
              onOpenChange={(open) => setOpenSections(prev => ({ ...prev, info: open }))}
            >
              <Card className="bg-white/80 backdrop-blur-sm border border-border/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Info className="h-5 w-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">Important Info</CardTitle>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${openSections.info ? 'rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {getDestinationCurrencyInfo() && (
                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                          <MapPin className="h-4 w-4 text-primary mt-0.5" />
                          <div className="text-sm flex-1">
                            <div className="font-medium">Local Currency</div>
                            <div className="text-muted-foreground">
                              {getDestinationCurrencyInfo()?.name} ({getDestinationCurrencyInfo()?.symbol})
                              {getDestinationCurrencyInfo()?.code !== currentCurrency.code && (
                                <div className="mt-1 text-xs">
                                  1 {currentCurrency.symbol} = ~{getDestinationCurrencyInfo()?.rate} {getDestinationCurrencyInfo()?.symbol}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      {getTimezoneInfo() && (
                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                          <Clock className="h-4 w-4 text-primary mt-0.5" />
                          <div className="text-sm flex-1">
                            <div className="font-medium">Time Zone</div>
                            <div className="text-muted-foreground">
                              {getTimezoneInfo()?.timezone} ({getTimezoneInfo()?.offset})
                              {getTimezoneInfo()?.difference && (
                                <div className="mt-1 text-xs">
                                  {getTimezoneInfo()?.difference} from your location
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <Star className="h-4 w-4 text-primary mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium">Local Customs</div>
                          <div className="text-muted-foreground">Respect local traditions and dress codes</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Weather Info */}
            <Collapsible 
              open={openSections.weather} 
              onOpenChange={(open) => setOpenSections(prev => ({ ...prev, weather: open }))}
            >
              <Card className="bg-white/80 backdrop-blur-sm border border-border/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <CloudSun className="h-5 w-5 text-orange-600" />
                        </div>
                        <CardTitle className="text-lg">Weather Info</CardTitle>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${openSections.weather ? 'rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">28°C</div>
                            <div className="text-sm text-muted-foreground">Average Temperature</div>
                          </div>
                          <div className="text-4xl">☀️</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-lg font-semibold">15%</div>
                          <div className="text-xs text-muted-foreground">Rain Chance</div>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-lg font-semibold">65%</div>
                          <div className="text-xs text-muted-foreground">Humidity</div>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-800">Packing Recommendations</div>
                        <div className="text-xs text-blue-600 mt-1">Light cotton clothes, sunscreen, hat, comfortable walking shoes</div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Visa Info */}
            <Collapsible 
              open={openSections.visa} 
              onOpenChange={(open) => setOpenSections(prev => ({ ...prev, visa: open }))}
            >
              <Card className="bg-white/80 backdrop-blur-sm border border-border/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-purple-600" />
                        </div>
                        <CardTitle className="text-lg">Visa Info</CardTitle>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${openSections.visa ? 'rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <div className="font-medium text-green-800">Visa on Arrival Available</div>
                        </div>
                        <div className="text-sm text-green-700">
                          30-day tourist visa available at airport for eligible countries
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Required Documents:</div>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>• Valid passport (6+ months remaining)</li>
                          <li>• Return ticket confirmation</li>
                          <li>• Proof of accommodation</li>
                          <li>• Sufficient funds proof</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Flights */}
            <Collapsible 
              open={openSections.flights} 
              onOpenChange={(open) => setOpenSections(prev => ({ ...prev, flights: open }))}
            >
              <Card className="bg-white/80 backdrop-blur-sm border border-border/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                          <Plane className="h-5 w-5 text-sky-600" />
                        </div>
                        <CardTitle className="text-lg">Flights</CardTitle>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${openSections.flights ? 'rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="p-4 border border-border/30 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-semibold">DEL</div>
                            <div className="text-sm text-muted-foreground">→</div>
                            <div className="text-lg font-semibold">{itineraryData.destinations[0]?.substring(0, 3).toUpperCase()}</div>
                          </div>
                          <Badge variant="secondary">{formatPrice(37500)}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {itineraryData.fromDate?.toLocaleDateString()} • 6:30 AM - 3:04 PM
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">INDIGO AI 295</div>
                      </div>
                      <div className="p-4 border border-border/30 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-semibold">{itineraryData.destinations[0]?.substring(0, 3).toUpperCase()}</div>
                            <div className="text-sm text-muted-foreground">→</div>
                            <div className="text-lg font-semibold">DEL</div>
                          </div>
                          <Badge variant="secondary">{formatPrice(37500)}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {itineraryData.toDate?.toLocaleDateString()} • 8:15 PM - 11:30 PM
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">INDIGO AI 298</div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Hotels */}
            <Collapsible 
              open={openSections.hotels} 
              onOpenChange={(open) => setOpenSections(prev => ({ ...prev, hotels: open }))}
            >
              <Card className="bg-white/80 backdrop-blur-sm border border-border/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                          <Hotel className="h-5 w-5 text-rose-600" />
                        </div>
                        <CardTitle className="text-lg">Hotels & Lodging</CardTitle>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${openSections.hotels ? 'rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="p-4 border border-border/30 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-semibold">The Luxury Resort</div>
                            <div className="text-sm text-muted-foreground">
                              {itineraryData.destinations[0]} • 4.8 ★
                            </div>
                          </div>
                          <Badge variant="secondary">{formatPrice(23000)}/night</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {itineraryData.fromDate?.toLocaleDateString()} - {itineraryData.toDate?.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-green-600 mt-1 font-medium">✓ Free cancellation</div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Documents */}
            <Collapsible 
              open={openSections.documents} 
              onOpenChange={(open) => setOpenSections(prev => ({ ...prev, documents: open }))}
            >
              <Card className="bg-white/80 backdrop-blur-sm border border-border/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Paperclip className="h-5 w-5 text-purple-600" />
                        </div>
                        <CardTitle className="text-lg">Documents</CardTitle>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${openSections.documents ? 'rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {bookingDetails && bookingDetails.length > 0 ? (
                        bookingDetails.map((booking, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                {booking.type === 'flight' && <Plane className="h-4 w-4 text-blue-600" />}
                                {booking.type === 'hotel' && <Hotel className="h-4 w-4 text-blue-600" />}
                                {booking.type === 'activity' && <Camera className="h-4 w-4 text-blue-600" />}
                                {booking.type === 'restaurant' && <Utensils className="h-4 w-4 text-blue-600" />}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{booking.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)} • 
                                  {booking.documentUrl ? '1 document' : 'No documents'}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-6 bg-muted/30 rounded-lg">
                          <Paperclip className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <div className="text-sm font-medium text-muted-foreground mb-1">No documents uploaded</div>
                          <div className="text-xs text-muted-foreground">
                            Upload booking confirmations, tickets, and other travel documents
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Quick upload button */}
                    <div className="mt-4 pt-4 border-t border-border/20">
                      <Button variant="outline" className="w-full" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </TabsContent>
          
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
                         const nextItem = dayItems[itemIndex + 1];
                         const transportInfo = nextItem ? getTransportationBetween(item, nextItem) : null;
                         const TransportIcon = transportInfo ? getTransportIcon(transportInfo.mode) : null;
                         
                         return (
                           <div key={item.id} className="space-y-3">
                             <Dialog>
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
                                           <>
                                             <Button
                                               variant="ghost"
                                               size="sm"
                                               className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                                               onClick={(e) => {
                                                 e.stopPropagation();
                                                 removePlace(item.id);
                                               }}
                                             >
                                               <X className="h-3 w-3" />
                                             </Button>
                                             <div className="p-1 rounded-full bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                               <GripVertical className="h-3 w-3 text-muted-foreground" />
                                             </div>
                                           </>
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
                           
                           {/* Transportation to Next Place */}
                           {transportInfo && TransportIcon && (
                             <div className="flex items-center justify-center py-3">
                               <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-border/30 rounded-full px-4 py-2 shadow-sm">
                                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                   <TransportIcon className="h-4 w-4 text-primary" />
                                   <span className="font-medium">{transportInfo.duration}</span>
                                   <span>•</span>
                                   <span>{transportInfo.distance}</span>
                                 </div>
                               </div>
                             </div>
                           )}
                           </div>
                         );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="expenses" className="space-y-4">
            <ExpenseTracker 
              expenses={bookingDetails} 
              onViewDetails={handleViewBookingDetails}
              tripMates={tripMates}
              onUpdateTripMates={onUpdateTripMates}
              expenseSplits={expenseSplits}
              onUpdateExpenseSplits={onUpdateExpenseSplits}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}