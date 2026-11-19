const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'byline_db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const ultimateBundle = {
  id: "prod-gate-2027-ultimate-bundle",
  slug: "gate-cse-2027-ultimate-mock-series-repeated-patterns-bundle",
  title: "GATE CSE 2027 Ultimate Predicted Mock Test Series & Repeated Patterns Bundle",
  subtitle: "10 Full-Length Predicted Mock Tests + 10 Complete Worked Solutions + 90-Day Repeated Patterns Compendium + Offline TCS iON CBT Simulator",
  description: `GATE CSE 2027 · ULTIMATE RANKER PREDICTED MOCK SERIES & HIGH-YIELD REPEATED PATTERNS BUNDLE

The most comprehensive, exam-calibrated preparation arsenal ever assembled for GATE CSE 2027 aspirants. Designed to simulate the real IISc/IIT exam difficulty, calibrate speed under negative marking pressure, and eliminate costly NAT/MSQ traps.

📦 WHAT IS INCLUDED IN THIS BUNDLE (29.9 MB ZIP):

1. 💻 OFFLINE TCS iON CBT EXAM SIMULATOR (HTML)
• Run full 180-minute simulations completely offline in any web browser (Chrome, Brave, Edge, Firefox).
• Authentic TCS iON user interface matching the official GATE exam screen.
• Built-in official GATE Scientific Virtual Calculator.
• Interactive question palette with status indicators (Answered, Not Answered, Marked for Review, Answered & Marked for Review).
• Instant diagnostic scorecard upon submission: total marks, subject-wise breakdown, negative marking audit, and question-by-question explanations.

2. 📑 10 FULL-LENGTH PREDICTED MOCK TEST PAPERS (10 INDIVIDUAL PDFs)
• Exactly 65 questions per mock (10 General Aptitude + 55 Core Computer Science & Discrete Mathematics).
• Rigorously calibrated weightage matching recent IISc Bangalore and IIT trends.
• High-discrimination Multiple Select Questions (MSQ) and Numerical Answer Type (NAT) problems designed to catch rounding and unit errors.
• Clean, printable typography formatted for timed physical exam practice.

3. 📖 10 COMPREHENSIVE WORKED SOLUTION MANUALS (10 INDIVIDUAL PDFs)
• Detailed step-by-step derivations for every single question.
• Multi-approach solutions: Standard textbook methods alongside fast exam-hall shortcuts.
• "Common Aspirant Pitfalls" highlighted for tricky algorithm, OS synchronization, and cache memory questions.

4. 📚 MASTER 10-MOCK PREDICTED EXAM COMPENDIUM (400+ PAGES SINGLE VOLUME PDF)
• All 10 Predicted Mock Tests and their complete solutions bound into a single, unified, hyperlinked master book.
• Ideal for tablet, iPad, or laptop revision with interactive table of contents.

5. 🎯 QUESTIONS GATE REPEATS: 90-DAY HIGH-YIELD MONOGRAPH (380 PAGES PDF)
• 60 recurring question archetypes ranked by frequency across 35 years of GATE CSE papers (1990–2026).
• Tier-S High-Yield Topics: Pipeline throughput, Graph theory counts, Eigenvalue invariants, Cache hit ratios, Relational Algebra queries, and Virtual Memory paging.
• NAT Round-Off Trap Warnings & 2-page rapid formula revision sheet.

🎯 WHO THIS BUNDLE IS FOR:
• Aspirants aiming for AIR < 100 in GATE CSE 2027.
• Students who know theory but lose 10–15 marks to time management, MSQ traps, or NAT calculator errors.
• Anyone looking for genuine, IIT-level predicted test papers rather than outdated generic coaching material.

⚡ INSTANT ACCESS & GUARANTEE:
• Download the complete 29.9 MB ZIP bundle immediately upon checkout.
• Lifetime personal access — save across all your devices.
• 7-day money-back guarantee if files are corrupt or not as described.`,
  price: 799,
  compareAtPrice: 1999,
  format: "Complete Bundle · 22 PDFs + Offline TCS iON CBT Simulator",
  pageCount: 850,
  fileSize: "29.9 MB ZIP",
  language: "English",
  delivery: "Download ZIP to your device immediately after payment",
  access: "Lifetime access with free future updates",
  refunds: "7 days if files are faulty or corrupted",
  category: "GATE Preparation",
  creatorName: "Gatewala",
  creatorHandle: "gatewala",
  creatorAvatar: "/avatars/gatewala.svg",
  coverUrl: "/previews/gate2027/01_mock_series_cover.png",
  jacketStyle: "swiss",
  jacketColor: "#1E3A8A",
  samplePages: [
    "/previews/gate2027/01_mock_series_cover.png",
    "/previews/gate2027/02_master_toc_calibration.png",
    "/previews/gate2027/03_mock01_question_paper_svg.png",
    "/previews/gate2027/05_mock01_worked_solutions.png",
    "/previews/gate2027/07_cbt_tcs_ion_exam_screen.png",
    "/previews/gate2027/08_cbt_analytics_review.png",
    "/previews/gate2027/repeated_02_roadmap.png",
    "/previews/gate2027/repeated_03_tier_s.png"
  ],
  digitalFileUrl: "/downloads/GATE_CSE_2027_Ultimate_Ranker_Mock_Bundle.zip",
  samplePdfUrl: "/sample_downloads/GATE_CSE_2027_Mock_01_FREE_SAMPLE.pdf",
  salesCount: 0,
  featured: true,
  published: true,
  createdAt: "2026-11-19T10:00:00.000Z",
  updatedAt: "2026-11-19T10:00:00.000Z"
};

