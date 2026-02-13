

# Travel Globe AI - Complete Product Requirements Document (PRD)

## 1. Product Overview

**Product Name:** Travel Globe AI
**Version:** 1.0
**Type:** AI-Powered Travel Planning and Management Platform
**Platforms:** Web (React), Mobile-ready (Capacitor for iOS/Android)

Travel Globe AI is a comprehensive travel planning application that uses artificial intelligence to generate personalized trip itineraries, manage travel documents, track expenses, and facilitate group trip coordination -- all from a single interface.

---

## 2. User Journey: End-to-End Flow

### 2.1 Landing Page

The first screen users see features:
- A rotating hero image carousel (beach, mountain, city destinations) with an auto-advance timer every 5 seconds
- Value propositions highlighted: AI-Powered Planning, Collaborative Trips, Smart Expense Splitting, Document Organization
- A "How It Works" section showing the 4-step process:
  1. Share Your Preferences
  2. AI Creates Your Plan
  3. Customize and Book
  4. Travel and Track
- Stats banner: 50K+ Trips Planned, 120+ Countries, 4.9 User Rating
- A primary call-to-action button: "Plan Your Trip Now"

### 2.2 Authentication

When users click the CTA, they are presented with an authentication screen:
- **Sign Up:** Email, password, full name fields with form validation
- **Sign In:** Email and password
- **Google Sign-In:** One-click OAuth integration
- Background uses a luxury beach hero image
- After successful auth, users land on the Dashboard

### 2.3 Dashboard

The dashboard is the central hub showing:
- User greeting and profile access
- Currency selector (INR, USD, EUR) that persists across the app
- "Create New Trip" button leading to the itinerary creation flow
- "My Itineraries" section listing all saved trips with destination, dates, and status
- API health check indicator for backend connectivity

---

## 3. Core Feature: AI-Powered Itinerary Creation

### 3.1 Two Planning Modes

Users begin by choosing one of two paths:

**Mode A: "I Know Where"** -- The user already has a destination in mind.

Steps (5-step wizard with progress bar):
1. **Destination** -- Enter departure city and one or more destinations (with autocomplete place suggestions). Users can add multiple destinations.
2. **Dates** -- Select travel start and end dates using a calendar picker. The app calculates trip duration automatically.
3. **Travel Party** -- Select who is traveling: Solo Adventure, Couple's Getaway, Family Trip, or Friends Trip.
4. **Trip Style** -- Multi-select from 10 travel vibes: Beach, Mountains, Relaxing, Adventure, Cultural, Romantic, Foodie, Nightlife, Shopping, Offbeat.
5. **Budget** -- Choose one: Budget Friendly ($500-$1,500), Comfortable ($1,500-$3,000), Luxury ($3,000-$6,000), Ultra Premium ($6,000+).

**Mode B: "Surprise Me"** -- The AI recommends destinations.

Steps (7-step wizard):
1. **Departure City** -- Where are you starting from?
2. **Travel Type** -- Domestic or International?
3. **Dates** -- Select dates OR mark "I'm flexible" to enter a preferred trip duration (slider: 1-30 days).
4. **Duration** (only if flexible) -- How many days?
5. **Travel Party** -- Same as Mode A.
6. **Trip Style** -- Same as Mode A.
7. **Budget** -- Same as Mode A.

### 3.2 AI Generation Process

When the user completes the wizard and clicks "Generate Itinerary":
- A loading screen appears with the message: "Generating your perfect plan... Our AI is crafting a personalized itinerary based on your preferences"
- The system sends all form inputs to the AI backend (via Edge Function or Spring Boot API)
- The AI model generates a comprehensive JSON response including: trip name, summary, budget breakdown, important info, weather data, visa requirements, day-by-day activities, and recommendations

### 3.3 AI Response Data Structure

The AI returns a rich data object containing:

