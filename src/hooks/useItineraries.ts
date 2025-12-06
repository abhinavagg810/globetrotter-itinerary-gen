import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Itinerary {
  id: string;
  user_id: string;
  name: string;
  destinations: string[];
  start_date: string;
  end_date: string;
  status: string;
  travel_type: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ItineraryDay {
  id: string;
  itinerary_id: string;
  day_number: number;
  date: string;
  location: string | null;
  notes: string | null;
  created_at: string;
}

export interface Activity {
  id: string;
  itinerary_day_id: string;
  title: string;
  description: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  category: string | null;
  cost: number | null;
  booking_status: string | null;
  created_at: string;
}

export interface CreateItineraryParams {
  name: string;
  destinations: string[];
  start_date: string;
  end_date: string;
  status?: string;
  travel_type?: string;
  image_url?: string;
}

export interface CreateDayParams {
  itinerary_id: string;
  day_number: number;
  date: string;
  location?: string;
  notes?: string;
}

export interface CreateActivityParams {
  itinerary_day_id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  category?: string;
  cost?: number;
  booking_status?: string;
}

export function useItineraries() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(null);
  const [days, setDays] = useState<ItineraryDay[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchItineraries = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItineraries(data as Itinerary[]);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
      toast.error('Failed to load itineraries');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchItinerary = useCallback(async (itineraryId: string) => {
    setIsLoading(true);
    try {
      // Fetch itinerary
      const { data: itinerary, error: itineraryError } = await supabase
        .from('itineraries')
        .select('*')
        .eq('id', itineraryId)
        .single();

      if (itineraryError) throw itineraryError;
      setCurrentItinerary(itinerary as Itinerary);

      // Fetch days
      const { data: daysData, error: daysError } = await supabase
        .from('itinerary_days')
        .select('*')
        .eq('itinerary_id', itineraryId)
        .order('day_number', { ascending: true });

      if (daysError) throw daysError;
      setDays(daysData as ItineraryDay[]);

      // Fetch activities for all days
      if (daysData && daysData.length > 0) {
        const dayIds = daysData.map(d => d.id);
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activities')
          .select('*')
          .in('itinerary_day_id', dayIds)
          .order('start_time', { ascending: true });

        if (activitiesError) throw activitiesError;
        setActivities(activitiesData as Activity[]);
      }

      return itinerary as Itinerary;
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      toast.error('Failed to load itinerary');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createItinerary = useCallback(async (params: CreateItineraryParams): Promise<Itinerary | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('itineraries')
        .insert({
          user_id: user.id,
          name: params.name,
          destinations: params.destinations,
          start_date: params.start_date,
          end_date: params.end_date,
          status: params.status || 'planning',
          travel_type: params.travel_type,
          image_url: params.image_url,
        })
        .select()
        .single();

      if (error) throw error;

      setItineraries(prev => [data as Itinerary, ...prev]);
      toast.success('Trip created successfully');
      return data as Itinerary;
    } catch (error) {
      console.error('Error creating itinerary:', error);
      toast.error('Failed to create trip');
      return null;
    }
  }, []);

  const updateItinerary = useCallback(async (itineraryId: string, updates: Partial<CreateItineraryParams>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('itineraries')
        .update(updates)
        .eq('id', itineraryId);

      if (error) throw error;

      setItineraries(prev => prev.map(i => 
        i.id === itineraryId ? { ...i, ...updates } : i
      ));
      
      if (currentItinerary?.id === itineraryId) {
        setCurrentItinerary(prev => prev ? { ...prev, ...updates } : null);
      }
      
      toast.success('Trip updated');
      return true;
    } catch (error) {
      console.error('Error updating itinerary:', error);
      toast.error('Failed to update trip');
      return false;
    }
  }, [currentItinerary?.id]);

  const deleteItinerary = useCallback(async (itineraryId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('itineraries')
        .delete()
        .eq('id', itineraryId);

      if (error) throw error;

      setItineraries(prev => prev.filter(i => i.id !== itineraryId));
      toast.success('Trip deleted');
      return true;
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      toast.error('Failed to delete trip');
      return false;
    }
  }, []);

  const createDay = useCallback(async (params: CreateDayParams): Promise<ItineraryDay | null> => {
    try {
      const { data, error } = await supabase
        .from('itinerary_days')
        .insert(params)
        .select()
        .single();

      if (error) throw error;

      setDays(prev => [...prev, data as ItineraryDay].sort((a, b) => a.day_number - b.day_number));
      return data as ItineraryDay;
    } catch (error) {
      console.error('Error creating day:', error);
      toast.error('Failed to add day');
      return null;
    }
  }, []);

  const createActivity = useCallback(async (params: CreateActivityParams): Promise<Activity | null> => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert(params)
        .select()
        .single();

      if (error) throw error;

      setActivities(prev => [...prev, data as Activity]);
      toast.success('Activity added');
      return data as Activity;
    } catch (error) {
      console.error('Error creating activity:', error);
      toast.error('Failed to add activity');
      return null;
    }
  }, []);

  const updateActivity = useCallback(async (activityId: string, updates: Partial<CreateActivityParams>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('activities')
        .update(updates)
        .eq('id', activityId);

      if (error) throw error;

      setActivities(prev => prev.map(a => 
        a.id === activityId ? { ...a, ...updates } : a
      ));
      return true;
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error('Failed to update activity');
      return false;
    }
  }, []);

  const deleteActivity = useCallback(async (activityId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId);

      if (error) throw error;

      setActivities(prev => prev.filter(a => a.id !== activityId));
      toast.success('Activity deleted');
      return true;
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
      return false;
    }
  }, []);

  const getActivitiesForDay = useCallback((dayId: string) => {
    return activities.filter(a => a.itinerary_day_id === dayId);
  }, [activities]);

  return {
    itineraries,
    currentItinerary,
    days,
    activities,
    isLoading,
    fetchItineraries,
    fetchItinerary,
    createItinerary,
    updateItinerary,
    deleteItinerary,
    createDay,
    createActivity,
    updateActivity,
    deleteActivity,
    getActivitiesForDay,
  };
}
