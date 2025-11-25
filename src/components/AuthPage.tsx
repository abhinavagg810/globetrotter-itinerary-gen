import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, Star, MapPin } from "lucide-react";
import luxuryBeachHero from "@/assets/luxury-beach-hero.jpg";
import { useAuth } from "@/hooks/useAuth";
import LandingPage from "./LandingPage";

interface AuthPageProps {
  onLogin: () => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { signIn, signUp, signInWithGoogle } = useAuth();

  if (!showLogin) {
    return <LandingPage onCreateTrip={() => setShowLogin(true)} />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    if (!error) {
      onLogin();
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signUp(email, password, fullName);
    if (!error) {
      onLogin();
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${luxuryBeachHero})` }}
      />
      <div className="absolute inset-0 bg-gradient-ocean/80" />
      
      <div className="hidden md:block absolute top-20 left-10 text-white/20 animate-pulse">
        <Plane className="h-6 w-6 lg:h-8 lg:w-8" />
      </div>
      <div className="hidden md:block absolute top-40 right-20 text-white/20 animate-pulse delay-1000">
        <MapPin className="h-5 w-5 lg:h-6 lg:w-6" />
      </div>
      <div className="hidden md:block absolute bottom-40 left-20 text-white/20 animate-pulse delay-2000">
        <Star className="h-6 w-6 lg:h-7 lg:w-7" />
      </div>
      
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
          <Card className="w-full max-w-sm md:max-w-lg mx-auto bg-white/95 backdrop-blur-xl border-0 shadow-premium rounded-2xl">
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
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form className="space-y-4" onSubmit={handleSignIn}>
                    <div className="space-y-2 text-left">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input 
                        id="signin-email" 
                        type="email" 
                        placeholder="you@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2 text-left">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input 
                        id="signin-password" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                      />
                    </div>
                    
                    <Button type="submit" variant="premium" className="w-full h-10 md:h-12 text-sm md:text-base font-semibold">
                      Sign In
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form className="space-y-4" onSubmit={handleSignUp}>
                    <div className="space-y-2 text-left">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input 
                        id="signup-name" 
                        type="text" 
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2 text-left">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2 text-left">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input 
                        id="signup-password" 
                        type="password"
                        placeholder="Min. 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        minLength={6}
                      />
                    </div>
                    
                    <Button type="submit" variant="premium" className="w-full h-10 md:h-12 text-sm md:text-base font-semibold">
                      Sign Up
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleGoogleSignIn} 
                className="w-full h-10 md:h-12 text-sm md:text-base bg-white/80 hover:bg-white border-2"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
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