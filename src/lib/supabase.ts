import { createClient } from '@supabase/supabase-js';

// These come from your .env file — see README for setup
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// We guard so the app still loads without .env (dev mode shows placeholder)
export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export const isSupabaseReady = !!supabase;

// ─── Auth helpers ────────────────────────────────────────────────────────────

export async function signInAnonymously(displayName: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user) return null;
  // Store display name in user metadata
  await supabase.auth.updateUser({ data: { display_name: displayName } });
  return data.user;
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// ─── Room helpers ─────────────────────────────────────────────────────────────

export async function createRoom(room: {
  code: string;
  name: string;
  max_size: number;
  session_type: string;
  default_key: string;
  notes: string;
}) {
  if (!supabase) return { error: 'Supabase not configured' };
  const { data, error } = await supabase
    .from('rooms')
    .insert(room)
    .select()
    .single();
  return { data, error };
}

export async function getRoomByCode(code: string) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('code', code)
    .single();
  return { data, error };
}

export async function joinRoom(roomId: string, player: {
  user_id: string;
  display_name: string;
  instrument: string;
  subtype: string;
  role: string;
}) {
  if (!supabase) return { error: 'Supabase not configured' };
  const { data, error } = await supabase
    .from('room_players')
    .upsert({ room_id: roomId, ...player })
    .select()
    .single();
  return { data, error };
}

// ─── Song / chart helpers ────────────────────────────────────────────────────

export async function getSongsForRoom(roomId: string) {
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });
  return { data: data ?? [], error };
}

export async function uploadPdfChart(
  file: File,
  songId: string
): Promise<string | null> {
  if (!supabase) return null;
  const path = `charts/${songId}/${file.name}`;
  const { error } = await supabase.storage
    .from('charts')
    .upload(path, file, { upsert: true });
  if (error) return null;
  const { data } = supabase.storage.from('charts').getPublicUrl(path);
  return data.publicUrl;
}
