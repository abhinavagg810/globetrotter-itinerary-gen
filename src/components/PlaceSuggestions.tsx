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
  { name: "Thailand", location: "Thailand", type: "Country", rating: 4.6 },
  { name: "Bangkok", location: "Thailand", type: "City", rating: 4.4 },
  { name: "Phuket", location: "Thailand", type: "Island", rating: 4.6 },
  { name: "Chiang Mai", location: "Chiang Mai Province, Thailand", type: "City", rating: 4.5 },
  { name: "Pattaya", location: "Chonburi Province, Thailand", type: "City", rating: 4.2 },
  { name: "Hua Hin", location: "Prachuap Khiri Khan Province, Thailand", type: "City", rating: 4.3 },
  { name: "Chiang Rai", location: "Chiang Rai Province, Thailand", type: "City", rating: 4.4 },
  { name: "Mumbai", location: "India", type: "City", rating: 4.5 },
  { name: "Delhi", location: "India", type: "City", rating: 4.2 },
  { name: "Bangalore", location: "India", type: "City", rating: 4.3 },
  { name: "Goa", location: "India", type: "City", rating: 4.7 },
  { name: "Dubai", location: "UAE", type: "City", rating: 4.8 },
  { name: "Singapore", location: "Singapore", type: "Country", rating: 4.6 },
  { name: "Bali", location: "Indonesia", type: "Island", rating: 4.9 },
  { name: "London", location: "UK", type: "City", rating: 4.5 },
  { name: "Paris", location: "France", type: "City", rating: 4.6 },
  { name: "New York", location: "USA", type: "City", rating: 4.4 },
  { name: "Tokyo", location: "Japan", type: "City", rating: 4.7 },
  { name: "Sydney", location: "Australia", type: "City", rating: 4.5 },
  { name: "Rome", location: "Italy", type: "City", rating: 4.6 },
  { name: "Barcelona", location: "Spain", type: "City", rating: 4.5 },
  { name: "Amsterdam", location: "Netherlands", type: "City", rating: 4.4 },
  { name: "Maldives", location: "Maldives", type: "Country", rating: 4.9 },
  { name: "Santorini", location: "Greece", type: "Island", rating: 4.8 },
  { name: "Mauritius", location: "Mauritius", type: "Country", rating: 4.7 },
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Country': return 'bg-blue-100 text-blue-800';
      case 'City': return 'bg-green-100 text-green-800';
      case 'Island': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/10 cursor-pointer transition-colors"
                  onClick={() => handleSuggestionClick(place.name)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-deep-blue text-sm">{place.name}</p>
                        <p className="text-xs text-muted-foreground">{place.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(place.type)}`}>
                          {place.type}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{place.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}