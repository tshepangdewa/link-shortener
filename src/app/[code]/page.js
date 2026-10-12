import { redirect, notFound } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RedirectPage({ params }) {
  const { code } = params;

  if (!code || !isSupabaseConfigured()) {
    notFound();
  }

  // Look up destination URL in Supabase
  const { data, error } = await supabase
    .from('urls')
    .select('original_url')
    .eq('short_code', code)
    .maybeSingle();

  if (error || !data?.original_url) {
    notFound();
  }

  // Increment clicks asynchronously without blocking redirect
  try {
    supabase.rpc('increment_clicks', { code }).then();
  } catch (e) {
    // Non-fatal
  }

  // Instant server-side redirect (HTTP 307)
  redirect(data.original_url);
}
