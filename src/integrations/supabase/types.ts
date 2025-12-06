export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          booking_status: string | null
          category: string | null
          cost: number | null
          created_at: string
          description: string | null
          end_time: string | null
          id: string
          itinerary_day_id: string
          location: string | null
          start_time: string | null
          title: string
        }
        Insert: {
          booking_status?: string | null
          category?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          itinerary_day_id: string
          location?: string | null
          start_time?: string | null
          title: string
        }
        Update: {
          booking_status?: string | null
          category?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          itinerary_day_id?: string
          location?: string | null
          start_time?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_itinerary_day_id_fkey"
            columns: ["itinerary_day_id"]
            isOneToOne: false
            referencedRelation: "itinerary_days"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          amount: number | null
          booking_reference: string | null
          created_at: string
          currency: string | null
          document_type: string
          event_date: string | null
          extracted_data: Json | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          itinerary_id: string
          ocr_confidence: number | null
          ocr_status: string | null
          provider_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          booking_reference?: string | null
          created_at?: string
          currency?: string | null
          document_type: string
          event_date?: string | null
          extracted_data?: Json | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          itinerary_id: string
          ocr_confidence?: number | null
          ocr_status?: string | null
          provider_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          booking_reference?: string | null
          created_at?: string
          currency?: string | null
          document_type?: string
          event_date?: string | null
          extracted_data?: Json | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          itinerary_id?: string
          ocr_confidence?: number | null
          ocr_status?: string | null
          provider_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_splits: {
        Row: {
          amount: number
          created_at: string
          expense_id: string
          id: string
          participant_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          expense_id: string
          id?: string
          participant_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          expense_id?: string
          id?: string
          participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_splits_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_splits_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "trip_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          currency: string
          date: string
          description: string | null
          id: string
          itinerary_id: string
          paid_by_participant_id: string
          receipt_url: string | null
          split_type: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          currency?: string
          date: string
          description?: string | null
          id?: string
          itinerary_id: string
          paid_by_participant_id: string
          receipt_url?: string | null
          split_type?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          currency?: string
          date?: string
          description?: string | null
          id?: string
          itinerary_id?: string
          paid_by_participant_id?: string
          receipt_url?: string | null
          split_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_paid_by_participant_id_fkey"
            columns: ["paid_by_participant_id"]
            isOneToOne: false
            referencedRelation: "trip_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      itineraries: {
        Row: {
          created_at: string
          destinations: string[]
          end_date: string
          id: string
          image_url: string | null
          name: string
          start_date: string
          status: string | null
          travel_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          destinations?: string[]
          end_date: string
          id?: string
          image_url?: string | null
          name: string
          start_date: string
          status?: string | null
          travel_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          destinations?: string[]
          end_date?: string
          id?: string
          image_url?: string | null
          name?: string
          start_date?: string
          status?: string | null
          travel_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itineraries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_days: {
        Row: {
          created_at: string
          date: string
          day_number: number
          id: string
          itinerary_id: string
          location: string | null
          notes: string | null
        }
        Insert: {
          created_at?: string
          date: string
          day_number: number
          id?: string
          itinerary_id: string
          location?: string | null
          notes?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          day_number?: number
          id?: string
          itinerary_id?: string
          location?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_days_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      settlements: {
        Row: {
          amount: number
          created_at: string
          currency: string
          from_participant_id: string
          id: string
          itinerary_id: string
          notes: string | null
          settled_at: string
          to_participant_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          from_participant_id: string
          id?: string
          itinerary_id: string
          notes?: string | null
          settled_at?: string
          to_participant_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          from_participant_id?: string
          id?: string
          itinerary_id?: string
          notes?: string | null
          settled_at?: string
          to_participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlements_from_participant_id_fkey"
            columns: ["from_participant_id"]
            isOneToOne: false
            referencedRelation: "trip_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settlements_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settlements_to_participant_id_fkey"
            columns: ["to_participant_id"]
            isOneToOne: false
            referencedRelation: "trip_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_participants: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          itinerary_id: string
          name: string
          total_owed: number
          total_paid: number
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          itinerary_id: string
          name: string
          total_owed?: number
          total_paid?: number
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          itinerary_id?: string
          name?: string
          total_owed?: number
          total_paid?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_participants_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
