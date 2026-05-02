import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://smdqzsbjonppazisufiu.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZHF6c2Jqb25wcGF6aXN1Zml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NDg1MzAsImV4cCI6MjA5MzMyNDUzMH0.9cW73GKEGmMCB1bkorGqKfFsti6j8L2iSoshPPOEc90'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
