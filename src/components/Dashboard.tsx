import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Plus, Calendar, User, Plane, Camera } from 'lucide-react';

interface DashboardProps {
  onCreateItinerary: () => void;
  onViewItineraries: () => void;
  onProfile: () => void;
}

export function Dashboard({ onCreateItinerary, onViewItineraries, onProfile }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky/10 to-sage/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-soft border-b border-border/50 p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-sky to-sage rounded-lg flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-deep-blue">TravelAI</h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onProfile}
            className="text-deep-blue hover:text-sky"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
        {/* Welcome Section */}
        <div className="text-center py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-deep-blue mb-4">
            Welcome back!
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to plan your next adventure? Create a new trip or continue working on your existing itineraries.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="group hover:shadow-elegant transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm" onClick={onCreateItinerary}>
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-sky to-sage rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl text-deep-blue">Create New Trip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Let AI plan your perfect itinerary. Just tell us where and when you want to travel.
              </p>
              <div className="flex items-center text-sky font-medium">
                Start Planning
                <MapPin className="w-4 h-4 ml-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-elegant transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm" onClick={onViewItineraries}>
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-sage to-sand rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl text-deep-blue">My Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View and manage your saved itineraries, track expenses, and collaborate with trip mates.
              </p>
              <div className="flex items-center text-sage font-medium">
                View Trips
                <Camera className="w-4 h-4 ml-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity or Tips */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-deep-blue mb-6">Travel Tips</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="p-4 bg-white/60 rounded-xl">
              <h3 className="font-semibold text-deep-blue mb-2">🌟 Pro Tip</h3>
              <p className="text-sm text-muted-foreground">Upload your booking confirmations to automatically organize your trip timeline.</p>
            </div>
            <div className="p-4 bg-white/60 rounded-xl">
              <h3 className="font-semibold text-deep-blue mb-2">💡 Smart Planning</h3>
              <p className="text-sm text-muted-foreground">Invite trip mates early to collaborate on planning and split expenses seamlessly.</p>
            </div>
            <div className="p-4 bg-white/60 rounded-xl">
              <h3 className="font-semibold text-deep-blue mb-2">📱 Stay Organized</h3>
              <p className="text-sm text-muted-foreground">Access your itinerary offline by downloading the trip details to your device.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}