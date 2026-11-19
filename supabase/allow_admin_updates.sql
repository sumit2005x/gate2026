-- ==============================================================================
-- 1. DISABLE ROW LEVEL SECURITY (RLS) ON PRODUCTS
-- This stops Supabase from hiding "published = false" products from the admin panel!
-- ==============================================================================
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- If RLS is ever re-enabled in the future, these policies ensure full access:
DROP POLICY IF EXISTS "Anyone can view published products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow update on products" ON public.products;
CREATE POLICY "Allow update on products" ON public.products FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow insert on products" ON public.products;
CREATE POLICY "Allow insert on products" ON public.products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete on products" ON public.products;
CREATE POLICY "Allow delete on products" ON public.products FOR DELETE USING (true);

-- Ensure payment_link_url column exists
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS payment_link_url TEXT;

-- ==============================================================================
-- 2. RESTORE ALL PRODUCTS AS PUBLISHED = TRUE
-- ==============================================================================
UPDATE public.products SET published = true;

-- Ensure all 3 core products exist and are published
INSERT INTO public.products (
  id, slug, title, subtitle, description, price, compare_at_price,
  format, page_count, file_size, language, delivery, access, refunds,
  category, creator_name, creator_handle, creator_avatar,
  cover_url, jacket_style, jacket_color, sample_pages,
  digital_file_url, sample_pdf_url, sales_count, featured, published
) VALUES
(
  'prod-gate-2027-mocks-cbt',
  'gate-cse-2027-10-predicted-mocks-cbt-simulator',
  'GATE CSE 2027 · 10 Predicted Full-Length Mock Papers & CBT Simulator',
  '10 Realistic Mock Papers (650 Qs) + 10 Detailed Step-by-Step Solution Volumes + Offline TCS iON CBT Exam Engine',
  'GATE CSE 2027 · 10 PREDICTED FULL-LENGTH MOCKS + OFFLINE CBT SIMULATOR

Includes all 10 Predicted Question Papers, 10 detailed Solution Volumes, Master 10-Mock Book, and the interactive Offline TCS iON Exam Simulator engine.

• 10 Predicted Full-length Mocks (65 Qs each = 650 IIT-level problems)
• 10 Comprehensive Step-by-Step Solution PDFs
• Offline TCS iON Exam Simulator (works in any browser without internet)
• Built-in virtual scientific calculator & diagnostic post-exam analysis
• Instant download immediately after payment',
  499,
  999,
  'ZIP Pack · 21 PDFs + Offline CBT Simulator',
  450,
  '23.5 MB ZIP',
  'English',
  'Download ZIP immediately after payment',
  'Lifetime access',
  '7 days if files are faulty or corrupted',
  'GATE Preparation',
  'Gatewala',
  'gatewala',
  '/avatars/gatewala.svg',
  '/previews/gate2027/01_mock_series_cover.png',
  'swiss',
  '#2563EB',
  '["/previews/gate2027/01_mock_series_cover.png"]'::jsonb,
  '/downloads/GATE_CSE_2027_Ultimate_Ranker_Mock_Bundle.zip',
  '/sample_downloads/GATE_CSE_2027_Mock_01_FREE_SAMPLE.pdf',
  0,
  false,
  true
),
(
  'prod-gate-2027-repeated-patterns',
  'gate-cse-2027-questions-gate-repeats-90day',
  'Questions GATE Repeats: 90-Day High-Yield Blueprint (GATE CSE 2027)',
  'Every Recurring Question Pattern Ranked by Frequency Across 35 Years of GATE CSE with Trap Warnings & Formula Revision Sheet',
  'QUESTIONS GATE REPEATS: 90-DAY HIGH-YIELD BLUEPRINT (GATE CSE 2027)

Stop studying blindly. Over 65% of GATE marks come from 60 recurring question patterns. This 380-page compendium analyzes 35 years of official GATE CSE papers to isolate every recurring archetype.

• 60 High-Frequency Question Blueprints ranked by appearance count
• Tier-S Focus: Cache Mapping, Virtual Memory, Pipeline Hazards, Eigenvalues, Graph Theory
• NAT Trap Warnings: Decimal rounding traps, unit conversions, and calculator pitfalls
• 2-Page Formula Revision Cheatsheet included
• High-resolution digital PDF for phone, tablet, and desktop',
  399,
  699,
  '1 PDF · 380 pages',
  380,
  '12.1 MB PDF',
  'English',
  'Download PDF immediately after payment',
  'Lifetime access',
  '7 days if files are faulty or corrupted',
  'GATE Preparation',
  'Gatewala',
  'gatewala',
  '/avatars/gatewala.svg',
  '/previews/gate2027/repeated_01_cover.png',
  'swiss',
  '#7C2D12',
  '["/previews/gate2027/repeated_01_cover.png"]'::jsonb,
  '/downloads/GATE_CSE_2027_Questions_GATE_Repeats_90Day.pdf',
  '/sample_downloads/GATE_CSE_2027_Questions_GATE_Repeats_FREE_SAMPLE.pdf',
  0,
  false,
  true
)
ON CONFLICT (id) DO UPDATE SET published = true;
