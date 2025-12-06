-- =====================================================
-- TRAVEL APP PRODUCTION DATABASE MIGRATION
-- Complete backend infrastructure for trip management
-- =====================================================

-- ===================
-- DOCUMENTS TABLE
-- For centralized document management with OCR extraction
-- ===================
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Document metadata
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- pdf, image, etc.
  file_size INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  
  -- Document classification
  document_type TEXT NOT NULL CHECK (document_type IN ('flight', 'hotel', 'activity', 'restaurant', 'visa', 'insurance', 'other')),
  
  -- OCR extracted data (stored as JSONB for flexibility)
  extracted_data JSONB DEFAULT '{}',
  ocr_status TEXT DEFAULT 'pending' CHECK (ocr_status IN ('pending', 'processing', 'completed', 'failed')),
  ocr_confidence DECIMAL(5,2),
  
  -- Common extracted fields (denormalized for easy querying)
  booking_reference TEXT,
  provider_name TEXT,
  amount DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  event_date DATE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents
CREATE POLICY "Users can view documents in their trips"
ON public.documents
FOR SELECT
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM itineraries
    WHERE itineraries.id = documents.itinerary_id
    AND (
      itineraries.user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM trip_participants
        WHERE trip_participants.itinerary_id = itineraries.id
        AND trip_participants.user_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Trip owners can create documents"
ON public.documents
FOR INSERT
WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM itineraries
    WHERE itineraries.id = documents.itinerary_id
    AND (
      itineraries.user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM trip_participants
        WHERE trip_participants.itinerary_id = itineraries.id
        AND trip_participants.user_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Users can update their own documents"
ON public.documents
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own documents"
ON public.documents
FOR DELETE
USING (user_id = auth.uid());

-- ===================
-- SETTLEMENTS TABLE
-- For tracking expense settlements between trip mates
-- ===================
CREATE TABLE public.settlements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  from_participant_id UUID NOT NULL REFERENCES public.trip_participants(id) ON DELETE CASCADE,
  to_participant_id UUID NOT NULL REFERENCES public.trip_participants(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  settled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for settlements
CREATE POLICY "Users can view settlements in their trips"
ON public.settlements
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM itineraries
    WHERE itineraries.id = settlements.itinerary_id
    AND (
      itineraries.user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM trip_participants
        WHERE trip_participants.itinerary_id = itineraries.id
        AND trip_participants.user_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Trip participants can create settlements"
ON public.settlements
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM itineraries
    WHERE itineraries.id = settlements.itinerary_id
    AND (
      itineraries.user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM trip_participants
        WHERE trip_participants.itinerary_id = itineraries.id
        AND trip_participants.user_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Trip owners can delete settlements"
ON public.settlements
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM itineraries
    WHERE itineraries.id = settlements.itinerary_id
    AND itineraries.user_id = auth.uid()
  )
);

-- ===================
-- STORAGE BUCKET FOR DOCUMENTS
-- ===================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'trip-documents',
  'trip-documents',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
);

-- Storage RLS Policies
CREATE POLICY "Users can upload documents to their trips"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'trip-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own trip documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'trip-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own trip documents"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'trip-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own trip documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'trip-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- ===================
-- INDEXES FOR PERFORMANCE
-- ===================
CREATE INDEX idx_documents_itinerary ON public.documents(itinerary_id);
CREATE INDEX idx_documents_user ON public.documents(user_id);
CREATE INDEX idx_documents_type ON public.documents(document_type);
CREATE INDEX idx_documents_ocr_status ON public.documents(ocr_status);
CREATE INDEX idx_settlements_itinerary ON public.settlements(itinerary_id);
CREATE INDEX idx_expenses_itinerary ON public.expenses(itinerary_id);
CREATE INDEX idx_expense_splits_expense ON public.expense_splits(expense_id);
CREATE INDEX idx_trip_participants_itinerary ON public.trip_participants(itinerary_id);
CREATE INDEX idx_activities_day ON public.activities(itinerary_day_id);
CREATE INDEX idx_itinerary_days_itinerary ON public.itinerary_days(itinerary_id);

-- ===================
-- TRIGGER FOR UPDATED_AT
-- ===================
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ===================
-- FOREIGN KEY ADDITIONS (if not exists)
-- ===================
DO $$
BEGIN
  -- Add foreign key from expenses to trip_participants if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'expenses_paid_by_participant_id_fkey'
  ) THEN
    ALTER TABLE public.expenses
    ADD CONSTRAINT expenses_paid_by_participant_id_fkey
    FOREIGN KEY (paid_by_participant_id) REFERENCES public.trip_participants(id) ON DELETE CASCADE;
  END IF;
  
  -- Add foreign key from expense_splits to trip_participants if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'expense_splits_participant_id_fkey'
  ) THEN
    ALTER TABLE public.expense_splits
    ADD CONSTRAINT expense_splits_participant_id_fkey
    FOREIGN KEY (participant_id) REFERENCES public.trip_participants(id) ON DELETE CASCADE;
  END IF;
  
  -- Add foreign key from expense_splits to expenses if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'expense_splits_expense_id_fkey'
  ) THEN
    ALTER TABLE public.expense_splits
    ADD CONSTRAINT expense_splits_expense_id_fkey
    FOREIGN KEY (expense_id) REFERENCES public.expenses(id) ON DELETE CASCADE;
  END IF;
  
  -- Add foreign key from itinerary_days to itineraries if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'itinerary_days_itinerary_id_fkey'
  ) THEN
    ALTER TABLE public.itinerary_days
    ADD CONSTRAINT itinerary_days_itinerary_id_fkey
    FOREIGN KEY (itinerary_id) REFERENCES public.itineraries(id) ON DELETE CASCADE;
  END IF;
  
  -- Add foreign key from activities to itinerary_days if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'activities_itinerary_day_id_fkey'
  ) THEN
    ALTER TABLE public.activities
    ADD CONSTRAINT activities_itinerary_day_id_fkey
    FOREIGN KEY (itinerary_day_id) REFERENCES public.itinerary_days(id) ON DELETE CASCADE;
  END IF;
END $$;