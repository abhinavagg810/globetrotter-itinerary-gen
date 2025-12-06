-- Fix the infinite recursion in trip_participants RLS policy
-- Drop the problematic policies first
DROP POLICY IF EXISTS "Users can view participants in their trips" ON public.trip_participants;
DROP POLICY IF EXISTS "Trip owners can manage participants" ON public.trip_participants;

-- Recreate with non-recursive logic
-- Policy for trip owners to manage all participants (INSERT, UPDATE, DELETE, SELECT)
CREATE POLICY "Trip owners can manage participants" 
ON public.trip_participants 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM itineraries 
    WHERE itineraries.id = trip_participants.itinerary_id 
    AND itineraries.user_id = auth.uid()
  )
);

-- Policy for participants to view other participants in the same trip
-- Uses a direct join to itineraries to avoid recursion
CREATE POLICY "Participants can view trip participants" 
ON public.trip_participants 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM itineraries 
    WHERE itineraries.id = trip_participants.itinerary_id 
    AND (
      itineraries.user_id = auth.uid() 
      OR trip_participants.user_id = auth.uid()
    )
  )
);