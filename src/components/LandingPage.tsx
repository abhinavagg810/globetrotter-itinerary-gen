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
  Camera, 
  Plane,
  Sparkles
} from 'lucide-react';

// Import images
import heroBeach from '@/assets/hero-beach.jpg';
import heroMountain from '@/assets/hero-mountain.jpg';
import heroCity from '@/assets/hero-city.jpg';

interface LandingPageProps {
  onCreateTrip: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCreateTrip }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroImages = [
    { src: heroBeach, alt: "Beautiful beach sunset" },
    { src: heroMountain, alt: "Mountain landscape" },
    { src: heroCity, alt: "Urban architecture" }
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
      title: "AI Itinerary Generator",
      description: "Personalized daily plans tailored to your travel style and preferences",
      gradient: "bg-gradient-ocean"
    },
    {
      icon: Users,
      title: "Plan with Tripmates",
      description: "Share, vote, and co-edit your travel plans with friends and family",
      gradient: "bg-gradient-sunset"
    },
    {
      icon: DollarSign,
      title: "Smart Expense Splitting",
      description: "No more messy spreadsheets — track and split costs effortlessly",
      gradient: "bg-gradient-premium"
    },
    {
      icon: FileText,
      title: "Travel Docs Organizer",
      description: "All your bookings, tickets, and documents in one organized place",
      gradient: "bg-gradient-card"
    }
  ];

  const sampleItinerary = [
    {
      day: "Day 1",
      title: "Beach Day + Sunset Dinner",
      time: "9:00 AM - 9:00 PM",
      color: "bg-sky-500"
    },
    {
      day: "Day 2", 
      title: "Island Hopping + Spa",
      time: "8:00 AM - 6:00 PM",
      color: "bg-emerald-500"
    },
    {
      day: "Day 3",
      title: "Local Market + Rooftop Bar",
      time: "10:00 AM - 11:00 PM",
      color: "bg-orange-500"
    }
  ];

  const howItWorksSteps = [
    { icon: MapPin, title: "Create Trip", description: "Tell us where you want to go" },
    { icon: Brain, title: "Answer Smart Questions", description: "Share your preferences and style" },
    { icon: Sparkles, title: "Get AI-Powered Plan", description: "Receive your personalized itinerary" },
    { icon: FileText, title: "Upload Bookings", description: "Add your travel documents" },
    { icon: Plane, title: "Travel Together, Smartly", description: "Enjoy your perfectly planned trip" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
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
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Let AI Plan Your
            <span className="block bg-gradient-to-r from-sky-200 to-emerald-200 bg-clip-text text-transparent">Perfect Trip</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Tell us where and when — we'll build your dream itinerary in seconds.
          </p>
          <Button
            onClick={onCreateTrip}
            size="xl"
            className="bg-gradient-premium hover:scale-105 transition-all duration-300 shadow-premium text-lg px-12 py-6 text-white font-semibold"
          >
            <Sparkles className="mr-3 h-6 w-6" />
            Create Your Trip
          </Button>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-24 px-4 md:px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Why Travelers Love Us
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for the perfect trip, powered by AI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-premium border-0 overflow-hidden bg-card/80 backdrop-blur-sm">
                <div className={`h-1 ${feature.gradient}`} />
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-premium rounded-full mb-6 mx-auto shadow-lg">
                    <feature.icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-4 text-center">{feature.title}</h3>
                  <p className="text-muted-foreground text-center leading-relaxed text-sm md:text-base">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Itinerary Preview */}
      <section className="py-20 md:py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              See Your Trip Come to Life
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-generated itineraries that feel like they were made just for you
            </p>
          </div>
          
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 no-scrollbar px-4 md:px-0">
            {sampleItinerary.map((day, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-72 md:w-80 bg-card rounded-2xl shadow-lg hover:shadow-premium transition-all duration-500 hover:scale-105 border border-border/30"
              >
                <div className={`h-40 md:h-48 ${day.color} rounded-t-2xl relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 md:px-4 md:py-2">
                    <span className="text-white font-semibold text-sm md:text-base">{day.day}</span>
                  </div>
                  <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4">
                    <Camera className="h-6 w-6 md:h-8 md:w-8 text-white/80" />
                  </div>
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold mb-2">{day.title}</h3>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm md:text-base">{day.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From idea to itinerary in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-premium transform translate-x-4" />
                )}
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-premium rounded-full mb-6 mx-auto relative z-10">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-24 px-4 md:px-6 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            Your Smartest Trip Starts Here
          </h2>
          <p className="text-lg md:text-xl mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of travelers who trust AI to plan their perfect adventures
          </p>
          <Button
            onClick={onCreateTrip}
            size="xl"
            className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-500 shadow-premium text-lg px-8 md:px-12 py-4 md:py-6 font-semibold"
          >
            <Sparkles className="mr-3 h-5 w-5 md:h-6 md:w-6" />
            Create Your Trip
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;