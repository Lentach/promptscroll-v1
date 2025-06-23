import { createClient } from '@supabase/supabase-js'
import type { Prompt, Category, ContextualRating } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jfxcvepfrixbwhpfuitj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmeGN2ZXBmcml4YndocGZ1aXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0Njk0NTAsImV4cCI6MjA2NjA0NTQ1MH0.fN9FjeXNENyXlzI5_eu6CbY7YrWfCEOB2Zcs3TDBlQs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Disable auth persistence for better performance
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-my-custom-header': 'promptscroll-app'
    }
  }
})

// Test database connection with better error handling
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Database connection error:', error)
      return false
    }
    
    console.log('Database connection successful')
    return true
  } catch (err) {
    console.error('Database connection failed:', err)
    return false
  }
}

// Export types for convenience
export type { Prompt, Category, ContextualRating }