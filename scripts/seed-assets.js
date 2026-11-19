const fs = require('fs');
const path = require('path');

const dirs = [
  'public/covers',
  'public/samples',
  'public/avatars',
  'public/sample_downloads',
  'public/uploads',
];

dirs.forEach((dir) => {
  const full = path.join(process.cwd(), dir);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(full, { recursive: true });
  }
});

// 1. Cover SVG Generator matching Byline's Swiss/Editorial Jacket design
function generateCoverSvg(title, edition, author, accentColor, bgPattern = 'swiss') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <linearGradient id="paperGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F7F6F2" />
      <stop offset="100%" stop-color="#EAE7DE" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#DAD7CE" stroke-width="0.7" opacity="0.4"/>
    </pattern>
  </defs>

  <!-- Paper background -->
  <rect width="800" height="1000" fill="url(#paperGrad)" />
  <rect width="800" height="1000" fill="url(#grid)" />

  <!-- Spine indicator -->
  <rect x="0" y="0" width="24" height="1000" fill="#171717" opacity="0.08" />
  <line x1="24" y1="0" x2="24" y2="1000" stroke="#171717" stroke-width="1.5" opacity="0.15" />

  <!-- Top bar -->
  <line x1="60" y1="80" x2="740" y2="80" stroke="#171717" stroke-width="2" />
  <text x="60" y="65" font-family="monospace" font-size="16" fill="#171717" font-weight="600" letter-spacing="2">BYLINE PUBLISHING · INDIA</text>
  <text x="740" y="65" text-anchor="end" font-family="monospace" font-size="16" fill="#171717" font-weight="600" letter-spacing="2">${edition.toUpperCase()}</text>

  <!-- Title section -->
  <rect x="60" y="160" width="12" height="12" fill="${accentColor}" />
  <text x="82" y="172" font-family="sans-serif" font-size="14" fill="#6F6D66" font-weight="bold" letter-spacing="1.5">OFFICIAL STUDY RELEASE</text>

  <foreignObject x="60" y="210" width="680" height="350">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Georgia, serif; font-size: 56px; font-weight: 700; color: #171717; line-height: 1.1; letter-spacing: -1px;">
      ${title}
    </div>
  </foreignObject>

  <!-- Center Graphic Accent -->
  <rect x="60" y="580" width="680" height="2" fill="#DAD7CE" />
  
  <g transform="translate(60, 620)">
    <!-- Geometric editorial glyphs -->
    <rect x="0" y="0" width="120" height="120" fill="${accentColor}" opacity="0.1" stroke="${accentColor}" stroke-width="2" />
    <circle cx="60" cy="60" r="40" fill="none" stroke="${accentColor}" stroke-width="2" />
    <line x1="20" y1="60" x2="100" y2="60" stroke="${accentColor}" stroke-width="2" />
    <line x1="60" y1="20" x2="60" y2="100" stroke="${accentColor}" stroke-width="2" />

    <text x="150" y="35" font-family="sans-serif" font-size="18" font-weight="bold" fill="#171717">Verified Digital Publication</text>
    <text x="150" y="65" font-family="sans-serif" font-size="15" fill="#6F6D66">Trap-checked · Fully worked steps · Virtual calc ready</text>
    <text x="150" y="95" font-family="monospace" font-size="14" fill="#344BB0">#GATE2027 · #DIRECT_DOWNLOAD</text>
  </g>

  <!-- Bottom author & seal -->
  <line x1="60" y1="880" x2="740" y2="880" stroke="#171717" stroke-width="1.5" />
  <text x="60" y="930" font-family="sans-serif" font-size="28" font-weight="600" fill="#171717">by ${author}</text>
  <text x="60" y="960" font-family="monospace" font-size="14" fill="#6F6D66">ISSUED BY BYLINE.STORE · VERIFIED ARCHIVE</text>

  <rect x="620" y="900" width="120" height="42" rx="4" fill="#171717" />
  <text x="680" y="927" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="bold" fill="#F2F1EC">PDF EDITION</text>
