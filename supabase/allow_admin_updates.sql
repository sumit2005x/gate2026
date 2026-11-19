-- ==============================================================================
-- Allow Admin Updates on Products Table
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Ensure all product columns exist
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS payment_link_url TEXT;

-- 2. Allow update on products (so admin panel edits save to Supabase)
DROP POLICY IF EXISTS "Allow update on products" ON public.products;
CREATE POLICY "Allow update on products"
ON public.products FOR UPDATE
USING (true)
WITH CHECK (true);

-- 3. Allow insert on products (so admin panel uploads save to Supabase)
DROP POLICY IF EXISTS "Allow insert on products" ON public.products;
CREATE POLICY "Allow insert on products"
ON public.products FOR INSERT
WITH CHECK (true);

-- 4. Allow delete on products (so admin panel deletes remove from Supabase)
DROP POLICY IF EXISTS "Allow delete on products" ON public.products;
CREATE POLICY "Allow delete on products"
ON public.products FOR DELETE
USING (true);
