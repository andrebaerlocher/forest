import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const reportFile = 'diagnostics_report.md';

console.log('=== Forest Component Library Diagnostics ===\n');

console.log('Syncing SvelteKit and packaging library...');
try {
  execSync('npx svelte-kit sync && npx svelte-package', { stdio: 'inherit' });
  console.log('Sync and build successful. Starting checks...\n');
} catch (error) {
  console.error('Failed to sync or build SvelteKit package!', error);
  process.exit(1);
}

const checks = [
  {
    name: 'Biome Linter & Formatter',
    cmd: 'npx @biomejs/biome check src',
    desc: 'Checks linting rules and code formatting'
  },
  {
    name: 'Svelte Check Native',
    cmd: 'npx svelte-check-native --workspace .',
    desc: 'High-performance Rust-based type checker'
  },
  {
    name: 'Svelte Doctor',
    cmd: 'npx svelte-doctor check',
    desc: 'Checks for security, dead code, and Svelte 5 patterns'
  },
  {
    name: 'Copy-Paste Detector (jscpd)',
    cmd: 'npx jscpd src/lib',
    desc: 'Checks for duplicate blocks of code'
  },
  {
    name: 'Package Exports Linter (publint)',
    cmd: 'npx publint',
    desc: 'Checks packaging format compatibility'
  }
];

let markdownReport = `# Forest Diagnostics Report\n\nGenerated on: ${new Date().toISOString()}\n\n`;
markdownReport += `| Check | Command | Status | Description |\n`;
markdownReport += `|---|---|---|---|\n`;

let overallSuccess = true;
const results = [];

for (const check of checks) {
  console.log(`Running: ${check.name}...`);
  try {
    const stdout = execSync(check.cmd, { stdio: 'pipe', encoding: 'utf-8' });
    results.push({ name: check.name, cmd: check.cmd, status: '✅ PASS', output: stdout });
    markdownReport += `| ${check.name} | \`${check.cmd}\` | ✅ PASS | ${check.desc} |\n`;
  } catch (error) {
    overallSuccess = false;
    results.push({ name: check.name, cmd: check.cmd, status: '❌ FAIL', output: error.stdout || error.message });
    markdownReport += `| ${check.name} | \`${check.cmd}\` | ❌ FAIL | ${check.desc} |\n`;
  }
}

markdownReport += `\n## Details\n\n`;

for (const res of results) {
  markdownReport += `### ${res.name} (${res.status})\n\n`;
  markdownReport += `\`\`\`text\n${res.output.trim() || 'No output'}\n\`\`\`\n\n`;
}

fs.writeFileSync(reportFile, markdownReport);
console.log(`\nDiagnostics finished. Report written to ${reportFile}`);

if (!overallSuccess) {
  console.error('\n❌ Some diagnostics failed!');
  process.exit(1);
} else {
  console.log('\n✅ All diagnostics passed!');
}
