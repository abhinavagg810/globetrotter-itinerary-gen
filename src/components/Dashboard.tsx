import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plus, BookOpen, User, Bell, Plane, Star, Globe, Award, TrendingUp, Camera, Navigation } from "lucide-react";
import premiumDashboardBg from "@/assets/premium-dashboard-bg.jpg";

interface DashboardProps {
  onCreateItinerary: () => void;
  onViewItineraries: () => void;
  onProfile: () => void;
}

export function Dashboard({ onCreateItinerary, onViewItineraries, onProfile }: DashboardProps) {
  const popularDestinations = [
    { name: "Bali", emoji: "🏝️", country: "Indonesia", description: "Tropical paradise with stunning beaches" },
    { name: "Singapore", emoji: "🏙️", country: "Singapore", description: "Modern city-state with rich culture" },
    { name: "Thailand", emoji: "🛺", country: "Thailand", description: "Land of smiles and amazing food" },
    { name: "Paris", emoji: "🗼", country: "France", description: "City of lights and romance" },
    { name: "Tokyo", emoji: "🏮", country: "Japan", description: "Vibrant metropolis blending tradition" },
    { name: "Dubai", emoji: "🕌", country: "UAE", description: "Luxury destination with modern marvels" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky/10 to-sand/30">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-r from-blue-500 to-orange-400 text-white p-6 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.8), rgba(251, 146, 60, 0.8)), url(${premiumDashboardBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
              <Plane className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold">Travel Globe AI</h1>
          </div>
          <div className="flex gap-2 items-center">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 backdrop-blur-sm">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 backdrop-blur-sm" onClick={onProfile}>
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Discover Your Next Adventure ✈️</h2>
          <p className="text-white/90 mb-6">AI-powered travel planning for unforgettable journeys</p>
          
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>200+ Destinations</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>Premium Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>AI Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-2 gap-3">
          <Card 
            className="cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg transition-all transform hover:scale-[1.02] border-0 rounded-2xl"
            onClick={onCreateItinerary}
          >
            <CardContent className="p-4 text-center">
              <Plus className="h-6 w-6 mx-auto mb-2" />
              <CardTitle className="text-sm mb-1">Create Itinerary</CardTitle>
              <p className="text-white/80 text-xs">Plan your perfect trip</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-lg transition-all transform hover:scale-[1.02] border-0 rounded-2xl"
            onClick={onViewItineraries}
          >
            <CardContent className="p-4 text-center">
              <BookOpen className="h-6 w-6 mx-auto mb-2" />
              <CardTitle className="text-sm mb-1">My Itineraries</CardTitle>
              <p className="text-white/80 text-xs">View your trips</p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-deep-blue">
              <Star className="h-5 w-5 text-primary" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <div>
                <h4 className="font-semibold text-deep-blue text-sm">Tell us where you want to go</h4>
                <p className="text-xs text-muted-foreground">Share your destination & preferences</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold text-deep-blue text-sm">AI creates your itinerary</h4>
                <p className="text-xs text-muted-foreground">Smart planning with local insights</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold text-deep-blue text-sm">Enjoy your perfect trip</h4>
                <p className="text-xs text-muted-foreground">Follow your plan & make memories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Us */}
        <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-deep-blue">
              <Award className="h-5 w-5 text-primary" />
              Why Choose Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl mb-1">🤖</div>
                <h4 className="font-semibold text-deep-blue text-xs mb-1">AI-Powered</h4>
                <p className="text-xs text-muted-foreground">Smart algorithms</p>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl mb-1">⚡</div>
                <h4 className="font-semibold text-deep-blue text-xs mb-1">Lightning Fast</h4>
                <p className="text-xs text-muted-foreground">Plan in minutes</p>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl mb-1">🌍</div>
                <h4 className="font-semibold text-deep-blue text-xs mb-1">Global Coverage</h4>
                <p className="text-xs text-muted-foreground">200+ destinations</p>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl mb-1">💫</div>
                <h4 className="font-semibold text-deep-blue text-xs mb-1">Personalized</h4>
                <p className="text-xs text-muted-foreground">Tailored for you</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Trips */}
        <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-deep-blue">
              <MapPin className="h-5 w-5 text-primary" />
              Recent Trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-all cursor-pointer">
                <div className="text-2xl">🏝️</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-deep-blue">Bali Paradise</h4>
                  <p className="text-sm text-muted-foreground">Dec 15-22, 2024</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-green-600 font-medium">Completed</div>
                  <div className="text-xs text-muted-foreground">7 days</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-all cursor-pointer">
                <div className="text-2xl">🏛️</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-deep-blue">European Adventure</h4>
                  <p className="text-sm text-muted-foreground">Oct 5-18, 2024</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-orange-600 font-medium">In Progress</div>
                  <div className="text-xs text-muted-foreground">14 days</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}