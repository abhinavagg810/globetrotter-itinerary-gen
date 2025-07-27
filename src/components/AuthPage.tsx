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
      
      {/* Floating Travel Icons - Hidden on mobile */}
      <div className="hidden md:block absolute top-20 left-10 text-white/20 animate-pulse">
        <Plane className="h-6 w-6 lg:h-8 lg:w-8" />
      </div>
      <div className="hidden md:block absolute top-40 right-20 text-white/20 animate-pulse delay-1000">
        <MapPin className="h-5 w-5 lg:h-6 lg:w-6" />
      </div>
      <div className="hidden md:block absolute bottom-40 left-20 text-white/20 animate-pulse delay-2000">
        <Star className="h-6 w-6 lg:h-7 lg:w-7" />
      </div>
      
      {/* Travel Destination Images - Hidden on mobile */}
      <div className="hidden lg:flex absolute top-32 right-32 w-20 h-20 xl:w-24 xl:h-24 bg-white/10 rounded-full backdrop-blur-sm items-center justify-center">
        <span className="text-xl xl:text-2xl">🏝️</span>
      </div>
      <div className="hidden lg:flex absolute bottom-32 right-20 w-16 h-16 xl:w-20 xl:h-20 bg-white/10 rounded-full backdrop-blur-sm items-center justify-center">
        <span className="text-lg xl:text-xl">🗼</span>
      </div>
      <div className="hidden lg:flex absolute top-48 left-32 w-20 h-20 xl:w-28 xl:h-28 bg-white/10 rounded-full backdrop-blur-sm items-center justify-center">
        <span className="text-xl xl:text-2xl">🏖️</span>
      </div>
      
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-2xl w-full">
          {/* Login Card First */}
          <Card className="w-full max-w-sm md:max-w-lg mx-auto bg-white/95 backdrop-blur-xl border-0 shadow-premium rounded-2xl mb-6 md:mb-8">
            <CardHeader className="text-center space-y-3 md:space-y-4 p-4 md:p-6 pb-4 md:pb-6">
              <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-gradient-premium rounded-2xl flex items-center justify-center shadow-lg">
                <Plane className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold text-deep-blue mb-2">Welcome to Travel Globe AI</CardTitle>
                <CardDescription className="text-xs md:text-sm text-muted-foreground">Your AI-powered travel companion awaits</CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-0">
              <Button onClick={onLogin} variant="premium" className="w-full h-10 md:h-12 text-sm md:text-base font-semibold">
                Continue with Email
              </Button>
              <Button variant="outline" onClick={onLogin} className="w-full h-10 md:h-12 text-sm md:text-base bg-white/80 hover:bg-white border-2">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
              <Button variant="outline" onClick={onLogin} className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white border-0">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </Button>
              
              <div className="text-center pt-4">
                <p className="text-xs text-muted-foreground">
                  By continuing, you agree to our Terms & Privacy Policy
                </p>
              </div>
            </CardContent>
          </Card>

          
          
        </div>
      </div>
    </div>
  );
}