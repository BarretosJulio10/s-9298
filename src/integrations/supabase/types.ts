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
      charge_settings: {
        Row: {
          auto_send_notifications: boolean | null
          company_id: string
          created_at: string
          default_interest_rate: number | null
          default_late_fee: number | null
          id: string
          notification_days_before: number | null
          notification_message: string | null
          updated_at: string
        }
        Insert: {
          auto_send_notifications?: boolean | null
          company_id: string
          created_at?: string
          default_interest_rate?: number | null
          default_late_fee?: number | null
          id?: string
          notification_days_before?: number | null
          notification_message?: string | null
          updated_at?: string
        }
        Update: {
          auto_send_notifications?: boolean | null
          company_id?: string
          created_at?: string
          default_interest_rate?: number | null
          default_late_fee?: number | null
          id?: string
          notification_days_before?: number | null
          notification_message?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "charge_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      charges: {
        Row: {
          amount: number
          asaas_id: string | null
          company_id: string
          created_at: string
          customer_document: string
          customer_email: string
          customer_name: string
          due_date: string
          id: string
          interest_rate: number | null
          late_fee: number | null
          notification_date: string | null
          notification_sent: boolean | null
          payment_date: string | null
          payment_link: string | null
          payment_method: string | null
          status: Database["public"]["Enums"]["charge_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          asaas_id?: string | null
          company_id: string
          created_at?: string
          customer_document: string
          customer_email: string
          customer_name: string
          due_date: string
          id?: string
          interest_rate?: number | null
          late_fee?: number | null
          notification_date?: string | null
          notification_sent?: boolean | null
          payment_date?: string | null
          payment_link?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["charge_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          asaas_id?: string | null
          company_id?: string
          created_at?: string
          customer_document?: string
          customer_email?: string
          customer_name?: string
          due_date?: string
          id?: string
          interest_rate?: number | null
          late_fee?: number | null
          notification_date?: string | null
          notification_sent?: boolean | null
          payment_date?: string | null
          payment_link?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["charge_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "charges_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address_city: string | null
          address_complement: string | null
          address_neighborhood: string | null
          address_number: string | null
          address_state: string | null
          address_street: string | null
          address_zip: string | null
          birth_date: string | null
          company_id: string
          created_at: string
          document: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string
          plan_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          birth_date?: string | null
          company_id: string
          created_at?: string
          document: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone: string
          plan_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          birth_date?: string | null
          company_id?: string
          created_at?: string
          document?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          plan_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      company_settings: {
        Row: {
          asaas_api_key: string | null
          asaas_environment: string | null
          company_id: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          asaas_api_key?: string | null
          asaas_environment?: string | null
          company_id: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          asaas_api_key?: string | null
          asaas_environment?: string | null
          company_id?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      configurations: {
        Row: {
          asaas_api_key: string | null
          asaas_environment: string | null
          created_at: string
          id: string
          updated_at: string
          whatsapp_instance_id: string | null
        }
        Insert: {
          asaas_api_key?: string | null
          asaas_environment?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          whatsapp_instance_id?: string | null
        }
        Update: {
          asaas_api_key?: string | null
          asaas_environment?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          whatsapp_instance_id?: string | null
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          company_id: string
          content: string
          created_at: string
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          company_id: string
          content: string
          created_at?: string
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          content?: string
          created_at?: string
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_history: {
        Row: {
          charge_id: string
          created_at: string
          id: string
          message: string | null
          status: string
          type: string
        }
        Insert: {
          charge_id: string
          created_at?: string
          id?: string
          message?: string | null
          status: string
          type: string
        }
        Update: {
          charge_id?: string
          created_at?: string
          id?: string
          message?: string | null
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_history_charge_id_fkey"
            columns: ["charge_id"]
            isOneToOne: false
            referencedRelation: "charges"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_rules: {
        Row: {
          active: boolean
          company_id: string
          created_at: string
          days_after: number
          days_before: number
          id: string
          template_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          company_id: string
          created_at?: string
          days_after?: number
          days_before?: number
          id?: string
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          company_id?: string
          created_at?: string
          days_after?: number
          days_before?: number
          id?: string
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_rules_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_gateway_settings: {
        Row: {
          api_key: string | null
          api_secret: string | null
          company_id: string
          created_at: string
          enabled: boolean | null
          environment: string | null
          gateway: Database["public"]["Enums"]["payment_gateway_type"]
          id: string
          updated_at: string
        }
        Insert: {
          api_key?: string | null
          api_secret?: string | null
          company_id: string
          created_at?: string
          enabled?: boolean | null
          environment?: string | null
          gateway: Database["public"]["Enums"]["payment_gateway_type"]
          id?: string
          updated_at?: string
        }
        Update: {
          api_key?: string | null
          api_secret?: string | null
          company_id?: string
          created_at?: string
          enabled?: boolean | null
          environment?: string | null
          gateway?: Database["public"]["Enums"]["payment_gateway_type"]
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_gateway_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_method_settings: {
        Row: {
          company_id: string
          created_at: string
          enabled: boolean | null
          gateway_id: string
          id: string
          method: Database["public"]["Enums"]["payment_method_type"]
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          enabled?: boolean | null
          gateway_id: string
          id?: string
          method: Database["public"]["Enums"]["payment_method_type"]
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          enabled?: boolean | null
          gateway_id?: string
          id?: string
          method?: Database["public"]["Enums"]["payment_method_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_method_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_method_settings_gateway_id_fkey"
            columns: ["gateway_id"]
            isOneToOne: false
            referencedRelation: "payment_gateway_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          active: boolean
          billing_period: string
          created_at: string
          description: string | null
          features: Json | null
          id: string
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          billing_period?: string
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          billing_period?: string
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          cnpj: string | null
          company_name: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          plan_id: string | null
          status: Database["public"]["Enums"]["company_status"] | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          cnpj?: string | null
          company_name?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          plan_id?: string | null
          status?: Database["public"]["Enums"]["company_status"] | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          cnpj?: string | null
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          plan_id?: string | null
          status?: Database["public"]["Enums"]["company_status"] | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_company: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      charge_status: "pending" | "paid" | "overdue" | "cancelled"
      company_status: "active" | "inactive" | "pending"
      payment_gateway_type:
        | "mercadopago"
        | "asaas"
        | "paghiper"
        | "picpay"
        | "pagbank"
      payment_method: "pix" | "boleto" | "credit_card"
      payment_method_type: "pix" | "credit_card" | "boleto"
      user_role: "admin" | "company"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
