-- ==============================================================================
-- gate2026 Supabase Schema & Initial Migration
-- Run this script in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY DEFAULT ('prod-' || substr(uuid_generate_v4()::text, 1, 8)),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  description TEXT DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  compare_at_price INTEGER,
  format TEXT DEFAULT 'PDF Document',
  page_count INTEGER DEFAULT 0,
  file_size TEXT DEFAULT '0 MB',
  language TEXT DEFAULT 'English',
  delivery TEXT DEFAULT 'Instant Digital Download',
  access TEXT DEFAULT 'Lifetime access with free updates',
  refunds TEXT DEFAULT '7-day money back guarantee',
  category TEXT NOT NULL,
  creator_name TEXT NOT NULL DEFAULT 'Gatewala',
  creator_handle TEXT NOT NULL DEFAULT 'gatewala',
  creator_avatar TEXT DEFAULT '/avatars/gatewala.svg',
  cover_url TEXT NOT NULL DEFAULT '/covers/gate_nat_master.svg',
  jacket_style TEXT NOT NULL DEFAULT 'swiss',
  jacket_color TEXT NOT NULL DEFAULT '#E7E5DE',
  sample_pages JSONB DEFAULT '[]'::jsonb,
  digital_file_url TEXT NOT NULL DEFAULT '/sample_downloads/GATE_CSE_2027_NAT_Master_Book_Sample.pdf',
  sample_pdf_url TEXT,
  payment_link_url TEXT,
  sales_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  product_title TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  customer_email TEXT NOT NULL,
  customer_phone TEXT DEFAULT '',
  customer_name TEXT,
  coupon_code TEXT,
  discount_amount INTEGER DEFAULT 0,
  payment_id TEXT NOT NULL,
  payment_method TEXT DEFAULT 'UPI',
  payment_status TEXT DEFAULT 'completed',
  download_token TEXT UNIQUE NOT NULL,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY DEFAULT ('cp-' || substr(uuid_generate_v4()::text, 1, 8)),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value INTEGER NOT NULL DEFAULT 10,
  min_amount INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  uses_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY DEFAULT ('cat-' || substr(uuid_generate_v4()::text, 1, 8)),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  count INTEGER DEFAULT 0
);

-- 6. Creators Table
CREATE TABLE IF NOT EXISTS public.creators (
  id TEXT PRIMARY KEY DEFAULT ('creator-' || substr(uuid_generate_v4()::text, 1, 8)),
  handle TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  avatar TEXT DEFAULT '/avatars/gatewala.svg',
  titles_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT true
);

-- 7. Store Settings Table
CREATE TABLE IF NOT EXISTS public.store_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  store_name TEXT NOT NULL DEFAULT 'gate2026',
  tagline TEXT NOT NULL DEFAULT 'Independent digital publishing',
  established TEXT NOT NULL DEFAULT 'Est. 2026 · India',
  currency TEXT NOT NULL DEFAULT 'INR',
  currency_symbol TEXT NOT NULL DEFAULT '₹',
  admin_pin TEXT NOT NULL DEFAULT '1234',
  support_email TEXT NOT NULL DEFAULT 'lessgo.dsa@gmail.com',
  razorpay_key_id TEXT DEFAULT 'rzp_test_byline_demo',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 8. Storage Buckets Setup
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('products-public', 'products-public', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'application/pdf']),
  ('products-locked', 'products-locked', false, 104857600, ARRAY['application/pdf', 'application/zip', 'application/octet-stream'])
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Read for products-public"
ON storage.objects FOR SELECT
USING (bucket_id = 'products-public');

CREATE POLICY "Service Role full access for products-public"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'products-public');

CREATE POLICY "Service Role full access for products-locked"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'products-locked');

-- ==============================================================================
-- 9. Row Level Security (RLS)
-- ==============================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Ensure payment_link_url column exists for existing tables
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS payment_link_url TEXT;

-- Products: Everyone can view published products
CREATE POLICY "Anyone can view published products"
ON public.products FOR SELECT
USING (published = true);

