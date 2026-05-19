import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://qagigcnqjqiyafcbjend.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhZ2lnY25xanFpeWFmY2JqZW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2OTczOTUsImV4cCI6MjA5NDI3MzM5NX0.arDHzDFKN5RNY0wcXakqHNpLCfnjuCn-al9Le-GBRY0"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