- **Trip Name and Summary:** A catchy trip title and brief description
- **Estimated Budget:** Total cost with breakdown into Flights, Accommodation, Activities, Food, Transportation, Miscellaneous, and per-person cost
- **Important Info:** Local currency with exchange rate, timezone with offset from user's location, local language, emergency numbers (police, ambulance, tourist helpline), best time to visit, visa requirements, and travel tips
- **Weather:** Temperature range (min/max), weather condition, humidity, and packing tips
- **Day-by-Day Itinerary:** Each day includes a day number, date, theme, location, and a list of activities (each with time, end time, title, description, type, price, location, booking status, tips, rating, duration, dress code)
- **Recommendations:** Must-try experiences, hidden gems, things to avoid, local customs, and photo spots
- **Practical Info:** Transportation advice, SIM card info, safety tips, and tipping customs

---

## 4. Generated Itinerary View (3-Tab Interface)

After generation, the itinerary is displayed with a trip summary card at the top showing: trip duration, destination name, and travel dates. Below it, a 3-tab interface:

### Tab 1: Overview

Contains collapsible sections, each expandable/collapsible independently:

1. **Trip Summary Card** -- AI-generated trip name and description with a sparkle icon
2. **Estimated Budget** -- Total budget with visual breakdown grid showing Flights, Accommodation, Activities, Food, Transportation, and Miscellaneous costs. Shows per-person cost if applicable.
3. **Important Info** -- Local currency with conversion rate to user's selected currency, timezone with difference from user's location, language spoken, emergency numbers, and travel tips
4. **Weather Info** -- Temperature range, weather condition with emoji icon (sun/cloud/rain), humidity percentage, travel season quality, and packing recommendations
5. **Visa Info** -- Visa requirements text, required documents checklist (passport validity, return ticket, accommodation proof, funds proof)
6. **AI Recommendations** (only when AI data is available) -- Must-try items as badges, local customs list, and things to avoid
7. **Flights** -- Outbound and return flight cards showing departure/arrival airport codes, dates, times, and estimated costs. Links to MakeMyTrip for booking.
8. **Hotels and Lodging** -- Recommended hotel card with destination, rating, nightly rate, dates, and free cancellation note
9. **Documents** -- Lists all uploaded booking documents with type icons, document count, view/download options. Shows empty state with upload prompt when no documents exist. Quick "Upload Document" button.

### Tab 2: Itinerary

Displays the day-by-day plan:

- Each day is a section with a header showing "Day X", the date, a location badge, and a "Regenerate Day" button (sparkle icon)
- Activities are listed as cards within each day, each showing:
  - Circular number indicator
  - Activity title and description
  - Time and price
  - Thumbnail image (destination-specific)
  - Booking status indicator (green checkmark if booked)
  - For flights and hotels: "Book" button (links to MakeMyTrip) and "Add Details" / "View Details" button
  - Drag handle for reordering (middle days only; first and last days are locked)
  - Remove button (X icon, appears on hover)
- "Add New Place" button at the bottom of each day
- Transportation indicators between activities showing mode (car, walk, train, bus), duration, and distance

**Activity Detail Modal:** Clicking an activity opens a full dialog with:
- Large destination image
- Time badge overlay
- Description section
- "About" section with type-specific bullet points (flight amenities, hotel facilities, activity details, restaurant features)
- Time, price, location, and rating (5-star display with review count)
- Action buttons: "View Booking Details" or "Add Details", and a "Book Now" button linking to external booking platforms

**Day Regeneration Feature:**
- Each day has a "Regenerate" button that opens a dialog
- The dialog offers 8 quick suggestion chips: More outdoor activities, More food experiences, More cultural activities, More relaxation time, Earlier/Later start time, Budget-friendly options, Premium experiences
- Users can also type a custom request in a text area
- Clicking "Regenerate" sends the request to the AI, which returns new activities for that specific day
- The itinerary updates in-place with the new activities

### Tab 3: Expenses

Contains two sub-tabs:

**Sub-tab: Overview**
- Total Expenses card with gradient background showing the sum of all tracked costs
- Expense Breakdown chart showing costs by category (Flights, Hotels, Activities, Dining) with percentage of total
- Expense Details list with each expense showing type icon, title, provider, category badge, split status, cost, and action buttons ("View Details", "Split")
- "+ Add Expense" button opening a dialog with:
  - Currency selector (INR, USD, EUR)
  - Amount input
  - Category selector (Restaurant, Flight, Hotel, Activity)
  - "Paid by" field
  - Split option
  - Date field (optional)

