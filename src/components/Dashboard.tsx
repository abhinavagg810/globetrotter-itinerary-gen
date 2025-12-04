import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Plus, Calendar, User, Plane, FolderOpen, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface DashboardProps {
  onCreateItinerary: () => void;
  onViewItineraries: () => void;
  onProfile: () => void;
}

export function Dashboard({ onCreateItinerary, onViewItineraries, onProfile }: DashboardProps) {
  const { user, signOut } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border/50 p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-premium rounded-lg flex items-center justify-center shadow-sm">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">TravelGlobe</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onProfile}
              className="text-muted-foreground hover:text-foreground"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={signOut}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-10">
        {/* Welcome Section */}
        <div className="text-center py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Welcome back
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Ready to plan your next adventure? Create a new trip or continue working on your existing itineraries.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="group hover:shadow-elegant transition-all duration-300 cursor-pointer border border-border/50 bg-card" onClick={onCreateItinerary}>
            <CardHeader className="pb-3">
              <div className="w-14 h-14 bg-gradient-premium rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm">
                <Plus className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-xl text-foreground">Create New Trip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Let AI plan your perfect itinerary. Just tell us where and when you want to travel.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                Start Planning
                <MapPin className="w-4 h-4 ml-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-elegant transition-all duration-300 cursor-pointer border border-border/50 bg-card" onClick={onViewItineraries}>
            <CardHeader className="pb-3">
              <div className="w-14 h-14 bg-gradient-sage rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm">
                <FolderOpen className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-xl text-foreground">My Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                View and manage your saved itineraries, track expenses, and collaborate with trip mates.
              </p>
              <div className="flex items-center text-secondary font-medium group-hover:gap-2 transition-all">
                View Trips
                <Calendar className="w-4 h-4 ml-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Travel Tips */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-8">Quick Tips</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="p-5 bg-muted/50 rounded-xl border border-border/30">
              <h3 className="font-medium text-foreground mb-2">Upload Documents</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Add your booking confirmations to automatically organize your trip timeline.</p>
            </div>
            <div className="p-5 bg-muted/50 rounded-xl border border-border/30">
              <h3 className="font-medium text-foreground mb-2">Invite Trip Mates</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Collaborate on planning and split expenses seamlessly with your travel companions.</p>
            </div>
            <div className="p-5 bg-muted/50 rounded-xl border border-border/30">
              <h3 className="font-medium text-foreground mb-2">Track Expenses</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Keep track of all trip costs and easily settle up with your group at the end.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
