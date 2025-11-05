# Ravencroft Auth

A Next.js + Supabase authentication demo with email magic link login.  
Deployed with Vercel.

---

> ⚠️ **Project Status:** Currently on the back burner while active development continues on Shift-Insight.  
> Ravencroft Auth remains public as a proof-of-concept showing my direction for authentication systems.  
> Updates will roll out gradually as supporting components (UI/UX, backend integrations) are finalized elsewhere.
>
> *"Even paused work still moves forward in thought."* 

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
