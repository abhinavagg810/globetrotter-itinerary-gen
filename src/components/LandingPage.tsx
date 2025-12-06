import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Brain, 
  Users, 
  DollarSign, 
  FileText, 
  Clock, 
  Plane,
  Sparkles,
  ArrowRight,
  Globe,
  Shield,
  Star,
  ChevronRight
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
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Planning",
      description: "Get personalized itineraries tailored to your travel style and budget in seconds.",
    },
    {
      icon: Users,
      title: "Collaborative Trips",
      description: "Plan together with friends and family. Share and coordinate seamlessly.",
    },
    {
      icon: DollarSign,
      title: "Smart Expense Splitting",
      description: "Track costs and split expenses fairly among your travel group.",
    },
    {
      icon: FileText,
      title: "Document Organization",
      description: "Keep all your bookings and confirmations organized in one place.",
    }
  ];

  const stats = [
    { value: "50K+", label: "Trips Planned" },
    { value: "120+", label: "Countries" },
    { value: "4.9", label: "User Rating", icon: Star }
  ];

  const steps = [
    { num: "01", title: "Share Your Preferences", desc: "Tell us destination, dates, and travel style" },
    { num: "02", title: "AI Creates Your Plan", desc: "Get detailed day-by-day itinerary instantly" },
    { num: "03", title: "Customize & Book", desc: "Adjust activities and manage bookings" },
    { num: "04", title: "Travel & Track", desc: "Follow your plan and split expenses" }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex items-center justify-center">
        {/* Background */}
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          </div>
        ))}
        
        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 py-20">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-5 py-2.5 mb-8 border border-white/20">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium">AI-Powered Travel Planning</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
            Plan Your Perfect Trip
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky via-sage to-gold mt-2">
              In Seconds, Not Hours
            </span>
          </h1>
          
          <p className="text-lg md:text-xl mb-10 text-white/80 max-w-2xl mx-auto leading-relaxed">
            Tell us where you want to go. Our AI creates detailed, personalized itineraries 
            that match your style, budget, and interests.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onCreateTrip}
              size="lg"
              className="bg-white text-foreground hover:bg-white/90 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              Start Planning Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 flex justify-center gap-8 sm:gap-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-3xl md:text-4xl font-bold">{stat.value}</span>
                  {stat.icon && <Star className="w-5 h-5 text-gold fill-gold" />}
                </div>
                <div className="text-sm text-white/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28 px-4 sm:px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Travel Smarter
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From planning to expense tracking, we've got you covered
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group p-6 border-0 bg-gradient-to-br from-card to-muted/20 hover:shadow-elegant transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              From idea to itinerary in four simple steps
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center sm:text-left">
                {index < steps.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-8 -right-4 w-8 h-8 text-border" />
                )}
                <div className="text-6xl font-bold text-primary/10 mb-3">{step.num}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-12 px-4 sm:px-6 bg-background border-y border-border/50">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <span>Available Worldwide</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span>24/7 Support</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-4 sm:px-6 bg-gradient-premium">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Plan Your Next Adventure?
          </h2>
          <p className="text-lg md:text-xl mb-10 text-white/80 max-w-2xl mx-auto">
            Join thousands of travelers who plan smarter, travel better
          </p>
          <Button
            onClick={onCreateTrip}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 px-10 py-6 text-lg font-semibold shadow-xl group"
          >
            Get Started Free
            <Plane className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
