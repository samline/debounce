// The website shows each example twice: a live preview and copyable files
// (site/examples.ts) that load the browser bundle. These tests run the copyable
// files against the built bundle, so the code people copy keeps working.
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

import debounceExamples from '../../site/examples'

const bundle = (pkg: string) =>
  fileURLToPath(new URL(`../../dist/browser/${pkg}.global.js`, import.meta.url))

type Example = { id: string; files: { html: string; css?: string; js: string } }

const open = async (page: import('@playwright/test').Page, pkg: string, example: Example) => {
  await page.setContent(
    `<!doctype html><html><head><style>${example.files.css ?? ''}</style></head><body><main>${example.files.html}</main></body></html>`
  )
  await page.addScriptTag({ path: bundle(pkg) })
  await page.addScriptTag({ content: example.files.js })
}

const find = <T extends Example>(list: readonly T[], id: string) =>
  list.find(item => item.id === id)!

test.describe('debounce copyable examples', () => {
  test('search waits for quiet, flushes on Enter and cancels on Escape', async ({ page }) => {
    await open(page, 'debounce', find(debounceExamples, 'search'))
    const input = page.locator('#search')
    await input.pressSequentially('pe', { delay: 30 })
    await expect(page.locator('#status')).toHaveText('3 results for “pe”')
    await input.fill('plu')
    await input.press('Enter')
    await expect(page.locator('#status')).toHaveText('1 results for “plu”')
    await input.fill('xyz')
    await input.dispatchEvent('input')
    await input.press('Escape')
    await page.waitForTimeout(400)
    await expect(page.locator('#status')).toHaveText('1 results for “plu”')
  })

  test('autosave saves at once, then at most once per second', async ({ page }) => {
    await open(page, 'debounce', find(debounceExamples, 'autosave'))
    await page.locator('#note').pressSequentially('hello there', { delay: 20 })
    await expect(page.locator('#saved')).toHaveText(/^Saved 1 times/)
    await expect(page.locator('#saved')).toHaveText(/^Saved 2 times · 11 characters/, {
      timeout: 2000,
    })
  })

  test('progress follows the scroll position', async ({ page }) => {
    await open(page, 'debounce', find(debounceExamples, 'progress'))
    await page.locator('#article').evaluate(element => (element.scrollTop = element.scrollHeight))
    await expect(page.locator('#bar')).toHaveAttribute('aria-valuenow', '100')
  })
})
