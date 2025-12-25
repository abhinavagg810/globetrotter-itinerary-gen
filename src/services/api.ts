// API Client for Spring Boot Backend

// Configure your Spring Boot API URL here or set VITE_API_URL environment variable
// For local development: http://localhost:8080/api
// For production: https://your-api-domain.com/api
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const getApiBaseUrl = () => API_BASE_URL;

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private setAuthTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  clearAuthTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { method = 'GET', body, headers = {} } = options;
    
    const token = this.getAuthToken();
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };
    
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      // Handle 401 - try to refresh token
      if (response.status === 401) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the original request
          requestHeaders['Authorization'] = `Bearer ${this.getAuthToken()}`;
          const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, {
            method,
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : undefined,
          });
          
          if (!retryResponse.ok) {
            const errorData = await retryResponse.json().catch(() => ({}));
            return { error: errorData.message || 'Request failed' };
          }
          
          const data = await retryResponse.json();
          return { data };
        } else {
          this.clearAuthTokens();
          window.location.href = '/';
          return { error: 'Session expired' };
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { error: errorData.message || `Request failed with status ${response.status}` };
      }

      // Handle empty responses
      const text = await response.text();
      if (!text) {
        return { data: undefined as T };
      }
      
      const data = JSON.parse(text);
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      this.setAuthTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      return false;
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const result = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    
    if (result.data) {
      this.setAuthTokens(result.data.accessToken, result.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(result.data.user));
    }
    
    return result;
  }

  async register(email: string, password: string, fullName: string): Promise<ApiResponse<AuthResponse>> {
    const result = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: { email, password, fullName },
    });
    
    if (result.data) {
      this.setAuthTokens(result.data.accessToken, result.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(result.data.user));
    }
    
    return result;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  async updateProfile(fullName: string, avatarUrl?: string): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/profile', {
      method: 'PUT',
      body: { fullName, avatarUrl },
    });
  }

  // Itinerary endpoints
  async getItineraries(): Promise<ApiResponse<Itinerary[]>> {
    return this.request<Itinerary[]>('/itineraries');
  }

  async getItinerary(id: string): Promise<ApiResponse<ItineraryDetails>> {
    return this.request<ItineraryDetails>(`/itineraries/${id}`);
  }

  async createItinerary(data: CreateItineraryRequest): Promise<ApiResponse<Itinerary>> {
    return this.request<Itinerary>('/itineraries', {
      method: 'POST',
      body: data,
    });
  }

  async updateItinerary(id: string, data: Partial<CreateItineraryRequest>): Promise<ApiResponse<Itinerary>> {
    return this.request<Itinerary>(`/itineraries/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteItinerary(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/itineraries/${id}`, { method: 'DELETE' });
  }

  async generateItinerary(data: GenerateItineraryRequest): Promise<ApiResponse<AIItinerary>> {
    return this.request<AIItinerary>('/itineraries/generate', {
      method: 'POST',
      body: data,
    });
  }

  async regenerateDay(itineraryId: string, data: RegenerateDayRequest): Promise<ApiResponse<AIItineraryDay>> {
    return this.request<AIItineraryDay>(`/itineraries/${itineraryId}/regenerate-day`, {
      method: 'POST',
      body: data,
    });
  }

  // Activity endpoints
  async createActivity(data: CreateActivityRequest): Promise<ApiResponse<Activity>> {
    return this.request<Activity>('/itineraries/activities', {
      method: 'POST',
      body: data,
    });
  }

  async updateActivity(id: string, data: Partial<CreateActivityRequest>): Promise<ApiResponse<Activity>> {
    return this.request<Activity>(`/itineraries/activities/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteActivity(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/itineraries/activities/${id}`, { method: 'DELETE' });
  }

  // Expense endpoints
  async getExpenses(itineraryId: string): Promise<ApiResponse<ExpenseDetails>> {
    return this.request<ExpenseDetails>(`/expenses/itinerary/${itineraryId}`);
  }

  async createExpense(data: CreateExpenseRequest): Promise<ApiResponse<Expense>> {
    return this.request<Expense>('/expenses', {
      method: 'POST',
      body: data,
    });
  }

  async updateExpense(id: string, data: Partial<CreateExpenseRequest>): Promise<ApiResponse<Expense>> {
    return this.request<Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteExpense(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/expenses/${id}`, { method: 'DELETE' });
  }

  async getBalances(itineraryId: string): Promise<ApiResponse<ParticipantBalance[]>> {
    return this.request<ParticipantBalance[]>(`/expenses/itinerary/${itineraryId}/balances`);
  }

  async createSettlement(data: CreateSettlementRequest): Promise<ApiResponse<Settlement>> {
    return this.request<Settlement>('/expenses/settlements', {
      method: 'POST',
      body: data,
    });
  }

  // Participant endpoints
  async getParticipants(itineraryId: string): Promise<ApiResponse<ParticipantDetails>> {
    return this.request<ParticipantDetails>(`/participants/itinerary/${itineraryId}`);
  }

  async addParticipant(data: CreateParticipantRequest): Promise<ApiResponse<Participant>> {
    return this.request<Participant>('/participants', {
      method: 'POST',
      body: data,
    });
  }

  async updateParticipant(id: string, data: Partial<CreateParticipantRequest>): Promise<ApiResponse<Participant>> {
    return this.request<Participant>(`/participants/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async removeParticipant(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/participants/${id}`, { method: 'DELETE' });
  }

  // Document endpoints
  async getDocuments(itineraryId: string): Promise<ApiResponse<Document[]>> {
    return this.request<Document[]>(`/documents/itinerary/${itineraryId}`);
  }

  async uploadDocument(itineraryId: string, file: File, documentType: string): Promise<ApiResponse<Document>> {
    const token = this.getAuthToken();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    try {
      const response = await fetch(`${this.baseUrl}/documents/itinerary/${itineraryId}/upload`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { error: errorData.message || 'Upload failed' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Upload failed' };
    }
  }

  async processDocumentOCR(documentId: string): Promise<ApiResponse<Document>> {
    return this.request<Document>(`/documents/${documentId}/process-ocr`, {
      method: 'POST',
    });
  }

  async deleteDocument(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/documents/${id}`, { method: 'DELETE' });
  }
}

// Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Itinerary {
  id: string;
  userId: string;
  name: string;
  destinations: string[];
  startDate: string;
  endDate: string;
  status: string;
  travelType: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryDay {
  id: string;
  itineraryId: string;
  dayNumber: number;
  date: string;
  location: string | null;
  notes: string | null;
  createdAt: string;
  activities: Activity[];
}

export interface Activity {
  id: string;
  itineraryDayId: string;
  title: string;
  description: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  category: string | null;
  cost: number | null;
  bookingStatus: string | null;
  createdAt: string;
}

export interface ItineraryDetails {
  itinerary: Itinerary;
  days: ItineraryDay[];
}

export interface CreateItineraryRequest {
  name: string;
  destinations: string[];
  startDate: string;
  endDate: string;
  status?: string;
  travelType?: string;
  imageUrl?: string;
}

export interface CreateActivityRequest {
  itineraryDayId: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  category?: string;
  cost?: number;
  bookingStatus?: string;
}

export interface GenerateItineraryRequest {
  fromLocation: string;
  destinations: string[];
  travelType: string;
  fromDate: string;
  toDate: string;
  travelingWith: string;
  travelVibes: string[];
  budget: string;
  domesticOrInternational: string;
  tripDuration: string;
  needsDestinationHelp: boolean;
}

export interface RegenerateDayRequest {
  dayNumber: number;
  date: string;
  location: string;
  changeRequest: string;
  destination?: string;
  travelVibes?: string[];
  travelingWith?: string;
}

