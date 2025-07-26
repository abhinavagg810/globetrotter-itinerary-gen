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
      <div className="flex justify-between items-center p-4 md:p-6 bg-white/80 backdrop-blur-sm border-b border-border/20">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-2 bg-gradient-premium rounded-full">
            <Plane className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          <h1 className="text-lg md:text-xl font-bold text-deep-blue">Travel Globe AI</h1>
        </div>
        <div className="flex gap-1 md:gap-2 items-center">
          <Button variant="ghost" size="icon" className="hover:bg-primary/10 h-8 w-8 md:h-10 md:w-10">
            <Bell className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10 h-8 w-8 md:h-10 md:w-10" onClick={onProfile}>
            <User className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>
      {/* Main Actions */}
      <div className="p-4 md:p-6 space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <Card 
            className="cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg transition-all transform hover:scale-[1.02] border-0 rounded-2xl"
            onClick={onCreateItinerary}
          >
            <CardContent className="p-4 md:p-6 text-center">
              <Plus className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2" />
              <CardTitle className="text-sm md:text-base mb-1">Create Itinerary</CardTitle>
              <p className="text-white/80 text-xs md:text-sm">Plan your perfect trip</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-lg transition-all transform hover:scale-[1.02] border-0 rounded-2xl"
            onClick={onViewItineraries}
          >
            <CardContent className="p-4 md:p-6 text-center">
              <BookOpen className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2" />
              <CardTitle className="text-sm md:text-base mb-1">My Itineraries</CardTitle>
              <p className="text-white/80 text-xs md:text-sm">View your trips</p>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-deep-blue text-lg md:text-xl">
              <Star className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              Features to replace all your other tools
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="text-center p-4 md:p-6 bg-white/50 rounded-xl">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <div className="text-xl md:text-2xl">🤖</div>
                </div>
                <h4 className="font-bold text-deep-blue text-sm md:text-base mb-2">AI-Powered Itinerary Planning</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Smart algorithms create personalized travel plans based on your preferences, budget, and interests.</p>
              </div>
              
              <div className="text-center p-6 bg-white/50 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">📄</div>
                </div>
                <h4 className="font-bold text-deep-blue text-base mb-2">Document Management</h4>
                <p className="text-sm text-muted-foreground">Store and organize all your travel documents - passports, tickets, reservations in one secure place.</p>
              </div>
              
              <div className="text-center p-6 bg-white/50 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">💰</div>
                </div>
                <h4 className="font-bold text-deep-blue text-base mb-2">Expense Tracking & Splitting</h4>
                <p className="text-sm text-muted-foreground">Keep track of your budget and easily split costs with travel companions in real-time.</p>
              </div>
              
              <div className="text-center p-6 bg-white/50 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">🎯</div>
                </div>
                <h4 className="font-bold text-deep-blue text-base mb-2">Personalized Recommendations</h4>
                <p className="text-sm text-muted-foreground">Get smart suggestions for places to visit, restaurants, and activities tailored to your travel style.</p>
              </div>
              
              <div className="text-center p-6 bg-white/50 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">✈️</div>
                </div>
                <h4 className="font-bold text-deep-blue text-base mb-2">Flight & Hotel Integration</h4>
                <p className="text-sm text-muted-foreground">Connect your email to automatically import flight and hotel reservations into your itinerary.</p>
              </div>
              
              <div className="text-center p-6 bg-white/50 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">👥</div>
                </div>
                <h4 className="font-bold text-deep-blue text-base mb-2">Collaborative Planning</h4>
                <p className="text-sm text-muted-foreground">Plan trips with friends and family using real-time collaboration and live editing features.</p>
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