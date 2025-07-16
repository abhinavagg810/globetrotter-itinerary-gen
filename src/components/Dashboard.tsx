import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plus, BookOpen, User, Bell, Plane, Star, Globe, Award, TrendingUp } from "lucide-react";
import { CurrencySelector } from "./CurrencySelector";
import premiumDashboardBg from "@/assets/premium-dashboard-bg.jpg";

interface DashboardProps {
  onCreateItinerary: () => void;
  onViewItineraries: () => void;
  onProfile: () => void;
}

export function Dashboard({ onCreateItinerary, onViewItineraries, onProfile }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-orange-400 text-white p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Plane className="h-8 w-8" />
            <h1 className="text-2xl font-bold">VoyageAI</h1>
          </div>
          <div className="flex gap-2 items-center">
            <CurrencySelector />
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onProfile}>
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-2">Welcome back, Explorer! ✈️</h2>
        <p className="text-white/90">Ready to plan your next adventure?</p>
      </div>

      {/* Main Actions */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg transition-all transform hover:scale-105"
            onClick={onCreateItinerary}
          >
            <CardContent className="p-6 text-center">
              <Plus className="h-12 w-12 mx-auto mb-3" />
              <CardTitle className="text-lg mb-1">Create Itinerary</CardTitle>
              <p className="text-white/80 text-sm">Plan your perfect trip</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-lg transition-all transform hover:scale-105"
            onClick={onViewItineraries}
          >
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-3" />
              <CardTitle className="text-lg mb-1">My Itineraries</CardTitle>
              <p className="text-white/80 text-sm">View your trips</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Trips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              Recent Trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="text-2xl">🏝️</div>
                <div>
                  <h4 className="font-semibold">Bali Paradise</h4>
                  <p className="text-sm text-gray-600">Dec 15-22, 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="text-2xl">🏛️</div>
                <div>
                  <h4 className="font-semibold">European Adventure</h4>
                  <p className="text-sm text-gray-600">Oct 5-18, 2024</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <div className="flex justify-around">
          <Button variant="ghost" className="flex flex-col gap-1 text-blue-500">
            <MapPin className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" className="flex flex-col gap-1" onClick={onCreateItinerary}>
            <Plus className="h-5 w-5" />
            <span className="text-xs">Create</span>
          </Button>
          <Button variant="ghost" className="flex flex-col gap-1" onClick={onViewItineraries}>
            <BookOpen className="h-5 w-5" />
            <span className="text-xs">Trips</span>
          </Button>
          <Button variant="ghost" className="flex flex-col gap-1" onClick={onProfile}>
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
}