import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          email: string | null
          plan_type: 'free' | 'pro'
          character_credits: number
          environment_credits: number
          prop_credits: number
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          stripe_plan_status: string | null
        }
        Insert: {
          user_id: string
          email?: string | null
          plan_type?: 'free' | 'pro'
          character_credits?: number
          environment_credits?: number
          prop_credits?: number
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_plan_status?: string | null
        }
        Update: {
          user_id?: string
          email?: string | null
          plan_type?: 'free' | 'pro'
          character_credits?: number
          environment_credits?: number
          prop_credits?: number
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_plan_status?: string | null
        }
      }
      characters: {
        Row: {
          id: string
          user_id: string
          name: string
          backstory: string | null
          image_primary_url: string | null
          image_face_url: string | null
          image_medium_url: string | null
          image_expression_url: string | null
          image_fullbody_url: string | null
          finetune_id: string | null
          trigger_word: string | null
          model_status: 'pending' | 'training' | 'ready' | 'failed'
          job_started_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          backstory?: string | null
          image_primary_url?: string | null
          image_face_url?: string | null
          image_medium_url?: string | null
          image_expression_url?: string | null
          image_fullbody_url?: string | null
          finetune_id?: string | null
          trigger_word?: string | null
          model_status?: 'pending' | 'training' | 'ready' | 'failed'
          job_started_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          backstory?: string | null
          image_primary_url?: string | null
          image_face_url?: string | null
          image_medium_url?: string | null
          image_expression_url?: string | null
          image_fullbody_url?: string | null
          finetune_id?: string | null
          trigger_word?: string | null
          model_status?: 'pending' | 'training' | 'ready' | 'failed'
          job_started_at?: string | null
          created_at?: string
        }
      }
      environments: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      props: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      stories: {
        Row: {
          id: string
          user_id: string
          title: string
          genre: string | null
          visual_style_keywords: string | null
          total_length_minutes: number | null
          chapter_count: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          genre?: string | null
          visual_style_keywords?: string | null
          total_length_minutes?: number | null
          chapter_count?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          genre?: string | null
          visual_style_keywords?: string | null
          total_length_minutes?: number | null
          chapter_count?: number | null
          created_at?: string
        }
      }
    }
  }
}
