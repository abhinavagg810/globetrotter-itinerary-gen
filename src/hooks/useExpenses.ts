import { useState, useCallback } from 'react';
import { api, Expense as ApiExpense, ExpenseSplit as ApiExpenseSplit } from '@/services/api';
import { toast } from 'sonner';

export interface Expense {
  id: string;
  itinerary_id: string;
  paid_by_participant_id: string;
  amount: number;
  currency: string;
  category: string;
  description: string | null;
  date: string;
  split_type: string;
  receipt_url: string | null;
  created_at: string;
}

export interface ExpenseSplit {
  id: string;
  expense_id: string;
  participant_id: string;
  amount: number;
  created_at: string;
}

export interface CreateExpenseParams {
  itinerary_id: string;
  paid_by_participant_id: string;
  amount: number;
  currency: string;
  category: string;
  description?: string;
  date: string;
  split_type?: string;
}

export interface CreateExpenseSplitParams {
  expense_id: string;
  participant_id: string;
  amount: number;
}

// Convert API response to legacy format
const fromApiExpense = (expense: ApiExpense): Expense => ({
  id: expense.id,
  itinerary_id: expense.itineraryId,
  paid_by_participant_id: expense.paidByParticipantId,
  amount: expense.amount,
  currency: expense.currency,
  category: expense.category,
  description: expense.description,
  date: expense.date,
  split_type: expense.splitType,
  receipt_url: expense.receiptUrl,
  created_at: expense.createdAt,
});

const fromApiExpenseSplit = (split: ApiExpenseSplit): ExpenseSplit => ({
  id: split.id,
  expense_id: split.expenseId,
  participant_id: split.participantId,
  amount: split.amount,
  created_at: split.createdAt,
});

export function useExpenses(itineraryId?: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseSplits, setExpenseSplits] = useState<ExpenseSplit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchExpenses = useCallback(async () => {
    if (!itineraryId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await api.getExpenses(itineraryId);

      if (error) throw new Error(error);
      
      const legacyExpenses = (data?.expenses || []).map(fromApiExpense);
      setExpenses(legacyExpenses);

      // Extract splits from expenses
      const allSplits: ExpenseSplit[] = [];
      (data?.expenses || []).forEach(expense => {
        expense.splits.forEach(split => {
          allSplits.push(fromApiExpenseSplit(split));
        });
      });
      setExpenseSplits(allSplits);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  }, [itineraryId]);

  const createExpense = useCallback(async (params: CreateExpenseParams): Promise<Expense | null> => {
    try {
      const { data, error } = await api.createExpense({
        itineraryId: params.itinerary_id,
        paidByParticipantId: params.paid_by_participant_id,
        amount: params.amount,
        currency: params.currency,
        category: params.category,
        description: params.description,
        date: params.date,
        splitType: params.split_type || 'equal',
      });

      if (error) throw new Error(error);
      if (!data) throw new Error('Failed to create expense');

      const legacyExpense = fromApiExpense(data);
      setExpenses(prev => [legacyExpense, ...prev]);
      toast.success('Expense added');
      return legacyExpense;
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Failed to add expense');
      return null;
    }
  }, []);

  const updateExpense = useCallback(async (expenseId: string, updates: Partial<CreateExpenseParams>): Promise<boolean> => {
    try {
      const apiUpdates: Record<string, unknown> = {};
      if (updates.amount !== undefined) apiUpdates.amount = updates.amount;
      if (updates.currency) apiUpdates.currency = updates.currency;
      if (updates.category) apiUpdates.category = updates.category;
      if (updates.description) apiUpdates.description = updates.description;
      if (updates.date) apiUpdates.date = updates.date;
      if (updates.split_type) apiUpdates.splitType = updates.split_type;

      const { error } = await api.updateExpense(expenseId, apiUpdates as Parameters<typeof api.updateExpense>[1]);

      if (error) throw new Error(error);

      setExpenses(prev => prev.map(e => 
        e.id === expenseId ? { ...e, ...updates } : e
      ));
      toast.success('Expense updated');
      return true;
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense');
      return false;
    }
  }, []);

  const deleteExpense = useCallback(async (expenseId: string): Promise<boolean> => {
    try {
      const { error } = await api.deleteExpense(expenseId);

      if (error) throw new Error(error);

      setExpenses(prev => prev.filter(e => e.id !== expenseId));
      setExpenseSplits(prev => prev.filter(s => s.expense_id !== expenseId));
      toast.success('Expense deleted');
      return true;
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
      return false;
    }
  }, []);

  const createExpenseSplits = useCallback(async (splits: CreateExpenseSplitParams[]): Promise<boolean> => {
    try {
      // Splits are created as part of expense creation in Spring Boot
      // For now, we need to update the expense with splits
      if (splits.length === 0) return true;
      
      const expenseId = splits[0].expense_id;
      const { error } = await api.updateExpense(expenseId, {
        splits: splits.map(s => ({
          participantId: s.participant_id,
          amount: s.amount,
        })),
      } as Parameters<typeof api.updateExpense>[1]);

      if (error) throw new Error(error);

      // Update local state
      const newSplits: ExpenseSplit[] = splits.map((s, index) => ({
        id: `temp-${index}`,
        expense_id: s.expense_id,
        participant_id: s.participant_id,
        amount: s.amount,
        created_at: new Date().toISOString(),
      }));

      setExpenseSplits(prev => [
        ...prev.filter(s => s.expense_id !== expenseId),
        ...newSplits
      ]);
      
      toast.success('Expense split saved');
      return true;
    } catch (error) {
      console.error('Error creating expense splits:', error);
      toast.error('Failed to save expense split');
      return false;
    }
  }, []);

  const getSplitsForExpense = useCallback((expenseId: string) => {
    return expenseSplits.filter(s => s.expense_id === expenseId);
  }, [expenseSplits]);

  const getTotalExpenses = useCallback(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const getExpensesByCategory = useCallback(() => {
    return expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [expenses]);

  return {
    expenses,
    expenseSplits,
    isLoading,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    createExpenseSplits,
    getSplitsForExpense,
    getTotalExpenses,
    getExpensesByCategory,
  };
}
