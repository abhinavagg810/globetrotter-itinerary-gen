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
import { useGenerateItinerary, AIItinerary } from "@/hooks/useGenerateItinerary";
import { supabase } from "@/integrations/supabase/client";

type AppState = 'auth' | 'dashboard' | 'create' | 'generating' | 'itinerary' | 'my-itineraries' | 'document-upload' | 'expense-tracker' | 'profile';

const Index = () => {
  const { user, loading } = useAuth();
  const [appState, setAppState] = useState<AppState>('auth');
  const { generateItinerary, saveItineraryToDatabase, isGenerating, isSaving } = useGenerateItinerary();
  
  useEffect(() => {
    if (user && appState === 'auth') {
      setAppState('dashboard');
    } else if (!user && appState !== 'auth') {
      setAppState('auth');
    }
  }, [user]);

  const [currentItinerary, setCurrentItinerary] = useState<ItineraryData | null>(null);
  const [aiGeneratedItinerary, setAiGeneratedItinerary] = useState<AIItinerary | null>(null);
  const [savedItineraryId, setSavedItineraryId] = useState<string | null>(null);
  const [documentUploadData, setDocumentUploadData] = useState<{ itemType: 'flight' | 'hotel' | 'activity' | 'restaurant'; itemTitle: string; itemId: string } | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails[]>([]);
  const [tripMates, setTripMates] = useState<TripMate[]>([]);
  const [expenseSplits, setExpenseSplits] = useState<ExpenseSplit[]>([]);

  // Load trip participants when viewing an itinerary
  const loadTripParticipants = async (itineraryId: string) => {
    const { data: participants, error } = await supabase
      .from('trip_participants')
      .select('*')
      .eq('itinerary_id', itineraryId);

    if (error) {
      console.error('Error loading participants:', error);
      return;
    }

    if (participants) {
      setTripMates(participants.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email || undefined,
        avatar: p.avatar_url || undefined,
        totalPaid: p.total_paid,
        totalOwed: p.total_owed,
        isOwner: p.user_id === user?.id,
      })));
    }
  };

  // Load expenses when viewing an itinerary
  const loadExpenses = async (itineraryId: string) => {
    const { data: expenses, error } = await supabase
      .from('expenses')
      .select(`
        *,
        expense_splits(*)
      `)
      .eq('itinerary_id', itineraryId);

    if (error) {
      console.error('Error loading expenses:', error);
      return;
    }

    if (expenses) {
      const loadedBookings: BookingDetails[] = expenses.map(e => ({
        id: e.id,
        title: e.description || 'Expense',
        provider: 'Manual Entry',
        type: e.category as 'flight' | 'hotel' | 'activity' | 'restaurant',
        cost: e.amount,
        details: `Date: ${e.date}`,
        bookingReference: e.id,
      }));
      setBookingDetails(loadedBookings);

      const loadedSplits: ExpenseSplit[] = expenses.flatMap(e => 
        (e.expense_splits || []).map((s: any) => ({
          id: s.id,
          expenseId: s.expense_id,
          tripMateId: s.participant_id,
          amount: s.amount,
          isPaid: false,
        }))
      );
      setExpenseSplits(loadedSplits);
    }
  };

  const handleLogin = () => setAppState('dashboard');
  const handleCreateItinerary = () => setAppState('create');
  const handleBackToDashboard = () => {
    setCurrentItinerary(null);
    setAiGeneratedItinerary(null);
    setSavedItineraryId(null);
    setTripMates([]);
    setExpenseSplits([]);
    setBookingDetails([]);
    setAppState('dashboard');
  };
  const handleViewItineraries = () => setAppState('my-itineraries');
  const handleProfile = () => setAppState('profile');
  const handleViewExpenses = () => setAppState('expense-tracker');

  const handleAddDetails = (itemType: 'flight' | 'hotel' | 'activity' | 'restaurant', itemTitle: string, itemId: string) => {
    setDocumentUploadData({ itemType, itemTitle, itemId });
    setAppState('document-upload');
  };

  const handleSaveBookingDetails = async (details: BookingDetails) => {
    setBookingDetails(prev => [...prev, details]);
    
    // Save expense to database if we have a saved itinerary
    if (savedItineraryId && tripMates.length > 0) {
      const paidByParticipant = tripMates.find(m => m.isOwner) || tripMates[0];
      
      await supabase.from('expenses').insert({
        itinerary_id: savedItineraryId,
        amount: details.cost,
        category: details.type,
        date: new Date().toISOString().split('T')[0],
        description: details.title,
        paid_by_participant_id: paidByParticipant.id,
        currency: 'USD',
      });
    }
    
    setAppState('itinerary');
  };

  const handleViewBookingDetails = (details: BookingDetails) => {
    console.log('Viewing booking details:', details);
  };

  const handleGenerateItinerary = async (data: ItineraryData) => {
    setCurrentItinerary(data);
    setAppState('generating');
    
    const result = await generateItinerary(data);
    
    if (result && user) {
      setAiGeneratedItinerary(result);
      
      // Save to database
      const savedResult = await saveItineraryToDatabase(data, result, user.id);
      if (savedResult) {
        setSavedItineraryId(savedResult.id);
        await loadTripParticipants(savedResult.id);
      }
      
      setAppState('itinerary');
    } else if (result) {
      setAiGeneratedItinerary(result);
      setAppState('itinerary');
    } else {
      setAppState('dashboard');
    }
  };

  const handleViewItinerary = async (id: string) => {
    // Load itinerary from database
    const { data: itinerary, error } = await supabase
      .from('itineraries')
      .select(`
        *,
        itinerary_days(
          *,
          activities(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !itinerary) {
      console.error('Error loading itinerary:', error);
      return;
    }

    const formData: ItineraryData = {
      fromLocation: "",
      destinations: itinerary.destinations || [],
      travelType: itinerary.travel_type || "adventure",
      fromDate: new Date(itinerary.start_date),
      toDate: new Date(itinerary.end_date),
    };

    // Reconstruct AI itinerary from database
    const aiData: AIItinerary = {
      tripName: itinerary.name,
      summary: "",
      estimatedBudget: {
        total: 0,
        breakdown: { flights: 0, accommodation: 0, activities: 0, food: 0, transportation: 0, miscellaneous: 0 },
        perPerson: 0,
        currency: "USD",
      },
      importantInfo: {
        localCurrency: { code: "USD", name: "US Dollar", symbol: "$", exchangeRate: "1.00" },
        timezone: { name: "UTC", offset: "UTC+0" },
        language: "English",
        emergencyNumbers: { police: "911", ambulance: "911" },
        bestTimeToVisit: "",
        visaRequirements: "",
        travelTips: [],
      },
      weather: {
        temperature: { min: 20, max: 30, unit: "°C" },
        condition: "",
        humidity: "",
        packingTips: [],
      },
      days: (itinerary.itinerary_days || []).map((day: any) => ({
        dayNumber: day.day_number,
        date: day.date,
        theme: day.notes || "",
        location: day.location || "",
        activities: (day.activities || []).map((a: any) => ({
          id: a.id,
          time: a.start_time || "09:00",
          endTime: a.end_time,
          title: a.title,
          description: a.description || "",
          type: a.category || "activity",
          price: a.cost || 0,
          location: a.location,
          bookingStatus: a.booking_status || "available",
        })),
      })),
      recommendations: { mustTry: [], avoidances: [], localCustoms: [] },
    };

    setCurrentItinerary(formData);
    setAiGeneratedItinerary(aiData);
    setSavedItineraryId(id);
    await loadTripParticipants(id);
    await loadExpenses(id);
    setAppState('itinerary');
  };

  const handleUpdateTripMates = async (updatedMates: TripMate[]) => {
    const oldMates = [...tripMates];
    setTripMates(updatedMates);
    
    // Sync with database
    if (savedItineraryId) {
      for (const mate of updatedMates) {
        const existingMate = oldMates.find(m => m.id === mate.id);
        if (!existingMate) {
          // New mate - insert and get the new ID
          const { data: insertedMate, error } = await supabase.from('trip_participants')
            .insert({
              itinerary_id: savedItineraryId,
              name: mate.name,
              email: mate.email || null,
              total_paid: mate.totalPaid,
              total_owed: mate.totalOwed,
            })
            .select()
            .single();
          
          if (!error && insertedMate) {
            // Update local state with the real ID from database
            setTripMates(prev => prev.map(m => 
              m.id === mate.id ? { ...m, id: insertedMate.id } : m
            ));
          }
        } else {
          // Existing mate - update if balances changed
          if (existingMate.totalPaid !== mate.totalPaid || existingMate.totalOwed !== mate.totalOwed) {
            await supabase.from('trip_participants')
              .update({
                total_paid: mate.totalPaid,
                total_owed: mate.totalOwed,
              })
              .eq('id', mate.id);
          }
        }
      }

      // Handle deletions
      for (const oldMate of oldMates) {
        if (!updatedMates.find(m => m.id === oldMate.id)) {
          await supabase.from('trip_participants').delete().eq('id', oldMate.id);
        }
      }
    }
  };

  const handleUpdateExpenseSplits = async (updatedSplits: ExpenseSplit[]) => {
    setExpenseSplits(updatedSplits);
    
    // Sync with database if we have a saved itinerary
    if (savedItineraryId) {
      for (const split of updatedSplits) {
        const existingSplit = expenseSplits.find(s => s.id === split.id);
        if (!existingSplit) {
          // New split
          await supabase.from('expense_splits').insert({
            expense_id: split.expenseId,
            participant_id: split.tripMateId,
            amount: split.amount,
          });
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading...</p>
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
            case 'generating':
              return (
                <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
                  <div className="text-center max-w-md mx-4">
                    <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-foreground mb-3">
                      {isSaving ? "Saving Your Trip" : "Creating Your Perfect Trip"}
                    </h2>
                    <p className="text-muted-foreground">
                      {isSaving 
                        ? "Saving your itinerary to your account..." 
                        : "Our AI is crafting a personalized itinerary based on your preferences..."
                      }
                    </p>
                  </div>
                </div>
              );
            case 'itinerary':
              return currentItinerary ? (
                <ItineraryView 
                  onBack={handleBackToDashboard} 
                  itineraryData={currentItinerary} 
                  aiItinerary={aiGeneratedItinerary}
                  itineraryId={savedItineraryId}
                  onAddDetails={handleAddDetails}
                  onViewExpenses={handleViewExpenses}
                  bookingDetails={bookingDetails}
                  onAddBookingDetails={(booking) => setBookingDetails([...bookingDetails, booking])}
                  tripMates={tripMates}
                  onUpdateTripMates={handleUpdateTripMates}
                  expenseSplits={expenseSplits}
                  onUpdateExpenseSplits={handleUpdateExpenseSplits}
                  onItineraryUpdated={() => {
                    // Refresh itinerary data
                    if (savedItineraryId) {
                      handleViewItinerary(savedItineraryId);
                    }
                  }}
                  isSaving={isSaving}
                  onSaveTrip={async () => {
                    if (!user || !currentItinerary || !aiGeneratedItinerary) return;
                    const savedResult = await saveItineraryToDatabase(currentItinerary, aiGeneratedItinerary, user.id);
                    if (savedResult) {
                      setSavedItineraryId(savedResult.id);
                      await loadTripParticipants(savedResult.id);
                    }
                  }}
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
                <div className="w-full min-h-screen bg-background">
                  <div className="glass border-b border-border/50 p-3 md:p-4 sticky top-0 z-10">
                    <div className="flex items-center gap-2 md:gap-3 max-w-6xl mx-auto">
                      <button onClick={() => setAppState('itinerary')} className="p-2 hover:bg-muted rounded-lg h-8 w-8 md:h-10 md:w-10 flex items-center justify-center transition-colors">
                        ←
                      </button>
                      <h1 className="font-semibold text-base md:text-lg text-foreground">Expense Tracker</h1>
                    </div>
                  </div>
                  <div className="p-3 md:p-6 max-w-6xl mx-auto">
                    <ExpenseTracker 
                      expenses={bookingDetails} 
                      onViewDetails={handleViewBookingDetails}
                      onAddExpense={(expense) => {
                        const newExpense: BookingDetails = {
                          ...expense,
                          id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                        };
                        handleSaveBookingDetails(newExpense);
                      }}
                      tripMates={tripMates}
                      onUpdateTripMates={handleUpdateTripMates}
                      expenseSplits={expenseSplits}
                      onUpdateExpenseSplits={handleUpdateExpenseSplits}
                      tripName={aiGeneratedItinerary?.tripName}
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
