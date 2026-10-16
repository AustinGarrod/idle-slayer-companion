// Builds the claude.ai/design input package at .design-sync/.cache/ds-pkg/:
//   data/      sample catalogs with icons inlined as data URIs
//   index.js   ESM bundle of .design-sync/ds-entry.ts (npm JavaScript external)
//   index.css  every stylesheet the entry imports, fonts copied beside it
//   types/     tsc declarations for the entry
// Run from the repo root after staging the converter (.ds-sync/ with esbuild).
// Analytics and PWA imports resolve to .design-sync/stubs/ so designs never
// transmit events or register a service worker.
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const out = join(here, '.cache', 'ds-pkg')
const esbuild = createRequire(join(root, '.ds-sync', 'package.json'))('esbuild')

rmSync(out, { recursive: true, force: true })
mkdirSync(join(out, 'data'), { recursive: true })

const dataUri = (path) => `data:image/png;base64,${readFileSync(join(root, 'public', path.replace(/^\//, ''))).toString('base64')}`

// Full Ascension catalog: the map components need its complete graph.
const catalog = JSON.parse(readFileSync(join(root, 'public', 'catalog.json'), 'utf8'))
for (const upgrade of catalog.upgrades) if (upgrade.icon) upgrade.icon = dataUri(upgrade.icon)
writeFileSync(join(out, 'data', 'sample-catalog.json'), JSON.stringify(catalog))

// Companion subset: the first entries with icons per system, plus every material
// so recipes and shopping lists resolve.
const companion = JSON.parse(readFileSync(join(root, 'public', 'companion-catalog.json'), 'utf8'))
const quota = { achievement: 12, craft: 12, material: Infinity, quest: 10, village: 8, enemy: 10, divinity: 10 }
const taken = {}
const entities = companion.entities.filter((entity) => {
  if (!entity.icon && entity.system !== 'village') return false
  taken[entity.system] = (taken[entity.system] ?? 0) + 1
  return taken[entity.system] <= (quota[entity.system] ?? 0)
}).map((entity) => entity.icon ? { ...entity, icon: dataUri(entity.icon) } : entity)
writeFileSync(join(out, 'data', 'sample-companion.json'), JSON.stringify({ ...companion, entities }))

writeFileSync(join(out, 'package.json'), JSON.stringify({
  name: 'idle-slayer-companion',
  version: JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version,
  type: 'module',
  module: 'index.js',
  types: 'types/.design-sync/ds-entry.d.ts',
}, null, 2))

// Declarations only; the repo's app tsconfig supplies strictness and vite types.
writeFileSync(join(out, 'tsconfig.json'), JSON.stringify({
  extends: '../../../tsconfig.app.json',
  compilerOptions: {
    noEmit: false, declaration: true, emitDeclarationOnly: true,
    outDir: './types', rootDir: '../../..', tsBuildInfoFile: null,
    noUnusedLocals: false, noUnusedParameters: false,
  },
  files: ['../../ds-entry.ts', '../../../src/vite-env.d.ts'].filter((file) => {
    try { readFileSync(join(out, file)); return true } catch { return false }
  }),
  include: [],
}, null, 2))
execFileSync(process.execPath, [join(root, 'node_modules', 'typescript', 'bin', 'tsc'), '-p', join(out, 'tsconfig.json')], { stdio: 'inherit' })

const stubs = {
  name: 'design-stubs',
  setup(build) {
    build.onResolve({ filter: /^\.\.?\/(analytics|pwa)$/ }, (args) => {
      if (!args.importer.startsWith(join(root, 'src'))) return undefined
      return { path: join(here, 'stubs', `${args.path.split('/').pop()}.ts`) }
    })
    // npm JavaScript stays external: the converter re-bundles index.js with its
    // React shim, which CommonJS dependencies need. Package CSS is inlined here.
    build.onResolve({ filter: /^(@[\w.-]+\/)?[\w.-]+(\/.*)?$/ }, (args) => args.kind === 'entry-point' || args.path.startsWith('.') || /^[A-Za-z]:/.test(args.path) || args.path.endsWith('.css') ? undefined : { path: args.path, external: true })
  },
}
await esbuild.build({
  entryPoints: { index: join(here, 'ds-entry.ts') },
  outdir: out,
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  jsx: 'automatic',
  define: { 'import.meta.env.BASE_URL': '""', 'import.meta.env.PROD': 'true' },
  loader: { '.woff2': 'file', '.woff': 'file', '.png': 'dataurl', '.svg': 'dataurl' },
  assetNames: 'fonts/[name]',
  plugins: [stubs],
  legalComments: 'none',
  logLevel: 'warning',
})
console.log(`design-sync package built at ${out}`)
