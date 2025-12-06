import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Plus, Calendar, User, Plane, FolderOpen, LogOut, Sparkles, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface DashboardProps {
  onCreateItinerary: () => void;
  onViewItineraries: () => void;
  onProfile: () => void;
}

export function Dashboard({ onCreateItinerary, onViewItineraries, onProfile }: DashboardProps) {
  const { user, signOut } = useAuth();
  
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Traveler';
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-premium rounded-xl flex items-center justify-center shadow-md">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">TravelGlobe</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onProfile}
                className="text-muted-foreground hover:text-foreground"
              >
                <User className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* Welcome Section */}
        <div className="text-center py-8 md:py-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Trip Planning
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
            Welcome back, <span className="text-gradient-premium">{displayName}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Ready to plan your next adventure? Create a personalized itinerary in seconds with AI.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card 
            className="group hover:shadow-premium transition-all duration-500 cursor-pointer border-0 bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 overflow-hidden relative" 
            onClick={onCreateItinerary}
          >
            <div className="absolute inset-0 bg-gradient-premium opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
            <CardHeader className="pb-3 relative">
              <div className="w-16 h-16 bg-gradient-premium rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-foreground">Create New Trip</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Let AI craft your perfect itinerary. Just share your destination, dates, and travel preferences.
              </p>
              <div className="flex items-center text-primary font-semibold group-hover:gap-3 transition-all">
                Start Planning
                <MapPin className="w-4 h-4 ml-2 group-hover:animate-bounce" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="group hover:shadow-premium transition-all duration-500 cursor-pointer border-0 bg-gradient-to-br from-accent/5 to-accent/10 hover:from-accent/10 hover:to-accent/15 overflow-hidden relative" 
            onClick={onViewItineraries}
          >
            <div className="absolute inset-0 bg-gradient-sage opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
            <CardHeader className="pb-3 relative">
              <div className="w-16 h-16 bg-gradient-sage rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FolderOpen className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-foreground">My Trips</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                View and manage your saved itineraries, track expenses, and collaborate with trip mates.
              </p>
              <div className="flex items-center text-accent font-semibold group-hover:gap-3 transition-all">
                View All Trips
                <Calendar className="w-4 h-4 ml-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="pt-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-card border border-border/50 hover:shadow-elegant transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Share Preferences</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tell us your destination, dates, budget, and travel style
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card border border-border/50 hover:shadow-elegant transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">AI Creates Plan</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get a detailed day-by-day itinerary generated in seconds
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card border border-border/50 hover:shadow-elegant transition-shadow">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Customize & Go</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Adjust activities, invite friends, and track expenses
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
