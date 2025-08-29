'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const supabase = createClient();

      // If Supabase sent an error message via URL (common if link is stale)
      const url = new URL(window.location.href);
      const errDesc = url.searchParams.get('error_description');
      if (errDesc) {
        router.replace(`/login?message=${encodeURIComponent(errDesc)}`);
        return;
      }

      try {
        /**
         * 1) FIRST try the PKCE style (?code=...) flow.
         *    Supabase SDK will read the code-verifier it stored during sign-in.
         *    IMPORTANT: pass no arguments – the SDK will read the code from the URL.
         */
        const { error: pkceErr } = await supabase.auth.exchangeCodeForSession();
        if (!pkceErr) {
          router.replace('/');
          return;
        }

        /**
         * 2) If PKCE failed, fall back to the legacy magic-link style
         *    (#token_hash=...&type=magiclink).
         */
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const token_hash = hash.get('token_hash');
        const type = (hash.get('type') ?? 'magiclink') as
          | 'magiclink'
          | 'recovery'
          | 'invite'
          | 'email_change';

        if (token_hash) {
          const { error: otpErr } = await supabase.auth.verifyOtp({ type, token_hash });
          if (!otpErr) {
            router.replace('/');
            return;
          }
          // Both failed → show the more helpful message
          router.replace(`/login?message=${encodeURIComponent(otpErr.message)}`);
          return;
        }

        // No recognizable params – bounce to login
        router.replace('/login?message=' + encodeURIComponent('Missing auth params'));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        router.replace(`/login?message=${encodeURIComponent(message || 'auth_failed')}`);
      }
    })();
  }, [router]);

  return <main className="p-6">Signing you in…</main>;
}
