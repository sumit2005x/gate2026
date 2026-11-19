const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceRoot = 'D:\\projects\\gat2\\output\\Gate2027';
const staging = path.join(__dirname, '..', 'staging_bundle');
const destZip = path.join(__dirname, '..', 'public', 'downloads', 'GATE_CSE_2027_Ultimate_Ranker_Mock_Bundle.zip');

console.log('1. Cleaning staging directory...');
if (fs.existsSync(staging)) {
  fs.rmSync(staging, { recursive: true, force: true });
}
fs.mkdirSync(staging, { recursive: true });

const folders = [
  '01_TCS_iON_CBT_Simulator',
  '02_Master_Complete_Mock_Book',
  '03_Repeated_Patterns_Monograph',
  '04_Individual_Mock_Question_Papers',
  '05_Individual_Worked_Solutions'
];
for (const f of folders) {
  fs.mkdirSync(path.join(staging, f), { recursive: true });
}

console.log('2. Copying CBT Simulator...');
fs.copyFileSync(
  path.join(sourceRoot, 'mock_series_2027', 'GATE_CSE_2027_CBT_Simulator.html'),
  path.join(staging, '01_TCS_iON_CBT_Simulator', 'GATE_CSE_2027_CBT_Simulator.html')
);

console.log('3. Copying Master 10-Mock Book...');
fs.copyFileSync(
  path.join(sourceRoot, 'mock_series_2027', 'GATE_CSE_2027_10_Predicted_Mocks_Complete.pdf'),
  path.join(staging, '02_Master_Complete_Mock_Book', 'GATE_CSE_2027_10_Predicted_Mocks_Complete.pdf')
);

console.log('4. Copying Repeated Patterns Monograph...');
fs.copyFileSync(
  path.join(sourceRoot, 'GATE_CSE_2027_Questions_GATE_Repeats_90Day.pdf'),
  path.join(staging, '03_Repeated_Patterns_Monograph', 'GATE_CSE_2027_Questions_GATE_Repeats_90Day.pdf')
);

console.log('5. Copying 10 Question Papers...');
const papersDir = path.join(sourceRoot, 'mock_series_2027', 'papers');
for (const file of fs.readdirSync(papersDir)) {
  if (file.endsWith('.pdf')) {
    fs.copyFileSync(path.join(papersDir, file), path.join(staging, '04_Individual_Mock_Question_Papers', file));
  }
}

console.log('6. Copying 10 Worked Solutions...');
const solutionsDir = path.join(sourceRoot, 'mock_series_2027', 'solutions');
for (const file of fs.readdirSync(solutionsDir)) {
  if (file.endsWith('.pdf')) {
    fs.copyFileSync(path.join(solutionsDir, file), path.join(staging, '05_Individual_Worked_Solutions', file));
  }
}

console.log('7. Writing README...');
const readme = `========================================================================
  GATE CSE 2027 ULTIMATE RANKER BUNDLE — OFFICIAL PACK
  10 Predicted Mocks + 10 Worked Solutions + Repeated Patterns + CBT
========================================================================

Thank you for your purchase from gate2026!

WHAT IS INCLUDED IN YOUR BUNDLE:
------------------------------------------------------------------------
1. [01_TCS_iON_CBT_Simulator]
   - GATE_CSE_2027_CBT_Simulator.html
   - Full 180-minute TCS iON exam engine simulator with virtual scientific
     calculator, question palette (Answered, Marked for Review, Not Visited),
     instant auto-scoring, topic-wise accuracy breakdown, and detailed explanations.
   - Works 100% OFFLINE! Just double click to open in Chrome, Brave, Edge or Firefox.

2. [02_Master_Complete_Mock_Book]
   - GATE_CSE_2027_10_Predicted_Mocks_Complete.pdf (Master 400+ Page Volume)
   - Contains all 10 Predicted Full-Length Mock Papers + complete step-by-step
     worked solutions bound in one unified, searchable, printable PDF.

3. [03_Repeated_Patterns_Monograph]
   - GATE_CSE_2027_Questions_GATE_Repeats_90Day.pdf
   - The 90-Day High-Yield Blueprint: 60 recurring question blueprints ranked
     by frequency across 35 years of GATE CSE PYQs with NAT trap warnings.

4. [04_Individual_Mock_Question_Papers]
   - Mock_01 through Mock_10 Question Papers (individual clean PDFs for timed practice).

5. [05_Individual_Worked_Solutions]
   - Mock_01 through Mock_10 Worked Solutions (complete explanations for post-exam review).

HOW TO PREPARE FOR BEST RESULTS:
------------------------------------------------------------------------
Step 1: Open the CBT Simulator or print Mock_01_Question_Paper.pdf.
Step 2: Sit in an isolated 3-hour exam block (9:30 AM - 12:30 PM or 2:30 PM - 5:30 PM).
Step 3: Strictly use the on-screen virtual calculator (no physical calculator).
Step 4: After completing, open the corresponding Solutions PDF to diagnose mistakes.
Step 5: Revise identified weak topics using the Repeated Patterns Monograph.

Support & Inquiries: lessgo.dsa@gmail.com
Store: gate2026
========================================================================
`;
fs.writeFileSync(path.join(staging, '00_README_START_HERE.txt'), readme, 'utf8');

console.log('8. Compressing staging folder to zip...');
const downloadsDir = path.dirname(destZip);
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}
if (fs.existsSync(destZip)) {
  fs.unlinkSync(destZip);
}

// Compress via PowerShell System.IO.Compression.ZipFile
const psCommand = `powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${staging}', '${destZip}', [System.IO.Compression.CompressionLevel]::Optimal, $false)"`;
execSync(psCommand, { stdio: 'inherit' });

console.log('9. Cleaning up staging directory...');
fs.rmSync(staging, { recursive: true, force: true });

const stat = fs.statSync(destZip);
console.log(`SUCCESS! Bundle ZIP created at: ${destZip}`);
console.log(`Size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
