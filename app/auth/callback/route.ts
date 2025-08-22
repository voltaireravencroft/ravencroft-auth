import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Prepare a response we can attach cookies to
  // Default to home on success; we'll override if needed
  const res = NextResponse.redirect(new URL('/', url));

  // Read cookies from the incoming request
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options?: CookieOptions) {
          res.cookies.set(name, value, options);
        },
        remove(name: string, options?: CookieOptions) {
          // No delete() on all channels; emulate with maxAge: 0
          res.cookies.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );

  try {
    const code = url.searchParams.get('code');        // OAuth / PKCE
    const token_hash = url.searchParams.get('token_hash'); // Magic link / recovery
    const type = url.searchParams.get('type') ?? 'magiclink';

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
    } else if (token_hash) {
      const { error } = await supabase.auth.verifyOtp({
        type: type as 'magiclink' | 'recovery' | 'invite' | 'email_change',
        token_hash,
      });
      if (error) throw error;
    } else {
      return NextResponse.redirect(
        new URL('/login?message=missing_params', url)
      );
    }

    // Success: cookie got set on `res`
    return res;
  } catch (err: unknown) {
    const msg = err instanceof Error ? encodeURIComponent(err.message) : 'auth_failed';
    return NextResponse.redirect(new URL(`/login?message=${msg}`, url));
  }
}