const mockSeriesStandalone = {
  id: "prod-gate-2027-mocks-cbt",
  slug: "gate-cse-2027-10-predicted-mocks-cbt-simulator",
  title: "GATE CSE 2027 · 10 Predicted Full-Length Mock Papers & CBT Simulator",
  subtitle: "10 Realistic Mock Papers (650 Qs) + 10 Detailed Step-by-Step Solution Volumes + Offline TCS iON CBT Exam Engine",
  description: `GATE CSE 2027 · 10 PREDICTED FULL-LENGTH MOCKS + OFFLINE CBT SIMULATOR

Includes all 10 Predicted Question Papers, 10 detailed Solution Volumes, Master 10-Mock Book, and the interactive Offline TCS iON Exam Simulator engine.

• 10 Predicted Full-length Mocks (65 Qs each = 650 IIT-level problems)
• 10 Comprehensive Step-by-Step Solution PDFs
• Offline TCS iON Exam Simulator (works in any browser without internet)
• Built-in virtual scientific calculator & diagnostic post-exam analysis
• Instant download immediately after payment`,
  price: 499,
  compareAtPrice: 999,
  format: "ZIP Pack · 21 PDFs + Offline CBT Simulator",
  pageCount: 450,
  fileSize: "23.5 MB ZIP",
  language: "English",
  delivery: "Download ZIP immediately after payment",
  access: "Lifetime access",
  refunds: "7 days if files are faulty or corrupted",
  category: "GATE Preparation",
  creatorName: "Gatewala",
  creatorHandle: "gatewala",
  creatorAvatar: "/avatars/gatewala.svg",
  coverUrl: "/previews/gate2027/01_mock_series_cover.png",
  jacketStyle: "swiss",
  jacketColor: "#2563EB",
  samplePages: [
    "/previews/gate2027/01_mock_series_cover.png",
    "/previews/gate2027/02_master_toc_calibration.png",
    "/previews/gate2027/03_mock01_question_paper_svg.png",
    "/previews/gate2027/04_mock01_answer_key_map.png",
    "/previews/gate2027/05_mock01_worked_solutions.png",
    "/previews/gate2027/07_cbt_tcs_ion_exam_screen.png"
  ],
  digitalFileUrl: "/downloads/GATE_CSE_2027_Ultimate_Ranker_Mock_Bundle.zip",
  samplePdfUrl: "/sample_downloads/GATE_CSE_2027_Mock_01_FREE_SAMPLE.pdf",
  salesCount: 0,
  featured: false,
  published: true,
  createdAt: "2026-11-19T10:00:00.000Z",
  updatedAt: "2026-11-19T10:00:00.000Z"
};

