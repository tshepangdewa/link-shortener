import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { generateShortCode, normalizeUrl } from '@/lib/utils';

export async function POST(request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error:
            'Supabase credentials are not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local',
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const rawUrl = body?.url;

    if (!rawUrl || typeof rawUrl !== 'string') {
      return NextResponse.json({ error: 'Please provide a valid URL string.' }, { status: 400 });
    }

    const normalizedUrl = normalizeUrl(rawUrl);
    if (!normalizedUrl) {
      return NextResponse.json(
        { error: 'Invalid URL format. Please include a valid domain (e.g. https://example.com).' },
        { status: 400 }
      );
    }

    // Check if URL was already shortened previously
    const { data: existingRecord } = await supabase
      .from('urls')
      .select('short_code')
      .eq('original_url', normalizedUrl)
      .limit(1)
      .maybeSingle();

    if (existingRecord?.short_code) {
      return NextResponse.json({
        shortCode: existingRecord.short_code,
        originalUrl: normalizedUrl,
        alreadyExisted: true,
      });
    }

    // Generate unique short code with collision handling
    let code = '';
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 5;

    while (!isUnique && attempts < maxAttempts) {
      code = generateShortCode(6);
      const { data } = await supabase
        .from('urls')
        .select('id')
        .eq('short_code', code)
        .limit(1);

      if (!data || data.length === 0) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Could not allocate a unique short code. Please try again.' },
        { status: 500 }
      );
    }

    // Insert record
    const { error: insertError } = await supabase.from('urls').insert([
      {
        original_url: normalizedUrl,
        short_code: code,
      },
    ]);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      shortCode: code,
      originalUrl: normalizedUrl,
      alreadyExisted: false,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
