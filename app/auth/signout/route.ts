// app/auth/signout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const res = NextResponse.redirect(new URL('/login', url));

  // NOTE: cookies() is async in your environment
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options?: CookieOptions) {
          // mutate the *response* cookies:
          res.cookies.set(name, value, options);
        },
        remove(name: string, options?: CookieOptions) {
          // delete via response cookies
          res.cookies.set(name, '', { ...options, maxAge: 0 });
        },
      },
    },
  );

  await supabase.auth.signOut();
  return res;
}