const repeatedPatterns = {
  id: "prod-gate-2027-repeated-patterns",
  slug: "gate-cse-2027-questions-gate-repeats-90day",
  title: "Questions GATE Repeats: 90-Day High-Yield Blueprint (GATE CSE 2027)",
  subtitle: "Every Recurring Question Pattern Ranked by Frequency Across 35 Years of GATE CSE with Trap Warnings & Formula Revision Sheet",
  description: `QUESTIONS GATE REPEATS: 90-DAY HIGH-YIELD BLUEPRINT (GATE CSE 2027)

Stop studying blindly. Over 65% of GATE marks come from 60 recurring question patterns. This 380-page compendium analyzes 35 years of official GATE CSE papers to isolate every recurring archetype.

• 60 High-Frequency Question Blueprints ranked by appearance count
• Tier-S Focus: Cache Mapping, Virtual Memory, Pipeline Hazards, Eigenvalues, Graph Theory
• NAT Trap Warnings: Decimal rounding traps, unit conversions, and calculator pitfalls
• 2-Page Formula Revision Cheatsheet included
• High-resolution digital PDF for phone, tablet, and desktop`,
  price: 399,
  compareAtPrice: 699,
  format: "1 PDF · 380 pages",
  pageCount: 380,
  fileSize: "12.1 MB PDF",
  language: "English",
  delivery: "Download PDF immediately after payment",
  access: "Lifetime access",
  refunds: "7 days if files are faulty or corrupted",
  category: "GATE Preparation",
  creatorName: "Gatewala",
  creatorHandle: "gatewala",
  creatorAvatar: "/avatars/gatewala.svg",
  coverUrl: "/previews/gate2027/repeated_01_cover.png",
  jacketStyle: "swiss",
  jacketColor: "#7C2D12",
  samplePages: [
    "/previews/gate2027/repeated_01_cover.png",
    "/previews/gate2027/repeated_02_roadmap.png",
    "/previews/gate2027/repeated_03_tier_s.png",
    "/previews/gate2027/repeated_05_coa_cache.png"
  ],
  digitalFileUrl: "/downloads/GATE_CSE_2027_Questions_GATE_Repeats_90Day.pdf",
  samplePdfUrl: "/sample_downloads/GATE_CSE_2027_Questions_GATE_Repeats_FREE_SAMPLE.pdf",
  salesCount: 0,
  featured: false,
  published: true,
  createdAt: "2026-11-19T10:00:00.000Z",
  updatedAt: "2026-11-19T10:00:00.000Z"
};

// Filter out old versions if any, and set newest
dbData.products = [
  ultimateBundle,
  mockSeriesStandalone,
  repeatedPatterns,
  ...dbData.products.filter(p => !['prod-gate-2027-ultimate-bundle', 'prod-gate-2027-mocks-cbt', 'prod-gate-2027-repeated-patterns'].includes(p.id))
];

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
console.log('byline_db.json updated with bundle products successfully!');

