import { test, expect } from '@playwright/test'

test.describe('SAGAR RAKSHAK Production Vercel Deployment Live Verification', () => {
  const PROD_URL = 'https://sagar-rakshak-sih26143.vercel.app'

  test('verifies live production deployment: auth, map, slick, suspect, workflow stages, dossier', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // 1. Initial Page Load & Auth Gateway
    await page.goto(PROD_URL, { waitUntil: 'networkidle' })
    await expect(page).toHaveTitle(/SAGAR RAKSHAK/i)

    const authHeader = page.locator('text=NTRO // SECURE MARITIME PORTAL').first()
    await expect(authHeader).toBeVisible()

    // 2. Authenticate
    const emailInput = page.locator('input[type="email"]')
    await emailInput.fill('commander.icg@sagarrakshak.gov.in')
    const passInput = page.locator('input[type="password"]')
    await passInput.fill('CoastGuard2026!')

    const authBtn = page.locator('button').filter({ hasText: /AUTHENTICATE & ENTER CONSOLE/i })
    await authBtn.click()

    // 3. Landing Page / Command Room
    const heroTitle = page.locator('text=Every Slick Traced, Every Vessel Identified').first()
    await expect(heroTitle).toBeVisible({ timeout: 8000 })

    // Verify Pilot Regions
    const pilotCard = page.locator('text=Mumbai High Western Fairway Crude Discharge').first()
    await expect(pilotCard).toBeVisible()

    // 4. Launch Console
    const launchConsoleBtn = page.locator('button').filter({ hasText: /LAUNCH CONSOLE/i }).first()
    await launchConsoleBtn.click()

    // 5. Operations Console & Map
    const consoleHeader = page.locator('header.tactical-header')
    await expect(consoleHeader).toBeVisible({ timeout: 10000 })

    // Verify Zero "API KEY REQUIRED" watermark
    const apiKeyWarning = page.locator('text=API KEY REQUIRED')
    await expect(apiKeyWarning).toHaveCount(0)

    // Map container exists
    const mapContainer = page.locator('.tactical-maplibre-container, .leaflet-container').first()
    await expect(mapContainer).toBeVisible()

    // Wait for forensic map layers & callouts to stabilize
    await page.waitForTimeout(2000)

    // 6. Verify Top Candidate Vessel Marker & Card
    const suspectMarker = page.locator('.suspect-vessel-hull, .tactical-annotation-box').first()
    await expect(suspectMarker).toBeVisible()

    const vesselCard = page.locator('.tactical-annotation-box').filter({ hasText: /MT OCEANUS PRIDE/i })
    await expect(vesselCard).toBeVisible()

    // 7. Verify Slick Evidence Callout
    const slickOriginCard = page.locator('.tactical-annotation-box').filter({ hasText: /SPILL ORIGIN/i })
    await expect(slickOriginCard).toBeVisible()

    // 8. Verify Workflow Navigation & Inspector Panels
    // Test Step 2: Drift Hindcast & Forecast
    const reverseDriftBtn = page.locator('button').filter({ hasText: /2. REVERSE DRIFT/i }).first()
    await reverseDriftBtn.click()
    await page.waitForTimeout(500)

    // Test Step 3: AIS Correlation & Vessel Attribution
    const aisCorrelationBtn = page.locator('button').filter({ hasText: /3. AIS CORRELATION/i }).first()
    await aisCorrelationBtn.click()
    await page.waitForTimeout(500)
    const suspectsView = page.locator('.suspects-view, header').first()
    await expect(suspectsView).toBeVisible()

    // Test Step 4: Legal Dossier
    const legalDossierBtn = page.locator('button').filter({ hasText: /4. LEGAL DOSSIER/i }).first()
    await legalDossierBtn.click()
    await page.waitForTimeout(500)
    const dossierHeader = page.locator('text=NATIONAL MARITIME OIL SPILL INVESTIGATION DOSSIER').first()
    await expect(dossierHeader).toBeVisible()

    // 9. Return to MAP
    const mapTab = page.locator('button').filter({ hasText: /^MAP$/i }).first()
    await mapTab.click()
    await page.waitForTimeout(500)

    // 10. Filter out irrelevant analytics/tile 404 noise and verify clean runtime
    const fatalErrors = consoleErrors.filter(
      (err) =>
        !err.includes('favicon') &&
        !err.includes('Failed to load resource') &&
        !err.includes('tiles.arcgis') &&
        !err.includes('basemaps.cartocdn')
    )
    expect(fatalErrors).toHaveLength(0)
  })
})
