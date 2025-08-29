// app/login/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    // Use Vercel URL in prod, localhost in dev
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${base}/auth/callback`,
      },
    });

    setLoading(false);
    setMsg(error ? error.message : 'Check your email for a magic link.');
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Sign in</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full rounded border border-neutral-700 bg-neutral-900 p-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Send magic link'}
        </button>

        {msg && <p className="text-sm opacity-80">{msg}</p>}
      </form>
    </div>
  );
}
