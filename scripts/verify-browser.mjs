import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright')
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const errors = []
page.on('pageerror', error => errors.push(error.message))
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 12)
const url = process.env.CHAOS_URL || 'http://127.0.0.1:5173'
await mkdir('dist/verification', { recursive: true })
try {
  await page.goto(url)
  await page.clock.install()
  assert.equal(await page.getByRole('button', { name: /Deploy$/ }).isDisabled(), true)
  async function deploy(task) {
    await page.locator('.composer-input').fill(task)
    await page.getByRole('button', { name: /Deploy$/ }).click()
  }
  async function snapshot() {
    return {
      dialogue: await page.locator('.event-system, .event-climax, .bubble:not(.bubble-typing)').allTextContents(),
      speakers: await page.locator('.msg-name').allTextContents(),
      postmortem: await page.locator('.postmortem-card').innerText(),
    }
  }
  async function fullRun(task) {
    await deploy(task)
    let interventions = 0
    for (let tick = 0; tick < 120 && !await page.locator('.postmortem-card').count(); tick++) {
      if (await page.locator('.intervention-bar').count()) {
        // Exercise both generic reactions and the existing preset stat changes.
        if (interventions++ % 2 === 0) {
          await page.locator('.composer-input').fill('please continue')
          await page.getByRole('button', { name: 'Send', exact: true }).click()
        } else {
          await page.getByRole('button', { name: 'Please just do the task.', exact: true }).click()
        }
      }
      await page.clock.runFor(3000)
    }
    assert.ok(await page.locator('.postmortem-card').count(), 'full playback completes')
    assert.ok(interventions >= 2, 'interventions reached')
    assert.equal(await page.locator('.event-climax').count(), 1)
    const output = await snapshot()
    const identity = await page.evaluate(async task => {
      const { buildIncident } = await import('/src/engine/buildIncident.js')
      const { seed, canonicalTaskKey } = buildIncident(task)
      return { seed, canonicalTaskKey }
    }, task)
    return { ...identity, dialogue: hash([output.dialogue, output.speakers]), postmortem: hash(output.postmortem), output }
  }
  const a1 = await fullRun('Center the login button')
  await page.screenshot({ animations: 'disabled', path: 'dist/verification/desktop.png' })
  await page.getByRole('button', { name: /New Incident/ }).click()
  const a2 = await fullRun('Center the login button')
  assert.deepEqual(a2, a1, 'reset plus rerun matches every displayed line and postmortem')
  await page.getByRole('button', { name: /New Incident/ }).click()
  const b = await fullRun('Fix a typo in the footer')
  assert.notEqual(b.dialogue, a1.dialogue)
  await page.getByRole('button', { name: /New Incident/ }).click()
  await deploy('zzzz')
  await page.getByRole('button', { name: 'Skip to end', exact: true }).click()
  assert.equal((await page.locator('.postmortem-card .pinned-category').innerText()).toLowerCase(), 'generic')
  const generic = await snapshot()
  await page.getByRole('button', { name: /New Incident/ }).click()
  await deploy('Center the login button')
  await page.getByRole('button', { name: 'Abort', exact: true }).click()
  await page.clock.runFor(10000)
  assert.equal(await page.locator('.bubble, .event-system').count(), 0, 'abort cancels pending events')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ animations: 'disabled', path: 'dist/verification/mobile-idle.png' })
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'mobile has no horizontal overflow')
  await deploy('zzzz')
  await page.getByRole('button', { name: 'Skip to end', exact: true }).click()
  assert.deepEqual(await snapshot(), generic, 'skip replay matches')
  await page.screenshot({ animations: 'disabled', path: 'dist/verification/mobile-postmortem.png' })
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'mobile postmortem fits')
  assert.deepEqual(errors, [])
  console.log(JSON.stringify({ runs: [a1, a2, b].map(({ output: _output, ...summary }) => summary), resetMatch: true, differentTasks: true, genericFallback: true, abortCleanup: true, mobile: '390x844; no overflow', consoleErrors: errors }, null, 2))
} finally {
  await browser.close()
}
