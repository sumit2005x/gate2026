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
  'prod-gate-2027-ultimate-bundle',
  'gate-cse-2027-ultimate-mock-series-repeated-patterns-bundle',
  'GATE CSE 2026 / 2027 Complete Ranker Mock & Repeated Patterns Bundle',
  '10 Full-Length Predicted Mock Tests + 10 Complete Worked Solutions + 90-Day Repeated Patterns Compendium + Offline TCS iON CBT Simulator',
  'What''s Inside the Complete Bundle (22 Files · 29.9 MB ZIP):

📘 Questions GATE Repeats (90-Day Sprint Edition)
• Comprehensive coverage across all 12 core CSE subjects.
• 122 Core Question Patterns with 1,112 solved PYQs (2008–2026).
• "Trap Alert" on every pattern: Common pitfalls where students lose negative marks.
• Master Formula & Speed Sheets before every topic.

🖥️ 10 Full-Length Predicted Pattern Mock Tests (650 Original Questions)
• Strictly engineered on the official GATE CSE weightage blueprint.
• Exact proportion: 36 MCQs, 11 MSQs, and 18 NAT questions per mock.
• Zero-spoiler question papers + separate detailed step-by-step solutions compendium.

💻 Offline TCS iON CBT Simulator (Web-Based App)
• Runs directly in Chrome/Edge on any Laptop or Desktop — NO internet needed during tests.
• Features real TCS iON virtual scientific calculator, 3-hour countdown timer, section navigation, and instant score analytics.

⚡ INSTANT ACCESS & GUARANTEE:
• Download the complete 29.9 MB ZIP bundle immediately upon checkout.
• Lifetime personal access — save across all your devices.
• 7-day money-back guarantee if files are corrupt or not as described.',
  799,
  1999,
  'Complete Bundle · 22 PDFs + Offline TCS iON CBT Simulator',
  850,
  '29.9 MB ZIP',
  'English',
  'Download ZIP to your device immediately after payment',
  'Lifetime access with free future updates',
  '7 days if files are faulty or corrupted',
  'GATE Preparation',
  'Gatewala',
  'gatewala',
  '/avatars/gatewala.svg',
  '/previews/gate2027/01_mock_series_cover.png',
  'swiss',
  '#1E3A8A',
  '["/previews/gate2027/01_mock_series_cover.png","/previews/gate2027/02_master_toc_calibration.png","/previews/gate2027/03_mock01_question_paper_svg.png","/previews/gate2027/05_mock01_worked_solutions.png","/previews/gate2027/07_cbt_tcs_ion_exam_screen.png","/previews/gate2027/08_cbt_analytics_review.png","/previews/gate2027/repeated_02_roadmap.png","/previews/gate2027/repeated_03_tier_s.png"]'::jsonb,
  '/downloads/GATE_CSE_2027_Ultimate_Ranker_Mock_Bundle.zip',
  '/sample_downloads/GATE_CSE_2027_Mock_01_FREE_SAMPLE.pdf',
  0,
  true,
  true
),
(
  'prod-gate-2027-mocks-cbt',
  'gate-cse-2027-10-predicted-mocks-cbt-simulator',
  '10 Full-Length Predicted Mock Tests & CBT Simulator (GATE CSE 2026 / 2027)',
  '10 Realistic Mock Papers (650 Qs) + 10 Detailed Step-by-Step Solution Volumes + Offline TCS iON CBT Exam Engine',
  'GATE CSE 2026 / 2027 · 10 PREDICTED FULL-LENGTH MOCKS + OFFLINE CBT SIMULATOR

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
  'Questions GATE Repeats: 90-Day High-Yield Blueprint (GATE CSE 2026 / 2027)',
  '122 Recurring Question Patterns (2008–2026) with Trap Alerts & Formula Revision Sheets',
  'QUESTIONS GATE REPEATS: 90-DAY HIGH-YIELD BLUEPRINT (GATE CSE 2026 / 2027)

Stop studying blindly. Over 65% of GATE marks come from recurring question patterns. This monograph analyzes 35 years of official GATE CSE papers to isolate every recurring archetype.

• 122 High-Frequency Question Blueprints ranked by appearance count (2008–2026)
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
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  published = true;
