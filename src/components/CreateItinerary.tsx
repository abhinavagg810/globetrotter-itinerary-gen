import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, MapPin, Sparkles, CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PlaceSuggestions } from "./PlaceSuggestions";

interface CreateItineraryProps {
  onBack: () => void;
  onGenerate: (data: ItineraryData) => void;
}

export interface ItineraryData {
  fromLocation: string;
  destinations: string[];
  travelType: string;
  fromDate: Date | undefined;
  toDate: Date | undefined;
}

export function CreateItinerary({ onBack, onGenerate }: CreateItineraryProps) {
  const [formData, setFormData] = useState<ItineraryData>({
    fromLocation: "",
    destinations: [""],
    travelType: "adventure",
    fromDate: new Date(),
    toDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const handleSubmit = () => {
    if (formData.fromDate && formData.toDate && formData.fromDate > formData.toDate) {
      alert("End date must be after start date");
      return;
    }
    onGenerate(formData);
  };

  const addDestination = () => {
    setFormData(prev => ({ ...prev, destinations: [...prev.destinations, ""] }));
  };

  const removeDestination = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      destinations: prev.destinations.filter((_, i) => i !== index) 
    }));
  };

  const updateDestination = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.map((dest, i) => i === index ? value : dest)
    }));
  };

  const getDaysDifference = () => {
    if (!formData.fromDate || !formData.toDate) return 0;
    const timeDiff = formData.toDate.getTime() - formData.fromDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const travelTypes = [
    { id: "romantic", label: "Romantic", emoji: "💕" },
    { id: "adventure", label: "Adventure", emoji: "🏔️" },
    { id: "family", label: "Family", emoji: "👨‍👩‍👧‍👦" },
    { id: "solo", label: "Solo", emoji: "🚶" },
    { id: "luxury", label: "Luxury", emoji: "👑" },
    { id: "budget", label: "Budget", emoji: "💰" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky/10 to-sand/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-soft border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-bold text-lg text-deep-blue">Create Itinerary</h1>
            <p className="text-sm text-muted-foreground">Plan your perfect journey</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Locations */}
        <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-deep-blue">
              <MapPin className="h-5 w-5 text-primary" />
              Where are you traveling?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-deep-blue font-medium">From (Starting Location)</Label>
              <PlaceSuggestions
                value={formData.fromLocation}
                onChange={(value) => setFormData(prev => ({ ...prev, fromLocation: value }))}
                placeholder="e.g., Mumbai, India"
                className="mt-2 bg-white/70 border-border/50"
              />
            </div>
            <div>
              <Label className="text-deep-blue font-medium">Destinations</Label>
              <div className="space-y-3 mt-2">
                {formData.destinations.map((destination, index) => (
                  <div key={index} className="flex gap-2">
                    <PlaceSuggestions
                      value={destination}
                      onChange={(value) => updateDestination(index, value)}
                      placeholder={`Destination ${index + 1}`}
                      className="bg-white/70 border-border/50"
                    />
                    {formData.destinations.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeDestination(index)}
                        className="shrink-0 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addDestination}
                  className="w-full border-dashed border-2 hover:bg-primary/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Destination
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Travel Type */}
        <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-deep-blue">
              <Sparkles className="h-5 w-5 text-accent" />
              What's your travel style?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {travelTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer text-center transition-all hover:scale-105 ${
                    formData.travelType === type.id
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border/50 hover:border-primary/50 bg-white/70"
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, travelType: type.id }))}
                >
                  <div className="text-2xl mb-1">{type.emoji}</div>
                  <div className="font-semibold text-sm text-deep-blue">{type.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-deep-blue">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Travel Dates
              {getDaysDifference() > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({getDaysDifference()} days)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-deep-blue font-medium">From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2 bg-white/70 border-border/50",
                        !formData.fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.fromDate ? format(formData.fromDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.fromDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, fromDate: date }))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-deep-blue font-medium">To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2 bg-white/70 border-border/50",
                        !formData.toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.toDate ? format(formData.toDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.toDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, toDate: date }))}
                      initialFocus
                      className="pointer-events-auto"
                      disabled={(date) =>
                        formData.fromDate ? date < formData.fromDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border/50 p-4 z-10">
        <Button 
          onClick={handleSubmit}
          className="w-full h-12"
          variant="premium"
          size="lg"
          disabled={!formData.fromLocation || !formData.destinations[0] || !formData.fromDate || !formData.toDate}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Generate {getDaysDifference()} Day Itinerary
          <Sparkles className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}