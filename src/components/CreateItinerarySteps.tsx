import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, MapPin, Calendar as CalendarIcon, Plane, Sparkles, Users, Heart, DollarSign, Globe, Check } from "lucide-react";
import { format } from "date-fns";
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
  tripPurpose?: string;
  travelVibes?: string[];
  budget?: string;
  isFlexibleWithDates?: boolean;
  tripDuration?: number;
  destinationPreference?: string;
  domesticOrInternational?: string;
}

type Step = 'destinations' | 'dates' | 'companions' | 'vibes' | 'budget' | 'help-departure' | 'help-travel-type' | 'help-dates' | 'help-duration' | 'help-companions' | 'help-vibes' | 'help-budget';

export function CreateItinerarySteps({ onBack, onGenerate }: CreateItineraryStepsProps) {
  const [currentStep, setCurrentStep] = useState<Step>('destinations');
  const [formData, setFormData] = useState<ItineraryData>({
    fromLocation: "",
    destinations: [""],
    travelType: "adventure",
    fromDate: undefined,
    toDate: undefined,
    needsDestinationHelp: false,
    travelingWith: "",
    tripPurpose: "",
    travelVibes: [],
    budget: "",
    isFlexibleWithDates: false,
    tripDuration: 7,
    destinationPreference: "",
  });

  const steps = [
    { id: 'destinations', title: 'Destination', icon: MapPin, subtitle: 'Where to?' },
    { id: 'dates', title: 'Dates', icon: CalendarIcon, subtitle: 'When?' },
    { id: 'companions', title: 'Travel Party', icon: Users, subtitle: 'Who?' },
    { id: 'vibes', title: 'Trip Style', icon: Heart, subtitle: 'What kind?' },
    { id: 'budget', title: 'Budget', icon: DollarSign, subtitle: 'How much?' },
  ];

  const helpSteps = [
    { id: 'help-departure', title: 'Departure', icon: Plane, subtitle: 'From where?' },
    { id: 'help-travel-type', title: 'Travel Type', icon: Globe, subtitle: 'Domestic/International' },
    { id: 'help-dates', title: 'Dates', icon: CalendarIcon, subtitle: 'When?' },
    { id: 'help-duration', title: 'Duration', icon: CalendarIcon, subtitle: 'How long?' },
    { id: 'help-companions', title: 'Travel Party', icon: Users, subtitle: 'Who?' },
    { id: 'help-vibes', title: 'Trip Style', icon: Heart, subtitle: 'What kind?' },
    { id: 'help-budget', title: 'Budget', icon: DollarSign, subtitle: 'How much?' },
  ];

  const isHelpFlow = currentStep.startsWith('help-');
  const activeSteps = isHelpFlow ? helpSteps : steps;
  const currentStepIndex = activeSteps.findIndex(s => s.id === currentStep);
  const displayStepIndex = currentStep === 'destinations' && formData.needsDestinationHelp ? 0 : currentStepIndex;

  const companionOptions = [
    { id: "solo", label: "Solo Adventure", emoji: "🚶", description: "Just me, myself & I" },
    { id: "partner", label: "Couple's Getaway", emoji: "💑", description: "Romantic for two" },
    { id: "family", label: "Family Trip", emoji: "👨‍👩‍👧‍👦", description: "Fun for all ages" },
    { id: "friends", label: "Friends Trip", emoji: "👥", description: "Squad goals" },
  ];

  const vibeOptions = [
    { id: "beach", label: "Beach & Sun", emoji: "🏖️" },
    { id: "mountains", label: "Mountains", emoji: "🏔️" },
    { id: "relaxing", label: "Relaxing", emoji: "🧘" },
    { id: "adventure", label: "Adventure", emoji: "🧗" },
    { id: "cultural", label: "Cultural", emoji: "🏛️" },
    { id: "romantic", label: "Romantic", emoji: "💑" },
    { id: "foodie", label: "Foodie", emoji: "🍜" },
    { id: "nightlife", label: "Nightlife", emoji: "🌃" },
    { id: "shopping", label: "Shopping", emoji: "🛍️" },
    { id: "offbeat", label: "Offbeat", emoji: "🌍" },
  ];

  const budgetRanges = [
    { id: "budget", label: "Budget Friendly", range: "$500 - $1,500", emoji: "💰", description: "Smart spending" },
    { id: "moderate", label: "Comfortable", range: "$1,500 - $3,000", emoji: "💳", description: "Balanced choice" },
    { id: "luxury", label: "Luxury", range: "$3,000 - $6,000", emoji: "💎", description: "Premium experience" },
    { id: "premium", label: "Ultra Premium", range: "$6,000+", emoji: "👑", description: "No limits" },
  ];

  const handleNext = () => {
    if (currentStep === 'destinations') {
      if (formData.needsDestinationHelp) {
        setCurrentStep('help-departure');
      } else if (formData.destinations.some(d => d) && formData.fromLocation) {
        setCurrentStep('dates');
      }
    } else if (currentStep === 'dates') {
      if (formData.fromDate && formData.toDate) {
        setCurrentStep('companions');
      }
    } else if (currentStep === 'companions' && formData.travelingWith) {
      setCurrentStep('vibes');
    } else if (currentStep === 'vibes' && formData.travelVibes && formData.travelVibes.length > 0) {
      setCurrentStep('budget');
    } else if (currentStep === 'budget' && formData.budget) {
      onGenerate(formData);
    }
    // Help flow navigation
    else if (currentStep === 'help-departure' && formData.fromLocation) {
      setCurrentStep('help-travel-type');
    } else if (currentStep === 'help-travel-type' && formData.domesticOrInternational) {
      setCurrentStep('help-dates');
    } else if (currentStep === 'help-dates') {
      if (formData.fromDate && formData.toDate) {
        setCurrentStep('help-companions');
      } else if (formData.isFlexibleWithDates) {
        setCurrentStep('help-duration');
      }
    } else if (currentStep === 'help-duration' && formData.tripDuration) {
      setCurrentStep('help-companions');
    } else if (currentStep === 'help-companions' && formData.travelingWith) {
      setCurrentStep('help-vibes');
    } else if (currentStep === 'help-vibes' && formData.travelVibes && formData.travelVibes.length > 0) {
      setCurrentStep('help-budget');
    } else if (currentStep === 'help-budget' && formData.budget) {
      const updatedFormData = { ...formData };
      if (formData.needsDestinationHelp) {
        updatedFormData.destinations = ["Recommended Destination"];
      }
      onGenerate(updatedFormData);
    }
  };

  const handleBack = () => {
    if (currentStep === 'destinations') {
      onBack();
    } else if (currentStep === 'dates') {
      setCurrentStep('destinations');
    } else if (currentStep === 'companions') {
      setCurrentStep('dates');
    } else if (currentStep === 'vibes') {
      setCurrentStep('companions');
    } else if (currentStep === 'budget') {
      setCurrentStep('vibes');
    }
    // Help flow back navigation
    else if (currentStep === 'help-departure') {
      setCurrentStep('destinations');
    } else if (currentStep === 'help-travel-type') {
      setCurrentStep('help-departure');
    } else if (currentStep === 'help-dates') {
      setCurrentStep('help-travel-type');
    } else if (currentStep === 'help-duration') {
      setCurrentStep('help-dates');
    } else if (currentStep === 'help-companions') {
      if (formData.isFlexibleWithDates) {
        setCurrentStep('help-duration');
      } else {
        setCurrentStep('help-dates');
      }
    } else if (currentStep === 'help-vibes') {
      setCurrentStep('help-companions');
    } else if (currentStep === 'help-budget') {
      setCurrentStep('help-vibes');
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'destinations': return (formData.destinations.some(d => d) && formData.fromLocation) || formData.needsDestinationHelp;
      case 'dates': return formData.fromDate && formData.toDate;
      case 'companions': return formData.travelingWith;
      case 'vibes': return formData.travelVibes && formData.travelVibes.length > 0;
      case 'budget': return formData.budget;
      case 'help-departure': return formData.fromLocation;
      case 'help-travel-type': return formData.domesticOrInternational;
      case 'help-dates': return (formData.fromDate && formData.toDate) || formData.isFlexibleWithDates;
      case 'help-duration': return formData.tripDuration;
      case 'help-companions': return formData.travelingWith;
      case 'help-vibes': return formData.travelVibes && formData.travelVibes.length > 0;
      case 'help-budget': return formData.budget;
      default: return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'destinations': return 'Where would you like to go?';
      case 'dates': return 'When are you traveling?';
      case 'companions': return 'Who\'s coming along?';
      case 'vibes': return 'What\'s your travel style?';
      case 'budget': return 'What\'s your budget?';
      case 'help-departure': return 'Where are you starting from?';
      case 'help-travel-type': return 'Domestic or International?';
      case 'help-dates': return 'When do you want to travel?';
      case 'help-duration': return 'How long is your trip?';
      case 'help-companions': return 'Who\'s coming along?';
      case 'help-vibes': return 'What\'s your travel style?';
      case 'help-budget': return 'What\'s your budget?';
      default: return '';
    }
  };

  const isLastStep = currentStep === 'budget' || currentStep === 'help-budget';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={handleBack} 
              className="h-10 w-10 p-0 rounded-full hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-bold text-lg text-foreground">Create Trip</h1>
              <p className="text-sm text-muted-foreground">
                Step {displayStepIndex + 1} of {activeSteps.length}
              </p>
            </div>
          </div>
        </div>
        
        {/* Step Indicators */}
        <div className="px-4 pb-4">
          <div className="flex gap-2">
            {activeSteps.map((step, index) => (
              <div key={step.id} className="flex-1 flex flex-col items-center">
                <div
                  className={cn(
                    "w-full h-1.5 rounded-full transition-all duration-300",
                    index < displayStepIndex 
                      ? "bg-primary" 
                      : index === displayStepIndex 
                        ? "bg-primary" 
                        : "bg-muted"
                  )}
                />
                <div className="flex items-center gap-1 mt-2">
                  {index < displayStepIndex && (
                    <Check className="h-3 w-3 text-primary" />
                  )}
                  <span className={cn(
                    "text-xs font-medium hidden sm:block",
                    index <= displayStepIndex ? "text-primary" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-32 max-w-2xl mx-auto">
        {/* Step Title */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {getStepTitle()}
          </h2>
          <p className="text-muted-foreground">
            {currentStep === 'destinations' && "Choose your dream destination or let us help you find one"}
            {currentStep === 'dates' && "Select your travel dates to get started"}
            {currentStep === 'companions' && "Tell us about your travel group"}
            {currentStep === 'vibes' && "Pick all the vibes that match your ideal trip"}
            {currentStep === 'budget' && "This helps us tailor recommendations for you"}
            {currentStep === 'help-departure' && "We'll find the best destinations from your city"}
            {currentStep === 'help-travel-type' && "Are you exploring locally or going abroad?"}
            {currentStep === 'help-dates' && "When are you planning to travel?"}
            {currentStep === 'help-duration' && "How many days would you like to travel?"}
            {currentStep === 'help-companions' && "Tell us about your travel group"}
            {currentStep === 'help-vibes' && "Pick all the vibes that match your ideal trip"}
            {currentStep === 'help-budget' && "This helps us tailor recommendations for you"}
          </p>
        </div>

        {/* Step Content */}
        {currentStep === 'destinations' && (
          <div className="space-y-6">
            {/* Toggle Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormData(prev => ({ ...prev, needsDestinationHelp: false, destinations: [""] }))}
                className={cn(
                  "p-4 rounded-2xl border-2 text-left transition-all duration-200",
                  !formData.needsDestinationHelp
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <MapPin className={cn(
                  "h-6 w-6 mb-2",
                  !formData.needsDestinationHelp ? "text-primary" : "text-muted-foreground"
                )} />
                <p className="font-semibold text-sm">I know where</p>
                <p className="text-xs text-muted-foreground">Enter my destination</p>
              </button>
              <button
                onClick={() => setFormData(prev => ({ ...prev, needsDestinationHelp: true, destinations: [""] }))}
                className={cn(
                  "p-4 rounded-2xl border-2 text-left transition-all duration-200",
                  formData.needsDestinationHelp
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <Sparkles className={cn(
                  "h-6 w-6 mb-2",
                  formData.needsDestinationHelp ? "text-primary" : "text-muted-foreground"
                )} />
                <p className="font-semibold text-sm">Surprise me</p>
                <p className="text-xs text-muted-foreground">Help me find a place</p>
              </button>
            </div>

            {!formData.needsDestinationHelp && (
              <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                <CardContent className="p-5 space-y-5">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Destination(s)
                    </Label>
                    {formData.destinations.map((destination, index) => (
                      <div key={index} className="flex gap-2">
                        <PlaceSuggestions
                          value={destination}
                          onChange={(value) => {
                            const newDestinations = [...formData.destinations];
                            newDestinations[index] = value;
                            setFormData(prev => ({ ...prev, destinations: newDestinations }));
                          }}
                          placeholder={index === 0 ? "e.g., Paris, Bali, Tokyo" : `Destination ${index + 1}`}
                          className="flex-1"
                        />
                        {formData.destinations.length > 1 && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newDestinations = formData.destinations.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, destinations: newDestinations }));
                            }}
                            className="shrink-0"
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      onClick={() => setFormData(prev => ({ ...prev, destinations: [...prev.destinations, ""] }))}
                      className="w-full border-2 border-dashed border-border hover:border-primary hover:bg-primary/5"
                    >
                      + Add Another Destination
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Plane className="h-4 w-4 text-primary" />
                      Departing From
                    </Label>
                    <PlaceSuggestions
                      value={formData.fromLocation}
                      onChange={(value) => setFormData(prev => ({ ...prev, fromLocation: value }))}
                      placeholder="e.g., Mumbai, New York, London"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {formData.needsDestinationHelp && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-accent/10">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Let's Find Your Perfect Spot!</h3>
                  <p className="text-muted-foreground text-sm">
                    Answer a few quick questions and we'll suggest amazing destinations tailored just for you.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {currentStep === 'dates' && (
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 bg-primary/5 border-b border-border/50">
                <p className="text-sm text-muted-foreground">
                  {formData.fromDate && formData.toDate ? (
                    <span className="font-medium text-foreground">
                      {format(formData.fromDate, 'MMM dd, yyyy')} — {format(formData.toDate, 'MMM dd, yyyy')}
                      <span className="text-primary ml-2">
                        ({Math.ceil((formData.toDate.getTime() - formData.fromDate.getTime()) / (1000 * 60 * 60 * 24))} nights)
                      </span>
                    </span>
                  ) : (
                    "Select start and end dates"
                  )}
                </p>
              </div>
              <div className="p-4 flex justify-center">
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
                  className="rounded-lg pointer-events-auto"
                  numberOfMonths={1}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'companions' && (
          <div className="space-y-3">
            <RadioGroup 
              value={formData.travelingWith} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, travelingWith: value }))}
              className="space-y-3"
            >
              {companionOptions.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200",
                    formData.travelingWith === option.id
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                  <div className="text-3xl">{option.emoji}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  {formData.travelingWith === option.id && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </label>
              ))}
            </RadioGroup>
          </div>
        )}

        {currentStep === 'vibes' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Select all that apply (at least 1):</p>
            <div className="grid grid-cols-2 gap-3">
              {vibeOptions.map((vibe) => {
                const isSelected = formData.travelVibes?.includes(vibe.id);
                return (
                  <button
                    key={vibe.id}
                    onClick={() => {
                      if (isSelected) {
                        setFormData(prev => ({
                          ...prev,
                          travelVibes: (prev.travelVibes || []).filter(v => v !== vibe.id)
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          travelVibes: [...(prev.travelVibes || []), vibe.id]
                        }));
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <span className="text-2xl">{vibe.emoji}</span>
                    <span className="font-medium text-sm">{vibe.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-primary ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 'budget' && (
          <div className="space-y-3">
            {budgetRanges.map((budget) => (
              <button
                key={budget.id}
                onClick={() => setFormData(prev => ({ ...prev, budget: budget.id }))}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200",
                  formData.budget === budget.id
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <div className="text-3xl">{budget.emoji}</div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{budget.label}</p>
                  <p className="text-sm text-muted-foreground">{budget.range} per person</p>
                </div>
                {formData.budget === budget.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Help Flow Steps */}
        {currentStep === 'help-departure' && (
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardContent className="p-5 space-y-4">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Plane className="h-4 w-4 text-primary" />
                Your City
              </Label>
              <PlaceSuggestions
                value={formData.fromLocation}
                onChange={(value) => setFormData(prev => ({ ...prev, fromLocation: value }))}
                placeholder="e.g., Mumbai, New York, London"
              />
            </CardContent>
          </Card>
        )}

        {currentStep === 'help-travel-type' && (
          <div className="space-y-3">
            <RadioGroup 
              value={formData.domesticOrInternational} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, domesticOrInternational: value }))}
              className="space-y-3"
            >
              <label
                className={cn(
                  "flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200",
                  formData.domesticOrInternational === 'domestic'
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <RadioGroupItem value="domestic" id="domestic" className="sr-only" />
                <div className="text-3xl">🏠</div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Domestic</p>
                  <p className="text-sm text-muted-foreground">Explore within your country</p>
                </div>
                {formData.domesticOrInternational === 'domestic' && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </label>
              <label
                className={cn(
                  "flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200",
                  formData.domesticOrInternational === 'international'
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <RadioGroupItem value="international" id="international" className="sr-only" />
                <div className="text-3xl">✈️</div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">International</p>
                  <p className="text-sm text-muted-foreground">Adventure abroad</p>
                </div>
                {formData.domesticOrInternational === 'international' && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </label>
            </RadioGroup>
          </div>
        )}

        {currentStep === 'help-dates' && (
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 bg-primary/5 border-b border-border/50">
                <p className="text-sm text-muted-foreground">
                  {formData.fromDate && formData.toDate ? (
                    <span className="font-medium text-foreground">
                      {format(formData.fromDate, 'MMM dd, yyyy')} — {format(formData.toDate, 'MMM dd, yyyy')}
                    </span>
                  ) : (
                    "Select start and end dates"
                  )}
                </p>
              </div>
              <div className="p-4 flex justify-center">
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
                  className="rounded-lg pointer-events-auto"
                  numberOfMonths={1}
                />
              </div>
              <div className="px-4 pb-4">
                <label
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
                    formData.isFlexibleWithDates
                      ? "border-primary bg-primary/10"
                      : "border-border bg-muted/30 hover:border-primary/50"
                  )}
                >
                  <Checkbox
                    id="flexible-dates"
                    checked={formData.isFlexibleWithDates}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, isFlexibleWithDates: checked as boolean }))
                    }
                  />
                  <span className="text-sm font-medium">I'm flexible with dates</span>
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'help-duration' && (
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
                  <span className="text-4xl font-bold text-primary">{formData.tripDuration}</span>
                </div>
                <p className="text-muted-foreground">days</p>
              </div>
              <Slider
                value={[formData.tripDuration || 7]}
                onValueChange={(value) => setFormData(prev => ({ ...prev, tripDuration: value[0] }))}
                max={21}
                min={2}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>2 days</span>
                <span>21+ days</span>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'help-companions' && (
          <div className="space-y-3">
            <RadioGroup 
              value={formData.travelingWith} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, travelingWith: value }))}
              className="space-y-3"
            >
              {companionOptions.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200",
                    formData.travelingWith === option.id
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value={option.id} id={`help-${option.id}`} className="sr-only" />
                  <div className="text-3xl">{option.emoji}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  {formData.travelingWith === option.id && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </label>
              ))}
            </RadioGroup>
          </div>
        )}

        {currentStep === 'help-vibes' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Select all that apply (at least 1):</p>
            <div className="grid grid-cols-2 gap-3">
              {vibeOptions.map((vibe) => {
                const isSelected = formData.travelVibes?.includes(vibe.id);
                return (
                  <button
                    key={vibe.id}
                    onClick={() => {
                      if (isSelected) {
                        setFormData(prev => ({
                          ...prev,
                          travelVibes: (prev.travelVibes || []).filter(v => v !== vibe.id)
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          travelVibes: [...(prev.travelVibes || []), vibe.id]
                        }));
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <span className="text-2xl">{vibe.emoji}</span>
                    <span className="font-medium text-sm">{vibe.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-primary ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 'help-budget' && (
          <div className="space-y-3">
            {budgetRanges.map((budget) => (
              <button
                key={budget.id}
                onClick={() => setFormData(prev => ({ ...prev, budget: budget.id }))}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200",
                  formData.budget === budget.id
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <div className="text-3xl">{budget.emoji}</div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{budget.label}</p>
                  <p className="text-sm text-muted-foreground">{budget.range} per person</p>
                </div>
                {formData.budget === budget.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border/50 p-4 z-20">
        <div className="max-w-2xl mx-auto">
          <Button 
            onClick={handleNext}
            className={cn(
              "w-full h-14 text-base font-semibold rounded-2xl transition-all duration-300",
              isLastStep && "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            )}
            variant={isLastStep ? "default" : "default"}
            size="lg"
            disabled={!canProceed()}
          >
            {isLastStep ? (
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Generate My Trip
                <Sparkles className="h-5 w-5" />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue
                <ArrowRight className="h-5 w-5" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
