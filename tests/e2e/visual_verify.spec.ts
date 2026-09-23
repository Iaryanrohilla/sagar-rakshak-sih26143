import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('SAGAR RAKSHAK Operations Console Layout & Visual Hierarchy Verification', () => {

  test('verifies strict zero-overlap layout, dark map rendering, and hero KPIs', async ({ page }) => {
    // 1. Authenticate
    await page.goto('/');
    await page.locator('input[type="email"]').fill('commander.icg@sagarrakshak.gov.in');
    await page.locator('input[type="password"]').fill('CoastGuard2026!');
    await page.locator('button').filter({ hasText: /AUTHENTICATE & ENTER CONSOLE/i }).click();

    // 2. Launch Operations Console from Landing Page
    const launchConsoleBtn = page.locator('button').filter({ hasText: /LAUNCH CONSOLE/i }).first();
    await expect(launchConsoleBtn).toBeVisible({ timeout: 5000 });
    await launchConsoleBtn.click();

    // Wait for console to render
    const consoleHeader = page.locator('header.tactical-header');
    await expect(consoleHeader).toBeVisible();

    // 3. Verify Hero KPIs in KPIRibbon
    const kpiRibbon = page.locator('.kpi-ribbon');
    await expect(kpiRibbon).toBeVisible();

    // AI Confidence %
    const aiConfidence = page.locator('.kpi-ribbon').filter({ hasText: /AI CONFIDENCE/i });
    await expect(aiConfidence).toHaveText(/\d+(\.\d+)?%/);

    // Spill Area
    const spillArea = page.locator('.kpi-ribbon').filter({ hasText: /SPILL AREA/i });
    await expect(spillArea).toHaveText(/\d+(\.\d+)?\s*km²/);

    // Top Suspect Match %
    const topSuspect = page.locator('.kpi-ribbon').filter({ hasText: /TOP SUSPECT MATCH/i });
    await expect(topSuspect).toHaveText(/\d+(\.\d+)?%/);

    // 4. Verify Strict Layout & Zero Overlap
    const mapBox = await page.locator('.map-hero-container').boundingBox();
    const rightPanelBox = await page.locator('.right-side-panel').boundingBox();
    const bottomTimelineBox = await page.locator('.bottom-timeline-region').boundingBox();

    expect(mapBox).not.toBeNull();
    expect(rightPanelBox).not.toBeNull();
    expect(bottomTimelineBox).not.toBeNull();

    if (mapBox && rightPanelBox && bottomTimelineBox) {
      // Right panel must have exact 420px width
      expect(Math.round(rightPanelBox.width)).toBe(420);

      // Map right edge must equal or precede right panel left edge (zero horizontal overlap)
      const mapRightEdge = mapBox.x + mapBox.width;
      expect(Math.abs(mapRightEdge - rightPanelBox.x)).toBeLessThanOrEqual(2);

      // Bottom timeline scrubber must be positioned below or at the bottom edge of middle area
      const mapBottomEdge = mapBox.y + mapBox.height;
      expect(Math.abs(mapBottomEdge - bottomTimelineBox.y)).toBeLessThanOrEqual(2);
    }

    // 5. Verify Leaflet Tile styling (No plain white inversion filter)
    const leafletContainer = page.locator('.leaflet-container');
    await expect(leafletContainer).toBeVisible();

    const tileFilter = await page.evaluate(() => {
      const tile = document.querySelector('.leaflet-tile');
      return tile ? window.getComputedStyle(tile).filter : 'none';
    });
    // Ensure tile filter is NOT invert(1)
    expect(tileFilter).not.toContain('invert(1)');

    // 6. Capture full dashboard screenshot for visual inspection
    const artifactScreenshotPath = path.resolve(
      'C:/Users/aryan/.gemini/antigravity-ide/brain/5b801a14-0dec-4cb1-b0af-94ac7b2e3a64',
      'dashboard_overhaul.png'
    );
    await page.screenshot({ path: artifactScreenshotPath, fullPage: false });

    // 7. Verify Workflow Stepper clicks stay responsive
    const reverseDriftBtn = page.locator('button').filter({ hasText: /2. REVERSE DRIFT/i }).first();
    await reverseDriftBtn.click();
    await page.waitForTimeout(300);

    const aisCorrelationBtn = page.locator('button').filter({ hasText: /3. AIS CORRELATION/i }).first();
    await aisCorrelationBtn.click();
    await page.waitForTimeout(300);

    const legalDossierBtn = page.locator('button').filter({ hasText: /4. LEGAL DOSSIER/i }).first();
    await legalDossierBtn.click();
    await page.waitForTimeout(300);
    const dossierHeader = page.locator('text=NATIONAL MARITIME OIL SPILL INVESTIGATION DOSSIER').first();
    await expect(dossierHeader).toBeVisible();
  });

});
