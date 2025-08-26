// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const token_hash = url.searchParams.get('token_hash');
  const typeParam = url.searchParams.get('type') ?? 'magiclink';
  const type = typeParam as 'magiclink' | 'recovery' | 'invite' | 'email_change';

  // Next 15: cookies() is async
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // No-ops on the server — Supabase will set auth cookies via response headers
        set() {},
        remove() {},
      },
    }
  );

  try {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (token_hash) {
      const { error } = await supabase.auth.verifyOtp({ type, token_hash });
      if (error) throw error;
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Missing params → send back to login with a message
    return NextResponse.redirect(
      new URL('/login?message=missing_params', request.url)
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'auth_failed';
    return NextResponse.redirect(
      new URL(`/login?message=${encodeURIComponent(msg)}`, request.url)
    );
  }
}
