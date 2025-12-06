# Travel App API Documentation

## Overview

This document describes the API endpoints and database schema for the Travel App backend powered by Lovable Cloud (Supabase).

## Authentication

All API requests require authentication via Supabase Auth. Include the JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

## Database Schema

### Tables

#### `profiles`
User profile information, automatically created on signup.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key, references auth.users |
| email | text | User's email address |
| full_name | text | User's full name |
| avatar_url | text | URL to user's avatar image |
| created_at | timestamptz | Record creation timestamp |
| updated_at | timestamptz | Last update timestamp |

#### `itineraries`
Trip/itinerary records.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Owner's user ID |
| name | text | Trip name |
| destinations | text[] | Array of destination names |
| start_date | date | Trip start date |
| end_date | date | Trip end date |
| status | text | Trip status (planning, active, completed) |
| travel_type | text | Type of travel |
| image_url | text | Cover image URL |
| created_at | timestamptz | Record creation timestamp |
| updated_at | timestamptz | Last update timestamp |

#### `itinerary_days`
Individual days within an itinerary.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| itinerary_id | uuid | Foreign key to itineraries |
| day_number | integer | Day number in sequence |
| date | date | Actual date |
| location | text | Location for this day |
| notes | text | Day notes |
| created_at | timestamptz | Record creation timestamp |

#### `activities`
Activities/events within a day.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| itinerary_day_id | uuid | Foreign key to itinerary_days |
| title | text | Activity title |
| description | text | Activity description |
| start_time | time | Start time |
| end_time | time | End time |
| location | text | Activity location |
| category | text | Activity category |
| cost | decimal | Cost in base currency |
| booking_status | text | Booking status |
| created_at | timestamptz | Record creation timestamp |

#### `trip_participants`
People participating in a trip.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| itinerary_id | uuid | Foreign key to itineraries |
| user_id | uuid | Linked user ID (optional) |
| name | text | Participant name |
| email | text | Participant email (optional) |
| avatar_url | text | Avatar URL |
| total_paid | decimal | Total amount paid |
| total_owed | decimal | Total amount owed |
| created_at | timestamptz | Record creation timestamp |

#### `expenses`
Expense records for a trip.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| itinerary_id | uuid | Foreign key to itineraries |
| paid_by_participant_id | uuid | Who paid |
| amount | decimal | Expense amount |
| currency | text | Currency code |
| category | text | Expense category |
| description | text | Expense description |
| date | date | Expense date |
| split_type | text | How to split (equal, custom, percentage) |
| receipt_url | text | Receipt document URL |
| created_at | timestamptz | Record creation timestamp |

#### `expense_splits`
How expenses are split among participants.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| expense_id | uuid | Foreign key to expenses |
| participant_id | uuid | Foreign key to trip_participants |
| amount | decimal | Split amount |
| created_at | timestamptz | Record creation timestamp |

#### `settlements`
Settlement records between participants.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| itinerary_id | uuid | Foreign key to itineraries |
| from_participant_id | uuid | Who is paying |
| to_participant_id | uuid | Who is receiving |
| amount | decimal | Settlement amount |
| currency | text | Currency code |
| settled_at | timestamptz | When settled |
| notes | text | Settlement notes |
| created_at | timestamptz | Record creation timestamp |

#### `documents`
Uploaded documents with OCR extraction.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| itinerary_id | uuid | Foreign key to itineraries |
| user_id | uuid | Uploader's user ID |
| file_name | text | Original file name |
| file_type | text | MIME type |
| file_size | integer | File size in bytes |
| file_url | text | Storage URL |
| document_type | text | Type (flight, hotel, etc.) |
| extracted_data | jsonb | OCR extracted data |
| ocr_status | text | Processing status |
| ocr_confidence | decimal | OCR confidence score |
| booking_reference | text | Extracted booking reference |
| provider_name | text | Extracted provider name |
| amount | decimal | Extracted amount |
| currency | text | Extracted currency |
| event_date | date | Extracted event date |
| created_at | timestamptz | Record creation timestamp |
| updated_at | timestamptz | Last update timestamp |

## Edge Functions

### `generate-itinerary`

Generates an AI-powered travel itinerary.

**Endpoint:** `POST /functions/v1/generate-itinerary`

**Authentication:** Required

**Request Body:**
```json
{
  "fromLocation": "New Delhi",
  "destinations": ["Tokyo", "Kyoto"],
  "fromDate": "2025-02-01",
  "toDate": "2025-02-07",
  "travelingWith": "Partner",
  "travelVibes": ["Cultural", "Foodie"],
  "budget": "moderate"
}
```

**Response:**
```json
{
  "tripName": "Japanese Cultural Journey",
  "destination": "Japan",
  "summary": "...",
  "estimatedBudget": {
    "total": 3500,
    "breakdown": {...},
    "currency": "USD"
  },
  "days": [...]
}
```

### `process-document-ocr`

Processes uploaded documents using AI-powered OCR.

**Endpoint:** `POST /functions/v1/process-document-ocr`

**Authentication:** Required

**Request Body:**
```json
{
  "documentId": "uuid",
  "fileUrl": "https://...",
  "documentType": "flight",
  "fileBase64": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "success": true,
  "documentId": "uuid",
  "extractedData": {
    "booking_reference": "ABC123",
    "provider_name": "Air India",
    "amount": 450.00,
    "currency": "USD",
    "confidence": 92
  },
  "confidence": 92
}
```

## Storage Buckets

### `trip-documents`

Private bucket for storing trip documents.

- **Max file size:** 10MB
- **Allowed types:** PDF, JPEG, PNG, WebP
- **Access:** Users can only access their own documents

**File path structure:** `{user_id}/{itinerary_id}/{timestamp}.{ext}`

## Row Level Security (RLS)

All tables have RLS enabled with the following access patterns:

- **Profiles:** Users can only access their own profile
- **Itineraries:** Owners and participants can view; only owners can modify
- **Documents:** Users can access documents in trips they participate in
- **Expenses/Splits:** Participants can view; trip owners can manage
- **Settlements:** Participants can view and create

## Rate Limits

- **AI endpoints:** Subject to Lovable AI rate limits
- **Storage uploads:** 10MB per file, 100 files per minute
- **Database queries:** Standard Supabase limits apply

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## SDKs and Client Libraries

### JavaScript/TypeScript

```typescript
import { supabase } from '@/integrations/supabase/client';

// Fetch itineraries
const { data, error } = await supabase
  .from('itineraries')
  .select('*')
  .order('created_at', { ascending: false });

// Call edge function
const { data, error } = await supabase.functions.invoke('generate-itinerary', {
  body: { fromLocation: 'Delhi', destinations: ['Tokyo'] }
});
```

## Webhooks

Currently not implemented. Future versions may support webhooks for:
- Trip status changes
- New expense notifications
- Settlement confirmations
