import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Eye, Plus, Loader2, Trash2, Globe, Sparkles } from "lucide-react";
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
      
      // Auto-update status based on dates
      const today = new Date();
      const updatedData = (data || []).map(trip => {
        const startDate = new Date(trip.start_date);
        const endDate = new Date(trip.end_date);
        
        let newStatus = trip.status;
        if (endDate < today && trip.status !== 'completed') {
          newStatus = 'completed';
        } else if (startDate <= today && endDate >= today && trip.status === 'planning') {
          newStatus = 'active';
        }
        
        // Update in database if status changed
        if (newStatus !== trip.status) {
          supabase.from('itineraries').update({ status: newStatus }).eq('id', trip.id).then();
        }
        
        return { ...trip, status: newStatus };
      });
      
      setItineraries(updatedData);
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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-primary/10 text-primary border-primary/20';
      case 'active': return 'bg-gold/10 text-gold border-gold/20';
      case 'completed': return 'bg-sage/10 text-sage border-sage/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDestinationEmoji = (destinations: string[]) => {
    const destination = destinations[0]?.toLowerCase() || '';
    if (destination.includes('bali') || destination.includes('beach') || destination.includes('maldives')) return '🏝️';
    if (destination.includes('paris') || destination.includes('rome') || destination.includes('europe')) return '🏛️';
    if (destination.includes('tokyo') || destination.includes('japan') || destination.includes('korea')) return '🏮';
    if (destination.includes('mountain') || destination.includes('swiss') || destination.includes('alps')) return '🏔️';
    if (destination.includes('london') || destination.includes('uk')) return '🇬🇧';
    if (destination.includes('dubai') || destination.includes('uae')) return '🌆';
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

  const getTripDuration = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return `${days} day${days > 1 ? 's' : ''}`;
    } catch {
      return '';
    }
  };

  const activeCount = itineraries.filter(i => i.status === 'active' || i.status === 'planning').length;
  const completedCount = itineraries.filter(i => i.status === 'completed').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-bold text-lg text-foreground">My Trips</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Your travel adventures</p>
              </div>
            </div>
            <Button onClick={onCreateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Trip</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{itineraries.length}</div>
              <div className="text-sm text-muted-foreground">Total Trips</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-gold/5 to-gold/10">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-gold">{activeCount}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-sage/5 to-sage/10">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-sage">{completedCount}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading your trips...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && itineraries.length === 0 && (
          <Card className="border-0 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-bold text-2xl text-foreground mb-3">No trips yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start planning your first adventure! Our AI will help you create the perfect itinerary.
              </p>
              <Button onClick={onCreateNew} size="lg" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Create Your First Trip
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Itineraries List */}
        {!isLoading && itineraries.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {itineraries.map((itinerary, index) => (
              <Card 
                key={itinerary.id} 
                className="group border-0 bg-card hover:shadow-premium transition-all duration-500 cursor-pointer overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => onViewItinerary(itinerary.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-premium flex items-center justify-center text-2xl shrink-0 shadow-md">
                      {getDestinationEmoji(itinerary.destinations)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-foreground truncate">{itinerary.name}</h3>
                        <Badge className={`shrink-0 ${getStatusStyles(itinerary.status)}`}>
                          {itinerary.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1.5 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{itinerary.destinations.join(" → ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>{formatDateRange(itinerary.start_date, itinerary.end_date)}</span>
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                            {getTripDuration(itinerary.start_date, itinerary.end_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewItinerary(itinerary.id);
                      }}
                      className="flex-1"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => handleDeleteItinerary(itinerary.id, e)}
                      className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