**Sub-tab: Trip Mates**
- Trip Mate Manager showing all co-travelers with their name, avatar initials, and balance (total paid vs. total owed)
- "Add Trip Mate" button opening a dialog for entering a nickname
- Each trip mate has options: WhatsApp invite, Email invite, Settle Up, Remove
- "Settle Up" dialog to record payments between trip mates

**Expense Splitting:**
- Each expense can be split among trip mates
- Three split modes: Equal, Custom (specific amounts), and Percentage-based
- Visual validation showing split amounts and remaining balance
- Split status shown on expense cards as a badge ("Split X ways")
- Settlement tracking adjusts individual balances

---

## 5. Document Management System

### 5.1 Document Upload (Per-Activity)

From the itinerary view, users can click "Add Details" on any flight, hotel, activity, or restaurant card. This opens a full-page form with:

**Common Fields:**
- File upload area (accepts PDF, JPG, JPEG, PNG, DOC, DOCX) with drag-and-drop style UI
- Booking Reference (required)
- Cost in INR (required)
- Additional Notes (optional)

**Flight-Specific Fields:**
- Airline Name, Flight Number
- Departure/Arrival Airport codes
- Departure/Arrival Date and Time

**Hotel-Specific Fields:**
- Hotel Name, Address
- Check-in/Check-out Date and Time

**Restaurant-Specific Fields:**
- Restaurant Name (required), Address
- Bill Currency and Amount (required)
- Date and Time (required)
- Bill upload (separate file input for receipts)

**Activity-Specific Fields:**
- Provider Name

### 5.2 Document Manager (Centralized)

A dedicated DocumentManager component accessible from the overview tab that provides:
- Upload button to add new documents
- Filterable tabs: All, Flights, Hotels, Other
- Each document shows: file name, type icon, OCR processing status (Pending/Processing/Completed/Failed), and extracted amount
- Document Detail dialog showing: file name, type, upload date, file size, OCR status badge, and extracted data fields (provider, booking reference, amount, dates)
- AI-Powered OCR badge indicating automatic extraction
- Delete and reprocess options per document

### 5.3 OCR Processing

When a document is uploaded:
1. File is stored in the backend (Supabase Storage bucket `trip-documents` or AWS S3)
2. The `process-document-ocr` edge function is triggered automatically
3. AI analyzes the document and extracts: provider name, booking reference, amounts, dates, airport codes, hotel addresses, etc.
4. Extracted data is stored and displayed alongside the document
5. OCR confidence score is shown
6. File size limit: 10MB; supported formats: PDF, JPG, JPEG, PNG, WEBP

---

## 6. Saving and Managing Trips

### 6.1 Save Trip

- After AI generates the itinerary, a "Save Trip" button appears in the header
- Saving creates a persistent record in the database with all itinerary data, days, and activities
- Once saved, a green "Saved" badge replaces the save button
- Saved trips appear in "My Itineraries" on the dashboard

### 6.2 My Itineraries

- List view of all user's trips
- Each trip card shows: trip name, destinations, date range, status (planning/active/completed), and travel type
- Options to view, edit, or delete trips

---

## 7. Currency System

- Global currency selector available across the app
- Supports: INR (Indian Rupee), USD (US Dollar), EUR (Euro)
- All prices are converted in real-time based on selected currency
- Currency context persists across all views (itinerary, expenses, budget)
- Destination-specific currency and conversion rates are shown in the Overview tab

---

## 8. Authentication and User Profile

### 8.1 Authentication Methods
- Email/Password registration and login
- Google OAuth sign-in
- JWT-based session management with automatic token refresh
- Secure token storage in localStorage

### 8.2 User Profile
- View and update full name
- Avatar URL support
- Profile accessible from dashboard

---

## 9. Technical Architecture

