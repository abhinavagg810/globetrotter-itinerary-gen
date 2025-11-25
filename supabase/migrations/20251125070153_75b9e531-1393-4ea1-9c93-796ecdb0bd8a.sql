-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create itineraries table
CREATE TABLE public.itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  destinations TEXT[] NOT NULL DEFAULT '{}',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
  travel_type TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

-- Create trip_participants table
CREATE TABLE public.trip_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID REFERENCES public.itineraries(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  total_paid DECIMAL(10,2) DEFAULT 0 NOT NULL,
  total_owed DECIMAL(10,2) DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.trip_participants ENABLE ROW LEVEL SECURITY;

-- Create itinerary_days table
CREATE TABLE public.itinerary_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID REFERENCES public.itineraries(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  date DATE NOT NULL,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.itinerary_days ENABLE ROW LEVEL SECURITY;

-- Create activities table
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_day_id UUID REFERENCES public.itinerary_days(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIME,
  end_time TIME,
  location TEXT,
  category TEXT,
  cost DECIMAL(10,2),
  booking_status TEXT CHECK (booking_status IN ('not_booked', 'pending', 'confirmed')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID REFERENCES public.itineraries(id) ON DELETE CASCADE NOT NULL,
  paid_by_participant_id UUID REFERENCES public.trip_participants(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR' NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  receipt_url TEXT,
  split_type TEXT DEFAULT 'equal' CHECK (split_type IN ('equal', 'custom', 'percentage')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create expense_splits table
CREATE TABLE public.expense_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID REFERENCES public.expenses(id) ON DELETE CASCADE NOT NULL,
  participant_id UUID REFERENCES public.trip_participants(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.expense_splits ENABLE ROW LEVEL SECURITY;

-- Now add RLS policies for itineraries (with participant checks)
CREATE POLICY "Users can view itineraries they own or participate in"
  ON public.itineraries FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.trip_participants
      WHERE trip_participants.itinerary_id = itineraries.id
      AND trip_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own itineraries"
  ON public.itineraries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own itineraries"
  ON public.itineraries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own itineraries"
  ON public.itineraries FOR DELETE
  USING (auth.uid() = user_id);

-- Trip participants policies
CREATE POLICY "Users can view participants in their trips"
  ON public.trip_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE itineraries.id = trip_participants.itinerary_id
      AND (itineraries.user_id = auth.uid() OR
           EXISTS (SELECT 1 FROM public.trip_participants tp
                   WHERE tp.itinerary_id = itineraries.id
                   AND tp.user_id = auth.uid()))
    )
  );

CREATE POLICY "Trip owners can manage participants"
  ON public.trip_participants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE itineraries.id = trip_participants.itinerary_id
      AND itineraries.user_id = auth.uid()
    )
  );

-- Itinerary days policies
CREATE POLICY "Users can view days in their trips"
  ON public.itinerary_days FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE itineraries.id = itinerary_days.itinerary_id
      AND (itineraries.user_id = auth.uid() OR
           EXISTS (SELECT 1 FROM public.trip_participants
                   WHERE trip_participants.itinerary_id = itineraries.id
                   AND trip_participants.user_id = auth.uid()))
    )
  );

CREATE POLICY "Trip owners can manage days"
  ON public.itinerary_days FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE itineraries.id = itinerary_days.itinerary_id
      AND itineraries.user_id = auth.uid()
    )
  );

-- Activities policies
CREATE POLICY "Users can view activities in their trips"
  ON public.activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.itinerary_days
      JOIN public.itineraries ON itineraries.id = itinerary_days.itinerary_id
      WHERE itinerary_days.id = activities.itinerary_day_id
      AND (itineraries.user_id = auth.uid() OR
           EXISTS (SELECT 1 FROM public.trip_participants
                   WHERE trip_participants.itinerary_id = itineraries.id
                   AND trip_participants.user_id = auth.uid()))
    )
  );

CREATE POLICY "Trip owners can manage activities"
  ON public.activities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.itinerary_days
      JOIN public.itineraries ON itineraries.id = itinerary_days.itinerary_id
      WHERE itinerary_days.id = activities.itinerary_day_id
      AND itineraries.user_id = auth.uid()
    )
  );

-- Expenses policies
CREATE POLICY "Users can view expenses in their trips"
  ON public.expenses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE itineraries.id = expenses.itinerary_id
      AND (itineraries.user_id = auth.uid() OR
           EXISTS (SELECT 1 FROM public.trip_participants
                   WHERE trip_participants.itinerary_id = itineraries.id
                   AND trip_participants.user_id = auth.uid()))
    )
  );

CREATE POLICY "Trip participants can create expenses"
  ON public.expenses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE itineraries.id = expenses.itinerary_id
      AND (itineraries.user_id = auth.uid() OR
           EXISTS (SELECT 1 FROM public.trip_participants
                   WHERE trip_participants.itinerary_id = itineraries.id
                   AND trip_participants.user_id = auth.uid()))
    )
  );

CREATE POLICY "Trip owners can manage expenses"
  ON public.expenses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE itineraries.id = expenses.itinerary_id
      AND itineraries.user_id = auth.uid()
    )
  );

CREATE POLICY "Trip owners can delete expenses"
  ON public.expenses FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE itineraries.id = expenses.itinerary_id
      AND itineraries.user_id = auth.uid()
    )
  );

-- Expense splits policies
CREATE POLICY "Users can view expense splits in their trips"
  ON public.expense_splits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.expenses
      JOIN public.itineraries ON itineraries.id = expenses.itinerary_id
      WHERE expenses.id = expense_splits.expense_id
      AND (itineraries.user_id = auth.uid() OR
           EXISTS (SELECT 1 FROM public.trip_participants
                   WHERE trip_participants.itinerary_id = itineraries.id
                   AND trip_participants.user_id = auth.uid()))
    )
  );

CREATE POLICY "Trip owners can manage expense splits"
  ON public.expense_splits FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.expenses
      JOIN public.itineraries ON itineraries.id = expenses.itinerary_id
      WHERE expenses.id = expense_splits.expense_id
      AND itineraries.user_id = auth.uid()
    )
  );

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.itineraries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();