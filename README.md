# Ravencroft Auth

A Next.js + Supabase authentication demo with email magic link login.  
Deployed with Vercel.

---

## 🚀 Features
- 🔑 **Supabase Auth** – email magic link login
- 🔒 **Protected routes** – dashboard requires login
- 🚪 **Logout support** – one click sign-out
- 🎨 Built with **Next.js 15** and **TypeScript**
- 🌐 Hosted on **Vercel**

---

## 📂 Project Structure
```bash
app/
  login/           # Login page (magic link)
  auth/
    callback/      # Handles Supabase auth callback
    signout/       # Handles logout
  page.tsx         # Protected dashboard
lib/
  supabase/        # Supabase client + server helpers
