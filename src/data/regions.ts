import { PilotRegion } from '../types'

export const PILOT_REGIONS: Record<string, PilotRegion> = {
  'mumbai-high': {
    id: 'mumbai-high',
    name: 'Mumbai High Offshore Corridor',
    state: 'Maharashtra / Arabian Sea',
    description: 'Major offshore crude extraction basin (ONGC platforms) and high-density tanker transit lane along western seaboard.',
    center: [19.42, 71.35],
    zoom: 9,
    trafficDensity: 'EXTREME',
    sensitiveZones: [
      {
        name: 'ONGC Platform BNV Complex',
        type: 'SPM_TERMINAL',
        coordinates: [19.45, 71.32],
        radiusKm: 5.0
      },
      {
        name: 'Western Deepwater Tanker Fairway',
        type: 'PORT_CHANNEL',
        coordinates: [19.35, 71.45],
        radiusKm: 8.0
      },
      {
        name: 'Alibaug Coastal Estuary & Fishery Reserve',
        type: 'MANGROVE',
        coordinates: [18.65, 72.85],
        radiusKm: 12.0
      }
    ]
  },
  'gulf-of-kutch': {
    id: 'gulf-of-kutch',
    name: 'Gulf of Kutch Deepwater Basin',
    state: 'Gujarat / Arabian Sea',
    description: 'Critical crude import gateway handling ~70% of India’s imported crude (Deendayal/Kandla Port, Vadinar SPMs) adjacent to Marine National Park.',
    center: [22.45, 69.45],
    zoom: 9,
    trafficDensity: 'EXTREME',
    sensitiveZones: [
      {
        name: 'Marine National Park & Sanctuary (Coral & Mangroves)',
        type: 'CORAL_REEF',
        coordinates: [22.48, 69.60],
        radiusKm: 15.0
      },
      {
        name: 'Vadinar Single Point Mooring (SPM) Crude Terminal',
        type: 'SPM_TERMINAL',
        coordinates: [22.42, 69.72],
        radiusKm: 4.5
      },
      {
        name: 'Kandla Estuarine Port Channel',
        type: 'PORT_CHANNEL',
        coordinates: [22.95, 70.20],
        radiusKm: 8.0
      }
    ]
  },
  'chennai-ennore': {
    id: 'chennai-ennore',
    name: 'Chennai / Ennore Coastal Gateway',
    state: 'Tamil Nadu / Bay of Bengal',
    description: 'Busiest eastern maritime gateway (Kamarajar Port & Chennai Port) with historical sensitivity following 2017 collision spill.',
    center: [13.25, 80.38],
    zoom: 10,
    trafficDensity: 'HIGH',
    sensitiveZones: [
      {
        name: 'Kamarajar Port Oil Basin Approach',
        type: 'PORT_CHANNEL',
        coordinates: [13.26, 80.34],
        radiusKm: 5.0
      },
      {
        name: 'Pulicat Lake Brackish Estuary (Flamingo & Fishery Sanctuary)',
        type: 'MANGROVE',
        coordinates: [13.42, 80.32],
        radiusKm: 14.0
      },
      {
        name: 'Marina Beach Coastal Biome',
        type: 'MARINE_PARK',
        coordinates: [13.04, 80.28],
        radiusKm: 7.0
      }
    ]
  }
}
