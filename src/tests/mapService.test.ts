import { describe, it, expect } from 'vitest'
import { demoMapProvider, fallbackMapProvider, createTacticalTileLayer } from '../services/mapService'
import { DEMO_SCENARIOS } from '../data/scenarios'
import { AlertService } from '../services/alertService'
import { Alert } from '../types'

describe('SAGAR RAKSHAK Map Infrastructure & Resilient Provider Tests', () => {
  it('ensures demoMapProvider never depends on CARTO or Mapbox API keys', () => {
    expect(demoMapProvider.url).not.toContain('cartocdn.com')
    expect(demoMapProvider.url).not.toContain('mapbox.com')
    expect(demoMapProvider.url).not.toContain('api_key')
    expect(demoMapProvider.url).not.toContain('access_token')
    expect(demoMapProvider.url).toContain('arcgisonline.com')
    expect(demoMapProvider.attribution).toBeDefined()
  })

  it('ensures fallbackMapProvider is OpenStreetMap with tactical dark styling filter', () => {
    expect(fallbackMapProvider.url).toContain('tile.openstreetmap.org')
    expect(fallbackMapProvider.className).toBe('tactical-dark-tiles')
  })

  it('instantiates tactical tile layer without throwing or requiring credentials', () => {
    const mockLeaflet = {
      tileLayer: (url: string, options: any) => ({
        url,
        options,
        on: () => {}
      })
    }
    const layer = createTacticalTileLayer(mockLeaflet)
    expect(layer).toBeDefined()
    expect(layer.url).toContain('arcgisonline.com')
  })

  it('verifies all 5 deterministic demo scenarios have complete geographic and forensic attributes', () => {
    expect(DEMO_SCENARIOS.length).toBeGreaterThanOrEqual(5)

    DEMO_SCENARIOS.forEach((scenario) => {
      const { incident } = scenario
      expect(incident.id).toBeDefined()
      expect(incident.detection.centroid[0]).toBeGreaterThan(0)
      expect(incident.detection.centroid[1]).toBeGreaterThan(0)
      expect(incident.detection.polygon.length).toBeGreaterThan(2)
      expect(incident.alerts.length).toBeGreaterThan(0)
      expect(incident.characterisation.surfaceAreaKm2).toBeGreaterThan(0)
      expect(incident.forecast.landfallRisk).toBeDefined()

      if (incident.detection.isConfirmedSlick) {
        expect(incident.aisVessels.length).toBeGreaterThan(0)
        expect(incident.suspects.length).toBeGreaterThan(0)
      } else {
        expect(incident.detection.classification).toBe('ALGAL_BLOOM')
      }
    })
  })

  it('verifies alert state transitions across all four operations actions: ACKNOWLEDGE, INVESTIGATE, ESCALATE, RESOLVE', () => {
    const baseAlert: Alert = {
      id: 'ALT-TEST-001',
      incidentId: 'INC-TEST',
      title: 'High-Risk Discharge Detected',
      severity: 'CRITICAL',
      type: 'VESSEL_SUSPECT',
      status: 'NEW',
      timestamp: new Date().toISOString(),
      assignedAgency: 'COAST_GUARD',
      description: 'Test anomaly detection',
      history: []
    }

    // 1. Acknowledge
    const ackAlert = AlertService.updateAlertStatus(baseAlert, 'ACKNOWLEDGED', 'Duty Officer', 'Acknowledged')
    expect(ackAlert.status).toBe('ACKNOWLEDGED')
    expect(ackAlert.history.length).toBe(1)

    // 2. Investigate
    const invAlert = AlertService.updateAlertStatus(ackAlert, 'INVESTIGATING', 'Tactical Analyst', 'Cross-referencing radar')
    expect(invAlert.status).toBe('INVESTIGATING')
    expect(invAlert.history.length).toBe(2)

    // 3. Escalate
    const escAlert = AlertService.updateAlertStatus(invAlert, 'ESCALATED', 'Commander', 'Escalated to HQ')
    expect(escAlert.status).toBe('ESCALATED')
    expect(escAlert.history.length).toBe(3)

    // 4. Resolve
    const resAlert = AlertService.updateAlertStatus(escAlert, 'RESOLVED', 'Command Desk', 'Incident contained')
    expect(resAlert.status).toBe('RESOLVED')
    expect(resAlert.history.length).toBe(4)
  })
})
