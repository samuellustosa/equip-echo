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
    PostgrestVersion: "13.0.4"
  }
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
          id?: number
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
        Relationships: []
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
          id?: number
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
        Relationships: []
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
          id?: number
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
        Relationships: [
          {
            foreignKeyName: "fk_equipment"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipments"
            referencedColumns: ["id"]
          },
        ]
      }
      sectors: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      responsibles: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          role?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
        }
        Relationships: []
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

type PublicSchema = DatabaseWithoutInternals['public']

export type Tables<
  TableName extends keyof PublicSchema['Tables'] | keyof PublicSchema['Views'],
> = PublicSchema['Tables'][TableName] extends {
  Row: infer R
}
  ? R
  : PublicSchema['Views'][TableName] extends {
      Row: infer R
    }
  ? R
  : never

export type TablesInsert<
  TableName extends keyof PublicSchema['Tables'],
> = PublicSchema['Tables'][TableName] extends {
  Insert: infer I
}
  ? I
  : never

export type TablesUpdate<
  TableName extends keyof PublicSchema['Tables'],
> = PublicSchema['Tables'][TableName] extends {
  Update: infer U
}
  ? U
  : never

export type Enums<
  EnumName extends keyof PublicSchema['Enums'],
> = PublicSchema['Enums'][EnumName]

export const Constants = {
  public: {
    Enums: {},
  },
} as const