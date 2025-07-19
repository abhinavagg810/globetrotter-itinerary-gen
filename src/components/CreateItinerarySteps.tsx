import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, ArrowRight, MapPin, Calendar as CalendarIcon, Plane, Sparkles } from "lucide-react";
import { format, addMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { PlaceSuggestions } from "./PlaceSuggestions";

interface CreateItineraryStepsProps {
  onBack: () => void;
  onGenerate: (data: ItineraryData) => void;
}

export interface ItineraryData {
  fromLocation: string;
  destinations: string[];
  travelType: string;
  fromDate: Date | undefined;
  toDate: Date | undefined;
}

type Step = 'destination' | 'dates' | 'departure' | 'style';

export function CreateItinerarySteps({ onBack, onGenerate }: CreateItineraryStepsProps) {
  const [currentStep, setCurrentStep] = useState<Step>('destination');
  const [formData, setFormData] = useState<ItineraryData>({
    fromLocation: "",
    destinations: [""],
    travelType: "adventure",
    fromDate: undefined,
    toDate: undefined,
  });
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  const steps = [
    { id: 'destination', title: 'Destination', icon: MapPin },
    { id: 'dates', title: 'Dates', icon: CalendarIcon },
    { id: 'departure', title: 'Departure', icon: Plane },
    { id: 'style', title: 'Style', icon: Sparkles },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const nextMonths = Array.from({ length: 9 }, (_, i) => addMonths(new Date(), i));

  const travelTypes = [
    { id: "romantic", label: "Romantic", emoji: "💕", description: "Perfect for couples" },
    { id: "adventure", label: "Adventure", emoji: "🏔️", description: "Thrill seekers" },
    { id: "family", label: "Family", emoji: "👨‍👩‍👧‍👦", description: "Fun for all ages" },
    { id: "solo", label: "Solo", emoji: "🚶", description: "Personal journey" },
    { id: "luxury", label: "Luxury", emoji: "👑", description: "Premium experience" },
    { id: "budget", label: "Budget", emoji: "💰", description: "Value for money" },
  ];

  const handleNext = () => {
    if (currentStep === 'destination' && formData.destinations[0]) {
      setCurrentStep('dates');
    } else if (currentStep === 'dates' && formData.fromDate && formData.toDate) {
      setCurrentStep('departure');
    } else if (currentStep === 'departure' && formData.fromLocation) {
      setCurrentStep('style');
    } else if (currentStep === 'style') {
      onGenerate(formData);
    }
  };

  const handleBack = () => {
    if (currentStep === 'destination') {
      onBack();
    } else if (currentStep === 'dates') {
      setCurrentStep('destination');
    } else if (currentStep === 'departure') {
      setCurrentStep('dates');
    } else if (currentStep === 'style') {
      setCurrentStep('departure');
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'destination': return formData.destinations[0];
      case 'dates': return formData.fromDate && formData.toDate;
      case 'departure': return formData.fromLocation;
      case 'style': return formData.travelType;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky/10 to-sand/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-soft border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg text-deep-blue">Create Itinerary</h1>
            <p className="text-sm text-muted-foreground">
              Step {currentStepIndex + 1} of {steps.length}
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 flex gap-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex-1 h-2 rounded-full",
                index <= currentStepIndex ? "bg-primary" : "bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Current Selections */}
        {currentStepIndex > 0 && (
          <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-sm text-deep-blue">Your Selections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {formData.destinations[0] && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Destination: {formData.destinations[0]}</span>
                </div>
              )}
              {selectedMonth && currentStepIndex > 1 && (
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  <span>Month: {format(selectedMonth, 'MMMM yyyy')}</span>
                </div>
              )}
              {formData.fromDate && formData.toDate && currentStepIndex > 2 && (
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  <span>
                    Dates: {format(formData.fromDate, 'MMM dd')} - {format(formData.toDate, 'MMM dd')}
                  </span>
                </div>
              )}
              {formData.fromLocation && currentStepIndex > 3 && (
                <div className="flex items-center gap-2 text-sm">
                  <Plane className="h-4 w-4 text-primary" />
                  <span>From: {formData.fromLocation}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step Content */}
        <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-deep-blue">
              {(() => {
                const IconComponent = steps[currentStepIndex].icon;
                return IconComponent ? <IconComponent className="h-5 w-5 text-primary" /> : null;
              })()}
              {currentStep === 'destination' && 'Where do you want to go?'}
              {currentStep === 'dates' && 'Select travel dates'}
              {currentStep === 'departure' && 'Where are you traveling from?'}
              {currentStep === 'style' && 'What\'s your travel style?'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 'destination' && (
              <PlaceSuggestions
                value={formData.destinations[0]}
                onChange={(value) => setFormData(prev => ({ ...prev, destinations: [value] }))}
                placeholder="e.g., Bali, Indonesia"
                className="bg-white/70 border-border/50"
              />
            )}

            {currentStep === 'dates' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-deep-blue">Select Travel Dates</h3>
                <div className="bg-white/70 rounded-lg p-4">
                  <Calendar
                    mode="range"
                    selected={{
                      from: formData.fromDate,
                      to: formData.toDate,
                    }}
                    onSelect={(range) => {
                      setFormData(prev => ({
                        ...prev,
                        fromDate: range?.from,
                        toDate: range?.to,
                      }));
                    }}
                    disabled={(date) => date < new Date()}
                    className="pointer-events-auto"
                  />
                </div>
              </div>
            )}

            {currentStep === 'departure' && (
              <PlaceSuggestions
                value={formData.fromLocation}
                onChange={(value) => setFormData(prev => ({ ...prev, fromLocation: value }))}
                placeholder="e.g., Mumbai, India"
                className="bg-white/70 border-border/50"
              />
            )}

            {currentStep === 'style' && (
              <div className="grid grid-cols-2 gap-3">
                {travelTypes.map((type) => (
                  <div
                    key={type.id}
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer text-center transition-all hover:scale-105",
                      formData.travelType === type.id
                        ? "border-primary bg-primary/10 shadow-lg"
                        : "border-border/50 hover:border-primary/50 bg-white/70"
                    )}
                    onClick={() => setFormData(prev => ({ ...prev, travelType: type.id }))}
                  >
                    <div className="text-2xl mb-1">{type.emoji}</div>
                    <div className="font-semibold text-sm text-deep-blue">{type.label}</div>
                    <div className="text-xs text-muted-foreground">{type.description}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Next Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border/50 p-4 z-10">
        <Button 
          onClick={handleNext}
          className="w-full h-12"
          variant="premium"
          size="lg"
          disabled={!canProceed()}
        >
          {currentStep === 'style' ? (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Itinerary
              <Sparkles className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}