export interface AIItinerary {
  tripName: string;
  destination?: string;
  summary: string;
  estimatedBudget: {
    total: number;
    breakdown: {
      flights: number;
      accommodation: number;
      activities: number;
      food: number;
      transportation: number;
      miscellaneous: number;
    };
    perPerson: number;
    currency: string;
    budgetLevel?: string;
  };
  importantInfo: {
    localCurrency: { code: string; name: string; symbol: string; exchangeRate: string };
    timezone: { name: string; offset: string; differenceFromOrigin?: string; differenceFromIST?: string };
    language: string;
    emergencyNumbers: { police: string; ambulance: string; tourist?: string };
    bestTimeToVisit: string;
    visaRequirements: string;
    travelTips: string[];
  };
  weather: {
    temperature: { min: number; max: number; unit: string };
    condition: string;
    humidity: string;
    packingTips: string[];
  };
  days: AIItineraryDay[];
  recommendations: {
    mustTry: string[];
    hiddenGems?: string[];
    avoidances: string[];
    localCustoms: string[];
    photoSpots?: string[];
  };
  practicalInfo?: {
    transportation?: string;
    simCard?: string;
    safety?: string;
    tipping?: string;
  };
}

export interface AIItineraryDay {
  dayNumber: number;
  date: string;
  theme: string;
  location: string;
  activities: AIItineraryActivity[];
}

export interface AIItineraryActivity {
  id: string;
  time: string;
  endTime?: string;
  title: string;
  description: string;
  type: 'flight' | 'hotel' | 'activity' | 'restaurant';
  price: number;
  location?: string;
  bookingStatus: 'available' | 'booked' | 'loading';
  tips?: string;
  rating?: number;
  duration?: string;
  bookingRequired?: boolean;
  dressCode?: string;
}

export interface Expense {
  id: string;
  itineraryId: string;
  paidByParticipantId: string;
  amount: number;
  currency: string;
  category: string;
  description: string | null;
  date: string;
  splitType: string;
  receiptUrl: string | null;
  createdAt: string;
  splits: ExpenseSplit[];
}

export interface ExpenseSplit {
  id: string;
  expenseId: string;
  participantId: string;
  amount: number;
  createdAt: string;
}

export interface ExpenseDetails {
  expenses: Expense[];
}

export interface CreateExpenseRequest {
  itineraryId: string;
  paidByParticipantId: string;
  amount: number;
  currency: string;
  category: string;
  description?: string;
  date: string;
  splitType?: string;
  splits?: { participantId: string; amount: number }[];
}

export interface CreateSettlementRequest {
  itineraryId: string;
  fromParticipantId: string;
  toParticipantId: string;
  amount: number;
  currency?: string;
  notes?: string;
}

export interface Settlement {
  id: string;
  itineraryId: string;
  fromParticipantId: string;
  toParticipantId: string;
  amount: number;
  currency: string;
  settledAt: string;
  notes: string | null;
  createdAt: string;
}

export interface ParticipantBalance {
  participantId: string;
  participantName: string;
  totalPaid: number;
  totalOwed: number;
  balance: number;
}

export interface Participant {
  id: string;
  itineraryId: string;
  userId: string | null;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  totalPaid: number;
  totalOwed: number;
  createdAt: string;
}

export interface ParticipantDetails {
  participants: Participant[];
  settlements: Settlement[];
}

export interface CreateParticipantRequest {
  itineraryId: string;
  name: string;
  email?: string;
  userId?: string;
}

export interface Document {
  id: string;
  itineraryId: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  documentType: 'flight' | 'hotel' | 'activity' | 'restaurant' | 'visa' | 'insurance' | 'other';
  extractedData: Record<string, unknown>;
  ocrStatus: 'pending' | 'processing' | 'completed' | 'failed';
  ocrConfidence: number | null;
  bookingReference: string | null;
  providerName: string | null;
  amount: number | null;
  currency: string;
  eventDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export const api = new ApiClient(API_BASE_URL);
