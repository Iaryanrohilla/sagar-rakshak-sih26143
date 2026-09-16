import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import { useIncident, ImageryMode } from '../../state/IncidentContext'
import { PILOT_REGIONS } from '../../data/regions'
import { createTacticalTileLayer } from '../../services/mapService'
import { Compass, Wind, Waves, Eye, X, Activity } from 'lucide-react'

export const TacticalMapCanvas: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const layerGroupRef = useRef<L.LayerGroup | null>(null)

  const {
    incident,
    activeStage,
    mapFocusTarget,
    setSelectedSuspect,
    selectedSuspect,
    imageryMode,
    setImageryMode,
    hindcastPlaybackStep,
    isHindcastPlaying,
    forecastSliderHour,
    activeEvidenceHighlight,
    clearEvidenceHighlight,
    openWhyVessel
  } = useIncident()

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

    // Tactical zero-key tile layer from mapService
    const tileLayer = createTacticalTileLayer(L)
    if (tileLayer) {
      tileLayer.addTo(map)
    }

    // Attribution control bottom-right
    L.control.attribution({ position: 'bottomright', prefix: 'Sagar Rakshak' }).addTo(map)

    // Zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    const layerGroup = L.layerGroup().addTo(map)
    layerGroupRef.current = layerGroup
    mapInstanceRef.current = map

    // Invalidate size on container resize
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
        color: imageryMode === 'OPTICAL' ? '#10b981' : '#00f2ff',
        weight: 1,
        dashArray: '4, 6',
        fillColor: imageryMode === 'OPTICAL' ? '#10b981' : '#00f2ff',
        fillOpacity: imageryMode === 'FUSION' ? 0.08 : 0.04
      })
      sceneRect.bindTooltip(`Satellite Scene: ${incident.scene.sensor} (${imageryMode} Mode)`, {
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

    // 3. Oil Slick Polygon (Styling reflects imageryMode)
    const slickPolygon = incident.detection.polygon
    if (slickPolygon && slickPolygon.length > 2) {
      // Dynamic styling based on imagery mode
      let strokeColor = '#00f2ff'
      let fillColor = '#0b1329'
      let fillOpacity = 0.75
      let strokeWidth = 2.5

      if (imageryMode === 'SAR') {
        strokeColor = '#00f2ff'
        fillColor = '#020617' // Deep radar backscatter shadow
        fillOpacity = 0.88
        strokeWidth = 2.5
      } else if (imageryMode === 'OPTICAL') {
        strokeColor = '#10b981' // SWIR/NIR contrast
        fillColor = '#064e3b'
        fillOpacity = 0.70
        strokeWidth = 2.0
      } else {
        // AI FUSION
        strokeColor = '#00f2ff'
        fillColor = '#1e1b4b' // Indigo-cyan neural segmentation gradient
        fillOpacity = 0.82
        strokeWidth = 3.0
      }

      const slick = L.polygon(slickPolygon, {
        color: strokeColor,
        weight: strokeWidth,
        fillColor: fillColor,
        fillOpacity: fillOpacity
      })

      slick.bindPopup(`
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f8fafc; min-width: 210px;">
          <div style="color: ${strokeColor}; font-weight: bold; margin-bottom: 4px; display: flex; justify-content: space-between;">
            <span>${incident.detection.classification.replace(/_/g, ' ')}</span>
            <span style="font-size: 10px; padding: 1px 4px; background: rgba(0,242,255,0.2); border-radius: 2px;">${imageryMode}</span>
          </div>
          <div>Surface Area: <strong>${incident.characterisation.surfaceAreaKm2} km²</strong></div>
          <div>Estimated Volume: <strong>${incident.characterisation.estimatedVolumeM3.toLocaleString()} m³</strong></div>
          <div>Neural Confidence: <strong>${incident.detection.confidenceScore}%</strong></div>
          <div>SAR Damping: <strong>${incident.detection.sarDampingRatioDb} dB</strong></div>
          <div>Spill Age: <strong>${incident.characterisation.spillAgeHours}h</strong></div>
          <div style="margin-top: 6px; font-size: 10px; color: #94a3b8;">Click vessel below for forensic attribution</div>
        </div>
      `)
      layerGroup.addLayer(slick)

      // Center marker icon for slick
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

    // 4. Backward Lagrangian Hindcast & Probable Origin Zone
    const hindcast = incident.hindcast
    if (hindcast && hindcast.timeSteps.length > 0 && activeStage !== 'INGESTION') {
      const stepsToRender = hindcastPlaybackStep >= 0
        ? hindcast.timeSteps.slice(0, hindcastPlaybackStep + 1)
        : hindcast.timeSteps

      // Trajectory path
      if (stepsToRender.length > 1) {
        const trajectoryPoints = stepsToRender.map((t) => t.meanPosition)
        const hindcastLine = L.polyline(trajectoryPoints, {
          color: '#00f2ff',
          weight: 2.5,
          dashArray: '6, 6',
          opacity: 0.9
        })
        layerGroup.addLayer(hindcastLine)
      }

      // Individual particles cloud
      stepsToRender.forEach((step, sIdx) => {
        const isCurrentActiveStep = sIdx === stepsToRender.length - 1 && hindcastPlaybackStep >= 0
        step.particles.forEach((pt) => {
          const pMarker = L.circleMarker(pt, {
            radius: isCurrentActiveStep ? 3.5 : 2,
            color: isCurrentActiveStep ? '#00f2ff' : 'rgba(0, 242, 255, 0.6)',
            fillColor: '#00f2ff',
            fillOpacity: isCurrentActiveStep ? 0.9 : 0.45,
            stroke: isCurrentActiveStep
          })
          layerGroup.addLayer(pMarker)
        })
      })

      // Probable Origin Ellipse / Circle
      const origin = hindcast.probableOrigin
      if (origin && origin.coordinates && (hindcastPlaybackStep === -1 || hindcastPlaybackStep === hindcast.timeSteps.length - 1)) {
        const originCircle = L.circle(origin.coordinates, {
          radius: origin.searchRadiusKm * 1000,
          color: '#00f2ff',
          weight: 2,
          fillColor: '#00f2ff',
          fillOpacity: 0.22,
          dashArray: '4, 4'
        })
        originCircle.bindPopup(`
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f8fafc;">
            <div style="color: #00f2ff; font-weight: bold; margin-bottom: 4px;">PROBABLE RELEASE ORIGIN ZONE</div>
            <div>Coords: <strong>${origin.coordinates[0].toFixed(3)}°N, ${origin.coordinates[1].toFixed(3)}°E</strong></div>
            <div>Search Radius: <strong>${origin.searchRadiusKm} km</strong></div>
            <div>Estimated Time: <strong>${origin.releaseTime.slice(11, 19)} UTC</strong></div>
            <div>Confidence: <strong>${origin.confidencePercent}%</strong></div>
          </div>
        `)
        layerGroup.addLayer(originCircle)

        const originCenterMarker = L.circleMarker(origin.coordinates, {
          radius: 5,
          color: '#00f2ff',
          fillColor: '#00f2ff',
          fillOpacity: 1
        })
        originCenterMarker.bindTooltip('Spill Origin $T_0$', { permanent: true, direction: 'bottom', className: 'tactical-tooltip' })
        layerGroup.addLayer(originCenterMarker)
      }
    }

    // 5. Forward Forecast Spread Envelope & Landfall Risk (Scaled by forecastSliderHour)
    const forecast = incident.forecast
    if (forecast && forecast.forecastSpreadPolygon.length > 2 && (activeStage === 'FORECAST' || activeStage === 'ALERTS' || forecastSliderHour < 48)) {
      // Scale polygon vertices based on forecastSliderHour / 48
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
          <div>Landfall Risk: <strong style="color: ${forecast.landfallRisk.riskLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b'}">${forecast.landfallRisk.riskLevel}</strong></div>
          <div>Vulnerable Zone: <strong>${forecast.landfallRisk.vulnerableZone || 'Shipping Fairway'}</strong></div>
          <div>Containment Strategy: <strong>${forecast.landfallRisk.containmentPriority}</strong></div>
        </div>
      `)
      layerGroup.addLayer(forecastPolygon)
    }

    // 6. AIS Vessels & Trajectories
    const vessels = incident.aisVessels
    const primarySuspect = selectedSuspect || incident.suspects[0]

    vessels.forEach((vessel) => {
      const isTopSuspect = primarySuspect && primarySuspect.vessel.id === vessel.id
      const markerColor = isTopSuspect ? '#ef4444' : vessel.hasBlackout ? '#f59e0b' : '#3b82f6'

      // Vessel current position marker
      const vesselMarker = L.circleMarker(vessel.currentPosition, {
        radius: isTopSuspect ? 9 : 6,
        color: markerColor,
        weight: isTopSuspect ? 3 : 2,
        fillColor: markerColor,
        fillOpacity: 0.9
      })

      // Popup on click
      vesselMarker.bindPopup(`
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f8fafc; min-width: 220px;">
          <div style="color: ${markerColor}; font-weight: bold; font-size: 13px; margin-bottom: 6px;">
            ${vessel.name} ${isTopSuspect ? '★ PRIMARY SUSPECT' : ''}
          </div>
          <div>IMO: <strong>${vessel.imo}</strong> | MMSI: <strong>${vessel.mmsi}</strong></div>
          <div>Type: <strong>${vessel.vesselType.replace(/_/g, ' ')}</strong></div>
          <div>Flag: <strong>${vessel.flagCountry} (${vessel.flag})</strong></div>
          <div>Speed / Course: <strong>${vessel.sogKnots} kts / ${vessel.cogDegrees}°</strong></div>
          <div>Draught: <strong>${vessel.draughtMeters}m</strong> | DWT: <strong>${(vessel.deadweightTons || Math.round(vessel.grossTonnage * 1.5)).toLocaleString()}t</strong></div>
          ${vessel.hasBlackout ? `<div style="color: #ef4444; font-weight: bold; margin-top: 4px;">⚠️ AIS BLACKOUT: ${vessel.blackoutDurationMin || (vessel.blackoutAnomaly ? Math.round(vessel.blackoutAnomaly.durationHours * 60) : 45)} min gap</div>` : ''}
        </div>
      `)

      vesselMarker.on('click', () => {
        const suspectMatch = incident.suspects.find((s) => s.vessel.id === vessel.id)
        if (suspectMatch) {
          setSelectedSuspect(suspectMatch)
        }
      })

      layerGroup.addLayer(vesselMarker)

      // Vessel Trajectory trail with blackout styling
      if (vessel.trajectory && vessel.trajectory.length > 1) {
        const trailPoints = vessel.trajectory.map((p) => p.position)
        
        if (vessel.hasBlackout && vessel.trajectory.length >= 3) {
          // Normal initial segment
          const preBlackout = vessel.trajectory.slice(0, 2).map(p => p.position)
          layerGroup.addLayer(L.polyline(preBlackout, {
            color: markerColor,
            weight: isTopSuspect ? 2.5 : 1.5,
            opacity: 0.7
          }))

          // Blackout segment (dashed crimson/amber)
          const blackoutMins = vessel.blackoutDurationMin || (vessel.blackoutAnomaly ? Math.round(vessel.blackoutAnomaly.durationHours * 60) : 45)
          const blackoutSegment = vessel.trajectory.slice(1, 3).map(p => p.position)
          const blackoutLine = L.polyline(blackoutSegment, {
            color: '#ef4444',
            weight: 3,
            dashArray: '4, 4',
            opacity: 0.95
          })
          blackoutLine.bindTooltip(`⚠️ ${vessel.name} AIS BLACKOUT (${blackoutMins} min)`, {
            direction: 'center',
            className: 'tactical-tooltip'
          })
          layerGroup.addLayer(blackoutLine)

          // Post-blackout segment
          const postBlackout = vessel.trajectory.slice(2).map(p => p.position)
          if (postBlackout.length > 1) {
            layerGroup.addLayer(L.polyline(postBlackout, {
              color: markerColor,
              weight: isTopSuspect ? 2.5 : 1.5,
              opacity: 0.7
            }))
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

    // 7. Forensic Evidence Intercept Line (When activeEvidenceHighlight is set or primary suspect selected)
    const highlightedVesselId = activeEvidenceHighlight || (activeStage === 'ATTRIBUTION' ? primarySuspect?.vessel.id : null)
    if (highlightedVesselId && primarySuspect && primarySuspect.vessel.id === highlightedVesselId) {
      const originCoords = incident.hindcast.probableOrigin?.coordinates
      const vesselPos = primarySuspect.vessel.currentPosition

      if (originCoords && vesselPos) {
        // Intercept vector
        const interceptLine = L.polyline([originCoords, vesselPos], {
          color: '#fbbf24', // Amber/gold evidence vector
          weight: 2.5,
          dashArray: '8, 8',
          opacity: 0.95
        })
        layerGroup.addLayer(interceptLine)

        // Midpoint evidentiary marker
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
    selectedSuspect
  ])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating Imagery Mode Switcher Pill (Top-Right of Map) */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          zIndex: 1000,
          background: 'rgba(8, 12, 22, 0.92)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
          display: 'flex',
          gap: '4px',
          boxShadow: 'var(--shadow-tactical)'
        }}
      >
        {(['SAR', 'OPTICAL', 'FUSION'] as ImageryMode[]).map((mode) => {
          const isActive = imageryMode === mode
          return (
            <button
              key={mode}
              onClick={() => setImageryMode(mode)}
              title={`Switch map view to ${mode} mode`}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: isActive
                  ? mode === 'SAR'
                    ? 'rgba(0, 242, 255, 0.25)'
                    : mode === 'OPTICAL'
                    ? 'rgba(16, 185, 129, 0.25)'
                    : 'rgba(168, 85, 247, 0.25)'
                  : 'transparent',
                color: isActive
                  ? mode === 'SAR'
                    ? 'var(--accent-cyan)'
                    : mode === 'OPTICAL'
                    ? 'var(--accent-emerald)'
                    : '#c084fc'
                  : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ fontSize: '10px' }}>{mode === 'SAR' ? '🛰️' : mode === 'OPTICAL' ? '🌈' : '⚡'}</span>
              <span>{mode === 'FUSION' ? 'AI FUSION' : mode}</span>
            </button>
          )
        })}
      </div>

      {/* Active Evidence Highlight Banner Overlay (When Geo-linked) */}
      {activeEvidenceHighlight && (
        <div
          style={{
            position: 'absolute',
            top: '60px',
            right: '14px',
            zIndex: 1000,
            background: 'rgba(251, 191, 36, 0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--accent-amber)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-tactical)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Eye size={14} color="var(--accent-amber)" />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
              FORENSIC GEO-LINK ACTIVE: {selectedSuspect?.vessel.name || activeEvidenceHighlight}
            </span>
          </div>

          <button
            onClick={openWhyVessel}
            style={{
              padding: '3px 8px',
              background: 'var(--accent-amber)',
              border: 'none',
              borderRadius: '2px',
              color: '#000',
              fontSize: '0.64rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            EXPLAIN
          </button>

          <button
            onClick={clearEvidenceHighlight}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-amber)',
              cursor: 'pointer',
              padding: '2px'
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Animated Hindcast Playback Step Banner */}
      {isHindcastPlaying && (
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: 'rgba(8, 12, 22, 0.94)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--accent-cyan)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-cyan-glow)'
          }}
        >
          <Activity size={14} className="pulse-dot cyan" />
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
            HINDCAST SIMULATION REWIND: STEP {hindcastPlaybackStep + 1} / {incident.hindcast.timeSteps.length}
          </span>
        </div>
      )}

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
          <span>Suspect Tanker</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', border: '1.5px dashed #fbbf24', display: 'inline-block' }}></span>
          <span>Forensic Intercept</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', border: '1.5px dashed #ef4444', display: 'inline-block' }}></span>
          <span>Marine Biome</span>
        </div>
      </div>
    </div>
  )
}
