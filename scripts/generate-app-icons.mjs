// Original code-native journal and compass mark. No game sprites or third-party artwork.
// Run with the reviewed Playwright Chromium installed; inspect outputs before commit.
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
const browser = await chromium.launch()
mkdirSync('public/pwa', { recursive: true })
for (const [file, size, scale] of [['icon-192.png', 192, 1], ['icon-512.png', 512, 1], ['apple-touch-icon.png', 180, 1], ['maskable-512.png', 512, 0.72]]) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 })
  await page.setContent(`<style>html,body{margin:0;overflow:hidden}svg{display:block;width:100vw;height:100vh}</style><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#231e19"/><g transform="translate(256 256) scale(${scale}) translate(-256 -256)"><path d="M104 116H224L256 136L288 116H408V390H288L256 410L224 390H104Z" fill="#15120f" stroke="#d6ae61" stroke-width="16" stroke-linejoin="round"/><path d="M256 138V402M136 344H216M296 344H376M136 368H200M312 368H376" fill="none" stroke="#79603b" stroke-width="10"/><path d="M256 140L284 208L352 236L284 264L256 332L228 264L160 236L228 208Z" fill="#b860af" stroke="#f1d79b" stroke-width="10" stroke-linejoin="round"/><path d="M256 178V294M198 236H314" stroke="#d6ae61" stroke-width="8"/><path d="M256 212L280 236L256 260L232 236Z" fill="#f1d79b"/></g></svg>`)
  await page.screenshot({ path: `public/pwa/${file}` })
  await page.close()
}
await browser.close()
