import { test, expect } from '@playwright/test';

test.describe('SAGAR RAKSHAK Full-Stack Maritime Operations Platform E2E Tests', () => {

  test('completes full operational journey from login to legal dossier and copilot', async ({ page }) => {
    // -------------------------------------------------------------
    // STEP 1: AUTHENTICATION GATEWAY (Supabase / Maritime Ops Login)
    // -------------------------------------------------------------
    await page.goto('/');
    await expect(page).toHaveTitle(/SAGAR RAKSHAK/i);

    // Verify Auth Page rendered
    const authHeader = page.locator('text=NTRO // SECURE MARITIME PORTAL').first();
    await expect(authHeader).toBeVisible();

    const simBadge = page.locator('text=SIMULATED DATA').first();
    await expect(simBadge).toBeVisible();

    // Fill credentials & submit login
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('commander.icg@sagarrakshak.gov.in');

    const passInput = page.locator('input[type="password"]');
    await passInput.fill('CoastGuard2026!');

    const authButton = page.locator('button').filter({ hasText: /AUTHENTICATE & ENTER CONSOLE/i });
    await authButton.click();

    // -------------------------------------------------------------
    // STEP 2: LANDING / COMMAND ROOM (Telemetry, Search & Pilot Zones)
    // -------------------------------------------------------------
    // Should transition to Landing Page
    const heroTitle = page.locator('text=Every Slick Traced, Every Vessel Identified').first();
    await expect(heroTitle).toBeVisible({ timeout: 5000 });

    // Verify Persistent Telemetry Ribbon
    const telemetryHud = page.locator('text=LIVE INCIDENT RECONSTRUCTION TELEMETRY HUD').first();
    await expect(telemetryHud).toBeVisible();

    // Verify Pilot Regions
    const pilotCard = page.locator('text=Mumbai High Western Fairway Crude Discharge').first();
    await expect(pilotCard).toBeVisible();

    // Test Search input
    const searchInput = page.locator('input[placeholder*="Search by Incident ID"]');
    await searchInput.fill('INC-2026-MH');
    await page.waitForTimeout(300);

    // Click "LAUNCH CONSOLE" on the Mumbai High card
    const launchConsoleBtn = page.locator('button').filter({ hasText: /LAUNCH CONSOLE/i }).first();
    await launchConsoleBtn.click();

    // -------------------------------------------------------------
    // STEP 3: OPERATIONS CONSOLE (Tactical Map, Presets & Animated Scrubber)
    // -------------------------------------------------------------
    // Verify Operations Console loaded
    const consoleHeader = page.locator('header.tactical-header');
    await expect(consoleHeader).toBeVisible();

    // Verify Map Canvas loaded
    const mapContainer = page.locator('.leaflet-container');
    await expect(mapContainer).toBeVisible();

    // Test Focus Presets
    const focusOriginBtn = page.locator('button').filter({ hasText: /Spill Origin/i }).first();
    if (await focusOriginBtn.isVisible()) {
      await focusOriginBtn.click();
      await page.waitForTimeout(400);
    }

    // Test Map Layers Toggle HUD
    const mapLayersBtn = page.locator('button').filter({ hasText: /MAP LAYERS/i }).first();
    await expect(mapLayersBtn).toBeVisible();
    await mapLayersBtn.click();

    const slickCheckbox = page.locator('label').filter({ hasText: /SAR Slick Polygon/i }).first();
    await expect(slickCheckbox).toBeVisible();
    await mapLayersBtn.click(); // Close toggle menu

    // Test Animated Timeline Scrubber
    const playButton = page.locator('button[aria-label*="Simulation Replay"]').first();
    if (await playButton.isVisible()) {
      await playButton.click();
      await page.waitForTimeout(600);
      await playButton.click(); // Pause
    }

    // -------------------------------------------------------------
    // STEP 4: INTERACTIVE EVIDENCE GRAPH
    // -------------------------------------------------------------
    const evidenceGraphTab = page.locator('button').filter({ hasText: /EVIDENCE GRAPH/i }).first();
    await expect(evidenceGraphTab).toBeVisible();
    await evidenceGraphTab.click();

    // Verify 8-Node Causal Chain rendered
    const sarNode = page.locator('text=SAR Satellite Observation').first();
    await expect(sarNode).toBeVisible();

    const driftNode = page.locator('text=Lagrangian Hydrodynamic Drift').first();
    await expect(driftNode).toBeVisible();

    // Click a causal node to inspect parameters in the right drawer
    await driftNode.click();
    const mathFormula = page.locator('text=MATHEMATICAL / SENSOR FORMULATION:').first();
    await expect(mathFormula).toBeVisible();

    // -------------------------------------------------------------
    // STEP 5: RANKED SUSPECTS & SCORECARDS
    // -------------------------------------------------------------
    const suspectsTab = page.locator('button').filter({ hasText: /^SUSPECTS$/i }).first();
    await expect(suspectsTab).toBeVisible();
    await suspectsTab.click();

    // Verify ranked suspect cards (#01, #02, etc.)
    const rank01 = page.locator('text=#01').first();
    await expect(rank01).toBeVisible();

    // Verify 5-factor breakdown sub-scores are visible
    const spatialCpa = page.locator('text=SPATIAL CPA').first();
    await expect(spatialCpa).toBeVisible();

    const timeDelta = page.locator('text=TIME DELTA (Δt)').first();
    await expect(timeDelta).toBeVisible();

    const courseMatch = page.locator('text=COURSE MATCH').first();
    await expect(courseMatch).toBeVisible();

    // -------------------------------------------------------------
    // STEP 6: WHAT-IF SENSITIVITY TESTING (Court-Defensible Perturbations)
    // -------------------------------------------------------------
    const whatIfTab = page.locator('button').filter({ hasText: /WHAT-IF/i }).first();
    await expect(whatIfTab).toBeVisible();
    await whatIfTab.click();

    // Verify sliders are rendered
    const currentSpeedLabel = page.locator('text=1. OCEAN CURRENT SPEED OFFSET').first();
    await expect(currentSpeedLabel).toBeVisible();

    // Check Outcome KPIs
    const rankRetentionLabel = page.locator('text=Rank #1 Retention Rate').first();
    await expect(rankRetentionLabel).toBeVisible();

    const correlationVarianceLabel = page.locator('text=Correlation Variance (σ)').first();
    await expect(correlationVarianceLabel).toBeVisible();

    // Verify Court-Defensible Plain-Language Readout
    const forensicReadout = page.locator('text=COURT-DEFENSIBLE FORENSIC SENSITIVITY READOUT').first();
    await expect(forensicReadout).toBeVisible();

    // Perturb current speed slider and observe dynamic recalculation
    const sliders = page.locator('input[type="range"]');
    if (await sliders.count() > 0) {
      await sliders.first().fill('0.35');
      await page.waitForTimeout(400);
    }

    // -------------------------------------------------------------
    // STEP 7: FORMAL LEGAL DOSSIER (MARPOL Annex I & SHA-256 Seal)
    // -------------------------------------------------------------
    const dossierTab = page.locator('button').filter({ hasText: /DOSSIER/i }).first();
    await expect(dossierTab).toBeVisible();
    await dossierTab.click();

    // Verify formal government letterhead
    const letterhead = page.locator('text=NATIONAL MARITIME OIL SPILL INVESTIGATION DOSSIER').first();
    await expect(letterhead).toBeVisible();

    // Verify SHA-256 seal & Section 65B Certificate
    const shaSeal = page.locator('text=DIGITAL INTEGRITY SEAL').first();
    await expect(shaSeal).toBeVisible();

    // Test Copy SHA-256 button
    const copyShaBtn = page.locator('button').filter({ hasText: /COPY SHA-256/i }).first();
    if (await copyShaBtn.isVisible()) {
      await copyShaBtn.click();
      await page.waitForTimeout(300);
    }

    // -------------------------------------------------------------
    // STEP 8: DOCKED AI FORENSICS COPILOT
    // -------------------------------------------------------------
    const copilotBtn = page.locator('button').filter({ hasText: /AI COPILOT/i }).first();
    await expect(copilotBtn).toBeVisible();
    await copilotBtn.click();

    // Verify Copilot drawer opened
    const copilotTitle = page.locator('text=AI FORENSICS COPILOT').first();
    await expect(copilotTitle).toBeVisible();

    // Click suggested inquiry chip
    const chip = page.locator('button').filter({ hasText: /Why is the top vessel ranked as primary suspect\?/i }).first();
    if (await chip.isVisible()) {
      await chip.click();
      await page.waitForTimeout(800);

      // Verify incident-aware grounded answer received
      const responseProof = page.locator('text=/CPA DISTANCE|ATTRIBUTION SCORE|Forensic Attribution Assessment/i').first();
      await expect(responseProof).toBeVisible();
    }
  });

});
