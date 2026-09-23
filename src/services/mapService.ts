/**
 * SAGAR RAKSHAK — Map Provider Abstraction Service
 *
 * Provides a resilient, zero-credential map infrastructure for SIH Demo Mode.
 * DEMO MODE must NEVER depend on:
 * - Mapbox token
 * - CARTO API key
 * - Sentinel Hub key
 * - private backend credentials
 * - any undocumented environment variable
 *
 * Primary Provider: Esri World Dark Gray Canvas (zero-key, dark nautical styling)
 * Secondary Provider: OpenStreetMap with tactical CSS dark inversion filter
 * Optional Live Provider: Configurable if live API keys are supplied via environment
 */

export interface MapTileProviderConfig {
  name: string
  url: string
  attribution: string
  maxZoom: number
  minZoom?: number
  subdomains?: string | string[]
  className?: string
  ext?: string
}

export interface MapServiceAbstraction {
  demoMapProvider: MapTileProviderConfig
  fallbackMapProvider: MapTileProviderConfig
  liveMapProvider?: MapTileProviderConfig
  getActiveTileLayer: (leafletInstance?: any) => any
}

// 1. Primary Demo Provider: Esri Dark Gray Canvas (high performance, watermark-free, dark maritime palette)
export const demoMapProvider: MapTileProviderConfig = {
  name: 'Esri Dark Gray Canvas (Maritime Tactical)',
  url: 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  attribution: '&copy; <a href="https://www.esri.com" target="_blank" rel="noopener noreferrer">Esri</a>, DeLorme, NAVTEQ',
  maxZoom: 16,
  minZoom: 3,
  className: 'esri-dark-tiles'
}

// 2. High-Res Satellite Theme (Esri World Imagery / Mapbox Satellite Streets equivalent)
export const satelliteProvider: MapTileProviderConfig = {
  name: 'Esri World Imagery (High-Res Dark Satellite)',
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  attribution: '&copy; <a href="https://www.esri.com">Esri</a>, Maxar, Earthstar Geographics',
  maxZoom: 18,
  minZoom: 3,
  className: 'satellite-tiles'
}

// 3. Fallback Demo Provider: Standard OpenStreetMap with tactical dark styling filter
export const fallbackMapProvider: MapTileProviderConfig = {
  name: 'OpenStreetMap (Tactical Dark Fallback)',
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
  maxZoom: 19,
  minZoom: 3,
  className: 'tactical-dark-tiles'
}

// 4. Optional Live Map Provider (if env keys exist, else undefined)
export const getLiveMapProvider = (): MapTileProviderConfig | undefined => {
  const customUrl = (import.meta as any).env?.VITE_MAP_TILE_URL
  const customAttribution = (import.meta as any).env?.VITE_MAP_ATTRIBUTION
  if (customUrl) {
    return {
      name: 'Custom Live Tile Provider',
      url: customUrl,
      attribution: customAttribution || 'Custom Map Data',
      maxZoom: 18,
      minZoom: 3
    }
  }
  return undefined
}

/**
 * Creates an L.TileLayer guaranteed to render dark tactical ocean or satellite imagery without white glare.
 */
export function createTacticalTileLayer(leafletInstance?: any, mode: 'DARK' | 'SATELLITE' = 'DARK'): any {
  if (!leafletInstance) {
    return null
  }

  const liveProvider = getLiveMapProvider()
  const activeConfig = liveProvider || (mode === 'SATELLITE' ? satelliteProvider : demoMapProvider)

  const tileLayer = leafletInstance.tileLayer(activeConfig.url, {
    maxZoom: activeConfig.maxZoom,
    minZoom: activeConfig.minZoom ?? 3,
    attribution: activeConfig.attribution,
    className: activeConfig.className ?? ''
  })

  // Resilient error handler: if tile loading errors occur, fallback to OSM
  let hasFallenBack = false
  tileLayer.on('tileerror', () => {
    if (!hasFallenBack && activeConfig.url !== fallbackMapProvider.url) {
      hasFallenBack = true
      console.warn('[mapService] Primary tile error. Falling back to alternative dark nautical tiles.')
      tileLayer.setUrl(fallbackMapProvider.url)
    }
  })

  return tileLayer
}

export const mapService: MapServiceAbstraction = {
  demoMapProvider,
  fallbackMapProvider,
  liveMapProvider: getLiveMapProvider(),
  getActiveTileLayer: createTacticalTileLayer
}
