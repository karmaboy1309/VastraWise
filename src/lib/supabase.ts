import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tovtnfqymhgxlfngfjjr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdnRuZnF5bWhneGxmbmdmampyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4OTI0MjEsImV4cCI6MjA4NTQ2ODQyMX0.yQpF7ONFmsFOlNEf6yLNn5AB3KIiFNcfxnP31MaZGog'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
