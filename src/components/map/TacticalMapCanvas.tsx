import React, { useEffect, useRef, useState } from 'react'
import * as mapboxgl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useIncident, ImageryMode, FocusPreset } from '../../state/IncidentContext'
import { PILOT_REGIONS } from '../../data/regions'
import { demoMapProvider, satelliteProvider } from '../../services/mapService'
import {
  Layers,
  Crosshair
} from 'lucide-react'

// Helper to convert [lat, lon] to GeoJSON [lon, lat]
const toLngLat = (coords: [number, number]): [number, number] => [coords[1], coords[0]]

// Generate a 32-point circle polygon in GeoJSON format
function createCirclePolygon(centerLngLat: [number, number], radiusKm: number, numPoints = 32): [number, number][] {
  const coords: [number, number][] = []
  const kmToDegreesLat = 1 / 110.574
  const kmToDegreesLng = 1 / (111.32 * Math.cos((centerLngLat[1] * Math.PI) / 180))

  for (let i = 0; i <= numPoints; i++) {
    const angle = (i * 2 * Math.PI) / numPoints
    const lng = centerLngLat[0] + Math.sin(angle) * radiusKm * kmToDegreesLng
    const lat = centerLngLat[1] + Math.cos(angle) * radiusKm * kmToDegreesLat
    coords.push([lng, lat])
  }
  return coords
}

