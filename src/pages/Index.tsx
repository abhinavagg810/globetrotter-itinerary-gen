import { useState, useEffect } from "react";
import { AuthPage } from "@/components/AuthPage";
import { Dashboard } from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { CreateItinerarySteps, ItineraryData } from "@/components/CreateItinerarySteps";
import { ItineraryView } from "@/components/ItineraryView";
import { MyItineraries } from "@/components/MyItineraries";
import { DocumentUpload, BookingDetails } from "@/components/DocumentUpload";
import { ExpenseTracker } from "@/components/ExpenseTracker";
import { Profile } from "@/components/Profile";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { TripMate } from "@/components/TripMateManager";
import { ExpenseSplit } from "@/components/ExpenseSplitter";

type AppState = 'auth' | 'dashboard' | 'create' | 'itinerary' | 'my-itineraries' | 'document-upload' | 'expense-tracker' | 'profile';

const Index = () => {
  const { user, loading } = useAuth();
  const [appState, setAppState] = useState<AppState>('auth');
  
  useEffect(() => {
    if (user && appState === 'auth') {
      setAppState('dashboard');
    } else if (!user && appState !== 'auth') {
      setAppState('auth');
    }
  }, [user]);
  const [currentItinerary, setCurrentItinerary] = useState<ItineraryData | null>(null);
  const [documentUploadData, setDocumentUploadData] = useState<{ itemType: 'flight' | 'hotel' | 'activity' | 'restaurant'; itemTitle: string; itemId: string } | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails[]>([]);
  const [tripMates, setTripMates] = useState<TripMate[]>([
    {
      id: 'owner-1',
      name: 'You',
      email: 'you@example.com',
      totalPaid: 0,
      totalOwed: 0,
      isOwner: true
    }
  ]);
  const [expenseSplits, setExpenseSplits] = useState<ExpenseSplit[]>([]);

  const handleLogin = () => setAppState('dashboard');
  const handleCreateItinerary = () => setAppState('create');
  const handleBackToDashboard = () => setAppState('dashboard');
  const handleViewItineraries = () => setAppState('my-itineraries');
  const handleProfile = () => setAppState('profile');
  const handleViewExpenses = () => setAppState('expense-tracker');

  const handleAddDetails = (itemType: 'flight' | 'hotel' | 'activity' | 'restaurant', itemTitle: string, itemId: string) => {
    setDocumentUploadData({ itemType, itemTitle, itemId });
    setAppState('document-upload');
  };

  const handleSaveBookingDetails = (details: BookingDetails) => {
    setBookingDetails(prev => [...prev, details]);
    setAppState('itinerary');
  };

  const handleViewBookingDetails = (details: BookingDetails) => {
    // In a real app, you might want to open a modal or navigate to a detail view
    console.log('Viewing booking details:', details);
  };

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

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-sky/30 via-sage/20 to-sand/30">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-deep-blue">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <CurrencyProvider>
      <div className="w-full min-h-screen">
        {(() => {
          switch (appState) {
            case 'auth':
              return <AuthPage onLogin={handleLogin} />;
            case 'dashboard':
              return <Dashboard onCreateItinerary={handleCreateItinerary} onViewItineraries={handleViewItineraries} onProfile={handleProfile} />;
            case 'create':
              return <CreateItinerarySteps onBack={handleBackToDashboard} onGenerate={handleGenerateItinerary} />;
            case 'itinerary':
              return currentItinerary ? (
                <ItineraryView 
                  onBack={handleBackToDashboard} 
                  itineraryData={currentItinerary} 
                  onAddDetails={handleAddDetails}
                  onViewExpenses={handleViewExpenses}
                  bookingDetails={bookingDetails}
                  onAddBookingDetails={(booking) => setBookingDetails([...bookingDetails, booking])}
                  tripMates={tripMates}
                  onUpdateTripMates={setTripMates}
                  expenseSplits={expenseSplits}
                  onUpdateExpenseSplits={setExpenseSplits}
                />
              ) : (
                <Dashboard onCreateItinerary={handleCreateItinerary} onViewItineraries={handleViewItineraries} onProfile={handleProfile} />
              );
            case 'my-itineraries':
              return <MyItineraries onBack={handleBackToDashboard} onViewItinerary={handleViewItinerary} onCreateNew={handleCreateItinerary} />;
            case 'document-upload':
              return documentUploadData ? (
                <DocumentUpload
                  onBack={() => setAppState('itinerary')}
                  onSave={handleSaveBookingDetails}
                  itemType={documentUploadData.itemType}
                  itemTitle={documentUploadData.itemTitle}
                />
              ) : (
                <Dashboard onCreateItinerary={handleCreateItinerary} onViewItineraries={handleViewItineraries} onProfile={handleProfile} />
              );
            case 'expense-tracker':
              return (
                <div className="w-full min-h-screen bg-gradient-to-br from-sky/10 to-sand/30">
                  <div className="bg-white/80 backdrop-blur-md shadow-soft border-b border-border/50 p-3 md:p-4 sticky top-0 z-10">
                    <div className="flex items-center gap-2 md:gap-3">
                      <button onClick={() => setAppState('itinerary')} className="p-2 hover:bg-gray-100 rounded-lg h-8 w-8 md:h-10 md:w-10 flex items-center justify-center">
                        ←
                      </button>
                      <h1 className="font-bold text-base md:text-lg text-deep-blue">Expense Tracker</h1>
                    </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <ExpenseTracker 
                      expenses={bookingDetails} 
                      onViewDetails={handleViewBookingDetails}
                      onAddExpense={(expense) => {
                        const newExpense: BookingDetails = {
                          ...expense,
                          id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                        };
                        setBookingDetails([...bookingDetails, newExpense]);
                      }}
                      tripMates={tripMates}
                      onUpdateTripMates={setTripMates}
                      expenseSplits={expenseSplits}
                      onUpdateExpenseSplits={setExpenseSplits}
                    />
                  </div>
                </div>
              );
            case 'profile':
              return <Profile onBack={handleBackToDashboard} />;
            default:
              return <AuthPage onLogin={handleLogin} />;
          }
        })()}
      </div>
    </CurrencyProvider>
  );
};

export default Index;
