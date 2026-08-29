import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
export const SUPABASE_PROJECT_ID = 'eelmvpztfrsmlmurkcew';
export const SUPABASE_URL = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 
  `https://${SUPABASE_PROJECT_ID}.supabase.co`;

export const SUPABASE_ANON_KEY = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  'sb_publishable_uLH0irP5zhHDB1GtKMNZMg_Tr6AYbIv';

let supabaseClient: SupabaseClient | null = null;

/**
 * Lazy initialization of Supabase client to prevent startup errors if variables are not provided
 */
export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabaseClient;
}

export const supabase = getSupabase();

/**
 * Check connectivity with Supabase backend
 */
export async function checkSupabaseConnection(): Promise<{ connected: boolean; message: string; latencyMs?: number }> {
  const startTime = Date.now();
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    const latencyMs = Date.now() - startTime;
    if (response.ok || response.status === 404 || response.status === 200 || response.status === 400) {
      return {
        connected: true,
        message: 'Successfully connected to Supabase backend',
        latencyMs,
      };
    }
    return {
      connected: false,
      message: `Supabase returned status code: ${response.status}`,
      latencyMs,
    };
  } catch (error: any) {
    return {
      connected: false,
      message: error?.message || 'Failed to connect to Supabase backend',
      latencyMs: Date.now() - startTime,
    };
  }
}
