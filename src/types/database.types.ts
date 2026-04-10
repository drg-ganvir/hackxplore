
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string | null
          avatar_url: string | null
          skills: string[] | null
          interests: string[] | null
          preferred_role: string | null
          looking_for: string | null
          bio: string | null
          github_url: string | null
          linkedin_url: string | null
          portfolio_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          name?: string | null
          avatar_url?: string | null
          skills?: string[] | null
          interests?: string[] | null
          preferred_role?: string | null
          looking_for?: string | null
          bio?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string | null
          avatar_url?: string | null
          skills?: string[] | null
          interests?: string[] | null
          preferred_role?: string | null
          looking_for?: string | null
          bio?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
        }
      }
      teams: {
        Row: {
          id: string
          created_at: string
          name: string
          hackathon_id: string
          description: string
          skills_needed: string[]
          creator_id: string
          max_members: number
          is_open: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          hackathon_id: string
          description: string
          skills_needed: string[]
          creator_id: string
          max_members: number
          is_open: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          hackathon_id?: string
          description?: string
          skills_needed?: string[]
          creator_id?: string
          max_members?: number
          is_open?: boolean
        }
      }
      team_members: {
        Row: {
          id: string
          created_at: string
          team_id: string
          user_id: string
          status: 'pending' | 'accepted' | 'rejected'
        }
        Insert: {
          id?: string
          created_at?: string
          team_id: string
          user_id: string
          status: 'pending' | 'accepted' | 'rejected'
        }
        Update: {
          id?: string
          created_at?: string
          team_id?: string
          user_id?: string
          status?: 'pending' | 'accepted' | 'rejected'
        }
      }
      bookmarks: {
        Row: {
          id: string
          created_at: string
          user_id: string
          item_id: string
          item_type: 'hackathon' | 'internship'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          item_id: string
          item_type: 'hackathon' | 'internship'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          item_id?: string
          item_type?: 'hackathon' | 'internship'
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
  }
}
