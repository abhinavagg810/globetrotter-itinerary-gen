import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Star, MapPin } from "lucide-react";
import luxuryBeachHero from "@/assets/luxury-beach-hero.jpg";

interface AuthPageProps {
  onLogin: () => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${luxuryBeachHero})` }}
      />
      <div className="absolute inset-0 bg-gradient-ocean/80" />
      
      {/* Floating Travel Icons */}
      <div className="absolute top-20 left-10 text-white/20 animate-pulse">
        <Plane className="h-8 w-8" />
      </div>
      <div className="absolute top-40 right-20 text-white/20 animate-pulse delay-1000">
        <MapPin className="h-6 w-6" />
      </div>
      <div className="absolute bottom-40 left-20 text-white/20 animate-pulse delay-2000">
        <Star className="h-7 w-7" />
      </div>
      
      {/* Travel Destination Images */}
      <div className="absolute top-32 right-32 w-24 h-24 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
        <span className="text-2xl">🏝️</span>
      </div>
      <div className="absolute bottom-32 right-20 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
        <span className="text-xl">🗼</span>
      </div>
      <div className="absolute top-48 left-32 w-28 h-28 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
        <span className="text-2xl">🏖️</span>
      </div>
      
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Travel Globe AI
          </h1>
          <p className="text-white/90 text-xl mb-8">Your AI-Powered Travel Companion</p>
          
          {/* Top Destinations */}
          <div className="w-full max-w-4xl mx-auto mb-8">
            <h2 className="text-2xl font-semibold text-white/90 mb-6 text-center">Discover Amazing Destinations</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { name: "Bali", emoji: "🏝️", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop&crop=center" },
                { name: "Paris", emoji: "🗼", image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop&crop=center" },
                { name: "Tokyo", emoji: "🏮", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop&crop=center" },
                { name: "Dubai", emoji: "🕌", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop&crop=center" }
              ].map((dest, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl">
                    <img 
                      src={dest.image} 
                      alt={dest.name}
                      className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 text-white">
                      <div className="text-lg">{dest.emoji}</div>
                      <div className="text-xs font-medium">{dest.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Card className="w-full max-w-sm mx-auto bg-white/95 backdrop-blur-xl border-0 shadow-premium">
            <CardHeader className="text-center space-y-3 pb-4">
              <div className="mx-auto w-12 h-12 bg-gradient-premium rounded-full flex items-center justify-center">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-deep-blue">Welcome Back</CardTitle>
              <CardDescription className="text-sm">Sign in to continue your journey</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3 pt-0">
              <Button onClick={onLogin} variant="premium" className="w-full h-10 text-sm">
                Get Started with Email
              </Button>
              <Button variant="outline" onClick={onLogin} className="w-full h-10 text-sm bg-white/80 hover:bg-white">
                Continue with Google
              </Button>
              <Button variant="outline" onClick={onLogin} className="w-full h-10 text-sm bg-white/80 hover:bg-white">
                Use Phone Number
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}