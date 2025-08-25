export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      equipments: {
        Row: {
          created_at: string
          id: number
          last_maintenance: string | null
          maintenance_interval: number
          model: string | null
          name: string
          next_maintenance: string | null
          responsible: string
          sector: string
          status: string
        }
        Insert: {
          created_at?: string
          last_maintenance?: string | null
          maintenance_interval: number
          model?: string | null
          name: string
          next_maintenance?: string | null
          responsible: string
          sector: string
          status: string
        }
        Update: {
          created_at?: string
          id?: number
          last_maintenance?: string | null
          maintenance_interval?: number
          model?: string | null
          name?: string
          next_maintenance?: string | null
          responsible?: string
          sector?: string
          status?: string
        }
        Enums: {
          [_ in never]: never
        }
      }
      inventory_items: {
        Row: {
          category: string
          created_at: string
          id: number
          last_movement: string | null
          location: string | null
          minimum: number
          name: string
          quantity: number
          status: string
          unit: string | null
        }
        Insert: {
          category: string
          created_at?: string
          last_movement?: string | null
          location?: string | null
          minimum: number
          name: string
          quantity: number
          status: string
          unit?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: number
          last_movement?: string | null
          location?: string | null
          minimum?: number
          name?: string
          quantity?: number
          status?: string
          unit?: string | null
        }
        Enums: {
          [_ in never]: never
        }
      }
      maintenance_records: {
        Row: {
          created_at: string
          date: string
          description: string | null
          equipment_id: number
          id: number
          responsible: string
          type: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          equipment_id: number
          responsible: string
          type: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          equipment_id?: number
          id?: number
          responsible?: string
          type?: string
        }
        Enums: {
          [_ in never]: never
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never