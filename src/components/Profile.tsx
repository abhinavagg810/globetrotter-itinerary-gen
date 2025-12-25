import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Settings, Globe, Bell, Lock, Heart, Shield, Star, Loader2 } from "lucide-react";
import { CurrencySelector } from "./CurrencySelector";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ProfileProps {
  onBack: () => void;
}

export function Profile({ onBack }: ProfileProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState({ trips: 0, destinations: 0, expenses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;
      
      try {
        const { data: itineraries } = await supabase
          .from('itineraries')
          .select('id, destinations')
          .eq('user_id', user.id);
        
        const tripCount = itineraries?.length || 0;
        const allDestinations = itineraries?.flatMap(i => i.destinations) || [];
        const uniqueDestinations = new Set(allDestinations).size;
        
        const { count: expenseCount } = await supabase
          .from('expenses')
          .select('id', { count: 'exact', head: true });
        
        setStats({
          trips: tripCount,
          destinations: uniqueDestinations,
          expenses: expenseCount || 0
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, [user]);

  const displayName = user?.fullName || user?.email?.split('@')[0] || 'Traveler';
  const displayEmail = user?.email || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky/10 to-sand/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-soft border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-bold text-lg text-deep-blue">Profile</h1>
            <p className="text-sm text-muted-foreground">Manage your preferences</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Info */}
        <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-deep-blue">{displayName}</h2>
                <p className="text-muted-foreground">{displayEmail}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-sm text-muted-foreground">Travel Explorer</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Settings */}
        <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-deep-blue">
              <Settings className="h-5 w-5 text-primary" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Currency Settings */}
            <div>
              <Label className="text-deep-blue font-medium mb-3 block">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Currency Preference
                </div>
              </Label>
              <CurrencySelector />
            </div>

            {/* Other Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-deep-blue">Push Notifications</span>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-deep-blue">Privacy Settings</span>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-deep-blue">Travel Preferences</span>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-deep-blue">Security</span>
                </div>
                <Button variant="outline" size="sm">
                  Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-deep-blue">Your Travel Stats</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stats.trips}</div>
                  <div className="text-xs text-muted-foreground">Trips Planned</div>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{stats.destinations}</div>
                  <div className="text-xs text-muted-foreground">Destinations</div>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">{stats.expenses}</div>
                  <div className="text-xs text-muted-foreground">Expenses Tracked</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
