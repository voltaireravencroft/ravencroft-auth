'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();

      // Read both query params & hash
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');           // OAuth / PKCE
      const token_hash = url.searchParams.get('token_hash'); // Magic link (older style)
      const type =
        (url.searchParams.get('type') as
          | 'magiclink'
          | 'recovery'
          | 'invite'
          | 'email_change'
          | null) ?? 'magiclink';

      let error: { message: string } | null = null;

      if (code) {
        // Your supabase-js expects the code as an argument
        const { error: e } = await supabase.auth.exchangeCodeForSession(code);
        error = e ?? null;
      } else if (token_hash) {
        // Fallback for token_hash style magic links
        const { error: e } = await supabase.auth.verifyOtp({ type, token_hash });
        error = e ?? null;
      } else {
        router.replace('/login?message=missing_params');
        return;
      }

      if (error) {
        router.replace(`/login?message=${encodeURIComponent(error.message)}`);
      } else {
        router.replace('/');
      }
    };

    run();
  }, [router]);

  return <main className="p-6">Signing you in…</main>;
}
