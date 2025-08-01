import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Split, DollarSign, Users, Calculator, Percent, Divide, AlertTriangle, Check } from "lucide-react";
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

interface EnhancedExpenseSplitterProps {
  expense: BookingDetails | null;
  tripMates: TripMate[];
  existingSplits: ExpenseSplit[];
  isOpen: boolean;
  onClose: () => void;
  onSaveSplit: (splits: ExpenseSplit[]) => void;
}

export function EnhancedExpenseSplitter({ 
  expense, 
  tripMates, 
  existingSplits, 
  isOpen, 
  onClose, 
  onSaveSplit 
}: EnhancedExpenseSplitterProps) {
  const [splitType, setSplitType] = useState<'equal' | 'custom' | 'percentage'>('equal');
  const [selectedMates, setSelectedMates] = useState<string[]>([]);
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>({});
  const [percentages, setPercentages] = useState<Record<string, number>>({});
  const [paidBy, setPaidBy] = useState<string>('');
  const { formatPrice } = useCurrency();
  const { toast } = useToast();

  // Initialize with existing splits if any
  useEffect(() => {
    if (existingSplits.length > 0 && expense) {
      const mateIds = existingSplits.map(split => split.tripMateId);
      setSelectedMates(mateIds);
      setPaidBy(existingSplits.find(split => split.isPaid)?.tripMateId || '');
      
      // Detect split type based on amounts
      const amounts = existingSplits.map(split => split.amount);
      const isEqual = amounts.every(amount => Math.abs(amount - amounts[0]) < 0.01);
      
      if (isEqual) {
        setSplitType('equal');
      } else {
        setSplitType('custom');
        const customAmountsMap: Record<string, number> = {};
        existingSplits.forEach(split => {
          customAmountsMap[split.tripMateId] = split.amount;
        });
        setCustomAmounts(customAmountsMap);
      }
    }
  }, [existingSplits, expense]);

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

  const getValidationStatus = () => {
    if (splitType === 'custom') {
      const total = calculateTotalCustom();
      const expected = expense?.cost || 0;
      const isValid = Math.abs(total - expected) < 0.01;
      return { isValid, progress: (total / expected) * 100 };
    }
    
    if (splitType === 'percentage') {
      const total = calculateTotalPercentage();
      const isValid = Math.abs(total - 100) < 0.01;
      return { isValid, progress: total };
    }
    
    return { isValid: true, progress: 100 };
  };

  if (!expense) return null;

  const validation = getValidationStatus();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Split className="h-5 w-5 text-primary" />
            Split Expense
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Expense Details & Payer */}
          <div className="space-y-4">
            {/* Expense Summary */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-lg text-deep-blue truncate">{expense.title}</p>
                    <p className="text-sm text-muted-foreground">{expense.type}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{formatPrice(expense.cost)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Who paid? */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Who paid?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Select value={paidBy} onValueChange={setPaidBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select who paid" />
                  </SelectTrigger>
                  <SelectContent>
                    {tripMates.map(mate => (
                      <SelectItem key={mate.id} value={mate.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {getInitials(mate.name)}
                            </AvatarFallback>
                          </Avatar>
                          {mate.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Validation Progress */}
            {(splitType === 'custom' || splitType === 'percentage') && (
              <Card className={`border-2 ${validation.isValid ? 'border-green-200 bg-green-50/50' : 'border-orange-200 bg-orange-50/50'}`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {splitType === 'custom' ? 'Amount Progress' : 'Percentage Progress'}
                      </span>
                      {validation.isValid ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                      )}
                    </div>
                    <Progress 
                      value={Math.min(validation.progress, 100)} 
                      className={`h-2 ${validation.isValid ? '[&>div]:bg-green-600' : '[&>div]:bg-orange-600'}`}
                    />
                    <p className="text-xs text-muted-foreground">
                      {splitType === 'custom' 
                        ? `${formatPrice(calculateTotalCustom())} / ${formatPrice(expense.cost)}`
                        : `${calculateTotalPercentage().toFixed(1)}% / 100%`
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Middle Column - Split Method */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Split Method</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Tabs value={splitType} onValueChange={(value) => setSplitType(value as any)}>
                  <TabsList className="grid w-full grid-cols-3 h-auto">
                    <TabsTrigger value="equal" className="flex flex-col gap-1 py-3">
                      <Divide className="h-4 w-4" />
                      <span className="text-xs">Equal</span>
                    </TabsTrigger>
                    <TabsTrigger value="custom" className="flex flex-col gap-1 py-3">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-xs">Custom</span>
                    </TabsTrigger>
                    <TabsTrigger value="percentage" className="flex flex-col gap-1 py-3">
                      <Percent className="h-4 w-4" />
                      <span className="text-xs">Percent</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-4 space-y-3">
                    <TabsContent value="equal" className="mt-0">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Split equally among selected people
                        </p>
                        {selectedMates.length > 0 && (
                          <p className="font-medium mt-1">
                            {formatPrice(expense.cost / selectedMates.length)} per person
                          </p>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="custom" className="mt-0">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Enter custom amount for each person
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="percentage" className="mt-0">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Enter percentage for each person
                        </p>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Trip Mates */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Who should pay? ({selectedMates.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {tripMates.map(mate => {
                    const isSelected = selectedMates.includes(mate.id);
                    
                    return (
                      <div key={mate.id} className={`p-3 rounded-lg border-2 transition-all ${
                        isSelected ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30'
                      }`}>
                        <div className="flex items-center gap-3 mb-2">
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
                        </div>
                        
                        {isSelected && (
                          <div className="ml-11 space-y-2">
                            {splitType === 'custom' && (
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
                                  className="h-8 text-sm"
                                  placeholder="0.00"
                                />
                              </div>
                            )}
                            
                            {splitType === 'percentage' && (
                              <div className="flex items-center gap-2">
                                <Percent className="h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="number"
                                  step="0.1"
                                  max="100"
                                  value={percentages[mate.id] || ''}
                                  onChange={(e) => setPercentages(prev => ({
                                    ...prev,
                                    [mate.id]: parseFloat(e.target.value) || 0
                                  }))}
                                  className="h-8 text-sm"
                                  placeholder="0"
                                />
                              </div>
                            )}
                            
                            {splitType === 'equal' && (
                              <Badge variant="secondary" className="text-xs">
                                {formatPrice(expense.cost / selectedMates.length)}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Summary & Actions */}
        <div className="space-y-4">
          <Separator />
          
          {/* Quick Summary */}
          {selectedMates.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-primary" />
                    <span className="font-medium">Split Summary</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {selectedMates.length} {selectedMates.length === 1 ? 'person' : 'people'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {splitType === 'equal' && `${formatPrice(expense.cost / selectedMates.length)} each`}
                      {splitType === 'custom' && `Total: ${formatPrice(calculateTotalCustom())}`}
                      {splitType === 'percentage' && `Total: ${calculateTotalPercentage().toFixed(1)}%`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              onClick={handleSave} 
              className="flex-1" 
              disabled={selectedMates.length === 0 || !paidBy || !validation.isValid}
            >
              Save Split
            </Button>
            <Button variant="outline" onClick={onClose} className="px-8">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}