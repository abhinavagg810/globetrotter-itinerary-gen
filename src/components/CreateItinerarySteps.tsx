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
  needsDestinationHelp?: boolean;
  travelingWith?: string;
  budget?: string;
}

type Step = 'destination' | 'dates' | 'departure' | 'style' | 'help-destination' | 'help-dates' | 'help-departure' | 'help-preferences' | 'help-companions' | 'help-budget';

export function CreateItinerarySteps({ onBack, onGenerate }: CreateItineraryStepsProps) {
  const [currentStep, setCurrentStep] = useState<Step>('destination');
  const [formData, setFormData] = useState<ItineraryData>({
    fromLocation: "",
    destinations: [""],
    travelType: "adventure",
    fromDate: undefined,
    toDate: undefined,
    needsDestinationHelp: false,
    travelingWith: "",
    budget: "",
  });
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  const steps = [
    { id: 'destination', title: 'Destination', icon: MapPin },
    { id: 'dates', title: 'Dates', icon: CalendarIcon },
    { id: 'departure', title: 'Departure', icon: Plane },
    { id: 'style', title: 'Style', icon: Sparkles },
  ];

  const helpSteps = [
    { id: 'help-dates', title: 'Travel dates', icon: CalendarIcon },
    { id: 'help-departure', title: 'Departure', icon: Plane },
    { id: 'help-preferences', title: 'Preferences', icon: Sparkles },
    { id: 'help-budget', title: 'Budget', icon: Sparkles },
  ];

  const isHelpFlow = currentStep.startsWith('help-');
  const activeSteps = isHelpFlow ? helpSteps : steps;
  const currentStepIndex = activeSteps.findIndex(s => s.id === currentStep);
  
  // For destination step in help flow, show as step 1
  const displayStepIndex = currentStep === 'destination' && formData.needsDestinationHelp ? 0 : currentStepIndex;

  const nextMonths = Array.from({ length: 9 }, (_, i) => addMonths(new Date(), i));

  const travelTypes = [
    { id: "romantic", label: "Romantic", emoji: "💕", description: "Perfect for couples" },
    { id: "adventure", label: "Adventure", emoji: "🏔️", description: "Thrill seekers" },
    { id: "family", label: "Family", emoji: "👨‍👩‍👧‍👦", description: "Fun for all ages" },
    { id: "solo", label: "Solo", emoji: "🚶", description: "Personal journey" },
    { id: "luxury", label: "Luxury", emoji: "👑", description: "Premium experience" },
    { id: "budget", label: "Budget", emoji: "💰", description: "Value for money" },
  ];

  const companionOptions = [
    { id: "solo", label: "Solo", emoji: "🚶", description: "Just me" },
    { id: "partner", label: "Partner", emoji: "💑", description: "With my partner" },
    { id: "family", label: "Family", emoji: "👨‍👩‍👧‍👦", description: "With family" },
    { id: "friends", label: "Friends", emoji: "👥", description: "With friends" },
    { id: "group", label: "Group", emoji: "👫", description: "Large group" },
  ];

  const budgetRanges = [
    { id: "budget", label: "Budget", range: "$500 - $1,500", emoji: "💰" },
    { id: "moderate", label: "Moderate", range: "$1,500 - $3,000", emoji: "💳" },
    { id: "luxury", label: "Luxury", range: "$3,000 - $6,000", emoji: "💎" },
    { id: "premium", label: "Premium", range: "$6,000+", emoji: "👑" },
  ];

  const handleNext = () => {
    if (currentStep === 'destination') {
      if (formData.needsDestinationHelp) {
        setCurrentStep('help-dates');
      } else if (formData.destinations.some(d => d)) {
        setCurrentStep('dates');
      }
    } else if (currentStep === 'dates' && formData.fromDate && formData.toDate) {
      setCurrentStep('departure');
    } else if (currentStep === 'departure' && formData.fromLocation) {
      setCurrentStep('style');
    } else if (currentStep === 'style') {
      onGenerate(formData);
    } else if (currentStep === 'help-dates' && formData.fromDate && formData.toDate) {
      setCurrentStep('help-departure');
    } else if (currentStep === 'help-departure' && formData.fromLocation) {
      setCurrentStep('help-preferences');
    } else if (currentStep === 'help-preferences' && formData.travelType) {
      setCurrentStep('help-budget');
    } else if (currentStep === 'help-budget' && formData.budget) {
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
    } else if (currentStep === 'help-dates') {
      setCurrentStep('destination');
    } else if (currentStep === 'help-departure') {
      setCurrentStep('help-dates');
    } else if (currentStep === 'help-preferences') {
      setCurrentStep('help-departure');
    } else if (currentStep === 'help-budget') {
      setCurrentStep('help-preferences');
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'destination': return formData.destinations.some(d => d) || formData.needsDestinationHelp;
      case 'dates': return formData.fromDate && formData.toDate;
      case 'departure': return formData.fromLocation;
      case 'style': return formData.travelType;
      case 'help-dates': return formData.fromDate && formData.toDate;
      case 'help-departure': return formData.fromLocation;
      case 'help-preferences': return formData.travelType;
      case 'help-budget': return formData.budget;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky/10 to-sand/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-soft border-b border-border/50 p-3 md:p-4">
        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="ghost" onClick={handleBack} className="h-8 w-8 md:h-10 md:w-10 p-0">
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-base md:text-lg text-deep-blue">Create Itinerary</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Step {displayStepIndex + 1} of {activeSteps.length}
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3 md:mt-4 flex gap-1 md:gap-2">
          {activeSteps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex-1 h-2 rounded-full",
                index <= displayStepIndex ? "bg-primary" : "bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>

      <div className="p-3 md:p-4">
        {/* Current Selections */}
        {currentStepIndex > 0 && (
          <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg mb-4 md:mb-6">
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm text-deep-blue">Your Selections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3 md:p-6 pt-0">
              {formData.destinations.filter(d => d).length > 0 && (
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <MapPin className="h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0" />
                  <span className="truncate">
                    Destinations: {formData.destinations.filter(d => d).join(', ')}
                  </span>
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
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="flex items-center gap-2 text-deep-blue text-sm md:text-base">
              {(() => {
                const IconComponent = activeSteps[displayStepIndex]?.icon;
                return IconComponent ? <IconComponent className="h-5 w-5 text-primary" /> : null;
              })()}
              {currentStep === 'destination' && 'Where do you want to go?'}
              {currentStep === 'dates' && 'Select travel dates'}
              {currentStep === 'departure' && 'Where are you traveling from?'}
              {currentStep === 'style' && 'What\'s your travel style?'}
              {currentStep === 'help-dates' && 'When do you want to travel?'}
              {currentStep === 'help-departure' && 'Where are you traveling from?'}
              {currentStep === 'help-preferences' && 'What\'s your travel preference?'}
              
              {currentStep === 'help-budget' && 'What\'s your budget range?'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            {currentStep === 'destination' && (
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                  <Button 
                    variant={!formData.needsDestinationHelp ? "default" : "outline"}
                    onClick={() => setFormData(prev => ({ ...prev, needsDestinationHelp: false, destinations: [""] }))}
                    className="flex-1 h-10 md:h-11 text-xs md:text-sm"
                  >
                    I know where I want to go
                  </Button>
                  <Button 
                    variant={formData.needsDestinationHelp ? "default" : "outline"}
                    onClick={() => setFormData(prev => ({ ...prev, needsDestinationHelp: true, destinations: [""] }))}
                    className="flex-1 h-10 md:h-11 text-xs md:text-sm"
                  >
                    Help me find vacation destination
                  </Button>
                </div>
                {!formData.needsDestinationHelp && (
                  <div className="space-y-4">
                    {formData.destinations.map((destination, index) => (
                      <div key={index} className="flex gap-2">
                        <PlaceSuggestions
                          value={destination}
                          onChange={(value) => {
                            const newDestinations = [...formData.destinations];
                            newDestinations[index] = value;
                            setFormData(prev => ({ ...prev, destinations: newDestinations }));
                          }}
                          placeholder={`Destination ${index + 1}`}
                          className="bg-white/70 border-border/50 flex-1"
                        />
                        {formData.destinations.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newDestinations = formData.destinations.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, destinations: newDestinations }));
                            }}
                            className="bg-white/70"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, destinations: [...prev.destinations, ""] }));
                      }}
                      className="w-full bg-white/70"
                    >
                      + Add Another Destination
                    </Button>
                  </div>
                )}
                {formData.needsDestinationHelp && (
                  <div className="text-center p-8 bg-white/70 rounded-lg">
                    <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-deep-blue mb-2">Let's find your perfect destination!</h3>
                    <p className="text-sm text-muted-foreground">We'll ask you a few questions to recommend the best places for you.</p>
                  </div>
                )}
              </div>
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
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                {travelTypes.map((type) => (
                  <div
                    key={type.id}
                    className={cn(
                      "p-3 md:p-4 rounded-lg border-2 cursor-pointer text-center transition-all hover:scale-105",
                      formData.travelType === type.id
                        ? "border-primary bg-primary/10 shadow-lg"
                        : "border-border/50 hover:border-primary/50 bg-white/70"
                    )}
                    onClick={() => setFormData(prev => ({ ...prev, travelType: type.id }))}
                  >
                    <div className="text-xl md:text-2xl mb-1">{type.emoji}</div>
                    <div className="font-semibold text-xs md:text-sm text-deep-blue">{type.label}</div>
                    <div className="text-xs text-muted-foreground hidden md:block">{type.description}</div>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 'help-dates' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-deep-blue">When do you want to travel?</h3>
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

            {currentStep === 'help-departure' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-deep-blue">Where are you traveling from?</h3>
                <PlaceSuggestions
                  value={formData.fromLocation}
                  onChange={(value) => setFormData(prev => ({ ...prev, fromLocation: value }))}
                  placeholder="e.g., Mumbai, India"
                  className="bg-white/70 border-border/50"
                />
              </div>
            )}

            {currentStep === 'help-preferences' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-deep-blue">What's your travel preference?</h3>
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
              </div>
            )}


            {currentStep === 'help-budget' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-deep-blue">What's your budget range?</h3>
                <div className="grid grid-cols-1 gap-3">
                  {budgetRanges.map((budget) => (
                    <div
                      key={budget.id}
                      className={cn(
                        "p-4 rounded-lg border-2 cursor-pointer text-center transition-all hover:scale-105",
                        formData.budget === budget.id
                          ? "border-primary bg-primary/10 shadow-lg"
                          : "border-border/50 hover:border-primary/50 bg-white/70"
                      )}
                      onClick={() => setFormData(prev => ({ ...prev, budget: budget.id }))}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{budget.emoji}</div>
                        <div className="text-left">
                          <div className="font-semibold text-sm text-deep-blue">{budget.label}</div>
                          <div className="text-xs text-muted-foreground">{budget.range}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
          {(currentStep === 'style' || currentStep === 'help-budget') ? (
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