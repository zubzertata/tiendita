import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://jvawjhgzotsabzvwyvro.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2YXdqaGd6b3RzYWJ6dnd5dnJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE1MzQxNTcsImV4cCI6MTk5NzExMDE1N30.FEs27uCN7ixP2-s8sTxeh4xeG8Jm_njA9RXO_dEM7Oc')