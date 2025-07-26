import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Split, DollarSign, Users, Calculator } from "lucide-react";
import { TripMate } from "./TripMateManager";
import { BookingDetails } from "./DocumentUpload";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useToast } from "@/hooks/use-toast";

export interface ExpenseSplit {
  id: string;
  expenseId: string;
  tripMateId: string;
  amount: number;
  isPaid: boolean;
}

interface ExpenseSplitterProps {
  expense: BookingDetails | null;
  tripMates: TripMate[];
  existingSplits: ExpenseSplit[];
  isOpen: boolean;
  onClose: () => void;
  onSaveSplit: (splits: ExpenseSplit[]) => void;
}

export function ExpenseSplitter({ 
  expense, 
  tripMates, 
  existingSplits, 
  isOpen, 
  onClose, 
  onSaveSplit 
}: ExpenseSplitterProps) {
  const [splitType, setSplitType] = useState<'equal' | 'custom' | 'percentage'>('equal');
  const [selectedMates, setSelectedMates] = useState<string[]>([]);
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>({});
  const [percentages, setPercentages] = useState<Record<string, number>>({});
  const [paidBy, setPaidBy] = useState<string>('');
  const { formatPrice } = useCurrency();
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const calculateSplits = () => {
    if (!expense || selectedMates.length === 0) return [];

    const totalAmount = expense.cost;
    const splits: Omit<ExpenseSplit, 'id'>[] = [];

    if (splitType === 'equal') {
      const amountPerPerson = totalAmount / selectedMates.length;
      selectedMates.forEach(mateId => {
        splits.push({
          expenseId: expense.id,
          tripMateId: mateId,
          amount: amountPerPerson,
          isPaid: mateId === paidBy
        });
      });
    } else if (splitType === 'custom') {
      selectedMates.forEach(mateId => {
        const amount = customAmounts[mateId] || 0;
        splits.push({
          expenseId: expense.id,
          tripMateId: mateId,
          amount,
          isPaid: mateId === paidBy
        });
      });
    } else if (splitType === 'percentage') {
      selectedMates.forEach(mateId => {
        const percentage = percentages[mateId] || 0;
        const amount = (totalAmount * percentage) / 100;
        splits.push({
          expenseId: expense.id,
          tripMateId: mateId,
          amount,
          isPaid: mateId === paidBy
        });
      });
    }

    return splits.map((split, index) => ({
      ...split,
      id: `split-${expense.id}-${index}`
    }));
  };

  const handleSave = () => {
    const splits = calculateSplits();
    
    if (splitType === 'custom') {
      const totalCustomAmount = Object.values(customAmounts).reduce((sum, amount) => sum + (amount || 0), 0);
      if (Math.abs(totalCustomAmount - (expense?.cost || 0)) > 0.01) {
        toast({
          title: "Amount mismatch",
          description: "Custom amounts must add up to the total expense amount",
          variant: "destructive"
        });
        return;
      }
    }

    if (splitType === 'percentage') {
      const totalPercentage = Object.values(percentages).reduce((sum, percentage) => sum + (percentage || 0), 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        toast({
          title: "Percentage error",
          description: "Percentages must add up to 100%",
          variant: "destructive"
        });
        return;
      }
    }

    onSaveSplit(splits);
    onClose();
    
    toast({
      title: "Expense split saved",
      description: `Split ${formatPrice(expense?.cost || 0)} among ${splits.length} people`
    });
  };

  const toggleMate = (mateId: string) => {
    setSelectedMates(prev => 
      prev.includes(mateId) 
        ? prev.filter(id => id !== mateId)
        : [...prev, mateId]
    );
  };

  const calculateTotalCustom = () => {
    return Object.values(customAmounts).reduce((sum, amount) => sum + (amount || 0), 0);
  };

  const calculateTotalPercentage = () => {
    return Object.values(percentages).reduce((sum, percentage) => sum + (percentage || 0), 0);
  };

  if (!expense) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Split className="h-5 w-5 text-primary" />
            Split Expense: {expense.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Expense Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-deep-blue">{expense.title}</p>
                  <p className="text-sm text-muted-foreground">{expense.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{formatPrice(expense.cost)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Who paid? */}
          <div>
            <label className="text-sm font-medium mb-2 block">Who paid for this expense?</label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger>
                <SelectValue placeholder="Select who paid" />
              </SelectTrigger>
              <SelectContent>
                {tripMates.map(mate => (
                  <SelectItem key={mate.id} value={mate.id}>
                    {mate.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Split Type */}
          <div>
            <label className="text-sm font-medium mb-2 block">How to split?</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={splitType === 'equal' ? 'default' : 'outline'}
                onClick={() => setSplitType('equal')}
                size="sm"
              >
                Equal Split
              </Button>
              <Button
                variant={splitType === 'custom' ? 'default' : 'outline'}
                onClick={() => setSplitType('custom')}
                size="sm"
              >
                Custom Amount
              </Button>
              <Button
                variant={splitType === 'percentage' ? 'default' : 'outline'}
                onClick={() => setSplitType('percentage')}
                size="sm"
              >
                Percentage
              </Button>
            </div>
          </div>

          {/* Trip Mates Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Who should pay for this expense?</label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {tripMates.map(mate => {
                const isSelected = selectedMates.includes(mate.id);
                
                return (
                  <div key={mate.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleMate(mate.id)}
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {getInitials(mate.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{mate.name}</p>
                    </div>
                    
                    {isSelected && splitType === 'custom' && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          step="0.01"
                          value={customAmounts[mate.id] || ''}
                          onChange={(e) => setCustomAmounts(prev => ({
                            ...prev,
                            [mate.id]: parseFloat(e.target.value) || 0
                          }))}
                          className="w-20 h-8"
                          placeholder="0.00"
                        />
                      </div>
                    )}
                    
                    {isSelected && splitType === 'percentage' && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          step="0.1"
                          max="100"
                          value={percentages[mate.id] || ''}
                          onChange={(e) => setPercentages(prev => ({
                            ...prev,
                            [mate.id]: parseFloat(e.target.value) || 0
                          }))}
                          className="w-16 h-8"
                          placeholder="0"
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    )}
                    
                    {isSelected && splitType === 'equal' && (
                      <Badge variant="secondary" className="text-xs">
                        {formatPrice(expense.cost / selectedMates.length)}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          {selectedMates.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-primary" />
                    <span className="font-medium">Split Summary</span>
                  </div>
                  <div className="text-right">
                    {splitType === 'equal' && (
                      <p className="text-sm">
                        {formatPrice(expense.cost / selectedMates.length)} per person
                      </p>
                    )}
                    {splitType === 'custom' && (
                      <p className={`text-sm ${Math.abs(calculateTotalCustom() - expense.cost) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                        Total: {formatPrice(calculateTotalCustom())} / {formatPrice(expense.cost)}
                      </p>
                    )}
                    {splitType === 'percentage' && (
                      <p className={`text-sm ${Math.abs(calculateTotalPercentage() - 100) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                        Total: {calculateTotalPercentage().toFixed(1)}% / 100%
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1" disabled={selectedMates.length === 0 || !paidBy}>
              Save Split
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}