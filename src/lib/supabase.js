import { createClient } from '@supabase/supabase-js'

// In a real project, these would be in .env
const supabaseUrl = 'https://mock.supabase.co'
const supabaseAnonKey = 'mock-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
