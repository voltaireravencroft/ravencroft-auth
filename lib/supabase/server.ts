// lib/supabase/server.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function createClient() {
  // cookies() is async in your Next version
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // In server components, cookie mutation is a no‑op. Keep these present
        // so the client is satisfied, but do nothing here.
        set(_name: string, _value: string, _options?: CookieOptions) {},
        remove(_name: string, _options?: CookieOptions) {},
      },
    },
  );
}
