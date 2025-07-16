import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Plane, Star } from "lucide-react";

interface PlaceSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const popularDestinations = [
  { name: "Mumbai, India", type: "city", rating: 4.5 },
  { name: "Delhi, India", type: "city", rating: 4.2 },
  { name: "Bangalore, India", type: "city", rating: 4.3 },
  { name: "Goa, India", type: "beach", rating: 4.7 },
  { name: "Dubai, UAE", type: "city", rating: 4.8 },
  { name: "Singapore", type: "city", rating: 4.6 },
  { name: "Bangkok, Thailand", type: "city", rating: 4.4 },
  { name: "Bali, Indonesia", type: "beach", rating: 4.9 },
  { name: "London, UK", type: "city", rating: 4.5 },
  { name: "Paris, France", type: "city", rating: 4.6 },
  { name: "New York, USA", type: "city", rating: 4.4 },
  { name: "Tokyo, Japan", type: "city", rating: 4.7 },
  { name: "Sydney, Australia", type: "city", rating: 4.5 },
  { name: "Rome, Italy", type: "city", rating: 4.6 },
  { name: "Barcelona, Spain", type: "city", rating: 4.5 },
  { name: "Amsterdam, Netherlands", type: "city", rating: 4.4 },
  { name: "Maldives", type: "beach", rating: 4.9 },
  { name: "Santorini, Greece", type: "beach", rating: 4.8 },
  { name: "Phuket, Thailand", type: "beach", rating: 4.6 },
  { name: "Mauritius", type: "beach", rating: 4.7 },
];

export function PlaceSuggestions({ value, onChange, placeholder, className }: PlaceSuggestionsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(popularDestinations);

  useEffect(() => {
    if (value.length > 0) {
      const filtered = popularDestinations.filter(place =>
        place.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(popularDestinations.slice(0, 8)); // Show top 8 when empty
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'beach': return '🏖️';
      case 'city': return '🏙️';
      default: return '📍';
    }
  };

  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className={className}
      />
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 bg-white/95 backdrop-blur-md border shadow-lg max-h-60 overflow-y-auto">
          <CardContent className="p-2">
            <div className="space-y-1">
              {filteredSuggestions.map((place, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/10 cursor-pointer transition-colors"
                  onClick={() => handleSuggestionClick(place.name)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-lg">{getTypeIcon(place.type)}</div>
                    <div>
                      <p className="font-medium text-deep-blue text-sm">{place.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{place.rating}</span>
                      </div>
                    </div>
                  </div>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}