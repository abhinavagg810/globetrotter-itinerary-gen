import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane } from "lucide-react";

interface AuthPageProps {
  onLogin: () => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-orange-400 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <Plane className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to TravelPlan</CardTitle>
          <CardDescription>Plan your perfect journey with AI-powered itineraries</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button onClick={onLogin} className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white">
            Get Started with Email
          </Button>
          <Button variant="outline" onClick={onLogin} className="w-full h-12">
            Continue with Google
          </Button>
          <Button variant="outline" onClick={onLogin} className="w-full h-12">
            Use Phone Number
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}