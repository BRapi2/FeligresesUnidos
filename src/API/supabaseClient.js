import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sbrhivsrjuqmgkcsnixf.supabase.co'; // Reemplaza con tu URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNicmhpdnNyanVxbWdrY3NuaXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5OTg0MTcsImV4cCI6MjA2NDU3NDQxN30.U-RGIDOPR3ICR8Fkjdp71ksjntXan1MswCH5PHTaHqc'; // Reemplaza con tu clave

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
     }
});