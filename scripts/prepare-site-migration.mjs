import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { resolve, relative, sep } from 'node:path'
import { createHash } from 'node:crypto'
import { build } from 'vite'
import { validateReleaseArtifact } from './release-artifact.ts'
import { validatePwaDistribution } from './pwa.ts'

const root = process.cwd(), output = resolve(root, '.cache/site-migration'), cache = resolve(root, '.cache')
if (!output.startsWith(cache + sep) || relative(cache, output) !== 'site-migration' || (existsSync(output) && lstatSync(output).isSymbolicLink())) throw new Error('Unsafe migration output')
if (existsSync(cache) && (lstatSync(cache).isSymbolicLink() || !realpathSync(cache).startsWith(realpathSync(root) + sep))) throw new Error('Migration cache must stay within this workspace')
validateReleaseArtifact(root, resolve(root, 'dist')); validatePwaDistribution(root, resolve(root, 'dist'))
if (existsSync(output)) rmSync(output, { recursive: true })
mkdirSync(output, { recursive: true })
cpSync(resolve(root, 'dist'), resolve(output, 'idle-slayer-companion'), { recursive: true })
const legacy = resolve(output, 'idle-slayer-ascension-map')
mkdirSync(legacy)
await build({ configFile: false, logLevel: 'warn', build: { outDir: legacy, emptyOutDir: false, lib: { entry: resolve(root, 'migration/legacy-bridge.ts'), formats: ['iife'], name: 'CompanionLegacyBridge', fileName: () => 'bridge.js' } } })
cpSync(resolve(root, 'migration/legacy-index.html'), resolve(legacy, 'index.html'))
for (const file of ['catalog.json', 'manifest.webmanifest', 'pwa', 'licenses', 'assets/upgrades']) cpSync(resolve(root, 'dist', file), resolve(legacy, file), { recursive: true })
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex')
const assets = []
function walk(parent = '') { for (const entry of readdirSync(resolve(legacy, parent), { withFileTypes: true })) { const file = parent + entry.name; if (entry.isDirectory()) walk(file + '/'); else assets.push({ file, sha256: sha(readFileSync(resolve(legacy, file))) }) } }
walk(); assets.sort((a, b) => a.file.localeCompare(b.file))
const worker = readFileSync(resolve(root, 'scripts/pwa-worker.js'), 'utf8').replaceAll('idle-slayer-companion-public-', 'idle-slayer-legacy-bridge-public-')
const release = { version: sha(JSON.stringify(assets) + worker), assets }
writeFileSync(resolve(legacy, 'sw.js'), 'const RELEASE = ' + JSON.stringify(release) + ';\n' + worker)
writeFileSync(resolve(legacy, 'offline-assets.json'), JSON.stringify(release, null, 2) + '\n')
writeFileSync(resolve(output, '.nojekyll'), '')
writeFileSync(resolve(output, 'index.html'), '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="referrer" content="no-referrer"><title>Idle Slayer Companion</title><a href="/idle-slayer-companion/">Open Idle Slayer Companion</a></html>\n')
console.log('Prepared reviewed same-origin migration site at .cache/site-migration. No hosting or repository settings were changed.')
