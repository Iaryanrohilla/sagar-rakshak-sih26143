import { test, expect } from '@playwright/test'

test.describe('SAGAR RAKSHAK Maritime Tactical Map Visualization & Collision Repair Verification', () => {

  // Helper to log in and get to the Tactical Operations Console
  async function enterConsole(page: any) {
    const consoleErrors: string[] = []
    page.on('console', (msg: any) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/')
    await expect(page).toHaveTitle(/SAGAR RAKSHAK/i)

    // Authenticate
    const emailInput = page.locator('input[type="email"]')
    await emailInput.fill('commander.icg@sagarrakshak.gov.in')
    const passInput = page.locator('input[type="password"]')
    await passInput.fill('CoastGuard2026!')
    const authButton = page.locator('button').filter({ hasText: /AUTHENTICATE & ENTER CONSOLE/i })
    await authButton.click()

    // Landing page: launch Mumbai High console
    const launchConsoleBtn = page.locator('button').filter({ hasText: /LAUNCH CONSOLE/i }).first()
    await expect(launchConsoleBtn).toBeVisible({ timeout: 6000 })
    await launchConsoleBtn.click()

    // Wait for Tactical Map container to load
    const mapContainer = page.locator('.map-viewport-container')
    await expect(mapContainer).toBeVisible({ timeout: 6000 })

    return consoleErrors
  }

  test('verifies zero overlap between annotations, leader lines, and interactive detailed popups', async ({ page }) => {
    const consoleErrors = await enterConsole(page)

    // Wait for annotations to be placed by the layout engine
    const originCard = page.locator('.tactical-annotation-box').filter({ hasText: /SPILL ORIGIN/i })
    const vesselCard = page.locator('.tactical-annotation-box').filter({ hasText: /MT OCEANUS PRIDE/i })
    const cpaCard = page.locator('.tactical-annotation-box').filter({ hasText: /CPA MATCH|FORENSIC INTERCEPT/i })

    await expect(originCard).toBeVisible({ timeout: 5000 })
    await expect(vesselCard).toBeVisible({ timeout: 5000 })
    await expect(cpaCard).toBeVisible({ timeout: 5000 })

    // Bounding boxes check
    const boxOrigin = await originCard.boundingBox()
    const boxVessel = await vesselCard.boundingBox()
    const boxCpa = await cpaCard.boundingBox()

    expect(boxOrigin).not.toBeNull()
    expect(boxVessel).not.toBeNull()
    expect(boxCpa).not.toBeNull()

    // Helper to test if two boxes overlap
    function checkOverlap(b1: any, b2: any) {
      return !(
        b1.x + b1.width < b2.x ||
        b1.x > b2.x + b2.width ||
        b1.y + b1.height < b2.y ||
        b1.y > b2.y + b2.height
      )
    }

    // Verify pairwise non-overlap
    expect(checkOverlap(boxOrigin, boxVessel), 'Origin and Vessel card must not overlap').toBe(false)
    expect(checkOverlap(boxOrigin, boxCpa), 'Origin and CPA card must not overlap').toBe(false)
    expect(checkOverlap(boxVessel, boxCpa), 'Vessel and CPA card must not overlap').toBe(false)

    // Verify leader lines SVG is present and has rendered paths
    const leaderLines = page.locator('.tactical-leader-lines path')
    const leaderCount = await leaderLines.count()
    expect(leaderCount).toBeGreaterThanOrEqual(3)

    // Verify Map Semantics Legend is present
    const legend = page.locator('.tactical-map-legend')
    await expect(legend).toBeVisible()
    await expect(legend).toContainText('MAP SEMANTICS')
    await expect(legend).toContainText('OIL SLICK')
    await expect(legend).toContainText('SPILL ORIGIN')
    await expect(legend).toContainText('HINDCAST')
    await expect(legend).toContainText('FORECAST')
    await expect(legend).toContainText('TOP CANDIDATE')
    await expect(legend).toContainText('CPA / INTERCEPT')

    // Test Requirement 14: Single-Active Detailed Callout Rule
    // Click Origin card -> expands Origin
    await originCard.click()
    await page.waitForTimeout(300)
    await expect(originCard.locator('button', { hasText: /Focus/i })).toBeVisible()

    // Click Vessel card -> expands Vessel, Origin minimizes
    await vesselCard.click()
    await page.waitForTimeout(300)
    await expect(vesselCard.locator('button', { hasText: /Why Suspect\?/i })).toBeVisible()
    await expect(originCard.locator('button', { hasText: /Focus/i })).toHaveCount(0)

    // Click CPA card -> expands CPA, Vessel minimizes
    await cpaCard.click()
    await page.waitForTimeout(300)
    await expect(cpaCard.locator('text=Intercept Point')).toBeVisible()
    await expect(vesselCard.locator('button', { hasText: /Why Suspect\?/i })).toHaveCount(0)

    // Check console errors
    const criticalErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('WebGL'))
    expect(criticalErrors).toEqual([])
  })

  test('verifies map layer toggles for all required layers', async ({ page }) => {
    await enterConsole(page)

    // Open Layer Manager
    const layerHudBtn = page.locator('button').filter({ hasText: /MAP LAYERS/i }).first()
    await layerHudBtn.click()

    // Verify all specified layers are present in toggles
    const layerTitles = [
      'SAR Slick Polygon',
      'Lagrangian Hindcast (T₀)',
      'Drift Forecast Cone (48h)',
      'Candidate Vessel & Track',
      'CPA Intercept & Match',
      'AIS Commercial Traffic',
      'Sensitive Ecological Zones',
      'AIS Dark Segments',
      'Animated Current Flow'
    ]

    for (const title of layerTitles) {
      const checkboxLabel = page.locator('label').filter({ hasText: title }).first()
      await expect(checkboxLabel).toBeVisible()
    }

    // Toggle Forecast off and on
    const forecastCheckbox = page.locator('label').filter({ hasText: /Drift Forecast Cone/i }).locator('input')
    await forecastCheckbox.click()
    await page.waitForTimeout(200)
    await forecastCheckbox.click()
    await page.waitForTimeout(200)

    // Toggle Candidate off and on
    const candidateCheckbox = page.locator('label').filter({ hasText: /Candidate Vessel & Track/i }).locator('input')
    await candidateCheckbox.click()
    await page.waitForTimeout(200)
    await candidateCheckbox.click()
    await page.waitForTimeout(200)
  })

  test('verifies responsive anti-collision layout at all required viewports', async ({ page }) => {
    await enterConsole(page)

    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1440, height: 900 },
      { width: 1280, height: 720 },
      { width: 1024, height: 768 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 }
    ]

    for (const vp of viewports) {
      await page.setViewportSize(vp)
      await page.waitForTimeout(500)

      const originCard = page.locator('.tactical-annotation-box').filter({ hasText: /SPILL ORIGIN/i })
      const vesselCard = page.locator('.tactical-annotation-box').filter({ hasText: /MT OCEANUS PRIDE/i })

      if (await originCard.isVisible() && await vesselCard.isVisible()) {
        const boxOrigin = await originCard.boundingBox()
        const boxVessel = await vesselCard.boundingBox()

        if (boxOrigin && boxVessel) {
          // Bounding boxes must not overlap
          const overlap = !(
            boxOrigin.x + boxOrigin.width < boxVessel.x ||
            boxOrigin.x > boxVessel.x + boxVessel.width ||
            boxOrigin.y + boxOrigin.height < boxVessel.y ||
            boxOrigin.y > boxVessel.y + boxVessel.height
          )
          expect(overlap, `Cards must not overlap at resolution ${vp.width}x${vp.height}`).toBe(false)

          // Must be within viewport
          expect(boxOrigin.x).toBeGreaterThanOrEqual(0)
          expect(boxOrigin.x + boxOrigin.width).toBeLessThanOrEqual(vp.width + 5)
          expect(boxVessel.x).toBeGreaterThanOrEqual(0)
          expect(boxVessel.x + boxVessel.width).toBeLessThanOrEqual(vp.width + 5)
        }
      }
    }
  })
})
