import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Eye, Edit3, Plus } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-bold text-lg">My Itineraries</h1>
          </div>
          <Button variant="ghost" onClick={onCreateNew}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{itineraries.length}</div>
              <div className="text-xs text-gray-600">Total Trips</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-500">
                {itineraries.filter(i => i.status === 'in-progress').length}
              </div>
              <div className="text-xs text-gray-600">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">
                {itineraries.filter(i => i.status === 'completed').length}
              </div>
              <div className="text-xs text-gray-600">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Itineraries List */}
        <div className="space-y-4">
          {itineraries.map((itinerary) => (
            <Card key={itinerary.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="text-4xl">{itinerary.image}</div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{itinerary.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {itinerary.destinations.join(" → ")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {itinerary.dates}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(itinerary.status)}>
                          {itinerary.status.charAt(0).toUpperCase() + itinerary.status.slice(1)}
                        </Badge>
                        <Badge variant="outline">{itinerary.travelType}</Badge>
                      </div>
                      <span className="text-sm text-gray-500">{itinerary.progress}% complete</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
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
                        className="flex-1"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
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