### 9.1 Frontend Stack
- React 18 with TypeScript
- Vite build tool
- Tailwind CSS with custom design tokens (gradients, shadows, glass effects)
- shadcn/ui component library (40+ components)
- TanStack React Query for server state management
- React Router for navigation
- Recharts for data visualization
- Capacitor for native iOS/Android builds

### 9.2 Backend Options

**Option A: Lovable Cloud (Supabase)**
- Edge Functions for AI processing: `generate-itinerary`, `process-document-ocr`, `regenerate-day`
- Supabase Storage for document files
- Supabase Auth for user management

**Option B: Spring Boot 3.2 (Standalone)**
- Java 17+ with Spring Security (JWT)
- PostgreSQL database with Flyway migrations
- RESTful API with OpenAPI/Swagger documentation
- AWS deployment (ECS/Fargate with CloudFormation)
- AWS S3 for document storage
- Configurable AI provider (OpenAI-compatible API)

### 9.3 AI Integration
- Configurable AI model via environment variables (model name, API key, base URL)
- System prompts engineered for structured JSON output
- Separate prompts for full itinerary generation and single-day regeneration
- Temperature: 0.7 for creative yet consistent results
- Max tokens: 4000 for generation, 2000 for regeneration

### 9.4 API Endpoints (Spring Boot)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login |
| POST | /api/auth/refresh | Token refresh |
| GET | /api/auth/me | Current user profile |
| PUT | /api/auth/profile | Update profile |
| GET | /api/itineraries | List user itineraries |
| GET | /api/itineraries/{id} | Get itinerary details |
| POST | /api/itineraries | Create itinerary |
| PUT | /api/itineraries/{id} | Update itinerary |
| DELETE | /api/itineraries/{id} | Delete itinerary |
| POST | /api/itineraries/generate | AI generate itinerary |
| POST | /api/itineraries/{id}/regenerate-day | AI regenerate day |
| POST | /api/itineraries/save-generated | Save AI itinerary |
| GET | /api/expenses/itinerary/{id} | Get expenses |
| POST | /api/expenses | Create expense |
| GET | /api/expenses/itinerary/{id}/balances | Get balances |
| POST | /api/expenses/settlements | Create settlement |
| GET | /api/participants/itinerary/{id} | Get participants |
| POST | /api/participants | Add participant |
| GET | /api/documents/itinerary/{id} | Get documents |
| POST | /api/documents/itinerary/{id}/upload | Upload document |
| POST | /api/documents/{id}/process-ocr | Process OCR |

### 9.5 Database Schema (Key Tables)

- **users** -- id, email, password_hash, full_name, avatar_url
- **itineraries** -- id, user_id, name, destinations[], start_date, end_date, status, travel_type, image_url
- **itinerary_days** -- id, itinerary_id, day_number, date, location, notes
- **activities** -- id, itinerary_day_id, title, description, start_time, end_time, location, category, cost, booking_status
- **trip_participants** -- id, itinerary_id, name, email, role
- **expenses** -- id, itinerary_id, title, amount, currency, category, paid_by, date
- **expense_splits** -- id, expense_id, participant_id, amount, is_paid, split_type
- **settlements** -- id, itinerary_id, from_participant_id, to_participant_id, amount
- **documents** -- id, itinerary_id, file_name, file_url, document_type, ocr_status, extracted_data, provider_name, booking_reference, amount

---

## 10. Design System

- **Color Palette:** Primary blue, accent orange/amber, gradient backgrounds (ocean, premium, card)
- **Typography:** System fonts with semibold headings, muted descriptions
- **Glass Effects:** Backdrop blur with semi-transparent whites (bg-white/80)
- **Shadows:** Soft shadows (shadow-soft), premium shadows (shadow-premium)
- **Cards:** Rounded corners (rounded-2xl), border-0 with shadows, gradient card backgrounds
- **Mobile-First:** Responsive grid layouts, stacked buttons on mobile, inline on desktop
- **Icons:** Lucide React icon library throughout
- **Animations:** Transition effects on hover, loading spinners, progress bar animations

