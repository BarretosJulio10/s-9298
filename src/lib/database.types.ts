
export interface Database {
  public: {
    Tables: {
      template_fields: {
        Row: {
          id: string
          name: string
          display_name: string
          category: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          display_name: string
          category: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_name?: string
          category?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
