import { useState } from "react";
import { AuthPage } from "@/components/AuthPage";
import { Dashboard } from "@/components/Dashboard";
import { CreateItinerary, ItineraryData } from "@/components/CreateItinerary";
import { ItineraryView } from "@/components/ItineraryView";
import { MyItineraries } from "@/components/MyItineraries";

type AppState = 'auth' | 'dashboard' | 'create' | 'itinerary' | 'my-itineraries';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('auth');
  const [currentItinerary, setCurrentItinerary] = useState<ItineraryData | null>(null);

  const handleLogin = () => setAppState('dashboard');
  const handleCreateItinerary = () => setAppState('create');
  const handleBackToDashboard = () => setAppState('dashboard');
  const handleViewItineraries = () => setAppState('my-itineraries');
  const handleProfile = () => console.log('Profile clicked');

  const handleGenerateItinerary = (data: ItineraryData) => {
    setCurrentItinerary(data);
    setAppState('itinerary');
  };

  const handleViewItinerary = (id: string) => {
    const mockData: ItineraryData = {
      fromLocation: "New York, USA",
      destinations: ["Bali, Indonesia"],
      travelType: "romantic",
      fromDate: new Date(),
      toDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    setCurrentItinerary(mockData);
    setAppState('itinerary');
  };

  switch (appState) {
    case 'auth':
      return <AuthPage onLogin={handleLogin} />;
    case 'dashboard':
      return <Dashboard onCreateItinerary={handleCreateItinerary} onViewItineraries={handleViewItineraries} onProfile={handleProfile} />;
    case 'create':
      return <CreateItinerary onBack={handleBackToDashboard} onGenerate={handleGenerateItinerary} />;
    case 'itinerary':
      return currentItinerary ? <ItineraryView onBack={handleBackToDashboard} itineraryData={currentItinerary} onBookingComplete={() => {}} /> : <Dashboard onCreateItinerary={handleCreateItinerary} onViewItineraries={handleViewItineraries} onProfile={handleProfile} />;
    case 'my-itineraries':
      return <MyItineraries onBack={handleBackToDashboard} onViewItinerary={handleViewItinerary} onCreateNew={handleCreateItinerary} />;
    default:
      return <AuthPage onLogin={handleLogin} />;
  }
};

export default Index;
