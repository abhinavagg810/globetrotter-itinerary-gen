import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Eye, Edit3, Plus, Star, TrendingUp, Navigation } from "lucide-react";

interface MyItinerariesProps {
  onBack: () => void;
  onViewItinerary: (id: string) => void;
  onCreateNew: () => void;
}

interface SavedItinerary {
  id: string;
  name: string;
  destinations: string[];
  dates: string;
  status: 'planning' | 'in-progress' | 'completed';
  progress: number;
  image: string;
  travelType: string;
}

export function MyItineraries({ onBack, onViewItinerary, onCreateNew }: MyItinerariesProps) {
  const itineraries: SavedItinerary[] = [
    {
      id: "1",
      name: "Bali Paradise Getaway",
      destinations: ["Bali", "Lombok"],
      dates: "Dec 15-22, 2024",
      status: "in-progress",
      progress: 75,
      image: "🏝️",
      travelType: "Romantic",
    },
    {
      id: "2",
      name: "European Adventure",
      destinations: ["Paris", "Rome", "Barcelona"],
      dates: "Oct 5-18, 2024",
      status: "completed",
      progress: 100,
      image: "🏛️",
      travelType: "Adventure",
    },
    {
      id: "3",
      name: "Tokyo Urban Explorer",
      destinations: ["Tokyo", "Kyoto"],
      dates: "Mar 10-17, 2025",
      status: "planning",
      progress: 25,
      image: "🏮",
      travelType: "Solo",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky/10 to-sand/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-soft border-b border-border/50 p-3 md:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="ghost" onClick={onBack} className="h-8 w-8 md:h-10 md:w-10 p-0">
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <div>
              <h1 className="font-bold text-base md:text-lg text-deep-blue">My Itineraries</h1>
              <p className="text-xs md:text-sm text-muted-foreground">Your travel adventures</p>
            </div>
          </div>
          <Button variant="premium" size="sm" onClick={onCreateNew} className="w-full sm:w-auto">
            <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            <span className="text-xs md:text-sm">New Trip</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-2 md:p-4 text-center">
              <div className="text-lg md:text-2xl font-bold text-blue-500">{itineraries.length}</div>
              <div className="text-xs text-muted-foreground">Total Trips</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-2 md:p-4 text-center">
              <div className="text-lg md:text-2xl font-bold text-orange-500">
                {itineraries.filter(i => i.status === 'in-progress').length}
              </div>
              <div className="text-xs text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-2 md:p-4 text-center">
              <div className="text-lg md:text-2xl font-bold text-green-500">
                {itineraries.filter(i => i.status === 'completed').length}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Itineraries List */}
        <div className="space-y-3 md:space-y-4">
          {itineraries.map((itinerary) => (
            <Card key={itinerary.id} className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
              <CardContent className="p-3 md:p-4">
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <div className="text-3xl md:text-4xl self-center sm:self-start">{itinerary.image}</div>
                  
                  <div className="flex-1 space-y-2 md:space-y-3">
                    <div>
                      <h3 className="font-semibold text-base md:text-lg text-deep-blue">{itinerary.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs md:text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{itinerary.destinations.join(" → ")}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          {itinerary.dates}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${getStatusColor(itinerary.status)} text-xs`}>
                          {itinerary.status.charAt(0).toUpperCase() + itinerary.status.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="bg-white/50 text-xs">{itinerary.travelType}</Badge>
                      </div>
                      <span className="text-xs md:text-sm text-muted-foreground">{itinerary.progress}% complete</span>
                    </div>
                    
                    <div className="w-full bg-white/50 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full transition-all"
                        style={{ width: `${itinerary.progress}%` }}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onViewItinerary(itinerary.id)}
                        className="flex-1 bg-white/50 hover:bg-white/70 h-8 md:h-9"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        <span className="text-xs md:text-sm">View</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-white/50 hover:bg-white/70 h-8 md:h-9">
                        <Edit3 className="h-3 w-3 mr-1" />
                        <span className="text-xs md:text-sm">Edit</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}