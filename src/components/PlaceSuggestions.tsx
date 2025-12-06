import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Star, Search } from "lucide-react";
import { cn } from "@/lib/utils";

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
  { name: "Vietnam", location: "Vietnam", type: "Country", rating: 4.5 },
  { name: "Malaysia", location: "Malaysia", type: "Country", rating: 4.4 },
  { name: "Sri Lanka", location: "Sri Lanka", type: "Country", rating: 4.6 },
  { name: "Nepal", location: "Nepal", type: "Country", rating: 4.5 },
  { name: "Switzerland", location: "Switzerland", type: "Country", rating: 4.8 },
];

export function PlaceSuggestions({ value, onChange, placeholder, className }: PlaceSuggestionsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(popularDestinations.slice(0, 8));
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.length > 0) {
      const filtered = popularDestinations.filter(place =>
        place.name.toLowerCase().includes(value.toLowerCase()) ||
        place.location.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered.length > 0 ? filtered : []);
    } else {
      setFilteredSuggestions(popularDestinations.slice(0, 8));
    }
  }, [value]);

  // Handle clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Country': return 'bg-primary/10 text-primary';
      case 'City': return 'bg-ocean/10 text-ocean';
      case 'Island': return 'bg-terracotta/10 text-terracotta';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    return <MapPin className="h-3 w-3" />;
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          className={cn("pl-10", className)}
        />
      </div>
      
      {showSuggestions && (
        <Card className="absolute z-[100] w-full mt-2 bg-background border border-border shadow-xl max-h-72 overflow-hidden rounded-xl">
          <CardContent className="p-0">
            {filteredSuggestions.length > 0 ? (
              <div className="overflow-y-auto max-h-72">
                <div className="p-2 border-b border-border/50 bg-muted/30">
                  <p className="text-xs text-muted-foreground font-medium px-2">
                    {value ? `Results for "${value}"` : "Popular Destinations"}
                  </p>
                </div>
                <div className="p-1">
                  {filteredSuggestions.map((place, index) => (
                    <div
                      key={`${place.name}-${index}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 cursor-pointer transition-all duration-150 group"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(place.name);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                            {place.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{place.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          getTypeColor(place.type)
                        )}>
                          {place.type}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>{place.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <MapPin className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No destinations found</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Try searching for a city or country
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
