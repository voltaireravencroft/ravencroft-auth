// app/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Welcome 👋</h1>
      <p className="opacity-80">
        Signed in as <b>{user.email}</b>
      </p>

      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="rounded bg-red-600 px-3 py-2 text-sm font-medium hover:bg-red-500"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}