// Generate SQL migration for Supabase
const sql = `
-- Insert or Update GATE 2027 Bundle Products
INSERT INTO public.products (
  id, slug, title, subtitle, description, price, compare_at_price,
  format, page_count, file_size, language, delivery, access, refunds,
  category, creator_name, creator_handle, creator_avatar,
  cover_url, jacket_style, jacket_color, sample_pages,
  digital_file_url, sample_pdf_url, sales_count, featured, published
) VALUES
(
  '${ultimateBundle.id}',
  '${ultimateBundle.slug}',
  '${ultimateBundle.title.replace(/'/g, "''")}',
  '${ultimateBundle.subtitle.replace(/'/g, "''")}',
  '${ultimateBundle.description.replace(/'/g, "''")}',
  ${ultimateBundle.price},
  ${ultimateBundle.compareAtPrice},
  '${ultimateBundle.format}',
  ${ultimateBundle.pageCount},
  '${ultimateBundle.fileSize}',
  '${ultimateBundle.language}',
  '${ultimateBundle.delivery}',
  '${ultimateBundle.access}',
  '${ultimateBundle.refunds}',
  '${ultimateBundle.category}',
  '${ultimateBundle.creatorName}',
  '${ultimateBundle.creatorHandle}',
  '${ultimateBundle.creatorAvatar}',
  '${ultimateBundle.coverUrl}',
  '${ultimateBundle.jacketStyle}',
  '${ultimateBundle.jacketColor}',
  '${JSON.stringify(ultimateBundle.samplePages)}'::jsonb,
  '${ultimateBundle.digitalFileUrl}',
  '${ultimateBundle.samplePdfUrl}',
  ${ultimateBundle.salesCount},
  ${ultimateBundle.featured},
  ${ultimateBundle.published}
),
(
  '${mockSeriesStandalone.id}',
  '${mockSeriesStandalone.slug}',
  '${mockSeriesStandalone.title.replace(/'/g, "''")}',
  '${mockSeriesStandalone.subtitle.replace(/'/g, "''")}',
  '${mockSeriesStandalone.description.replace(/'/g, "''")}',
  ${mockSeriesStandalone.price},
  ${mockSeriesStandalone.compareAtPrice},
  '${mockSeriesStandalone.format}',
  ${mockSeriesStandalone.pageCount},
  '${mockSeriesStandalone.fileSize}',
  '${mockSeriesStandalone.language}',
  '${mockSeriesStandalone.delivery}',
  '${mockSeriesStandalone.access}',
  '${mockSeriesStandalone.refunds}',
  '${mockSeriesStandalone.category}',
  '${mockSeriesStandalone.creatorName}',
  '${mockSeriesStandalone.creatorHandle}',
  '${mockSeriesStandalone.creatorAvatar}',
  '${mockSeriesStandalone.coverUrl}',
  '${mockSeriesStandalone.jacketStyle}',
  '${mockSeriesStandalone.jacketColor}',
  '${JSON.stringify(mockSeriesStandalone.samplePages)}'::jsonb,
  '${mockSeriesStandalone.digitalFileUrl}',
  '${mockSeriesStandalone.samplePdfUrl}',
  ${mockSeriesStandalone.salesCount},
  ${mockSeriesStandalone.featured},
  ${mockSeriesStandalone.published}
),
(
  '${repeatedPatterns.id}',
  '${repeatedPatterns.slug}',
  '${repeatedPatterns.title.replace(/'/g, "''")}',
  '${repeatedPatterns.subtitle.replace(/'/g, "''")}',
  '${repeatedPatterns.description.replace(/'/g, "''")}',
  ${repeatedPatterns.price},
  ${repeatedPatterns.compareAtPrice},
  '${repeatedPatterns.format}',
  ${repeatedPatterns.pageCount},
  '${repeatedPatterns.fileSize}',
  '${repeatedPatterns.language}',
  '${repeatedPatterns.delivery}',
  '${repeatedPatterns.access}',
  '${repeatedPatterns.refunds}',
  '${repeatedPatterns.category}',
  '${repeatedPatterns.creatorName}',
  '${repeatedPatterns.creatorHandle}',
  '${repeatedPatterns.creatorAvatar}',
  '${repeatedPatterns.coverUrl}',
  '${repeatedPatterns.jacketStyle}',
  '${repeatedPatterns.jacketColor}',
  '${JSON.stringify(repeatedPatterns.samplePages)}'::jsonb,
  '${repeatedPatterns.digitalFileUrl}',
  '${repeatedPatterns.samplePdfUrl}',
  ${repeatedPatterns.salesCount},
  ${repeatedPatterns.featured},
  ${repeatedPatterns.published}
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  cover_url = EXCLUDED.cover_url,
  sample_pages = EXCLUDED.sample_pages,
  digital_file_url = EXCLUDED.digital_file_url,
  sample_pdf_url = EXCLUDED.sample_pdf_url,
  featured = EXCLUDED.featured,
  published = EXCLUDED.published;
`;

const sqlPath = path.join(__dirname, '..', 'supabase', 'insert_gate2027_products.sql');
fs.writeFileSync(sqlPath, sql, 'utf8');
console.log('Generated SQL migration at:', sqlPath);
