import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Brain, 
  Users, 
  DollarSign, 
  FileText, 
  MapPin, 
  Clock, 
  Plane,
  Sparkles,
  ArrowRight,
  Globe,
  Shield
} from 'lucide-react';

import heroBeach from '@/assets/hero-beach.jpg';
import heroMountain from '@/assets/hero-mountain.jpg';
import heroCity from '@/assets/hero-city.jpg';

interface LandingPageProps {
  onCreateTrip: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCreateTrip }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroImages = [
    { src: heroBeach, alt: "Beautiful beach destination" },
    { src: heroMountain, alt: "Mountain landscape adventure" },
    { src: heroCity, alt: "Urban city exploration" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Planning",
      description: "Get personalized itineraries tailored to your travel style, interests, and budget.",
    },
    {
      icon: Users,
      title: "Collaborative Trips",
      description: "Plan together with friends and family. Share, vote, and coordinate seamlessly.",
    },
    {
      icon: DollarSign,
      title: "Smart Expense Splitting",
      description: "Track costs and split expenses fairly among your travel group.",
    },
    {
      icon: FileText,
      title: "Document Organization",
      description: "Keep all your bookings, tickets, and confirmations in one secure place.",
    }
  ];

  const stats = [
    { value: "50K+", label: "Trips Planned" },
    { value: "120+", label: "Countries" },
    { value: "4.9", label: "User Rating" }
  ];

  const howItWorks = [
    { step: "01", title: "Share Your Preferences", description: "Tell us your destination, dates, and travel style" },
    { step: "02", title: "AI Creates Your Plan", description: "Get a detailed day-by-day itinerary in seconds" },
    { step: "03", title: "Customize & Book", description: "Adjust activities, invite friends, and manage bookings" },
    { step: "04", title: "Travel & Track", description: "Follow your plan and split expenses with your group" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
          </div>
        ))}
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6 py-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Travel Planning</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
            Plan Your Perfect Trip
            <span className="block text-primary-light mt-2">In Seconds, Not Hours</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Tell us where you want to go. Our AI creates detailed, personalized itineraries 
            that match your style, budget, and interests.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onCreateTrip}
              size="lg"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Planning Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg"
            >
              See How It Works
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 flex justify-center gap-12 md:gap-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                <div className="text-sm text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white w-6' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 px-4 md:px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Everything You Need to Travel Smarter
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From planning to expense tracking, we've got you covered
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-elegant transition-all duration-300 border border-border/50 bg-card p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-5">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 px-4 md:px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From idea to itinerary in four simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-border -translate-x-4" />
                )}
                <div className="text-5xl font-bold text-primary/20 mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 md:px-6 bg-background border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">Available Worldwide</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">Secure & Private</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 px-4 md:px-6 bg-gradient-premium">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Plan Your Next Adventure?
          </h2>
          <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of travelers who plan smarter, travel better
          </p>
          <Button
            onClick={onCreateTrip}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started Free
            <Plane className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
