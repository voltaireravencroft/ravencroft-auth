// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ravencroft Auth Demo',
  description: 'Email magic-link auth with Supabase + Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        <main className="mx-auto max-w-xl p-6">{children}</main>
      </body>
    </html>
  );
}
