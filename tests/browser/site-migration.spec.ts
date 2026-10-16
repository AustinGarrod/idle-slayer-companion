import { createServer } from 'node:http'
import { readFileSync, statSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import { test, expect } from './fixtures'
import type { Catalog } from '../../src/domain/types'
import { emptyProfile } from '../../src/domain/types'
import { emptyCompanionProgress } from '../../src/domain/companion-progress'
import { COMPANION_STORAGE_KEY } from '../../src/domain/companion-storage'
import { PROFILE_STORAGE_KEY } from '../../src/domain/storage'
import { encodeProgressTransfer } from '../../src/domain/progress-transfer'

test.use({ serviceWorkers: 'allow', appServiceWorkers: true })
const root = resolve('.cache/site-migration'), legacy = '/idle-slayer-ascension-map/', companion = '/idle-slayer-companion/'
const catalog = JSON.parse(readFileSync('public/catalog.json', 'utf8')) as Catalog
const server = createServer((request, response) => {
  try {
    const path = decodeURIComponent(new URL(request.url!, 'http://localhost').pathname)
    const file = resolve(root, '.' + (path.endsWith('/') ? path + 'index.html' : path))
    if (!file.startsWith(root + sep) || !statSync(file).isFile()) throw new Error()
    const type = file.endsWith('.html') ? 'text/html' : file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.json') || file.endsWith('.webmanifest') ? 'application/json' : file.endsWith('.png') ? 'image/png' : 'application/octet-stream'
    response.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' }); response.end(readFileSync(file))
  } catch { response.writeHead(404); response.end() }
})
let origin: string
test.beforeAll(async () => {
  readFileSync(resolve(root, legacy.slice(1), 'bridge.js')) // Generate with yarn prepare:migration first.
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done))
  origin = `http://127.0.0.1:${(server.address() as { port: number }).port}`
})
test.afterAll(async () => { await new Promise<void>((done) => server.close(() => done())) })

test('old address forwards only reviewed public references and cleans arbitrary URL data', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  await page.goto(origin + legacy + '?private=synthetic-secret#upgrade=' + catalog.startId + '&catalog=' + catalog.revision)
  await expect(page).toHaveURL(origin + companion + 'ascension/')
  await expect(page.locator('.details h2')).toHaveText(catalog.upgrades.find((node) => node.id === catalog.startId)!.title)
  expect(requests.filter((url) => new URL(url).pathname.startsWith(companion)).every((url) => !url.includes('synthetic-secret'))).toBe(true)
  expect(requests.some((url) => url.includes('analytics.garrod.house'))).toBe(false)
})

test('old private map transfer reaches the existing confirmation flow without applying', async ({ page }) => {
  const profile = { ...emptyProfile(catalog.revision), epoch: 3 }
  const encoded = await encodeProgressTransfer(catalog, profile, 'native')
  if (!encoded.ok) throw new Error(encoded.error)
  await page.goto(origin + legacy + '#transfer=' + encoded.token)
  await expect(page.getByRole('dialog', { name: 'Transfer map progress', exact: true })).toBeVisible()
  await expect(page).toHaveURL(origin + companion + 'ascension/')
  expect(await page.evaluate((key) => localStorage.getItem(key), COMPANION_STORAGE_KEY)).toBeNull()
})

test('legacy and companion workers coexist; offline bridge reads and exports without writing', async ({ page, context }) => {
  test.setTimeout(90000)
  const progress = emptyCompanionProgress(catalog.revision)
  progress.ascension.purchases[catalog.startId] = { epoch: 0, active: true }
  progress.modules.material = { tracked: true, records: { 'future-material': { count: '12345678901234567890' } } }
  const stored = JSON.stringify({ format: 'idle-slayer-companion-storage', version: 1, legacyBaseline: null, progress })
  await page.addInitScript(({ key, stored }) => { if (!localStorage.getItem(key)) localStorage.setItem(key, stored) }, { key: COMPANION_STORAGE_KEY, stored })
  await page.goto(origin + companion)
  await expect(page.getByRole('main', { name: 'Overview', exact: true })).toBeVisible()
  await page.goto(origin + legacy)
  await expect(page).toHaveURL(origin + companion)
  await expect.poll(() => page.evaluate(async () => {
    const registrations = await navigator.serviceWorker.getRegistrations()
    const scopes = registrations.filter((registration) => registration.active).map((registration) => new URL(registration.scope).pathname)
    return scopes.sort()
  }), { timeout: 60000 }).toEqual([legacy, companion].sort())
  const cachesBefore = await page.evaluate(() => caches.keys())
  expect(cachesBefore.some((name) => name.startsWith('idle-slayer-companion-public-'))).toBe(true)
  expect(cachesBefore.some((name) => name.startsWith('idle-slayer-legacy-bridge-public-'))).toBe(true)
  await context.setOffline(true)
  await page.goto(origin + legacy)
  await expect(page.locator('#status')).toHaveText('You are offline. Your saved map and export remain available here.')
  await expect(page.locator('#map svg [role=button]').first()).toBeVisible()
  expect(await page.evaluate(({ key, old }) => [localStorage.getItem(key), localStorage.getItem(old)], { key: COMPANION_STORAGE_KEY, old: PROFILE_STORAGE_KEY })).toEqual([stored, null])
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export saved progress', exact: true }).click()
  const file = await (await pending).path()
  expect(JSON.parse(readFileSync(file!, 'utf8'))).toEqual(progress)
  expect((await page.evaluate(() => caches.keys())).sort()).toEqual(cachesBefore.sort())
})

test('invalid new storage never resurrects an old profile in the read-only bridge', async ({ page }) => {
  await page.addInitScript(({ key, old, profile }) => { Object.defineProperty(navigator, 'onLine', { get: () => false }); localStorage.setItem(key, 'invalid synthetic companion'); localStorage.setItem(old, JSON.stringify(profile)) }, { key: COMPANION_STORAGE_KEY, old: PROFILE_STORAGE_KEY, profile: emptyProfile(catalog.revision) })
  await page.goto(origin + legacy)
  await expect(page.locator('#status')).toContainText('Saved progress could not be safely read')
  await expect(page.getByRole('button', { name: 'Export saved progress', exact: true })).toBeDisabled()
  expect(await page.evaluate((key) => localStorage.getItem(key), COMPANION_STORAGE_KEY)).toBe('invalid synthetic companion')
})
