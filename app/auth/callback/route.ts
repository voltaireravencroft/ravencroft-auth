// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function GET(request: Request) {
  const url = new URL(request.url);

  // We will redirect to "/" (adjust if you want a dashboard path)
  const res = NextResponse.redirect(new URL('/', url));

  // In your Next version, cookies() is async
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // mutate via response cookies in route handlers
          res.cookies.set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          // emulate delete by setting empty value + maxAge: 0
          res.cookies.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );

  try {
    const code = url.searchParams.get('code');        // OAuth/PKCE
    const token_hash = url.searchParams.get('token_hash'); // Magic link / recovery
    const type = (url.searchParams.get('type') ?? 'magiclink') as
      | 'magiclink'
      | 'recovery'
      | 'invite'
      | 'email_change';

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
    } else if (token_hash) {
      const { error } = await supabase.auth.verifyOtp({ type, token_hash });
      if (error) throw error;
    } else {
      // Missing params -> bounce to login with a message
      return NextResponse.redirect(new URL('/login?message=missing_params', url));
    }

    // Success -> send them to /
    return res;
  } catch (err: any) {
    const msg = encodeURIComponent(err?.message ?? 'auth_failed');
    return NextResponse.redirect(new URL(`/login?message=${msg}`, url));
  }
}
