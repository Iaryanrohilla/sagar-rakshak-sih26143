import { test, expect } from '@playwright/test';

test.describe('SAGAR RAKSHAK C4I Control Room Platform E2E Tests', () => {

  test('completes full intelligence and forensic attribution user journey', async ({ page }) => {
    // 1. Load Dashboard
    await page.goto('/');
    await expect(page).toHaveTitle(/SAGAR RAKSHAK/i);

    // Verify Tactical Header and Simulation Disclosures
    const headerTitle = page.locator('header, div').filter({ hasText: /SAGAR RAKSHAK/i }).first();
    await expect(headerTitle).toBeVisible();

    const simBadge = page.locator('text=SIMULATED DATA').first();
    await expect(simBadge).toBeVisible();

    // Verify Map Canvas loaded
    const mapContainer = page.locator('.leaflet-container');
    await expect(mapContainer).toBeVisible();

    // 2. Region Switching Flow
    const regionSelect = page.locator('select[aria-label="Active Incident Scenario"]');
    await expect(regionSelect).toBeVisible();
    
    // Switch to Gulf of Kutch
    await regionSelect.selectOption('kutch-spm-sensitive');
    await expect(regionSelect).toHaveValue('kutch-spm-sensitive');

    // Switch back to Mumbai High
    await regionSelect.selectOption('mumbai-high-crude');
    await expect(regionSelect).toHaveValue('mumbai-high-crude');

    // 3. Interactive Timeline Scrubber
    const playButton = page.locator('button[aria-label*="Simulation Replay"]').first();
    await expect(playButton).toBeVisible();
    
    // Click play to animate drift timeline
    await playButton.click();
    await page.waitForTimeout(600);
    await playButton.click(); // Pause

    // Test hindcast/forecast scrubber slider
    const rangeSlider = page.locator('input[type="range"]');
    if (await rangeSlider.count() > 0) {
      await rangeSlider.first().fill('2');
      await page.waitForTimeout(300);
    }

    // 4. Navigate to Suspect Leaderboard
    const suspectsTab = page.locator('button').filter({ hasText: /VESSEL ATTRIBUTION/i }).first();
    await expect(suspectsTab).toBeVisible();
    await suspectsTab.click();

    // Verify tactical suspect cards render
    const topRank = page.locator('text=#01').first();
    await expect(topRank).toBeVisible();

    // Verify driving factor badges render (e.g. CPA, AIS GAP)
    const factorBadge = page.locator('text=/CPA|AIS GAP|COURSE/i').first();
    await expect(factorBadge).toBeVisible();

    // 5. Open Forensic "Why This Vessel?" Modal
    const whyButton = page.locator('button').filter({ hasText: /WHY THIS VESSEL/i }).first();
    await expect(whyButton).toBeVisible();
    await whyButton.click();

    // Verify explainability modal opened
    const modalHeading = page.locator('text=FORENSIC ATTRIBUTION EXPLAINABILITY').first();
    await expect(modalHeading).toBeVisible();

    // Close Explainability modal
    await page.keyboard.press('Escape');
    await expect(modalHeading).not.toBeVisible();

    // 6. Open MARPOL Annex I Forensic Dossier
    const dossierButton = page.locator('button').filter({ hasText: /DOSSIER/i }).first();
    await expect(dossierButton).toBeVisible();
    await dossierButton.click();

    // Verify Court Admissibility & SHA-256 seal
    const sha256Digest = page.locator('text=SHA-256 DIGEST:').first();
    await expect(sha256Digest).toBeVisible();

    // Close dossier modal
    const closeDossierBtn = page.locator('button[aria-label="Close Evidence Dossier"]');
    await closeDossierBtn.click();
    await expect(sha256Digest).not.toBeVisible();

    // 7. Multi-Agency Alert Workflow
    const alertsTab = page.locator('button').filter({ hasText: /AGENCY ALERTS/i }).first();
    await expect(alertsTab).toBeVisible();
    await alertsTab.click();

    const actionButton = page.locator('button').filter({ hasText: /ACKNOWLEDGE|INVESTIGATE|ESCALATE|RESOLVE/i }).first();
    if (await actionButton.isVisible()) {
      await actionButton.click();
      await page.waitForTimeout(300);
    }
  });

});