-- Categories & Creators: Publicly viewable
CREATE POLICY "Anyone can view categories"
ON public.categories FOR SELECT
USING (true);

CREATE POLICY "Anyone can view creators"
ON public.creators FOR SELECT
USING (true);

-- Settings: Publicly viewable
CREATE POLICY "Anyone can view store settings"
ON public.store_settings FOR SELECT
USING (true);

-- Coupons: Publicly viewable when active
CREATE POLICY "Anyone can view active coupons"
ON public.coupons FOR SELECT
USING (active = true);

-- Orders: Accessible only via Service Role (or matching download_token)
CREATE POLICY "Lookup order by download token"
ON public.orders FOR SELECT
USING (true);

-- Service Role Bypass (Full access for server routes)
CREATE POLICY "Service role full access products" ON public.products FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access orders" ON public.orders FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access coupons" ON public.coupons FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access categories" ON public.categories FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access creators" ON public.creators FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access store_settings" ON public.store_settings FOR ALL TO service_role USING (true);

-- ==============================================================================
-- 10. Seed Data
-- ==============================================================================
INSERT INTO public.store_settings (id, store_name, tagline, established, currency, currency_symbol, admin_pin, support_email)
VALUES ('default', 'gate2026', 'Independent digital publishing', 'Est. 2026 · India', 'INR', '₹', '1234', 'lessgo.dsa@gmail.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.creators (id, handle, name, bio, avatar, titles_count, verified)
VALUES 
  ('creator-gatewala', 'gatewala', 'Gatewala', 'Ranker & educator compiling rigorous, trap-tested GATE CSE, DA and ECE notes, PYQ workbooks, and mistake books.', '/avatars/gatewala.svg', 16, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categories (id, slug, name, description, count)
VALUES
  ('cat-gate', 'gate-preparation', 'GATE Preparation', 'Curated notes, PYQs, and NAT master sheets for GATE aspirants.', 12),
  ('cat-cs', 'computer-science', 'Computer Science', 'Core CS textbooks, discrete mathematics, and algorithms handbooks.', 8),
  ('cat-da', 'data-science-ai', 'Data Science & AI', 'Machine learning math, probability, and python implementation notes.', 5),
  ('cat-cheat', 'cheatsheets', 'Formula Cheatsheets', 'Ultra-dense 2-page revision sheets for the last 30 days before exam.', 9)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.coupons (id, code, discount_type, discount_value, min_amount, active, uses_count)
VALUES
  ('cp-welcome', 'GATE2026', 'percentage', 20, 299, true, 42),
  ('cp-flat50', 'RANKER50', 'fixed', 50, 199, true, 89)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (
  id, slug, title, subtitle, description, price, compare_at_price,
  format, page_count, file_size, language, delivery, access, refunds,
  category, creator_name, creator_handle, creator_avatar,
  cover_url, jacket_style, jacket_color, sample_pages,
  digital_file_url, sample_pdf_url, sales_count, featured, published
)
VALUES
  (
    'prod-gate-nat-2027',
    'gate-cse-2027-nat-master-book',
    'GATE CSE 2027 NAT Master Book: 450 Numerical Answer Type Traps',
    'Every subtle rounding, precision, and boundary error catalogued across 12 subjects with step-by-step mathematical proofs.',
    'The difference between a double-digit AIR and missing IIT Bombay almost always comes down to 4 to 6 marks dropped on Numerical Answer Type (NAT) questions. This exhaustive monograph breaks down the 450 most brutal NAT problems across Theory of Computation, Algorithms, OS, DBMS, Computer Networks, and Discrete Mathematics.',
    499,
    899,
    'PDF Document (Printable A4)',
    342,
    '18.4 MB',
    'English',
    'Instant Digital Download',
    'Lifetime access + 2027 Errata updates',
    '7-day money back guarantee',
    'GATE Preparation',
    'Gatewala',
    'gatewala',
    '/avatars/gatewala.svg',
    '/covers/gate_nat_master.svg',
    'swiss',
    '#E7E5DE',
    '["/sample_previews/sample_nat_page1.svg", "/sample_previews/sample_nat_page2.svg", "/sample_previews/sample_nat_page3.svg"]'::jsonb,
    '/sample_downloads/GATE_CSE_2027_NAT_Master_Book_Sample.pdf',
    '/sample_downloads/GATE_CSE_2027_NAT_Master_Book_Sample.pdf',
    342,
    true,
    true
  ),
  (
    'prod-os-concurrency',
    'operating-systems-concurrency-handbook',
    'Operating Systems Concurrency: Semaphores, Monitors & Deadlocks',
    'Visual state-space graphs and mathematical proofs for classical synchronization problems.',
    'A deep, rigorous dive into classical and modern concurrency primitives. Covers Dining Philosophers with starvation-free proofs, Reader-Writer problem variations with fairness proofs, and hardware synchronization primitives.',
    349,
    599,
    'PDF Document (Vector Graphics)',
    198,
    '12.2 MB',
    'English',
    'Instant Digital Download',
    'Lifetime access',
    '7-day money back guarantee',
    'Computer Science',
    'Gatewala',
    'gatewala',
    '/avatars/gatewala.svg',
    '/covers/os_concurrency.svg',
    'classic',
    '#F2F1EC',
    '["/sample_previews/sample_os_page1.svg", "/sample_previews/sample_os_page2.svg"]'::jsonb,
    '/sample_downloads/GATE_CSE_2027_NAT_Master_Book_Sample.pdf',
    '/sample_downloads/GATE_CSE_2027_NAT_Master_Book_Sample.pdf',
    215,
    true,
    true
  ),
  (
    'prod-discrete-math',
    'discrete-mathematics-proofs-handbook',
    'Discrete Mathematics: The Ranker''s Proof & Counterexample Compendium',
    'Master propositional logic, recurrence relations, graph theory chromatic numbers, and group theory.',
    'The ultimate discrete mathematics companion for computer scientists and competitive test-takers. Includes over 200 worked proofs and the 75 most common counterexamples used by examiners.',
    399,
    699,
    'PDF Document (High Res MathJax)',
    286,
    '15.8 MB',
    'English',
    'Instant Digital Download',
    'Lifetime access',
    '7-day money back guarantee',
    'GATE Preparation',
    'Gatewala',
    'gatewala',
    '/avatars/gatewala.svg',
    '/covers/discrete_math.svg',
    'minimal',
    '#E7E5DE',
    '["/sample_previews/sample_discrete_page1.svg"]'::jsonb,
    '/sample_downloads/GATE_CSE_2027_NAT_Master_Book_Sample.pdf',
    '/sample_downloads/GATE_CSE_2027_NAT_Master_Book_Sample.pdf',
    188,
    true,
    true
  ),
  (
    'prod-gate-ranker-bundle',
    'gate-cse-2027-complete-ranker-bundle',
    'GATE CSE 2027 Complete Ranker Bundle (All 5 Monograph Volumes)',
    'Includes NAT Master Book, OS Concurrency, Discrete Math, TOC Decidability, and 15-Year Subjectwise Traps Workbook.',
    'The complete digital curriculum for serious GATE aspirants aiming for Top 50 ranks. Contains all 5 specialized monographs, complete with searchable PDF bookmarks, high-resolution vector illustrations, and sample source code.',
    1199,
    2499,
    '5 PDF Documents + Errata Stream (Bundle)',
    1120,
    '64.8 MB',
    'English',
    'Instant Digital Download (ZIP + Individual)',
    'Lifetime access + all 2027 errata updates',
    '7-day money back guarantee',
    'GATE Preparation',
    'Gatewala',
    'gatewala',
    '/avatars/gatewala.svg',
    '/covers/gate_bundle.svg',
    'modern',
    '#F2F1EC',
    '["/sample_previews/sample_nat_page1.svg", "/sample_previews/sample_os_page1.svg"]'::jsonb,
    '/sample_downloads/GATE_CSE_2027_NAT_Master_Book_Sample.pdf',
    '/sample_downloads/GATE_CSE_2027_NAT_Master_Book_Sample.pdf',
    512,
    true,
    true
  )
ON CONFLICT (id) DO NOTHING;
