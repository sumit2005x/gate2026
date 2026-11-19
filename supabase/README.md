# Supabase Setup for gate2026

## 1. Create a Free Supabase Project (0 Card Required)
1. Go to [https://supabase.com](https://supabase.com) and log in with your GitHub account (`sumit2005x`).
2. Click **New Project**.
3. Choose a name (e.g. `gate2026`), set a secure database password, and pick a region near India (e.g. `Singapore` or `Mumbai`).
4. Click **Create new project**.

## 2. Run the Database Schema
1. In your Supabase dashboard, click on the **SQL Editor** tab in the left sidebar.
2. Click **New query**.
3. Open and copy the entire content of [`supabase/schema.sql`](./schema.sql).
4. Paste it into the SQL Editor and click **Run** (green button).
5. All tables (`products`, `orders`, `coupons`, `categories`, `creators`, `store_settings`), storage buckets (`products-public`, `products-locked`), and seed data will be created instantly.

## 3. Get Your API Keys
1. Go to **Project Settings** (gear icon) -> **API**.
2. Copy:
   - **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public** key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (secret) -> `SUPABASE_SERVICE_ROLE_KEY`

## 4. Add to Local & Vercel
Add them to `.env.local` locally and under **Environment Variables** in your Vercel Project Settings!
