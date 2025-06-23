import { supabase } from './supabase'

export async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...')
  
  try {
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('categories')
      .select('count')
      .limit(1)
    
    if (connectionError) {
      console.error('❌ Database connection failed:', connectionError)
      return false
    }
    
    console.log('✅ Database connection successful')
    
    // Test categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(5)
    
    if (categoriesError) {
      console.error('❌ Categories query failed:', categoriesError)
      return false
    }
    
    console.log(`✅ Categories loaded: ${categories?.length || 0} found`)
    
    // Test prompts
    const { data: prompts, error: promptsError } = await supabase
      .from('prompts')
      .select('*')
      .limit(5)
    
    if (promptsError) {
      console.error('❌ Prompts query failed:', promptsError)
      return false
    }
    
    console.log(`✅ Prompts loaded: ${prompts?.length || 0} found`)
    
    return true
  } catch (error) {
    console.error('❌ Database test failed:', error)
    return false
  }
}

export async function checkDatabaseSchema() {
  console.log('🔍 Checking database schema...')
  
  const tables = ['categories', 'prompts', 'contextual_ratings', 'prompt_tags', 'quality_indicators']
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.error(`❌ Table '${table}' not found or accessible:`, error.message)
        return false
      } else {
        console.log(`✅ Table '${table}' exists and accessible`)
      }
    } catch (error) {
      console.error(`❌ Error checking table '${table}':`, error)
      return false
    }
  }
  
  return true
}