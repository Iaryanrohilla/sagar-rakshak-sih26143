import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import { useIncident } from '../../state/IncidentContext'
import { PILOT_REGIONS } from '../../data/regions'
import { Compass, Wind, Waves } from 'lucide-react'

export const TacticalMapCanvas: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const layerGroupRef = useRef<L.LayerGroup | null>(null)

  const { incident, activeStage, mapFocusTarget, setSelectedSuspect } = useIncident()
  const region = PILOT_REGIONS[incident.regionId]

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    const initialCenter = region ? region.center : incident.detection.centroid
    const initialZoom = region ? region.zoom : 9

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false
    })

    // Tactical dark carto tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      subdomains: 'abcd'
    }).addTo(map)

    // Zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    const layerGroup = L.layerGroup().addTo(map)
    layerGroupRef.current = layerGroup
    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Update map view when region or focus target changes
  useEffect(() => {
    if (!mapInstanceRef.current) return

    if (mapFocusTarget) {
      mapInstanceRef.current.flyTo(mapFocusTarget, Math.max(mapInstanceRef.current.getZoom(), 10), {
        duration: 1.2
      })
    } else if (region) {
      mapInstanceRef.current.flyTo(region.center, region.zoom, { duration: 1.0 })
    }
  }, [incident.regionId, mapFocusTarget])

  // Render tactical layers dynamically based on state
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return
    const layerGroup = layerGroupRef.current
    layerGroup.clearLayers()

    // 1. Satellite Footprint Bounding Box
    const bbox = incident.scene.boundingBox
    if (bbox && bbox.length === 2) {
      const sceneRect = L.rectangle(bbox, {
        color: '#00f2ff',
        weight: 1,
        dashArray: '4, 6',
        fillColor: '#00f2ff',
        fillOpacity: 0.04
      })
      sceneRect.bindTooltip(`Satellite Scene: ${incident.scene.sensor}`, {
        permanent: false,
        direction: 'top',
        className: 'tactical-tooltip'
      })
      layerGroup.addLayer(sceneRect)
    }

    // 2. Sensitive Ecological Zones
    if (region && region.sensitiveZones) {
      region.sensitiveZones.forEach((zone) => {
        const circle = L.circle(zone.coordinates, {
          radius: zone.radiusKm * 1000,
          color: zone.type === 'CORAL_REEF' ? '#ef4444' : '#f59e0b',
          weight: 1.5,
          dashArray: '3, 4',
          fillColor: zone.type === 'CORAL_REEF' ? '#ef4444' : '#f59e0b',
          fillOpacity: 0.12
        })
        circle.bindTooltip(`Sensitive Biome: ${zone.name}`, {
          permanent: false,
          direction: 'center',
          className: 'tactical-tooltip'
        })
        layerGroup.addLayer(circle)
      })
    }

    // 3. Oil Slick Polygon
    const slickPolygon = incident.detection.polygon
    if (slickPolygon && slickPolygon.length > 2) {
      const isConfirmed = incident.detection.isConfirmedSlick
      const slick = L.polygon(slickPolygon, {
        color: isConfirmed ? '#00f2ff' : '#f59e0b',
        weight: isConfirmed ? 2.5 : 2,
        fillColor: isConfirmed ? '#0b1329' : '#451a03',
        fillOpacity: 0.75
      })

      slick.bindPopup(`
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f8fafc;">
          <div style="color: ${isConfirmed ? '#00f2ff' : '#f59e0b'}; font-weight: bold; margin-bottom: 4px;">
            ${incident.detection.classification.replace('_', ' ')}
          </div>
          <div>Area: <strong>${incident.characterisation.surfaceAreaKm2} km²</strong></div>
          <div>Confidence: <strong>${incident.detection.confidenceScore}%</strong></div>
          <div>Damping Ratio: <strong>${incident.detection.sarDampingRatioDb} dB</strong></div>
          <div>Spill Age: <strong>${incident.characterisation.spillAgeHours}h</strong></div>
        </div>
      `)
      layerGroup.addLayer(slick)

      // Center marker icon for slick
      const slickMarker = L.circleMarker(incident.detection.centroid, {
        radius: 6,
        color: isConfirmed ? '#00f2ff' : '#f59e0b',
        fillColor: isConfirmed ? '#00f2ff' : '#f59e0b',
        fillOpacity: 0.9
      })
      layerGroup.addLayer(slickMarker)
    }

    // 4. Backward Lagrangian Hindcast & Probable Origin Zone
    const hindcast = incident.hindcast
    if (hindcast && hindcast.timeSteps.length > 0 && activeStage !== 'INGESTION') {
      // Trajectory path
      const trajectoryPoints = hindcast.timeSteps.map((t) => t.meanPosition)
      const hindcastLine = L.polyline(trajectoryPoints, {
        color: '#00f2ff',
        weight: 2,
        dashArray: '6, 6',
        opacity: 0.85
      })
      layerGroup.addLayer(hindcastLine)

      // Individual particles cloud (if available)
      hindcast.timeSteps.forEach((step) => {
        step.particles.forEach((pt) => {
          const pMarker = L.circleMarker(pt, {
            radius: 2,
            color: '#00f2ff',
            fillColor: '#00f2ff',
            fillOpacity: 0.5,
            stroke: false
          })
          layerGroup.addLayer(pMarker)
        })
      })

      // Probable Origin Ellipse / Circle
      const origin = hindcast.probableOrigin
      if (origin && origin.coordinates) {
        const originCircle = L.circle(origin.coordinates, {
          radius: origin.searchRadiusKm * 1000,
          color: '#00f2ff',
          weight: 2,
          fillColor: '#00f2ff',
          fillOpacity: 0.2
        })
        originCircle.bindPopup(`
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f8fafc;">
            <div style="color: #00f2ff; font-weight: bold; margin-bottom: 4px;">PROBABLE RELEASE ORIGIN</div>
            <div>Coords: <strong>${origin.coordinates[0].toFixed(3)}°N, ${origin.coordinates[1].toFixed(3)}°E</strong></div>
            <div>Search Radius: <strong>${origin.searchRadiusKm} km</strong></div>
            <div>Estimated Time: <strong>${origin.releaseTime.slice(11, 19)} UTC</strong></div>
            <div>Confidence: <strong>${origin.confidencePercent}%</strong></div>
          </div>
        `)
        layerGroup.addLayer(originCircle)
      }
    }

    // 5. Forward Forecast Spread Envelope & Landfall Risk
    const forecast = incident.forecast
    if (forecast && forecast.forecastSpreadPolygon.length > 2 && (activeStage === 'FORECAST' || activeStage === 'ALERTS')) {
      const forecastPolygon = L.polygon(forecast.forecastSpreadPolygon, {
        color: '#f59e0b',
        weight: 1.5,
        dashArray: '5, 5',
        fillColor: '#f59e0b',
        fillOpacity: 0.18
      })
      forecastPolygon.bindPopup(`
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f8fafc;">
          <div style="color: #f59e0b; font-weight: bold; margin-bottom: 4px;">48H FORWARD DRIFT FORECAST</div>
          <div>Landfall Risk: <strong style="color: ${forecast.landfallRisk.riskLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b'}">${forecast.landfallRisk.riskLevel}</strong></div>
          <div>Vulnerable: <strong>${forecast.landfallRisk.vulnerableZone || 'Fairway'}</strong></div>
          <div>Priority: <strong>${forecast.landfallRisk.containmentPriority}</strong></div>
        </div>
      `)
      layerGroup.addLayer(forecastPolygon)
    }

    // 6. AIS Vessels & Trajectories
    const vessels = incident.aisVessels
    const primarySuspect = incident.suspects[0]

    vessels.forEach((vessel) => {
      const isTopSuspect = primarySuspect && primarySuspect.vessel.id === vessel.id
      const markerColor = isTopSuspect ? '#ef4444' : vessel.hasBlackout ? '#f59e0b' : '#3b82f6'

      // Vessel current position marker
      const vesselMarker = L.circleMarker(vessel.currentPosition, {
        radius: isTopSuspect ? 8 : 6,
        color: markerColor,
        weight: 2,
        fillColor: markerColor,
        fillOpacity: 0.85
      })

      // Popup on click
      vesselMarker.bindPopup(`
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f8fafc; min-width: 200px;">
          <div style="color: ${markerColor}; font-weight: bold; font-size: 13px; margin-bottom: 6px;">
            ${vessel.name} ${isTopSuspect ? '★ TOP SUSPECT' : ''}
          </div>
          <div>IMO: <strong>${vessel.imo}</strong> | MMSI: <strong>${vessel.mmsi}</strong></div>
          <div>Type: <strong>${vessel.vesselType.replace(/_/g, ' ')}</strong></div>
          <div>Flag: <strong>${vessel.flagCountry} (${vessel.flag})</strong></div>
          <div>Speed / Course: <strong>${vessel.sogKnots} kts / ${vessel.cogDegrees}°</strong></div>
          ${vessel.hasBlackout ? `<div style="color: #ef4444; font-weight: bold; margin-top: 4px;">⚠️ AIS BLACKOUT ANOMALY DETECTED</div>` : ''}
        </div>
      `)

      vesselMarker.on('click', () => {
        const suspectMatch = incident.suspects.find((s) => s.vessel.id === vessel.id)
        if (suspectMatch) {
          setSelectedSuspect(suspectMatch)
        }
      })

      layerGroup.addLayer(vesselMarker)

      // Trajectory trail
      if (vessel.trajectory && vessel.trajectory.length > 1) {
        const trailPoints = vessel.trajectory.map((p) => p.position)
        const trail = L.polyline(trailPoints, {
          color: markerColor,
          weight: isTopSuspect ? 2.5 : 1.2,
          opacity: isTopSuspect ? 0.9 : 0.45,
          dashArray: vessel.hasBlackout ? '4, 4' : undefined
        })
        layerGroup.addLayer(trail)
      }
    })
  }, [incident, activeStage, region])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Tactical Compass & Metocean Telemetry Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 1000,
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxShadow: 'var(--shadow-tactical)',
          pointerEvents: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
          <Compass size={14} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
            METOCEAN TELEMETRY
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wind size={12} style={{ color: 'var(--accent-cyan)' }} />
            <span>WIND: <strong>{incident.metocean.windSpeedKnots} kts ({incident.metocean.windDirectionDegrees}°)</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Waves size={12} style={{ color: 'var(--accent-blue)' }} />
            <span>CURRENT: <strong>{incident.metocean.currentSpeedKnots} kts ({incident.metocean.currentDirectionDegrees}°)</strong></span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>SEA TEMP:</span> <strong>{incident.metocean.seaTemperatureCelsius}°C</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>WAVE:</span> <strong>{incident.metocean.waveHeightMeters}m</strong>
          </div>
        </div>
      </div>

      {/* Map Legend Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '16px',
          zIndex: 1000,
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 12px',
          display: 'flex',
          gap: '14px',
          fontSize: '0.7rem',
          fontFamily: 'var(--font-mono)',
          boxShadow: 'var(--shadow-tactical)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', background: '#0b1329', border: '1.5px solid #00f2ff', display: 'inline-block' }}></span>
          <span>Slick Polygon</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00f2ff', display: 'inline-block' }}></span>
          <span>Hindcast Origin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
          <span>#1 Suspect Tanker</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', border: '1.5px dashed #ef4444', display: 'inline-block' }}></span>
          <span>Marine Sanctuary</span>
        </div>
      </div>
    </div>
  )
}
