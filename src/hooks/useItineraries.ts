import { useState, useCallback } from 'react';
import { api, Itinerary, ItineraryDay, Activity, CreateItineraryRequest, CreateActivityRequest } from '@/services/api';
import { toast } from 'sonner';

// Re-export types for backwards compatibility
export type { Itinerary, Activity } from '@/services/api';

export interface CreateDayParams {
  itinerary_id: string;
  day_number: number;
  date: string;
  location?: string;
  notes?: string;
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

// Convert snake_case to camelCase for API
const toApiItinerary = (params: CreateItineraryParams): CreateItineraryRequest => ({
  name: params.name,
  destinations: params.destinations,
  startDate: params.start_date,
  endDate: params.end_date,
  status: params.status,
  travelType: params.travel_type,
  imageUrl: params.image_url,
});

const toApiActivity = (params: CreateActivityParams): CreateActivityRequest => ({
  itineraryDayId: params.itinerary_day_id,
  title: params.title,
  description: params.description,
  startTime: params.start_time,
  endTime: params.end_time,
  location: params.location,
  category: params.category,
  cost: params.cost,
  bookingStatus: params.booking_status,
});

// Convert camelCase from API to snake_case for frontend compatibility
const fromApiItinerary = (itinerary: Itinerary) => ({
  id: itinerary.id,
  user_id: itinerary.userId,
  name: itinerary.name,
  destinations: itinerary.destinations,
  start_date: itinerary.startDate,
  end_date: itinerary.endDate,
  status: itinerary.status,
  travel_type: itinerary.travelType,
  image_url: itinerary.imageUrl,
  created_at: itinerary.createdAt,
  updated_at: itinerary.updatedAt,
});

const fromApiDay = (day: ItineraryDay) => ({
  id: day.id,
  itinerary_id: day.itineraryId,
  day_number: day.dayNumber,
  date: day.date,
  location: day.location,
  notes: day.notes,
  created_at: day.createdAt,
});

const fromApiActivity = (activity: Activity) => ({
  id: activity.id,
  itinerary_day_id: activity.itineraryDayId,
  title: activity.title,
  description: activity.description,
  start_time: activity.startTime,
  end_time: activity.endTime,
  location: activity.location,
  category: activity.category,
  cost: activity.cost,
  booking_status: activity.bookingStatus,
  created_at: activity.createdAt,
});

export interface LegacyItinerary {
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

export interface LegacyItineraryDay {
  id: string;
  itinerary_id: string;
  day_number: number;
  date: string;
  location: string | null;
  notes: string | null;
  created_at: string;
}

export interface LegacyActivity {
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

export function useItineraries() {
  const [itineraries, setItineraries] = useState<LegacyItinerary[]>([]);
  const [currentItinerary, setCurrentItinerary] = useState<LegacyItinerary | null>(null);
  const [days, setDays] = useState<LegacyItineraryDay[]>([]);
  const [activities, setActivities] = useState<LegacyActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchItineraries = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await api.getItineraries();

      if (error) throw new Error(error);
      setItineraries((data || []).map(fromApiItinerary));
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
      const { data, error } = await api.getItinerary(itineraryId);

      if (error) throw new Error(error);
      if (!data) throw new Error('Itinerary not found');
      
      const legacyItinerary = fromApiItinerary(data.itinerary);
      setCurrentItinerary(legacyItinerary);

      const legacyDays = data.days.map(fromApiDay);
      setDays(legacyDays);

      const allActivities: LegacyActivity[] = [];
      data.days.forEach(day => {
        day.activities.forEach(activity => {
          allActivities.push(fromApiActivity(activity));
        });
      });
      setActivities(allActivities);

      return legacyItinerary;
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      toast.error('Failed to load itinerary');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createItinerary = useCallback(async (params: CreateItineraryParams): Promise<LegacyItinerary | null> => {
    try {
      const { data, error } = await api.createItinerary(toApiItinerary(params));

      if (error) throw new Error(error);
      if (!data) throw new Error('Failed to create itinerary');

      const legacyItinerary = fromApiItinerary(data);
      setItineraries(prev => [legacyItinerary, ...prev]);
      toast.success('Trip created successfully');
      return legacyItinerary;
    } catch (error) {
      console.error('Error creating itinerary:', error);
      toast.error('Failed to create trip');
      return null;
    }
  }, []);

  const updateItinerary = useCallback(async (itineraryId: string, updates: Partial<CreateItineraryParams>): Promise<boolean> => {
    try {
      const apiUpdates: Partial<CreateItineraryRequest> = {};
      if (updates.name) apiUpdates.name = updates.name;
      if (updates.destinations) apiUpdates.destinations = updates.destinations;
      if (updates.start_date) apiUpdates.startDate = updates.start_date;
      if (updates.end_date) apiUpdates.endDate = updates.end_date;
      if (updates.status) apiUpdates.status = updates.status;
      if (updates.travel_type) apiUpdates.travelType = updates.travel_type;
      if (updates.image_url) apiUpdates.imageUrl = updates.image_url;

      const { error } = await api.updateItinerary(itineraryId, apiUpdates);

      if (error) throw new Error(error);

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
      const { error } = await api.deleteItinerary(itineraryId);

      if (error) throw new Error(error);

      setItineraries(prev => prev.filter(i => i.id !== itineraryId));
      toast.success('Trip deleted');
      return true;
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      toast.error('Failed to delete trip');
      return false;
    }
  }, []);

  const createDay = useCallback(async (_params: CreateDayParams): Promise<LegacyItineraryDay | null> => {
    // Days are typically created as part of itinerary generation
    // This would need a dedicated endpoint in Spring Boot
    toast.error('Day creation not yet implemented');
    return null;
  }, []);

  const createActivity = useCallback(async (params: CreateActivityParams): Promise<LegacyActivity | null> => {
    try {
      const { data, error } = await api.createActivity(toApiActivity(params));

      if (error) throw new Error(error);
      if (!data) throw new Error('Failed to create activity');

      const legacyActivity = fromApiActivity(data);
      setActivities(prev => [...prev, legacyActivity]);
      toast.success('Activity added');
      return legacyActivity;
    } catch (error) {
      console.error('Error creating activity:', error);
      toast.error('Failed to add activity');
      return null;
    }
  }, []);

  const updateActivity = useCallback(async (activityId: string, updates: Partial<CreateActivityParams>): Promise<boolean> => {
    try {
      const apiUpdates: Partial<CreateActivityRequest> = {};
      if (updates.title) apiUpdates.title = updates.title;
      if (updates.description) apiUpdates.description = updates.description;
      if (updates.start_time) apiUpdates.startTime = updates.start_time;
      if (updates.end_time) apiUpdates.endTime = updates.end_time;
      if (updates.location) apiUpdates.location = updates.location;
      if (updates.category) apiUpdates.category = updates.category;
      if (updates.cost !== undefined) apiUpdates.cost = updates.cost;
      if (updates.booking_status) apiUpdates.bookingStatus = updates.booking_status;

      const { error } = await api.updateActivity(activityId, apiUpdates);

      if (error) throw new Error(error);

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
      const { error } = await api.deleteActivity(activityId);

      if (error) throw new Error(error);

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
