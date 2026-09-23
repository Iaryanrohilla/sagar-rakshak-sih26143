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

  // Construct dual-layer base map style (both dark and satellite pre-loaded to prevent map dropouts)
  const getDualBaseStyle = (): mapboxgl.StyleSpecification => {
    return {
      version: 8,
      sources: {
        'ocean-dark-source': {
          type: 'raster',
          tiles: [demoMapProvider.url],
          tileSize: 256,
          attribution: '&copy; Esri Dark Canvas, SAGAR RAKSHAK'
        },
        'satellite-source': {
          type: 'raster',
          tiles: [satelliteProvider.url],
          tileSize: 256,
          attribution: '&copy; Esri World Imagery'
        }
      },
      layers: [
        {
          id: 'ocean-dark-layer',
          type: 'raster',
          source: 'ocean-dark-source',
          minzoom: 0,
          maxzoom: 22,
          layout: {
            visibility: imageryMode === 'OPTICAL' ? 'none' : 'visible'
          },
          paint: {
            'raster-brightness-max': 0.92,
            'raster-contrast': 0.15
          }
        },
        {
          id: 'satellite-layer',
          type: 'raster',
          source: 'satellite-source',
          minzoom: 0,
          maxzoom: 22,
          layout: {
            visibility: (imageryMode === 'OPTICAL' || imageryMode === 'FUSION') ? 'visible' : 'none'
          },
          paint: {
            'raster-brightness-max': 0.96,
            'raster-contrast': 0.2,
            'raster-opacity': imageryMode === 'FUSION' ? 0.72 : 1.0
          }
        }
      ]
    }
  }

  // 1. Initialize Mapbox GL JS in Strict Clean Top-Down 2D Mode (pitch: 0, bearing: 0)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    const initialCenterLatLon = region ? region.center : incident.detection.centroid
    const initialLngLat: [number, number] = [initialCenterLatLon[1], initialCenterLatLon[0]]
    const initialZoom = region ? region.zoom : 9.5

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: getDualBaseStyle(),
      center: initialLngLat,
      zoom: initialZoom,
      pitch: 0, // Strict flat top-down 2D
      bearing: 0, // Strict north-aligned 2D
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

  // 2. Seamlessly toggle base imagery layers without reloading or dropping the map
  useEffect(() => {
    if (!mapInstanceRef.current) return
    const map = mapInstanceRef.current
    if (!map.isStyleLoaded()) return

    const isSatellite = imageryMode === 'OPTICAL' || imageryMode === 'FUSION'
    const isFusion = imageryMode === 'FUSION'

    if (map.getLayer('satellite-layer')) {
      map.setLayoutProperty('satellite-layer', 'visibility', isSatellite ? 'visible' : 'none')
      if (isSatellite) {
        map.setPaintProperty('satellite-layer', 'raster-opacity', isFusion ? 0.72 : 1.0)
      }
    }

    if (map.getLayer('ocean-dark-layer')) {
      map.setLayoutProperty('ocean-dark-layer', 'visibility', (imageryMode === 'SAR' || isFusion) ? 'visible' : 'none')
    }

    // Adapt slick polygon colors for Optical vs SAR mode
    if (map.getLayer('slick-polygon-line')) {
      map.setPaintProperty(
        'slick-polygon-line',
        'line-color',
        imageryMode === 'OPTICAL' ? '#10b981' : '#00d2b4'
      )
    }
    if (map.getLayer('slick-polygon-fill')) {
      map.setPaintProperty(
        'slick-polygon-fill',
        'fill-color',
        imageryMode === 'OPTICAL' ? '#064e3b' : '#020713'
      )
    }
  }, [imageryMode])

  // 3. React to focus targets & presets in strict 2D
  useEffect(() => {
    if (!mapInstanceRef.current) return
    const map = mapInstanceRef.current

    if (mapFocusTarget) {
      map.flyTo({
        center: [mapFocusTarget[1], mapFocusTarget[0]],
        zoom: Math.max(map.getZoom(), 11),
        pitch: 0,
        bearing: 0,
        duration: 1000
      })
    } else if (region) {
      map.flyTo({
        center: [region.center[1], region.center[0]],
        zoom: region.zoom,
        pitch: 0,
        bearing: 0,
        duration: 800
      })
    }
  }, [incident.regionId, mapFocusTarget])

  // 4. Main Clean 2D Tactical Forensic Layer Renderer
  const renderForensicScene = (map: mapboxgl.Map) => {
    // Clear any existing custom DOM markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    const primarySuspect = selectedSuspect || incident.suspects[0]
    const originCoords = incident.hindcast.probableOrigin.coordinates
    const originLngLat: [number, number] = [originCoords[1], originCoords[0]]

    // Clean up existing GeoJSON sources/layers if re-rendering
    const layerIds = [
      'spill-origin-fill',
      'spill-origin-line',
      'origin-center-dot',
      'ais-uncertainty-fill',
      'ais-uncertainty-line',
      'slick-polygon-fill',
      'slick-polygon-line',
      'hindcast-line-glow',
      'hindcast-line-core',
      'suspect-track-glow',
      'suspect-track-core',
      'secondary-ships-dots',
      'secondary-ships-labels'
    ]
    const sourceIds = [
      'spill-origin-source',
      'ais-uncertainty-source',
      'slick-polygon-source',
      'hindcast-line-source',
      'suspect-track-source',
      'secondary-ships-source'
    ]

    layerIds.forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id)
    })
    sourceIds.forEach((id) => {
      if (map.getSource(id)) map.removeSource(id)
    })

    // =========================================================================
    // 1. CLEAN 2D FLAT SPILL ORIGIN BOUNDING BOX
    // =========================================================================
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
      id: 'spill-origin-fill',
      type: 'fill',
      source: 'spill-origin-source',
      paint: {
        'fill-color': '#00d2b4',
        'fill-opacity': 0.08
      }
    })

    map.addLayer({
      id: 'spill-origin-line',
      type: 'line',
      source: 'spill-origin-source',
      paint: {
        'line-color': '#00d2b4',
        'line-width': 2,
        'line-dasharray': [4, 4]
      }
    })

    // Exact T0 Origin Center Dot
    map.addLayer({
      id: 'origin-center-dot',
      type: 'circle',
      source: 'spill-origin-source',
      paint: {
        'circle-color': '#00d2b4',
        'circle-radius': 6,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 2
      }
    })

    // =========================================================================
    // 2. CLEAN 2D AIS UNCERTAINTY ZONES (Flat circles with dashed borders)
    // =========================================================================
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
        id: 'ais-uncertainty-fill',
        type: 'fill',
        source: 'ais-uncertainty-source',
        paint: {
          'fill-color': '#f59e0b',
          'fill-opacity': 0.14
        }
      })

      map.addLayer({
        id: 'ais-uncertainty-line',
        type: 'line',
        source: 'ais-uncertainty-source',
        paint: {
          'line-color': '#f59e0b',
          'line-width': 1.5,
          'line-dasharray': [3, 3]
        }
      })
    }

    // =========================================================================
    // 3. SUSPECT VESSEL TRACK (Crisp military radar trajectory)
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
      // Subtle background contrast line
      map.addLayer({
        id: 'suspect-track-glow',
        type: 'line',
        source: 'suspect-track-source',
        paint: {
          'line-color': '#f43f5e',
          'line-width': 5,
          'line-opacity': 0.35
        }
      })

      // Crisp dashed track
      map.addLayer({
        id: 'suspect-track-core',
        type: 'line',
        source: 'suspect-track-source',
        paint: {
          'line-color': '#f43f5e',
          'line-width': 2.5,
          'line-dasharray': [4, 3]
        }
      })
    }

    // =========================================================================
    // 4. OIL SLICK POLYGON & LAGRANGIAN HINDCAST
    // =========================================================================
    if (showSlickPolygon && incident.detection.polygon.length > 2) {
      const slickGeoJsonCoords: [number, number][] = incident.detection.polygon.map(toLngLat)
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
          'fill-color': imageryMode === 'OPTICAL' ? '#064e3b' : '#020713',
          'fill-opacity': 0.88
        }
      })

      map.addLayer({
        id: 'slick-polygon-line',
        type: 'line',
        source: 'slick-polygon-source',
        paint: {
          'line-color': imageryMode === 'OPTICAL' ? '#10b981' : '#00d2b4',
          'line-width': 2
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
          'line-width': 5,
          'line-opacity': 0.35
        }
      })

      map.addLayer({
        id: 'hindcast-line-core',
        type: 'line',
        source: 'hindcast-line-source',
        paint: {
          'line-color': '#00d2b4',
          'line-width': 2,
          'line-dasharray': [3, 2]
        }
      })
    }

    // =========================================================================
    // 5. SECONDARY SHIPS: MAPBOX SYMBOL LAYER (Collision detection enabled)
    // =========================================================================
    // Explicitly avoids DOM label clusters. Mapbox engine automatically hides colliding labels!
    const legalTrafficFeatures = [
      {
        type: 'Feature' as const,
        properties: { name: 'FV Sagar Kanya (Trawler)' },
        geometry: { type: 'Point' as const, coordinates: [originLngLat[0] - 0.09, originLngLat[1] + 0.06] as [number, number] }
      },
      {
        type: 'Feature' as const,
        properties: { name: 'MV Coastal Trader' },
        geometry: { type: 'Point' as const, coordinates: [originLngLat[0] + 0.075, originLngLat[1] - 0.055] as [number, number] }
      },
      {
        type: 'Feature' as const,
        properties: { name: 'INS Tarini (Naval Patrol)' },
        geometry: { type: 'Point' as const, coordinates: [originLngLat[0] + 0.11, originLngLat[1] + 0.025] as [number, number] }
      }
    ]

    map.addSource('secondary-ships-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: legalTrafficFeatures
      }
    })

    // Vessel dots
    map.addLayer({
      id: 'secondary-ships-dots',
      type: 'circle',
      source: 'secondary-ships-source',
      paint: {
        'circle-color': '#38bdf8',
        'circle-radius': 4.5,
        'circle-stroke-color': '#050a12',
        'circle-stroke-width': 1.5
      }
    })

    // Anti-collision Symbol Labels
    map.addLayer({
      id: 'secondary-ships-labels',
      type: 'symbol',
      source: 'secondary-ships-source',
      layout: {
        'text-field': ['get', 'name'],
        'text-size': 10,
        'text-anchor': 'top',
        'text-offset': [0, 0.6],
        'text-allow-overlap': false, // Engine auto-hides colliding labels
        'text-ignore-placement': false,
        'text-optional': true
      },
      paint: {
        'text-color': '#94a3b8',
        'text-halo-color': '#050a12',
        'text-halo-width': 1.5
      }
    })

    // =========================================================================
    // 6. PRIMARY EVIDENCE PANELS: STRICT OFFSET & CRISP MILITARY STYLING
    // =========================================================================

    // PANEL 1: SPILL ORIGIN (T₀) Panel (Offset strictly above origin point)
    const originHudEl = document.createElement('div')
    originHudEl.className = 'floating-tactical-hud'
    originHudEl.innerHTML = `
      <div class="hud-panel-clean teal-panel">
        <div class="hud-header">
          <span style="display:flex;align-items:center;gap:4px;">
            <span class="hud-dot teal"></span>
            <span class="hud-title">SPILL ORIGIN (T₀)</span>
          </span>
          <span class="hud-badge teal">CONFIRMED</span>
        </div>
        <div class="hud-coords">${originCoords[0].toFixed(3)}° N, ${originCoords[1].toFixed(3)}° E</div>
        <div class="hud-meta">Release: ${incident.characterisation.releaseWindowStart.slice(11, 16)} UTC • 94.6% Confidence</div>
      </div>
    `
    const originMarker = new mapboxgl.Marker({ element: originHudEl, offset: [0, -35] })
      .setLngLat(originLngLat)
      .addTo(map)
    markersRef.current.push(originMarker)

    // PANEL 2: FORENSIC INTERCEPT CPA Panel (Offset cleanly higher to prevent overlap)
    const interceptLngLat: [number, number] = [originLngLat[0] + 0.028, originLngLat[1] + 0.018]
    const interceptHudEl = document.createElement('div')
    interceptHudEl.className = 'floating-tactical-hud'
    interceptHudEl.innerHTML = `
      <div class="hud-panel-clean coral-panel">
        <div class="hud-header">
          <span style="display:flex;align-items:center;gap:4px;">
            <span class="hud-dot coral"></span>
            <span class="hud-title">FORENSIC INTERCEPT</span>
          </span>
          <span class="hud-badge coral">CPA MATCH</span>
        </div>
        <div class="hud-stats">
          <span>CPA <strong>0.82 NM</strong></span>
          <span class="hud-sep">|</span>
          <span>Δt <strong>18 min</strong></span>
        </div>
        <div class="hud-meta">VESSEL: <strong>${primarySuspect ? primarySuspect.vessel.name : 'MT OCEANUS PRIDE'}</strong></div>
      </div>
    `
    const interceptMarker = new mapboxgl.Marker({ element: interceptHudEl, offset: [0, -65] })
      .setLngLat(interceptLngLat)
      .addTo(map)
    markersRef.current.push(interceptMarker)

    // PANEL 3: SUSPECT VESSEL BADGE ("MT OCEANUS PRIDE") (Offset below vessel dot)
    const vesselEl = document.createElement('div')
    vesselEl.className = 'floating-tactical-hud'
    vesselEl.innerHTML = `
      <div class="vessel-panel-clean">
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
    const vesselMarker = new mapboxgl.Marker({ element: vesselEl, offset: [0, 25] })
      .setLngLat([originLngLat[0] - 0.005, originLngLat[1] - 0.002])
      .addTo(map)
    markersRef.current.push(vesselMarker)
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

  // Focus presets handler with clean 2D top-down camera flight
  const handleFocusPresetClick = (preset: FocusPreset) => {
    triggerFocusPreset(preset)
    if (!mapInstanceRef.current) return
    const map = mapInstanceRef.current
    const originCoords = incident.hindcast.probableOrigin.coordinates

    switch (preset) {
      case 'CORRIDOR':
        map.flyTo({ center: [originCoords[1], originCoords[0]], zoom: 9.5, pitch: 0, bearing: 0, duration: 800 })
        break
      case 'SLICK':
        map.flyTo({ center: [incident.detection.centroid[1], incident.detection.centroid[0]], zoom: 11.2, pitch: 0, bearing: 0, duration: 800 })
        break
      case 'ORIGIN':
        map.flyTo({ center: [originCoords[1], originCoords[0]], zoom: 12.0, pitch: 0, bearing: 0, duration: 800 })
        break
      case 'TOP_SUSPECT':
        map.flyTo({ center: [originCoords[1] + 0.02, originCoords[0] + 0.015], zoom: 11.5, pitch: 0, bearing: 0, duration: 800 })
        break
      case 'DARK_SEGMENT':
        map.flyTo({ center: [originCoords[1] - 0.035, originCoords[0] - 0.02], zoom: 11.8, pitch: 0, bearing: 0, duration: 800 })
        break
    }
  }

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#050a12' }}>
      {/* Clean 2D Mapbox GL Map Container */}
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

      {/* Floating Top-Left Focus Presets Toolbar */}
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

      {/* Floating Left Layer Manager HUD & Imagery Switcher */}
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

      {/* Floating Layer Toggles Drawer Menu */}
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
