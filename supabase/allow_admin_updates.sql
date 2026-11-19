-- ==============================================================================
-- Allow Admin Updates & Viewing Hidden Products in Admin Panel
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Ensure all product columns exist
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS payment_link_url TEXT;

-- 2. Allow SELECT on all products (public store filters published=true in code;
--    admin panel needs to query published=false so hidden products can be viewed & unhidden)
DROP POLICY IF EXISTS "Anyone can view published products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products"
ON public.products FOR SELECT
USING (true);

-- 3. Allow UPDATE on products (so admin panel edits & hide/unhide save to Supabase)
DROP POLICY IF EXISTS "Allow update on products" ON public.products;
CREATE POLICY "Allow update on products"
ON public.products FOR UPDATE
USING (true)
WITH CHECK (true);

-- 4. Allow INSERT on products (so admin panel uploads save to Supabase)
DROP POLICY IF EXISTS "Allow insert on products" ON public.products;
CREATE POLICY "Allow insert on products"
ON public.products FOR INSERT
WITH CHECK (true);

-- 5. Allow DELETE on products (so admin panel deletes remove from Supabase)
DROP POLICY IF EXISTS "Allow delete on products" ON public.products;
CREATE POLICY "Allow delete on products"
ON public.products FOR DELETE
USING (true);

-- 6. Ensure the 3 core products exist and are properly published
INSERT INTO public.products (
  id, slug, title, description, price, original_price, badge, rating, reviews_count,
  category, format, pages, file_size, author, language, published, features, highlights,
  cover_url, preview_url, digital_file_url, sort_order
) VALUES (
  'prod-gate-2027-mocks-cbt',
  'gate-2027-10-full-length-mocks-cbt',
  '10 Full-Length CBT Mock Tests (GATE 2026/2027)',
  '10 full-length Computer Based Test (CBT) mock tests designed on the exact TCS iON interface. Includes virtual calculator, live timer, negative marking simulation, and video solutions for all 650 questions.',
  399,
  999,
  'Exam Interface',
  4.9,
  89,
  'GATE Preparation',
  '10 Tests + PDF Solutions',
  10,
  '50 MB',
  'Top 50 GATE Rankers',
  'English',
  true,
  '["10 Full CBT Mock Tests on exact TCS iON interface","650 high-yield questions with video solutions","Virtual calculator practice mode","All-India percentile ranking & topic-wise diagnostic analytics","Unlimited re-attempts with question bookmarking"]'::jsonb,
  '["Exact TCS iON CBT interface simulation","650 questions with video solutions","All-India percentile ranking"]'::jsonb,
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60',
  '/downloads/gate-2027-10-cbt-mocks.pdf',
  2
)
ON CONFLICT (id) DO NOTHING;
