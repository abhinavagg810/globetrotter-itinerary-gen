import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Star, MapPin } from "lucide-react";
import luxuryBeachHero from "@/assets/luxury-beach-hero.jpg";

interface AuthPageProps {
  onLogin: () => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${luxuryBeachHero})` }}
      />
      <div className="absolute inset-0 bg-gradient-ocean/80" />
      
      <div className="absolute top-20 left-10 text-white/20 animate-pulse">
        <Plane className="h-8 w-8" />
      </div>
      <div className="absolute top-40 right-20 text-white/20 animate-pulse delay-1000">
        <MapPin className="h-6 w-6" />
      </div>
      <div className="absolute bottom-40 left-20 text-white/20 animate-pulse delay-2000">
        <Star className="h-7 w-7" />
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Wanderlog</h1>
          <p className="text-white/90 text-xl mb-8">Your AI-Powered Travel Companion</p>
          
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border-0 shadow-premium">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-premium rounded-full flex items-center justify-center">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-deep-blue">Welcome Back</CardTitle>
              <CardDescription>Sign in to continue your journey</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Button onClick={onLogin} variant="premium" className="w-full h-12">
                Get Started with Email
              </Button>
              <Button variant="outline" onClick={onLogin} className="w-full h-12 bg-white/80 hover:bg-white">
                Continue with Google
              </Button>
              <Button variant="outline" onClick={onLogin} className="w-full h-12 bg-white/80 hover:bg-white">
                Use Phone Number
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}