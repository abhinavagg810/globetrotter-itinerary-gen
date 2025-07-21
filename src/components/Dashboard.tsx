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
        <div className="grid gap-4">
          <Card 
            className="cursor-pointer bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:shadow-2xl transition-all transform hover:scale-[1.02] border-0 rounded-3xl overflow-hidden"
            onClick={onCreateItinerary}
          >
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <Plus className="h-16 w-16 mx-auto mb-4 bg-white/20 rounded-full p-3" />
                <CardTitle className="text-2xl font-black mb-2">Create Epic Trip ✨</CardTitle>
                <p className="text-white/90 text-lg font-medium">Let AI plan your perfect adventure</p>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer bg-gradient-to-br from-blue-500 to-cyan-500 text-white hover:shadow-2xl transition-all transform hover:scale-[1.02] border-0 rounded-3xl overflow-hidden"
            onClick={onViewItineraries}
          >
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <BookOpen className="h-16 w-16 mx-auto mb-4 bg-white/20 rounded-full p-3" />
                <CardTitle className="text-2xl font-black mb-2">My Adventures 🌟</CardTitle>
                <p className="text-white/90 text-lg font-medium">Explore your saved trips</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="bg-gradient-to-br from-orange-50 to-pink-50 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl font-black text-gray-800">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              How It Works 🚀
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-4 bg-white/70 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <div>
                  <h4 className="font-bold text-gray-800">Tell us where you wanna go</h4>
                  <p className="text-sm text-gray-600">Share your dream destination & preferences</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/70 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <div>
                  <h4 className="font-bold text-gray-800">AI creates your itinerary</h4>
                  <p className="text-sm text-gray-600">Smart planning with local insights & hidden gems</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/70 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <div>
                  <h4 className="font-bold text-gray-800">Live your best life!</h4>
                  <p className="text-sm text-gray-600">Follow your personalized plan & make memories</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Us */}
        <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl font-black text-gray-800">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              Why Us? 💎
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/70 rounded-2xl">
                <div className="text-3xl mb-2">🤖</div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">AI-Powered</h4>
                <p className="text-xs text-gray-600">Smart algorithms for perfect trips</p>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-2xl">
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">Lightning Fast</h4>
                <p className="text-xs text-gray-600">Plan trips in minutes, not hours</p>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-2xl">
                <div className="text-3xl mb-2">🌍</div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">Global Coverage</h4>
                <p className="text-xs text-gray-600">200+ destinations worldwide</p>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-2xl">
                <div className="text-3xl mb-2">💫</div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">Personalized</h4>
                <p className="text-xs text-gray-600">Tailored to your style & budget</p>
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