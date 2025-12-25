import { useState, useCallback } from 'react';
import { api, Participant as ApiParticipant, Settlement as ApiSettlement } from '@/services/api';
import { toast } from 'sonner';

export interface TripParticipant {
  id: string;
  itinerary_id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  avatar_url: string | null;
  total_paid: number;
  total_owed: number;
  created_at: string;
}

export interface Settlement {
  id: string;
  itinerary_id: string;
  from_participant_id: string;
  to_participant_id: string;
  amount: number;
  currency: string;
  settled_at: string;
  notes: string | null;
  created_at: string;
}

export interface CreateParticipantParams {
  itinerary_id: string;
  name: string;
  email?: string;
  user_id?: string;
}

export interface CreateSettlementParams {
  itinerary_id: string;
  from_participant_id: string;
  to_participant_id: string;
  amount: number;
  currency?: string;
  notes?: string;
}

// Convert API response to legacy format
const fromApiParticipant = (p: ApiParticipant): TripParticipant => ({
  id: p.id,
  itinerary_id: p.itineraryId,
  user_id: p.userId,
  name: p.name,
  email: p.email,
  avatar_url: p.avatarUrl,
  total_paid: p.totalPaid,
  total_owed: p.totalOwed,
  created_at: p.createdAt,
});

const fromApiSettlement = (s: ApiSettlement): Settlement => ({
  id: s.id,
  itinerary_id: s.itineraryId,
  from_participant_id: s.fromParticipantId,
  to_participant_id: s.toParticipantId,
  amount: s.amount,
  currency: s.currency,
  settled_at: s.settledAt,
  notes: s.notes,
  created_at: s.createdAt,
});

export function useTripParticipants(itineraryId?: string) {
  const [participants, setParticipants] = useState<TripParticipant[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchParticipants = useCallback(async () => {
    if (!itineraryId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await api.getParticipants(itineraryId);

      if (error) throw new Error(error);
      
      setParticipants((data?.participants || []).map(fromApiParticipant));
      setSettlements((data?.settlements || []).map(fromApiSettlement));
    } catch (error) {
      console.error('Error fetching participants:', error);
      toast.error('Failed to load trip participants');
    } finally {
      setIsLoading(false);
    }
  }, [itineraryId]);

  const addParticipant = useCallback(async (params: CreateParticipantParams): Promise<TripParticipant | null> => {
    try {
      const { data, error } = await api.addParticipant({
        itineraryId: params.itinerary_id,
        name: params.name,
        email: params.email,
        userId: params.user_id,
      });

      if (error) throw new Error(error);
      if (!data) throw new Error('Failed to add participant');

      const legacyParticipant = fromApiParticipant(data);
      setParticipants(prev => [...prev, legacyParticipant]);
      toast.success(`${params.name} added to the trip`);
      return legacyParticipant;
    } catch (error) {
      console.error('Error adding participant:', error);
      toast.error('Failed to add participant');
      return null;
    }
  }, []);

  const removeParticipant = useCallback(async (participantId: string): Promise<boolean> => {
    try {
      const participant = participants.find(p => p.id === participantId);
      
      const { error } = await api.removeParticipant(participantId);

      if (error) throw new Error(error);

      setParticipants(prev => prev.filter(p => p.id !== participantId));
      toast.success(`${participant?.name || 'Participant'} removed from the trip`);
      return true;
    } catch (error) {
      console.error('Error removing participant:', error);
      toast.error('Failed to remove participant');
      return false;
    }
  }, [participants]);

  const updateParticipantBalances = useCallback(async (
    participantId: string, 
    totalPaid: number, 
    totalOwed: number
  ): Promise<boolean> => {
    try {
      const { error } = await api.updateParticipant(participantId, {
        totalPaid,
        totalOwed,
      } as Parameters<typeof api.updateParticipant>[1]);

      if (error) throw new Error(error);

      setParticipants(prev => prev.map(p => 
        p.id === participantId ? { ...p, total_paid: totalPaid, total_owed: totalOwed } : p
      ));
      return true;
    } catch (error) {
      console.error('Error updating balances:', error);
      return false;
    }
  }, []);

  const createSettlement = useCallback(async (params: CreateSettlementParams): Promise<Settlement | null> => {
    try {
      const { data, error } = await api.createSettlement({
        itineraryId: params.itinerary_id,
        fromParticipantId: params.from_participant_id,
        toParticipantId: params.to_participant_id,
        amount: params.amount,
        currency: params.currency || 'USD',
        notes: params.notes,
      });

      if (error) throw new Error(error);
      if (!data) throw new Error('Failed to create settlement');

      const legacySettlement = fromApiSettlement(data);
      setSettlements(prev => [legacySettlement, ...prev]);
      toast.success('Settlement recorded');
      return legacySettlement;
    } catch (error) {
      console.error('Error creating settlement:', error);
      toast.error('Failed to record settlement');
      return null;
    }
  }, []);

  const calculateBalances = useCallback(() => {
    // Calculate who owes whom
    const balances: Record<string, number> = {};
    
    participants.forEach(p => {
      balances[p.id] = p.total_paid - p.total_owed;
    });

    // Apply settlements
    settlements.forEach(s => {
      balances[s.from_participant_id] = (balances[s.from_participant_id] || 0) + s.amount;
      balances[s.to_participant_id] = (balances[s.to_participant_id] || 0) - s.amount;
    });

    return balances;
  }, [participants, settlements]);

  const getSimplifiedDebts = useCallback(() => {
    const balances = calculateBalances();
    const debts: { from: TripParticipant; to: TripParticipant; amount: number }[] = [];

    // Separate into creditors and debtors
    const creditors = participants.filter(p => balances[p.id] > 0.01);
    const debtors = participants.filter(p => balances[p.id] < -0.01);

    // Simplify debts
    let i = 0, j = 0;
    const creditorBalances = creditors.map(c => ({ ...c, balance: balances[c.id] }));
    const debtorBalances = debtors.map(d => ({ ...d, balance: -balances[d.id] }));

    while (i < creditorBalances.length && j < debtorBalances.length) {
      const amount = Math.min(creditorBalances[i].balance, debtorBalances[j].balance);
      
      if (amount > 0.01) {
        debts.push({
          from: debtors[j],
          to: creditors[i],
          amount: Math.round(amount * 100) / 100,
        });
      }

      creditorBalances[i].balance -= amount;
      debtorBalances[j].balance -= amount;

      if (creditorBalances[i].balance < 0.01) i++;
      if (debtorBalances[j].balance < 0.01) j++;
    }

    return debts;
  }, [participants, calculateBalances]);

  return {
    participants,
    settlements,
    isLoading,
    fetchParticipants,
    addParticipant,
    removeParticipant,
    updateParticipantBalances,
    createSettlement,
    calculateBalances,
    getSimplifiedDebts,
  };
}