</svg>`;
}

// 2. Sample Page SVG
function generateSampleSvg(pageNum, header, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
  <rect width="800" height="1100" fill="#FCFAF6" />
  <rect x="40" y="40" width="720" height="1020" fill="none" stroke="#E5E2D8" stroke-width="1" />
  
  <text x="60" y="80" font-family="monospace" font-size="13" fill="#6F6D66">BYLINE SAMPLE PREVIEW · PAGE ${pageNum}</text>
  <line x1="60" y1="95" x2="740" y2="95" stroke="#DAD7CE" stroke-width="1" />

  <text x="60" y="150" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#171717">${header}</text>
  
  <rect x="60" y="180" width="680" height="140" rx="8" fill="#F2F0E8" stroke="#DAD7CE" />
  <text x="85" y="215" font-family="monospace" font-size="14" font-weight="bold" fill="#344BB0">TYPE 04 : PIPELINE SPEEDUP &amp; LATENCY</text>
  <text x="85" y="245" font-family="sans-serif" font-size="15" fill="#171717">Years asked: 2015, 2017, 2019, 2021, 2023, 2025 (6 times)</text>
  <text x="85" y="275" font-family="sans-serif" font-size="14" fill="#6F6D66">Round-off warning: Always keep 4 decimals before final clock multiplier!</text>

  <foreignObject x="60" y="360" width="680" height="580">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: sans-serif; font-size: 16px; color: #333; line-height: 1.6;">
      <p style="font-weight: 600; color: #171717; margin-bottom: 12px;">Problem Statement (GATE CSE Official PYQ):</p>
      <p style="background: #FFF; padding: 14px; border: 1px solid #DAD7CE; border-radius: 6px; font-family: monospace; font-size: 14px;">
        Consider a 5-stage pipeline with stage latencies 120ps, 90ps, 150ps, 110ps, and 130ps. The pipeline register delay is 10ps. Calculate the speedup achieved over non-pipelined execution for 1000 tasks. Round off to 2 decimal places.
      </p>
      
      <p style="font-weight: 600; color: #171717; margin-top: 20px;">Standard Trap &amp; Solution:</p>
      <ul style="padding-left: 20px; color: #45443F;">
        <li>Non-pipelined total time = 120 + 90 + 150 + 110 + 130 = 600 ps.</li>
        <li>Pipelined clock cycle = max(120, 90, 150, 110, 130) + 10 = 150 + 10 = 160 ps.</li>
        <li>Time for 1000 tasks = (5 + 1000 - 1) * 160 ps = 1004 * 160 = 160,640 ps.</li>
        <li>Speedup = (1000 * 600) / 160,640 = 600,000 / 160,640 = <strong>3.7348...</strong></li>
        <li><strong>Final answer to enter: 3.73</strong> (Range accepted: 3.72 to 3.75)</li>
      </ul>
    </div>
  </foreignObject>

  <!-- Watermark -->
  <text x="400" y="600" text-anchor="middle" font-family="sans-serif" font-size="64" font-weight="900" fill="#171717" opacity="0.04" transform="rotate(-30 400 600)">SAMPLE PREVIEW</text>

  <line x1="60" y1="1020" x2="740" y2="1020" stroke="#DAD7CE" stroke-width="1" />
  <text x="60" y="1045" font-family="monospace" font-size="12" fill="#6F6D66">BYLINE DIGITAL PUBLISHING · ALL RIGHTS RESERVED</text>
  <text x="740" y="1045" text-anchor="end" font-family="monospace" font-size="12" fill="#6F6D66">GATEWALA EDITION</text>
</svg>`;
}

// 3. Creator Avatar
function generateAvatarSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <circle cx="100" cy="100" r="100" fill="#344BB0" />
  <text x="100" y="125" text-anchor="middle" font-family="Georgia, serif" font-size="82" font-weight="bold" fill="#F2F1EC">G</text>
</svg>`;
}

// Write files
fs.writeFileSync('public/covers/nat-master.svg', generateCoverSvg('GATE CSE 2027 NAT Master Book', 'Edition 2027', 'Gatewala', '#344BB0'));
fs.writeFileSync('public/covers/da-rescue.svg', generateCoverSvg('GATE DA 2027 90-Day Rescue Plan', 'Fast-Track', 'Gatewala', '#171717'));
fs.writeFileSync('public/covers/pyq-workbook.svg', generateCoverSvg('GATE CSE 2027 PYQ Workbook', '1999–2026', 'Gatewala', '#2F5233'));
fs.writeFileSync('public/covers/mistake-book.svg', generateCoverSvg('GATE CSE 2027 The Mistake Book', '100 Common Traps', 'Gatewala', '#8C271E'));
fs.writeFileSync('public/covers/ece-bundle.svg', generateCoverSvg('GATE ECE 2027 · The Complete Pack', '3-in-1 Bundle', 'Gatewala', '#344BB0'));

fs.writeFileSync('public/samples/sample-page-1.svg', generateSampleSvg(1, 'Methodology & Virtual Calculator Traps', ''));
fs.writeFileSync('public/samples/sample-page-2.svg', generateSampleSvg(2, 'Computer Networks & Sliding Window NATs', ''));
fs.writeFileSync('public/samples/sample-page-3.svg', generateSampleSvg(3, 'Eigenvalues & Linear Algebra Shortcuts', ''));

fs.writeFileSync('public/avatars/gatewala.svg', generateAvatarSvg());

// Create valid sample PDF files for download simulation
const samplePdfContent = `%PDF-1.4
1 0 obj
<< /Title (Byline Digital Purchase)
   /Author (Byline / Gatewala)
   /Subject (GATE Study Guide) >>
endobj
2 0 obj
<< /Type /Catalog /Pages 3 0 R >>
endobj
3 0 obj
<< /Type /Pages /Kids [4 0 R] /Count 1 >>
endobj
4 0 obj
<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R
   /Resources << /Font << /F1 6 0 R >> >> >>
endobj
5 0 obj
<< /Length 190 >>
stream
BT
/F1 24 Tf
50 720 Td
(BYLINE DIGITAL PUBLISHING - INDIA) Tj
/F1 14 Tf
0 -40 Td
(Official Purchased Document - Instant Download) Tj
0 -30 Td
(Thank you for your purchase from bylinee.store!) Tj
0 -30 Td
(Keep this file in your personal study library.) Tj
ET
endstream
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000100 00000 n 
0000000147 00000 n 
0000000204 00000 n 
0000000325 00000 n 
0000000567 00000 n 
trailer
<< /Size 7 /Root 2 0 R >>
startxref
648
%%EOF`;

const pdfFiles = [
  'GATE_CSE_2027_NAT_Master_Book_Sample.pdf',
  'GATE_DA_2027_90_Day_Rescue_Plan.pdf',
  'GATE_CSE_PYQ_Workbook_Sample.pdf',
  'GATE_Mistake_Book_Sample.pdf',
  'GATE_ECE_Complete_Pack_Sample.pdf',
];

pdfFiles.forEach((file) => {
  fs.writeFileSync(path.join('public/sample_downloads', file), samplePdfContent);
});

console.log('Successfully seeded all SVG assets and sample PDF downloads!');
