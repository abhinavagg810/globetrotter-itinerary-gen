import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

export function useExpenses(itineraryId?: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseSplits, setExpenseSplits] = useState<ExpenseSplit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchExpenses = useCallback(async () => {
    if (!itineraryId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('itinerary_id', itineraryId)
        .order('date', { ascending: false });

      if (error) throw error;
      setExpenses(data as Expense[]);

      // Fetch all expense splits for these expenses
      if (data && data.length > 0) {
        const expenseIds = data.map(e => e.id);
        const { data: splits, error: splitsError } = await supabase
          .from('expense_splits')
          .select('*')
          .in('expense_id', expenseIds);

        if (splitsError) throw splitsError;
        setExpenseSplits(splits as ExpenseSplit[]);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  }, [itineraryId]);

  const createExpense = useCallback(async (params: CreateExpenseParams): Promise<Expense | null> => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          itinerary_id: params.itinerary_id,
          paid_by_participant_id: params.paid_by_participant_id,
          amount: params.amount,
          currency: params.currency,
          category: params.category,
          description: params.description,
          date: params.date,
          split_type: params.split_type || 'equal',
        })
        .select()
        .single();

      if (error) throw error;

      setExpenses(prev => [data as Expense, ...prev]);
      toast.success('Expense added');
      return data as Expense;
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Failed to add expense');
      return null;
    }
  }, []);

  const updateExpense = useCallback(async (expenseId: string, updates: Partial<CreateExpenseParams>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', expenseId);

      if (error) throw error;

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
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;

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
      // Delete existing splits for this expense
      if (splits.length > 0) {
        await supabase
          .from('expense_splits')
          .delete()
          .eq('expense_id', splits[0].expense_id);
      }

      const { data, error } = await supabase
        .from('expense_splits')
        .insert(splits)
        .select();

      if (error) throw error;

      // Update local state
      const expenseId = splits[0]?.expense_id;
      setExpenseSplits(prev => [
        ...prev.filter(s => s.expense_id !== expenseId),
        ...(data as ExpenseSplit[])
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
