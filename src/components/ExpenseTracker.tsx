import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plane, Hotel, Camera, Utensils, TrendingUp, PieChart, Split, Users, Plus } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { BookingDetails } from "./DocumentUpload";
import { TripMateManager, TripMate } from "./TripMateManager";
import { EnhancedExpenseSplitter, ExpenseSplit } from "./EnhancedExpenseSplitter";

interface ExpenseTrackerProps {
  expenses: BookingDetails[];
  onViewDetails: (expense: BookingDetails) => void;
  onAddExpense?: (expense: Omit<BookingDetails, 'id'>) => void;
  tripMates?: TripMate[];
  onUpdateTripMates?: (tripMates: TripMate[]) => void;
  expenseSplits?: ExpenseSplit[];
  onUpdateExpenseSplits?: (splits: ExpenseSplit[]) => void;
  tripName?: string;
}

export function ExpenseTracker({ 
  expenses, 
  onViewDetails,
  onAddExpense,
  tripMates = [], 
  onUpdateTripMates, 
  expenseSplits = [], 
  onUpdateExpenseSplits,
  tripName = "Your Trip"
}: ExpenseTrackerProps) {
  const { formatPrice } = useCurrency();
  const [selectedExpenseForSplit, setSelectedExpenseForSplit] = useState<BookingDetails | null>(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState<{
    title: string;
    provider: string;
    type: 'flight' | 'hotel' | 'activity' | 'restaurant';
    cost: string;
    details: string;
  }>({
    title: '',
    provider: '',
    type: 'activity',
    cost: '',
    details: ''
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'flight': return Plane;
      case 'hotel': return Hotel;
      case 'activity': return Camera;
      case 'restaurant': return Utensils;
      default: return Camera;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'flight': return 'bg-blue-100 text-blue-800';
      case 'hotel': return 'bg-green-100 text-green-800';
      case 'activity': return 'bg-purple-100 text-purple-800';
      case 'restaurant': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.cost, 0);

  const expensesByType = expenses.reduce((acc, expense) => {
    acc[expense.type] = (acc[expense.type] || 0) + expense.cost;
    return acc;
  }, {} as Record<string, number>);

  const typeLabels = {
    flight: 'Flights',
    hotel: 'Hotels',
    activity: 'Activities',
    restaurant: 'Dining'
  };

  // Calculate trip mate balances
  const calculateTripMateBalances = () => {
    return tripMates.map(mate => {
      const totalPaid = expenseSplits
        .filter(split => split.tripMateId === mate.id && split.isPaid)
        .reduce((sum, split) => sum + split.amount, 0);
      
      const totalOwed = expenseSplits
        .filter(split => split.tripMateId === mate.id)
        .reduce((sum, split) => sum + split.amount, 0);

      return {
        ...mate,
        totalPaid,
        totalOwed
      };
    });
  };

  const handleAddTripMate = (newMate: Omit<TripMate, 'id' | 'totalPaid' | 'totalOwed'>) => {
    const tripMate: TripMate = {
      ...newMate,
      id: `mate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      totalPaid: 0,
      totalOwed: 0
    };
    
    if (onUpdateTripMates) {
      onUpdateTripMates([...tripMates, tripMate]);
    }
  };

  const handleRemoveTripMate = (id: string) => {
    if (onUpdateTripMates) {
      onUpdateTripMates(tripMates.filter(mate => mate.id !== id));
    }
    // Also remove related expense splits
    if (onUpdateExpenseSplits) {
      onUpdateExpenseSplits(expenseSplits.filter(split => split.tripMateId !== id));
    }
  };

  const handleSaveSplit = (splits: ExpenseSplit[]) => {
    if (onUpdateExpenseSplits) {
      // Remove existing splits for this expense
      const filteredSplits = expenseSplits.filter(split => 
        split.expenseId !== selectedExpenseForSplit?.id
      );
      onUpdateExpenseSplits([...filteredSplits, ...splits]);
    }
  };

  const handleSettleUp = (fromMateId: string, toMateId: string, amount: number) => {
    // Create a settlement record by adjusting balances
    const updatedTripMates = tripMates.map(mate => {
      if (mate.id === fromMateId) {
        return { ...mate, totalPaid: mate.totalPaid + amount };
      }
      if (mate.id === toMateId) {
        return { ...mate, totalOwed: mate.totalOwed + amount };
      }
      return mate;
    });
    
    onUpdateTripMates?.(updatedTripMates);
  };

  const getExpenseSplitInfo = (expense: BookingDetails) => {
    const splits = expenseSplits.filter(split => split.expenseId === expense.id);
    const totalSplitAmount = splits.reduce((sum, split) => sum + split.amount, 0);
    const splitCount = splits.length;
    
    return {
      isSplit: splits.length > 0,
      splitCount,
      totalSplitAmount,
      remainingAmount: expense.cost - totalSplitAmount
    };
  };

  const handleAddExpense = () => {
    if (!onAddExpense || !newExpense.title || !newExpense.cost) return;
    
    const expense: Omit<BookingDetails, 'id'> = {
      title: newExpense.title,
      provider: newExpense.provider || 'Manual Entry',
      type: newExpense.type,
      cost: parseFloat(newExpense.cost),
      details: newExpense.details,
      bookingReference: `MAN-${Date.now()}`,
    };
    
    onAddExpense(expense);
    setNewExpense({
      title: '',
      provider: '',
      type: 'activity',
      cost: '',
      details: ''
    });
    setShowAddExpense(false);
  };

  const updatedTripMates = calculateTripMateBalances();

  return (
    <div className="space-y-4 md:space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-9 md:h-10">
          <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="tripmates" className="text-xs md:text-sm">Trip Mates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
      {/* Total Expenses */}
      <Card className="bg-gradient-premium text-white border-0 shadow-premium">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base md:text-lg font-semibold mb-1">Total Expenses</h3>
              <p className="text-2xl md:text-3xl font-bold">{formatPrice(totalExpenses)}</p>
            </div>
            <div className="text-3xl md:text-4xl opacity-80">
              <TrendingUp className="h-8 w-8 md:h-12 md:w-12" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown */}
      <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-deep-blue text-sm md:text-base">
            <PieChart className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            Expense Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="space-y-2 md:space-y-3">
            {Object.entries(expensesByType).map(([type, amount]) => {
              const Icon = getIcon(type);
              const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
              
              return (
                <div key={type} className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-white/70">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                    <div className="p-1.5 md:p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <Icon className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-deep-blue text-xs md:text-sm truncate">{typeLabels[type as keyof typeof typeLabels]}</p>
                      <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of total</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-deep-blue text-xs md:text-sm">{formatPrice(amount)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Expense Details */}
      <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-deep-blue">Expense Details</CardTitle>
            {onAddExpense && (
              <Button 
                onClick={() => setShowAddExpense(true)}
                className="gap-2 bg-primary hover:bg-primary/90"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No expenses added yet</p>
                <p className="text-sm mt-1">Add details to flights, hotels, and activities to track expenses</p>
              </div>
            ) : (
              expenses.map((expense) => {
                const Icon = getIcon(expense.type);
                const splitInfo = getExpenseSplitInfo(expense);
                
                return (
                  <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg bg-white/70 hover:bg-white/90 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-deep-blue">{expense.title}</p>
                        <p className="text-sm text-muted-foreground">{expense.provider}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge className={`text-xs ${getTypeColor(expense.type)}`}>
                            {expense.type}
                          </Badge>
                          {splitInfo.isSplit && (
                            <Badge variant="secondary" className="text-xs">
                              <Split className="h-3 w-3 mr-1" />
                              Split {splitInfo.splitCount} ways
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-deep-blue">{formatPrice(expense.cost)}</p>
                      <div className="flex gap-2 mt-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onViewDetails(expense)}
                        >
                          View Details
                        </Button>
                        {onUpdateTripMates && onUpdateExpenseSplits && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedExpenseForSplit(expense)}
                            className="gap-1"
                          >
                            <Split className="h-3 w-3" />
                            {splitInfo.isSplit ? 'Edit Split' : 'Split'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
        </TabsContent>
        
        <TabsContent value="tripmates" className="space-y-6 mt-6">
          {onUpdateTripMates ? (
            <TripMateManager 
              tripMates={updatedTripMates}
              onAddTripMate={handleAddTripMate}
              onRemoveTripMate={handleRemoveTripMate}
              onSettleUp={handleSettleUp}
              tripName={tripName}
            />
          ) : (
            <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">Trip mate management not available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Expense Dialog */}
      <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Lunch at restaurant"
                value={newExpense.title}
                onChange={(e) => setNewExpense(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="type">Category *</Label>
              <Select value={newExpense.type} onValueChange={(value) => setNewExpense(prev => ({ ...prev, type: value as 'flight' | 'hotel' | 'activity' | 'restaurant' }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flight">Flight</SelectItem>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="cost">Cost (INR) *</Label>
              <Input
                id="cost"
                type="number"
                placeholder="Enter amount"
                value={newExpense.cost}
                onChange={(e) => setNewExpense(prev => ({ ...prev, cost: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="provider">Provider/Vendor</Label>
              <Input
                id="provider"
                placeholder="e.g., Zomato, MakeMyTrip"
                value={newExpense.provider}
                onChange={(e) => setNewExpense(prev => ({ ...prev, provider: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="details">Description</Label>
              <Textarea
                id="details"
                placeholder="Add any additional details..."
                value={newExpense.details}
                onChange={(e) => setNewExpense(prev => ({ ...prev, details: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowAddExpense(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddExpense}
                disabled={!newExpense.title || !newExpense.cost}
                className="flex-1"
              >
                Add Expense
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Expense Splitter Dialog */}
      {onUpdateExpenseSplits && (
        <EnhancedExpenseSplitter
          expense={selectedExpenseForSplit}
          tripMates={updatedTripMates}
          existingSplits={expenseSplits.filter(split => split.expenseId === selectedExpenseForSplit?.id)}
          isOpen={!!selectedExpenseForSplit}
          onClose={() => setSelectedExpenseForSplit(null)}
          onSaveSplit={handleSaveSplit}
        />
      )}
    </div>
  );
}