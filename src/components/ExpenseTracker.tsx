import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Hotel, Camera, Utensils, TrendingUp, PieChart } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { BookingDetails } from "./DocumentUpload";

interface ExpenseTrackerProps {
  expenses: BookingDetails[];
  onViewDetails: (expense: BookingDetails) => void;
}

export function ExpenseTracker({ expenses, onViewDetails }: ExpenseTrackerProps) {
  const { formatPrice } = useCurrency();

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

  return (
    <div className="space-y-6">
      {/* Total Expenses */}
      <Card className="bg-gradient-premium text-white border-0 shadow-premium">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Total Expenses</h3>
              <p className="text-3xl font-bold">{formatPrice(totalExpenses)}</p>
            </div>
            <div className="text-4xl opacity-80">
              <TrendingUp className="h-12 w-12" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown */}
      <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-deep-blue">
            <PieChart className="h-5 w-5 text-primary" />
            Expense Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(expensesByType).map(([type, amount]) => {
              const Icon = getIcon(type);
              const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
              
              return (
                <div key={type} className="flex items-center justify-between p-3 rounded-lg bg-white/70">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-deep-blue">{typeLabels[type as keyof typeof typeLabels]}</p>
                      <p className="text-sm text-muted-foreground">{percentage.toFixed(1)}% of total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-deep-blue">{formatPrice(amount)}</p>
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
          <CardTitle className="text-deep-blue">Expense Details</CardTitle>
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
                
                return (
                  <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg bg-white/70 hover:bg-white/90 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-deep-blue">{expense.title}</p>
                        <p className="text-sm text-muted-foreground">{expense.provider}</p>
                        <Badge className={`text-xs ${getTypeColor(expense.type)}`}>
                          {expense.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-deep-blue">{formatPrice(expense.cost)}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onViewDetails(expense)}
                        className="mt-1"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}