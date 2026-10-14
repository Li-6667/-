import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { legacyRoutes } from './legacy/routes.mjs';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repository = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: project, encoding: 'utf8' }).trim();
const baseline = 'd3f5945';
const prefix = '随意搭';
const staging = mkdtempSync(join(tmpdir(), 'suiyida-legacy-'));
const source = join(staging, prefix);
const archive = execFileSync('git', ['archive', baseline, prefix], { cwd: repository, maxBuffer: 64 * 1024 * 1024 });
const extracted = spawnSync('tar', ['-x', '-C', staging], { input: archive });
if (extracted.status !== 0) throw new Error('Could not extract the original site.');

for (const filename of ['next.config.mjs', 'LegacyLink.tsx', 'CompareBar.tsx']) {
  const destination = filename === 'next.config.mjs' ? source : join(source, 'components');
  cpSync(join(project, 'scripts/legacy', filename), join(destination, filename));
}
function adaptLinks(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) adaptLinks(path);
    else if (path.endsWith('.tsx')) {
      const original = readFileSync(path, 'utf8');
      writeFileSync(path, original.replaceAll("from 'next/link'", "from '@/components/LegacyLink'"));
    }
  }
}
adaptLinks(join(source, 'app'));
adaptLinks(join(source, 'components'));
const layoutPath = join(source, 'app/layout.tsx');
const layout = readFileSync(layoutPath, 'utf8')
  .replace("import './globals.css';", "import './globals.css';\nimport CompareBar from '@/components/CompareBar';")
  .replace('<Nav/>', '<CompareBar/><Nav/>');
writeFileSync(layoutPath, layout);
const stylesPath = join(source, 'app/globals.css');
writeFileSync(stylesPath, readFileSync(stylesPath, 'utf8') + `
:root{--legacy-bar-height:48px}
.legacy-compare-bar{position:sticky;top:0;z-index:60;min-height:var(--legacy-bar-height);display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 28px;background:#3f435f;color:#fff;font:12px/1.5 Arial,"Microsoft YaHei",sans-serif}
.legacy-compare-bar div{display:flex;gap:20px;white-space:nowrap}
.legacy-compare-bar a{text-decoration:underline;text-underline-offset:4px}
.legacy-compare-bar+header{top:var(--legacy-bar-height)}
@media(max-width:600px){:root{--legacy-bar-height:72px}.legacy-compare-bar{align-items:flex-start;flex-direction:column;gap:5px;padding:9px 18px}}
`);
for (const args of [['ci', '--no-audit', '--no-fund'], ['run', 'build']]) {
  const result = spawnSync('npm', args, { cwd: source, stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`Legacy build failed: npm ${args.join(' ')}`);
}
for (const route of legacyRoutes) {
  if (!existsSync(join(source, 'out', route ? `${route}.html` : 'index.html'))) {
    throw new Error(`Missing legacy route: /${route}`);
  }
}
const destination = join(project, 'public/legacy');
mkdirSync(destination, { recursive: true });
cpSync(join(source, 'out'), destination, { recursive: true });
writeFileSync(join(destination, 'manifest.json'), JSON.stringify({ baseline, routes: legacyRoutes.map(route => `/legacy${route ? `/${route}` : ''}`), note: 'Original visual and simulated interactions. Only navigation and comparison banner adapted.' }, null, 2) + '\n');
console.log(`Preserved ${legacyRoutes.length} original routes in ${destination}`);
console.log(`Build source retained for inspection: ${source}`);