export const TacticalMapCanvas: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null)
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])

  const {
    incident,
    mapFocusTarget,
    setSelectedSuspect,
    selectedSuspect,
    imageryMode,
    setImageryMode,
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

  // Construct map style specification (Dark Nautical vs Satellite)
  const getMapStyle = (mode: ImageryMode): mapboxgl.StyleSpecification => {
    const isSatellite = mode === 'OPTICAL' || mode === 'FUSION'
    const tileConfig = isSatellite ? satelliteProvider : demoMapProvider

    return {
      version: 8,
      sources: {
        'ocean-raster-source': {
          type: 'raster',
          tiles: [tileConfig.url],
          tileSize: 256,
          attribution: '&copy; Esri, SAGAR RAKSHAK Maritime Intelligence'
        }
      },
      layers: [
        {
          id: 'ocean-raster-layer',
          type: 'raster',
          source: 'ocean-raster-source',
          minzoom: 0,
          maxzoom: 22,
          paint: {
            'raster-brightness-max': isSatellite ? 0.95 : 0.9,
            'raster-contrast': 0.15
          }
        }
      ]
    }
  }

  // 1. Initialize Mapbox GL JS 3D Isometric Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    const initialCenterLatLon = region ? region.center : incident.detection.centroid
    const initialLngLat: [number, number] = [initialCenterLatLon[1], initialCenterLatLon[0]]
    const initialZoom = region ? region.zoom : 9.5

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: getMapStyle(imageryMode),
      center: initialLngLat,
      zoom: initialZoom,
      pitch: 60, // 3D Isometric Pitch Angle
      bearing: -20, // 3D Isometric Bearing Angle
      attributionControl: false
    })

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'bottom-right')

    map.on('load', () => {
      renderForensicScene(map)
    })

    mapInstanceRef.current = map

    const resizeObserver = new ResizeObserver(() => {
      map.resize()
    })
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // 2. Switch base style when imageryMode toggles
  useEffect(() => {
    if (!mapInstanceRef.current) return
    const map = mapInstanceRef.current

    map.setStyle(getMapStyle(imageryMode))
    map.once('style.load', () => {
      renderForensicScene(map)
    })
  }, [imageryMode])

  // 3. React to focus targets & presets
  useEffect(() => {
    if (!mapInstanceRef.current) return
    const map = mapInstanceRef.current

    if (mapFocusTarget) {
      map.flyTo({
        center: [mapFocusTarget[1], mapFocusTarget[0]],
        zoom: Math.max(map.getZoom(), 11),
        pitch: 60,
        bearing: -20,
        duration: 1200
      })
    } else if (region) {
      map.flyTo({
        center: [region.center[1], region.center[0]],
        zoom: region.zoom,
        pitch: 60,
        bearing: -20,
        duration: 1000
      })
    }
  }, [incident.regionId, mapFocusTarget])

  // 4. Main 3D Forensic Reconstruction Layer Renderer
  const renderForensicScene = (map: mapboxgl.Map) => {
    // Clear any existing custom DOM markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    const primarySuspect = selectedSuspect || incident.suspects[0]
    const originCoords = incident.hindcast.probableOrigin.coordinates
    const originLngLat: [number, number] = [originCoords[1], originCoords[0]]

    // Clean up existing GeoJSON sources/layers if re-rendering
    const layerIds = [
      'spill-origin-extrusion',
      'ais-uncertainty-extrusion',
      'slick-polygon-fill',
      'slick-polygon-line',
      'hindcast-line-glow',
      'hindcast-line-core',
      'hindcast-particles',
      'suspect-track-glow',
      'suspect-track-core'
    ]
    const sourceIds = [
      'spill-origin-source',
      'ais-uncertainty-source',
      'slick-polygon-source',
      'hindcast-line-source',
      'hindcast-particles-source',
      'suspect-track-source'
    ]

    layerIds.forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id)
    })
    sourceIds.forEach((id) => {
      if (map.getSource(id)) map.removeSource(id)
    })

    // =========================================================================
    // 1. 3D VOLUMETRIC ZONE: SPILL ORIGIN BOUNDING PRISM (fill-extrusion)
    // =========================================================================
    // Construct rectangular 3D volume around the spill origin T₀
    const deltaLat = 0.024
    const deltaLng = 0.038
    const originBoxPolygon: [number, number][] = [
      [originLngLat[0] - deltaLng, originLngLat[1] - deltaLat],
      [originLngLat[0] + deltaLng, originLngLat[1] - deltaLat],
      [originLngLat[0] + deltaLng, originLngLat[1] + deltaLat],
      [originLngLat[0] - deltaLng, originLngLat[1] + deltaLat],
      [originLngLat[0] - deltaLng, originLngLat[1] - deltaLat]
    ]

    map.addSource('spill-origin-source', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [originBoxPolygon]
        }
      }
    })

    map.addLayer({
      id: 'spill-origin-extrusion',
      type: 'fill-extrusion',
      source: 'spill-origin-source',
      paint: {
        'fill-extrusion-color': '#00d2b4', // Glowing Cyan
        'fill-extrusion-height': 500, // 500 meters vertical extrusion
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': 0.82
      }
    })

    // =========================================================================
    // 2. 3D VOLUMETRIC ZONES: AIS UNCERTAINTY CYLINDERS (fill-extrusion)
    // =========================================================================
    // Create 3D cylindrical volumes along the suspect vessel path for AIS uncertainty/blackout
    const blackoutPoints: [number, number][] = [
      [originLngLat[0] - 0.065, originLngLat[1] - 0.045],
      [originLngLat[0] - 0.035, originLngLat[1] - 0.02],
      [originLngLat[0] + 0.045, originLngLat[1] + 0.03],
      [originLngLat[0] + 0.085, originLngLat[1] + 0.055]
    ]

    const uncertaintyPolygons = blackoutPoints.map((pt, idx) => ({
      type: 'Feature' as const,
      properties: { id: `ais-gap-${idx}` },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [createCirclePolygon(pt, 1.8)]
      }
    }))

    map.addSource('ais-uncertainty-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: uncertaintyPolygons
      }
    })

    if (showDarkSegments) {
      map.addLayer({
        id: 'ais-uncertainty-extrusion',
        type: 'fill-extrusion',
        source: 'ais-uncertainty-source',
        paint: {
          'fill-extrusion-color': '#ffd700', // Translucent glowing yellow
          'fill-extrusion-height': 380, // 380 meters vertical cylinder
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.42
        }
      })
    }

    // =========================================================================
    // 3. GLOWING TRAJECTORIES: SUSPECT VESSEL TRACK (Red Neon Trail)
    // =========================================================================
    const vesselTrajectoryPoints: [number, number][] = [
      [originLngLat[0] - 0.12, originLngLat[1] - 0.08],
      [originLngLat[0] - 0.065, originLngLat[1] - 0.045],
      [originLngLat[0] - 0.015, originLngLat[1] - 0.01],
      [originLngLat[0] + 0.012, originLngLat[1] + 0.008],
      [originLngLat[0] + 0.045, originLngLat[1] + 0.03],
      [originLngLat[0] + 0.085, originLngLat[1] + 0.055],
      [originLngLat[0] + 0.14, originLngLat[1] + 0.09]
    ]

    map.addSource('suspect-track-source', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: vesselTrajectoryPoints
        }
      }
    })

    if (showAisTracks) {
      // Glow underlayer with wide blur
      map.addLayer({
        id: 'suspect-track-glow',
        type: 'line',
        source: 'suspect-track-source',
        paint: {
          'line-color': '#f43f5e',
          'line-width': 15, // Wider line width
          'line-blur': 15, // Neon blur
          'line-opacity': 0.88
        }
      })

      // Sharp central core line
      map.addLayer({
        id: 'suspect-track-core',
        type: 'line',
        source: 'suspect-track-source',
        paint: {
          'line-color': '#ff4d6d',
          'line-width': 3.5,
          'line-opacity': 1.0,
          'line-dasharray': [4, 2]
        }
      })
    }

    // =========================================================================
    // 4. OIL SLICK POLYGON & LAGRANGIAN HINDCAST
    // =========================================================================
    if (showSlickPolygon && incident.detection.polygon.length > 2) {
      const slickGeoJsonCoords: [number, number][] = incident.detection.polygon.map(toLngLat)
      // Close polygon ring
      if (slickGeoJsonCoords.length > 0) {
        slickGeoJsonCoords.push(slickGeoJsonCoords[0])
      }

      map.addSource('slick-polygon-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [slickGeoJsonCoords]
          }
        }
      })

      map.addLayer({
        id: 'slick-polygon-fill',
        type: 'fill',
        source: 'slick-polygon-source',
        paint: {
          'fill-color': '#020713',
          'fill-opacity': 0.88
        }
      })

      map.addLayer({
        id: 'slick-polygon-line',
        type: 'line',
        source: 'slick-polygon-source',
        paint: {
          'line-color': '#00d2b4',
          'line-width': 2.5
        }
      })
    }

    // Lagrangian Drift Hindcast Trajectory
    if (showDriftCone && incident.hindcast.timeSteps.length > 1) {
      const hindcastPoints: [number, number][] = incident.hindcast.timeSteps.map((t) => toLngLat(t.meanPosition))

      map.addSource('hindcast-line-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: hindcastPoints
          }
        }
      })

      map.addLayer({
        id: 'hindcast-line-glow',
        type: 'line',
        source: 'hindcast-line-source',
        paint: {
          'line-color': '#00d2b4',
          'line-width': 8,
          'line-blur': 10,
          'line-opacity': 0.65
        }
      })

      map.addLayer({
        id: 'hindcast-line-core',
        type: 'line',
        source: 'hindcast-line-source',
        paint: {
          'line-color': '#00d2b4',
          'line-width': 2.5,
          'line-dasharray': [3, 2]
        }
      })
    }

    // =========================================================================
    // 5. FLOATING HUD MARKERS (Digital Glass Panels via new mapboxgl.Marker)
    // =========================================================================

    // HUD 1: SPILL ORIGIN (T₀) Floating Glass Marker
    const originHudEl = document.createElement('div')
    originHudEl.className = 'floating-3d-hud'
    originHudEl.innerHTML = `
      <div class="hud-glass-card cyan-glow">
        <div class="hud-header">
          <span style="display:flex;align-items:center;gap:5px;">
            <span class="hud-dot teal"></span>
            <span class="hud-title">SPILL ORIGIN (T₀)</span>
          </span>
          <span class="hud-badge" style="background:rgba(0,210,180,0.2);color:#00d2b4;">SAR UNET</span>
        </div>
        <div class="hud-coords">${originCoords[0].toFixed(3)}° N, ${originCoords[1].toFixed(3)}° E</div>
        <div class="hud-meta">Release: ${incident.characterisation.releaseWindowStart.slice(11, 16)} UTC • 94.6% Confidence</div>
      </div>
      <div class="hud-stem"></div>
    `
    const originMarker = new mapboxgl.Marker({ element: originHudEl, anchor: 'bottom' })
      .setLngLat(originLngLat)
      .addTo(map)
    markersRef.current.push(originMarker)

    // HUD 2: FORENSIC INTERCEPT CPA Floating Glass Marker
    const interceptLngLat: [number, number] = [originLngLat[0] + 0.028, originLngLat[1] + 0.018]
    const interceptHudEl = document.createElement('div')
    interceptHudEl.className = 'floating-3d-hud'
    interceptHudEl.innerHTML = `
      <div class="hud-glass-card coral-glow">
        <div class="hud-header">
          <span style="display:flex;align-items:center;gap:5px;">
            <span class="hud-dot coral"></span>
            <span class="hud-title">FORENSIC INTERCEPT</span>
          </span>
          <span class="hud-badge coral">CPA MATCH</span>
        </div>
        <div class="hud-stats">
          <span>CPA <strong style="color: #ff5252">0.82 NM</strong></span>
          <span class="hud-sep">|</span>
          <span>Δt <strong style="color: #ff5252">18 min</strong></span>
        </div>
        <div class="hud-meta">VESSEL: <strong>${primarySuspect ? primarySuspect.vessel.name : 'MT OCEANUS PRIDE'}</strong></div>
      </div>
      <div class="hud-stem coral"></div>
    `
    const interceptMarker = new mapboxgl.Marker({ element: interceptHudEl, anchor: 'bottom' })
      .setLngLat(interceptLngLat)
      .addTo(map)
    markersRef.current.push(interceptMarker)

    // HUD 3: 3D Vessel Model Badge at Origin ("MT OCEANUS PRIDE")
    const vesselEl = document.createElement('div')
    vesselEl.className = 'vessel-3d-marker'
    vesselEl.innerHTML = `
      <div class="vessel-3d-badge">
        <span>🚢</span>
        <span>${primarySuspect ? primarySuspect.vessel.name : 'MT OCEANUS PRIDE'}</span>
        <span style="background:rgba(244,63,94,0.3);color:#ff5252;padding:0 3px;border-radius:2px;font-size:0.55rem;">
          ${primarySuspect ? primarySuspect.overallScore : 92.4}%
        </span>
      </div>
    `
    vesselEl.onclick = () => {
      if (primarySuspect) setSelectedSuspect(primarySuspect)
    }
    const vesselMarker = new mapboxgl.Marker({ element: vesselEl, anchor: 'center' })
      .setLngLat([originLngLat[0] - 0.005, originLngLat[1] - 0.002])
      .addTo(map)
    markersRef.current.push(vesselMarker)

    // HUD 4: Other Legal Sea Traffic (Trawlers & Cargo outside scene)
    const legalTrafficPoints = [
      { name: 'FV Sagar Kanya (Trawler)', lngLat: [originLngLat[0] - 0.09, originLngLat[1] + 0.06] as [number, number] },
      { name: 'MV Coastal Trader', lngLat: [originLngLat[0] + 0.075, originLngLat[1] - 0.055] as [number, number] },
      { name: 'INS Tarini (Naval Patrol)', lngLat: [originLngLat[0] + 0.11, originLngLat[1] + 0.025] as [number, number] }
    ]

    legalTrafficPoints.forEach((v) => {
      const trafficEl = document.createElement('div')
      trafficEl.className = 'legal-traffic-badge'
      trafficEl.innerHTML = `<span>⚓</span><span>${v.name}</span>`
      const marker = new mapboxgl.Marker({ element: trafficEl, anchor: 'center' })
        .setLngLat(v.lngLat)
        .addTo(map)
      markersRef.current.push(marker)
    })
  }

  // 5. Continuous Canvas Particle Flow Overlay (Driven by Metocean Current + Wind Vectors)
  useEffect(() => {
    const canvas = particleCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = (canvas.width = canvas.parentElement?.clientWidth || 800)
    const height = (canvas.height = canvas.parentElement?.clientHeight || 600)

    const currAngle = (incident.metocean.currentDirectionDegrees * Math.PI) / 180
    const currSpeed = incident.metocean.currentSpeedKnots
    const windAngle = (incident.metocean.windDirectionDegrees * Math.PI) / 180
    const windSpeed = incident.metocean.windSpeedKnots * 0.03

    const flowVx = (currSpeed * Math.sin(currAngle) + windSpeed * Math.sin(windAngle)) * 1.5
    const flowVy = -(currSpeed * Math.cos(currAngle) + windSpeed * Math.cos(windAngle)) * 1.5

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 8 + Math.random() * 12,
      speed: 0.6 + Math.random() * 0.8,
      opacity: 0.2 + Math.random() * 0.4
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

          p.x += flowVx * p.speed
          p.y += flowVy * p.speed
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

  // Focus presets handler with 3D camera angles
  const handleFocusPresetClick = (preset: FocusPreset) => {
    triggerFocusPreset(preset)
    if (!mapInstanceRef.current) return
    const map = mapInstanceRef.current
    const originCoords = incident.hindcast.probableOrigin.coordinates

    switch (preset) {
      case 'CORRIDOR':
        map.flyTo({ center: [originCoords[1], originCoords[0]], zoom: 9.5, pitch: 60, bearing: -20, duration: 1200 })
        break
      case 'SLICK':
        map.flyTo({ center: [incident.detection.centroid[1], incident.detection.centroid[0]], zoom: 11.2, pitch: 60, bearing: -20, duration: 1200 })
        break
      case 'ORIGIN':
        map.flyTo({ center: [originCoords[1], originCoords[0]], zoom: 12.2, pitch: 65, bearing: -25, duration: 1200 })
        break
      case 'TOP_SUSPECT':
        map.flyTo({ center: [originCoords[1] + 0.02, originCoords[0] + 0.015], zoom: 11.8, pitch: 60, bearing: -15, duration: 1200 })
        break
      case 'DARK_SEGMENT':
        map.flyTo({ center: [originCoords[1] - 0.035, originCoords[0] - 0.02], zoom: 12.0, pitch: 62, bearing: -30, duration: 1200 })
        break
    }
  }

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#050a12' }}>
      {/* Mapbox GL Map Container */}
      <div
        ref={mapContainerRef}
        className="map-viewport-container mapboxgl-map maplibregl-map leaflet-container h-full w-full relative"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Animated Metocean Particle Flow Canvas Overlay */}
      <canvas
        ref={particleCanvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 10
        }}
      />

      {/* Floating Top-Left Focus Presets Toolbar (Toolbar: z-20) */}
      <div
        className="glass-hud absolute top-4 left-4 z-20"
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 20,
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
          <span>3D FOCUS:</span>
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
              onClick={() => handleFocusPresetClick(preset.id)}
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

      {/* Floating Left Layer Manager HUD & Imagery Switcher (Under Focus Presets, z-20) */}
      <div
        className="absolute z-20"
        style={{
          position: 'absolute',
          top: '56px',
          left: '16px',
          zIndex: 20,
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

      {/* Floating Layer Toggles Drawer Menu (Dropdown: z-25) */}
      {isLayerHudOpen && (
        <div
          className="glass-hud absolute z-25"
          style={{
            position: 'absolute',
            top: '96px',
            left: '16px',
            zIndex: 25,
            width: '240px',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxHeight: '260px',
            overflowY: 'auto'
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
    </div>
  )
}
export default TacticalMapCanvas
