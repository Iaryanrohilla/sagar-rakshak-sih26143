import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { useIncident, ImageryMode, FocusPreset } from '../../state/IncidentContext'
import { PILOT_REGIONS } from '../../data/regions'
import { createTacticalTileLayer } from '../../services/mapService'
import {
  Wind,
  Waves,
  Layers,
  Crosshair
} from 'lucide-react'

export const TacticalMapCanvas: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const layerGroupRef = useRef<L.LayerGroup | null>(null)
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const {
    incident,
    activeStage,
    mapFocusTarget,
    setSelectedSuspect,
    selectedSuspect,
    imageryMode,
    setImageryMode,
    hindcastPlaybackStep,
    forecastSliderHour,
    activeEvidenceHighlight,
    showSlickPolygon,
    showDriftCone,
    showAisTracks,
    showDarkSegments,
    showCurrentVectors,
    toggleMapLayer,
    activeFocusPreset,
    triggerFocusPreset
  } = useIncident()

  const region = PILOT_REGIONS[incident.regionId]
  const [isLayerHudOpen, setIsLayerHudOpen] = useState<boolean>(false)

  // Initialize Leaflet Map
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

    const tileLayer = createTacticalTileLayer(L)
    if (tileLayer) {
      tileLayer.addTo(map)
    }

    L.control.attribution({ position: 'bottomright', prefix: 'SAGAR RAKSHAK // C4I Map' }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    const layerGroup = L.layerGroup().addTo(map)
    layerGroupRef.current = layerGroup
    mapInstanceRef.current = map

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize()
    })
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Camera pan & zoom on focus target change
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

  // Continuous Canvas Particle Flow Animation (Driven by Metocean Current + Wind Vectors)
  useEffect(() => {
    const canvas = particleCanvasRef.current
    if (!canvas || !mapInstanceRef.current) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = (canvas.width = canvas.parentElement?.clientWidth || 800)
    const height = (canvas.height = canvas.parentElement?.clientHeight || 600)

    // Flow velocity vector from current + 3% wind leeway
    const currAngle = (incident.metocean.currentDirectionDegrees * Math.PI) / 180
    const currSpeed = incident.metocean.currentSpeedKnots
    const windAngle = (incident.metocean.windDirectionDegrees * Math.PI) / 180
    const windSpeed = incident.metocean.windSpeedKnots * 0.03

    const flowVx = (currSpeed * Math.sin(currAngle) + windSpeed * Math.sin(windAngle)) * 1.5
    const flowVy = -(currSpeed * Math.cos(currAngle) + windSpeed * Math.cos(windAngle)) * 1.5

    // Seed 120 particles
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 8 + Math.random() * 12,
      speed: 0.6 + Math.random() * 0.8,
      opacity: 0.2 + Math.random() * 0.5
    }))

    let animId = 0

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      if (showCurrentVectors) {
        ctx.lineWidth = 1.2
        ctx.strokeStyle = '#00d2b4'

        particles.forEach((p) => {
          ctx.beginPath()
          ctx.globalAlpha = p.opacity
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x + flowVx * p.length * 0.2, p.y + flowVy * p.length * 0.2)
          ctx.stroke()

          // Move along vector field
          p.x += flowVx * p.speed
          p.y += flowVy * p.speed

          // Wrap edges
          if (p.x < 0) p.x = width
          if (p.x > width) p.x = 0
          if (p.y < 0) p.y = height
          if (p.y > height) p.y = 0
        })
      }

      animId = requestAnimationFrame(render)
    }

    render()
    animationFrameRef.current = animId

    return () => {
      if (animId) cancelAnimationFrame(animId)
    }
  }, [incident.metocean, showCurrentVectors])

  // Render Map Layers Dynamically
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return
    const layerGroup = layerGroupRef.current
    layerGroup.clearLayers()

    // 1. Satellite Footprint Bounding Box
    const bbox = incident.scene.boundingBox
    if (bbox && bbox.length === 2) {
      const sceneRect = L.rectangle(bbox, {
        color: imageryMode === 'OPTICAL' ? '#10b981' : '#00d2b4',
        weight: 1,
        dashArray: '4, 6',
        fillColor: imageryMode === 'OPTICAL' ? '#10b981' : '#00d2b4',
        fillOpacity: imageryMode === 'FUSION' ? 0.08 : 0.04
      })
      sceneRect.bindTooltip(`Satellite Pass: ${incident.scene.sensor} (${imageryMode} Mode)`, {
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
          color: zone.type === 'CORAL_REEF' ? '#f43f5e' : '#f59e0b',
          weight: 1.5,
          dashArray: '3, 4',
          fillColor: zone.type === 'CORAL_REEF' ? '#f43f5e' : '#f59e0b',
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

    // 3. Oil Slick Polygon (Toggleable via showSlickPolygon)
    const slickPolygon = incident.detection.polygon
    if (showSlickPolygon && slickPolygon && slickPolygon.length > 2) {
      let strokeColor = '#00d2b4'
      let fillColor = '#050f1e'
      let fillOpacity = 0.8
      let strokeWidth = 2.5

      if (imageryMode === 'SAR') {
        strokeColor = '#00d2b4'
        fillColor = '#020713'
        fillOpacity = 0.9
        strokeWidth = 2.5
      } else if (imageryMode === 'OPTICAL') {
        strokeColor = '#10b981'
        fillColor = '#064e3b'
        fillOpacity = 0.75
        strokeWidth = 2.0
      } else {
        strokeColor = '#00d2b4'
        fillColor = '#152540'
        fillOpacity = 0.85
        strokeWidth = 3.0
      }

      const slick = L.polygon(slickPolygon, {
        color: strokeColor,
        weight: strokeWidth,
        fillColor: fillColor,
        fillOpacity: fillOpacity
      })

      slick.bindPopup(`
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f8fafc; min-width: 220px;">
          <div style="color: ${strokeColor}; font-weight: bold; margin-bottom: 4px; display: flex; justify-content: space-between;">
            <span>${incident.detection.classification.replace(/_/g, ' ')}</span>
            <span style="font-size: 10px; padding: 1px 4px; background: rgba(0,210,180,0.2); border-radius: 2px;">${imageryMode}</span>
          </div>
          <div>Surface Area: <strong>${incident.characterisation.surfaceAreaKm2} km²</strong></div>
          <div>Estimated Volume: <strong>${incident.characterisation.estimatedVolumeM3.toLocaleString()} m³</strong></div>
          <div>Neural Confidence: <strong>${incident.detection.confidenceScore}%</strong></div>
          <div>SAR Damping: <strong>${incident.detection.sarDampingRatioDb} dB</strong></div>
          <div>Spill Age: <strong>${incident.characterisation.spillAgeHours}h</strong></div>
          <div style="margin-top: 6px; font-size: 10px; color: #94a3b8;">Click suspect vessel to inspect attribution</div>
        </div>
      `)
      layerGroup.addLayer(slick)

      // Center marker icon
      const slickMarker = L.circleMarker(incident.detection.centroid, {
        radius: 6,
        color: strokeColor,
        fillColor: strokeColor,
        fillOpacity: 0.9
      })
      slickMarker.bindTooltip(`Centroid: ${incident.detection.centroid[0].toFixed(3)}°N, ${incident.detection.centroid[1].toFixed(3)}°E`, {
        direction: 'top',
        className: 'tactical-tooltip'
      })
      layerGroup.addLayer(slickMarker)
    }

    // 4. Backward Lagrangian Hindcast & Probable Origin (Toggleable via showDriftCone)
    const hindcast = incident.hindcast
    if (showDriftCone && hindcast && hindcast.timeSteps.length > 0) {
      const stepsToRender = hindcastPlaybackStep >= 0
        ? hindcast.timeSteps.slice(0, hindcastPlaybackStep + 1)
        : hindcast.timeSteps

      // Trajectory line
      if (stepsToRender.length > 1) {
        const trajectoryPoints = stepsToRender.map((t) => t.meanPosition)
        const hindcastLine = L.polyline(trajectoryPoints, {
          color: '#00d2b4',
          weight: 2.5,
          dashArray: '6, 6',
          opacity: 0.9
        })
        layerGroup.addLayer(hindcastLine)
      }

      // Particle cloud
      stepsToRender.forEach((step, sIdx) => {
        const isCurrentActiveStep = sIdx === stepsToRender.length - 1 && hindcastPlaybackStep >= 0
        step.particles.forEach((pt) => {
          const pMarker = L.circleMarker(pt, {
            radius: isCurrentActiveStep ? 3.5 : 2,
            color: isCurrentActiveStep ? '#00d2b4' : 'rgba(0, 210, 180, 0.6)',
            fillColor: '#00d2b4',
            fillOpacity: isCurrentActiveStep ? 0.9 : 0.45,
            stroke: isCurrentActiveStep
          })
          layerGroup.addLayer(pMarker)
        })
      })

      // Probable Origin Ellipse
      const origin = hindcast.probableOrigin
      if (origin && origin.coordinates && (hindcastPlaybackStep === -1 || hindcastPlaybackStep === hindcast.timeSteps.length - 1)) {
        const originCircle = L.circle(origin.coordinates, {
          radius: origin.searchRadiusKm * 1000,
          color: '#00d2b4',
          weight: 2,
          fillColor: '#00d2b4',
          fillOpacity: 0.22,
          dashArray: '4, 4'
        })
        originCircle.bindPopup(`
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f8fafc;">
            <div style="color: #00d2b4; font-weight: bold; margin-bottom: 4px;">PROBABLE RELEASE ORIGIN ZONE (T₀)</div>
            <div>Coords: <strong>${origin.coordinates[0].toFixed(3)}°N, ${origin.coordinates[1].toFixed(3)}°E</strong></div>
            <div>Search Radius: <strong>${origin.searchRadiusKm} km</strong></div>
            <div>Estimated Time: <strong>${origin.releaseTime.slice(11, 19)} UTC</strong></div>
            <div>Spatial Confidence: <strong>${origin.confidencePercent}%</strong></div>
          </div>
        `)
        layerGroup.addLayer(originCircle)

        const originCenterMarker = L.circleMarker(origin.coordinates, {
          radius: 5,
          color: '#00d2b4',
          fillColor: '#00d2b4',
          fillOpacity: 1
        })
        originCenterMarker.bindTooltip('Spill Origin T₀', { permanent: true, direction: 'bottom', className: 'tactical-tooltip' })
        layerGroup.addLayer(originCenterMarker)
      }
    }

    // 5. Forward Forecast Spread Envelope
    const forecast = incident.forecast
    if (showDriftCone && forecast && forecast.forecastSpreadPolygon.length > 2 && (forecastSliderHour < 48 || activeStage === 'FORECAST')) {
      const scaleFactor = Math.max(0.15, forecastSliderHour / 48)
      const centroid = incident.detection.centroid
      const scaledPolygon = forecast.forecastSpreadPolygon.map(([lat, lon]) => [
        centroid[0] + (lat - centroid[0]) * scaleFactor,
        centroid[1] + (lon - centroid[1]) * scaleFactor
      ] as [number, number])

      const forecastPolygon = L.polygon(scaledPolygon, {
        color: '#f59e0b',
        weight: 1.8,
        dashArray: '5, 5',
        fillColor: '#f59e0b',
        fillOpacity: 0.18 + (scaleFactor * 0.12)
      })
      forecastPolygon.bindPopup(`
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f8fafc;">
          <div style="color: #f59e0b; font-weight: bold; margin-bottom: 4px;">FORWARD DRIFT FORECAST (+${forecastSliderHour}h)</div>
          <div>Landfall Risk: <strong style="color: ${forecast.landfallRisk.riskLevel === 'CRITICAL' ? '#f43f5e' : '#f59e0b'}">${forecast.landfallRisk.riskLevel}</strong></div>
          <div>Vulnerable Zone: <strong>${forecast.landfallRisk.vulnerableZone || 'Fairway'}</strong></div>
        </div>
      `)
      layerGroup.addLayer(forecastPolygon)
    }

    // 6. AIS Vessel Tracks & Positions (Toggleable via showAisTracks & showDarkSegments)
    const vessels = incident.aisVessels
    const primarySuspect = selectedSuspect || incident.suspects[0]

    if (showAisTracks) {
      vessels.forEach((vessel) => {
        const isTopSuspect = primarySuspect && primarySuspect.vessel.id === vessel.id
        const markerColor = isTopSuspect ? '#f43f5e' : vessel.hasBlackout ? '#f59e0b' : '#38bdf8'

        // Vessel current position marker
        const vesselMarker = L.circleMarker(vessel.currentPosition, {
          radius: isTopSuspect ? 9 : 6,
          color: markerColor,
          weight: isTopSuspect ? 3 : 2,
          fillColor: markerColor,
          fillOpacity: 0.95
        })

        vesselMarker.bindPopup(`
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f8fafc; min-width: 220px;">
            <div style="color: ${markerColor}; font-weight: bold; font-size: 13px; margin-bottom: 4px;">
              ${vessel.name} ${isTopSuspect ? '★ PRIMARY SUSPECT' : ''}
            </div>
            <div>IMO: <strong>${vessel.imo}</strong> | MMSI: <strong>${vessel.mmsi}</strong></div>
            <div>Type: <strong>${vessel.vesselType.replace(/_/g, ' ')}</strong></div>
            <div>Speed / Course: <strong>${vessel.sogKnots} kts / ${vessel.cogDegrees}°</strong></div>
            ${vessel.hasBlackout ? `<div style="color: #f43f5e; font-weight: bold; margin-top: 4px;">⚠️ AIS BLACKOUT: ${vessel.blackoutDurationMin || 45} min gap</div>` : ''}
          </div>
        `)

        vesselMarker.on('click', () => {
          const suspectMatch = incident.suspects.find((s) => s.vessel.id === vessel.id)
          if (suspectMatch) setSelectedSuspect(suspectMatch)
        })

        layerGroup.addLayer(vesselMarker)

        // Trajectory trail
        if (vessel.trajectory && vessel.trajectory.length > 1) {
          const trailPoints = vessel.trajectory.map((p) => p.position)

          if (showDarkSegments && vessel.hasBlackout && vessel.trajectory.length >= 3) {
            // Normal segment
            const preBlackout = vessel.trajectory.slice(0, 2).map((p) => p.position)
            layerGroup.addLayer(L.polyline(preBlackout, { color: markerColor, weight: isTopSuspect ? 2.5 : 1.5, opacity: 0.7 }))

            // Blackout gap segment (dashed coral-red)
            const blackoutMins = vessel.blackoutDurationMin || 45
            const blackoutSegment = vessel.trajectory.slice(1, 3).map((p) => p.position)
            const blackoutLine = L.polyline(blackoutSegment, {
              color: '#f43f5e',
              weight: 3.5,
              dashArray: '5, 5',
              opacity: 0.95
            })
            blackoutLine.bindTooltip(`⚠️ ${vessel.name} AIS BLACKOUT (${blackoutMins} min)`, {
              direction: 'center',
              className: 'tactical-tooltip'
            })
            layerGroup.addLayer(blackoutLine)

            // Post-blackout segment
            const postBlackout = vessel.trajectory.slice(2).map((p) => p.position)
            if (postBlackout.length > 1) {
              layerGroup.addLayer(L.polyline(postBlackout, { color: markerColor, weight: isTopSuspect ? 2.5 : 1.5, opacity: 0.7 }))
            }
          } else {
            const trail = L.polyline(trailPoints, {
              color: markerColor,
              weight: isTopSuspect ? 2.5 : 1.2,
              opacity: isTopSuspect ? 0.9 : 0.45
            })
            layerGroup.addLayer(trail)
          }
        }
      })
    }

    // 7. Tactical Intercept Line (When primary suspect active)
    const highlightedVesselId = activeEvidenceHighlight || (primarySuspect ? primarySuspect.vessel.id : null)
    if (highlightedVesselId && primarySuspect && primarySuspect.vessel.id === highlightedVesselId) {
      const originCoords = incident.hindcast.probableOrigin?.coordinates
      const vesselPos = primarySuspect.vessel.currentPosition

      if (originCoords && vesselPos) {
        const interceptLine = L.polyline([originCoords, vesselPos], {
          color: '#fbbf24',
          weight: 2.5,
          dashArray: '6, 6',
          opacity: 0.95
        })
        layerGroup.addLayer(interceptLine)

        const midLat = (originCoords[0] + vesselPos[0]) / 2
        const midLon = (originCoords[1] + vesselPos[1]) / 2
        const evidenceMarker = L.circleMarker([midLat, midLon], {
          radius: 5,
          color: '#fbbf24',
          fillColor: '#fbbf24',
          fillOpacity: 1
        })
        evidenceMarker.bindTooltip(`FORENSIC INTERCEPT: CPA ${primarySuspect.cpaDistanceNm ?? 0.82} NM | Δt ${primarySuspect.cpaTimeDeltaMin ?? 18} min`, {
          permanent: true,
          direction: 'top',
          className: 'tactical-tooltip'
        })
        layerGroup.addLayer(evidenceMarker)
      }
    }
  }, [
    incident,
    activeStage,
    region,
    imageryMode,
    hindcastPlaybackStep,
    forecastSliderHour,
    activeEvidenceHighlight,
    selectedSuspect,
    showSlickPolygon,
    showDriftCone,
    showAisTracks,
    showDarkSegments
  ])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating Canvas Overlay for Animated Hydrodynamic Particle Flow */}
      <canvas
        ref={particleCanvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 400
        }}
      />

      {/* Floating Top-Left Focus Presets Toolbar */}
      <div
        className="glass-hud"
        style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          zIndex: 850,
          borderRadius: 'var(--radius-sm)',
          padding: '4px',
          display: 'flex',
          gap: '4px'
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            fontSize: '0.66rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            color: 'var(--accent-teal)'
          }}
        >
          <Crosshair size={13} />
          <span>FOCUS:</span>
        </span>

        {([
          { id: 'CORRIDOR', label: 'Full Corridor' },
          { id: 'SLICK', label: 'Slick Polygon' },
          { id: 'ORIGIN', label: 'Spill Origin (T₀)' },
          { id: 'TOP_SUSPECT', label: 'Top Suspect' },
          { id: 'DARK_SEGMENT', label: 'Dark Segment' }
        ] as { id: FocusPreset; label: string }[]).map((preset) => {
          const isActive = activeFocusPreset === preset.id
          return (
            <button
              key={preset.id}
              onClick={() => triggerFocusPreset(preset.id)}
              style={{
                padding: '4px 10px',
                border: 'none',
                borderRadius: 'var(--radius-xs)',
                background: isActive ? 'var(--accent-teal)' : 'rgba(255, 255, 255, 0.04)',
                color: isActive ? '#030712' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {preset.label}
            </button>
          )
        })}
      </div>

      {/* Floating Left Layer Manager HUD & Imagery Switcher (Under Focus Presets) */}
      <div
        style={{
          position: 'absolute',
          top: '52px',
          left: '14px',
          zIndex: 850,
          display: 'flex',
          gap: '8px'
        }}
      >
        {/* Layer Toggles Trigger */}
        <button
          onClick={() => setIsLayerHudOpen((prev) => !prev)}
          className="glass-hud"
          style={{
            height: '32px',
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: isLayerHudOpen ? 'var(--accent-teal)' : 'var(--text-primary)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            fontWeight: 800
          }}
        >
          <Layers size={14} style={{ color: 'var(--accent-teal)' }} />
          <span>MAP LAYERS</span>
        </button>

        {/* Imagery Mode Switcher Pill */}
        <div
          className="glass-hud"
          style={{
            padding: '3px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            gap: '3px'
          }}
        >
          {(['SAR', 'OPTICAL', 'FUSION'] as ImageryMode[]).map((mode) => {
            const isActive = imageryMode === mode
            return (
              <button
                key={mode}
                onClick={() => setImageryMode(mode)}
                style={{
                  padding: '4px 10px',
                  border: 'none',
                  borderRadius: 'var(--radius-xs)',
                  background: isActive ? 'rgba(0, 210, 180, 0.25)' : 'transparent',
                  color: isActive ? 'var(--accent-teal)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {mode === 'FUSION' ? 'AI FUSION' : mode}
              </button>
            )
          })}
        </div>
      </div>

      {/* Floating Layer Toggles Drawer Menu */}
      {isLayerHudOpen && (
        <div
          className="glass-hud"
          style={{
            position: 'absolute',
            top: '90px',
            left: '14px',
            zIndex: 860,
            width: '240px',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
            LAYER VISIBILITY TOGGLES:
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={showSlickPolygon} onChange={() => toggleMapLayer('slick')} />
            <span style={{ color: 'var(--accent-teal)' }}>SAR Slick Polygon</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={showDriftCone} onChange={() => toggleMapLayer('drift')} />
            <span style={{ color: 'var(--accent-teal)' }}>Lagrangian Drift Cone</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={showAisTracks} onChange={() => toggleMapLayer('ais')} />
            <span style={{ color: 'var(--accent-amber-bright)' }}>AIS Vessel Tracks</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={showDarkSegments} onChange={() => toggleMapLayer('dark')} />
            <span style={{ color: 'var(--accent-coral)' }}>AIS Dark Segments</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={showCurrentVectors} onChange={() => toggleMapLayer('current')} />
            <span style={{ color: 'var(--accent-green)' }}>Animated Current Flow</span>
          </label>
        </div>
      )}

      {/* Floating Metocean Telemetry Pill (Bottom-Left) */}
      <div
        className="glass-hud"
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '16px',
          zIndex: 850,
          borderRadius: 'var(--radius-sm)',
          padding: '8px 14px',
          display: 'flex',
          gap: '16px',
          fontSize: '0.7rem',
          fontFamily: 'var(--font-mono)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Wind size={13} style={{ color: 'var(--accent-green)' }} />
          <span>WIND: <strong>{incident.metocean.windSpeedKnots} kts ({incident.metocean.windDirectionDegrees}°)</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Waves size={13} style={{ color: 'var(--accent-teal)' }} />
          <span>CURRENT: <strong>{incident.metocean.currentSpeedKnots} kts ({incident.metocean.currentDirectionDegrees}°)</strong></span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>SEA:</span> <strong>{incident.metocean.seaTemperatureCelsius}°C</strong>
        </div>
      </div>
    </div>
  )
}
