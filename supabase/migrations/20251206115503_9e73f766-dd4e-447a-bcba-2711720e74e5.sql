-- Create a security definer function to check if user is a trip participant
-- This avoids RLS recursion by bypassing RLS when checking
CREATE OR REPLACE FUNCTION public.is_trip_participant(_user_id uuid, _itinerary_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.trip_participants
    WHERE user_id = _user_id
      AND itinerary_id = _itinerary_id
  )
$$;

-- Create a function to check if user owns the itinerary
CREATE OR REPLACE FUNCTION public.is_itinerary_owner(_user_id uuid, _itinerary_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.itineraries
    WHERE id = _itinerary_id
      AND user_id = _user_id
  )
$$;

-- Drop existing problematic policies on itineraries
DROP POLICY IF EXISTS "Users can view itineraries they own or participate in" ON public.itineraries;
DROP POLICY IF EXISTS "Users can create their own itineraries" ON public.itineraries;
DROP POLICY IF EXISTS "Users can update their own itineraries" ON public.itineraries;
DROP POLICY IF EXISTS "Users can delete their own itineraries" ON public.itineraries;

-- Recreate itineraries policies using the security definer function
CREATE POLICY "Users can view itineraries they own or participate in" 
ON public.itineraries 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR public.is_trip_participant(auth.uid(), id)
);

CREATE POLICY "Users can create their own itineraries" 
ON public.itineraries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own itineraries" 
ON public.itineraries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own itineraries" 
ON public.itineraries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Fix trip_participants policies to use the security definer function
DROP POLICY IF EXISTS "Trip owners can manage participants" ON public.trip_participants;
DROP POLICY IF EXISTS "Participants can view trip participants" ON public.trip_participants;

CREATE POLICY "Trip owners can manage participants" 
ON public.trip_participants 
FOR ALL 
USING (public.is_itinerary_owner(auth.uid(), itinerary_id));

CREATE POLICY "Users can view participants in their trips" 
ON public.trip_participants 
FOR SELECT 
USING (
  public.is_itinerary_owner(auth.uid(), itinerary_id) 
  OR user_id = auth.uid()
);