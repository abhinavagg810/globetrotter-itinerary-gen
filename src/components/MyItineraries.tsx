import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Eye, Edit3, Plus, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface MyItinerariesProps {
  onBack: () => void;
  onViewItinerary: (id: string) => void;
  onCreateNew: () => void;
}

interface SavedItinerary {
  id: string;
  name: string;
  destinations: string[];
  start_date: string;
  end_date: string;
  status: string;
  travel_type: string | null;
  image_url: string | null;
  created_at: string;
}

export function MyItineraries({ onBack, onViewItinerary, onCreateNew }: MyItinerariesProps) {
  const [itineraries, setItineraries] = useState<SavedItinerary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadItineraries();
  }, []);

  const loadItineraries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItineraries(data || []);
    } catch (error) {
      console.error('Error loading itineraries:', error);
      toast.error('Failed to load your trips');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItinerary = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this trip?')) return;

    try {
      const { error } = await supabase
        .from('itineraries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setItineraries(prev => prev.filter(i => i.id !== id));
      toast.success('Trip deleted');
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      toast.error('Failed to delete trip');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDestinationEmoji = (destinations: string[]) => {
    const destination = destinations[0]?.toLowerCase() || '';
    if (destination.includes('bali') || destination.includes('beach') || destination.includes('maldives')) return '🏝️';
    if (destination.includes('paris') || destination.includes('rome') || destination.includes('europe')) return '🏛️';
    if (destination.includes('tokyo') || destination.includes('japan') || destination.includes('korea')) return '🏮';
    if (destination.includes('mountain') || destination.includes('swiss') || destination.includes('alps')) return '🏔️';
    if (destination.includes('london') || destination.includes('uk')) return '🇬🇧';
    if (destination.includes('dubai') || destination.includes('uae')) return '🏙️';
    if (destination.includes('singapore')) return '🇸🇬';
    if (destination.includes('thailand') || destination.includes('bangkok')) return '🇹🇭';
    if (destination.includes('australia') || destination.includes('sydney')) return '🇦🇺';
    if (destination.includes('usa') || destination.includes('new york') || destination.includes('america')) return '🗽';
    return '✈️';
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    } catch {
      return `${startDate} - ${endDate}`;
    }
  };

  const activeCount = itineraries.filter(i => i.status === 'active' || i.status === 'planning').length;
  const completedCount = itineraries.filter(i => i.status === 'completed').length;

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
              <div className="text-lg md:text-2xl font-bold text-orange-500">{activeCount}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-2 md:p-4 text-center">
              <div className="text-lg md:text-2xl font-bold text-green-500">{completedCount}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && itineraries.length === 0 && (
          <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">✈️</div>
              <h3 className="font-semibold text-lg text-deep-blue mb-2">No trips yet</h3>
              <p className="text-muted-foreground mb-4">Start planning your first adventure!</p>
              <Button variant="premium" onClick={onCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Trip
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Itineraries List */}
        {!isLoading && itineraries.length > 0 && (
          <div className="space-y-3 md:space-y-4">
            {itineraries.map((itinerary) => (
              <Card 
                key={itinerary.id} 
                className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
                onClick={() => onViewItinerary(itinerary.id)}
              >
                <CardContent className="p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <div className="text-3xl md:text-4xl self-center sm:self-start">
                      {getDestinationEmoji(itinerary.destinations)}
                    </div>
                    
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
                            {formatDateRange(itinerary.start_date, itinerary.end_date)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`${getStatusColor(itinerary.status)} text-xs`}>
                            {itinerary.status.charAt(0).toUpperCase() + itinerary.status.slice(1)}
                          </Badge>
                          {itinerary.travel_type && (
                            <Badge variant="outline" className="bg-white/50 text-xs">
                              {itinerary.travel_type}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewItinerary(itinerary.id);
                          }}
                          className="flex-1 bg-white/50 hover:bg-white/70 h-8 md:h-9"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span className="text-xs md:text-sm">View</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => handleDeleteItinerary(itinerary.id, e)}
                          className="bg-white/50 hover:bg-red-50 hover:text-red-600 hover:border-red-200 h-8 md:h-9"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
