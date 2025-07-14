import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, Sparkles } from "lucide-react";

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
    onGenerate(formData);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold text-lg">Create Itinerary</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              Where are you traveling?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>From (Starting Location)</Label>
              <Input
                placeholder="e.g., New York, USA"
                value={formData.fromLocation}
                onChange={(e) => setFormData(prev => ({ ...prev, fromLocation: e.target.value }))}
              />
            </div>
            <div>
              <Label>To (Destination)</Label>
              <Input
                placeholder="e.g., Paris, France"
                value={formData.destinations[0]}
                onChange={(e) => setFormData(prev => ({ ...prev, destinations: [e.target.value] }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Travel Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              What's your travel style?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {travelTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer text-center transition-all ${
                    formData.travelType === type.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, travelType: type.id }))}
                >
                  <div className="text-2xl mb-1">{type.emoji}</div>
                  <div className="font-semibold text-sm">{type.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Travel Dates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>From Date</Label>
              <Input type="date" />
            </div>
            <div>
              <Label>To Date</Label>
              <Input type="date" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button 
          onClick={handleSubmit}
          className="w-full h-12 bg-gradient-to-r from-blue-500 to-orange-500 text-white"
          disabled={!formData.fromLocation || !formData.destinations[0]}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Itinerary
          <Sparkles className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}