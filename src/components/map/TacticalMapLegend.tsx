import React, { useState } from 'react'
import { Info, ChevronDown, ChevronUp } from 'lucide-react'

export const TacticalMapLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

  const legendItems = [
    {
      id: 'SLICK',
      label: 'OIL SLICK',
      category: 'PRIMARY',
      color: '#00d2b4',
      lineStyle: 'Solid Boundary (2.8px)',
      shape: 'Polygon Fill',
      icon: '▱',
      desc: 'SAR Dual-Polarization Verified Slick'
    },
    {
      id: 'ORIGIN',
      label: 'SPILL ORIGIN',
      category: 'PRIMARY',
      color: '#00d2b4',
      lineStyle: 'Concentric Ring',
      shape: 'Target Point',
      icon: '●',
      desc: 'Lagrangian Backtrack Release Site (T₀)'
    },
    {
      id: 'HINDCAST',
      label: 'HINDCAST',
      category: 'DRIFT',
      color: '#00d2b4',
      lineStyle: 'Heavy Line',
      shape: 'Backward Vector',
      icon: '━━',
      desc: 'HYCOM + ECMWF Reverse Hydrodynamics'
    },
    {
      id: 'FORECAST',
      label: 'FORECAST',
      category: 'DRIFT',
      color: '#f59e0b',
      lineStyle: 'Dotted Line + Cone',
      shape: 'Forward Envelope',
      icon: '┅┅',
      desc: 'Forward Trajectory & Landfall Dispersion'
    },
    {
      id: 'AIS',
      label: 'AIS VESSEL',
      category: 'AIS',
      color: '#38bdf8',
      lineStyle: 'Solid Thin (1.5px)',
      shape: 'Waypoint Circle',
      icon: '•',
      desc: 'Background Commercial AIS Telemetry'
    },
    {
      id: 'CANDIDATE',
      label: 'TOP CANDIDATE',
      category: 'VESSEL',
      color: '#f43f5e',
      lineStyle: 'Heavy Dashed (6, 4)',
      shape: 'Diamond Marker',
      icon: '◆',
      desc: 'Potential Responsible Vessel'
    },
    {
      id: 'CPA',
      label: 'CPA / INTERCEPT',
      category: 'FORENSIC',
      color: '#f43f5e',
      lineStyle: 'Radar Reticle',
      shape: 'Intercept Star',
      icon: '✦',
      desc: 'Closest Point of Approach'
    },
    {
      id: 'SENSITIVE',
      label: 'SENSITIVE ZONE',
      category: 'ECOLOGY',
      color: '#a855f7',
      lineStyle: 'Dashed Perimeter',
      shape: 'Ecological Radius',
      icon: '🛡️',
      desc: 'Marine Sanctuary / SPM / Coral Reef'
    }
  ]

  return (
    <div
      className="glass-hud tactical-map-legend"
      style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        zIndex: 20,
        maxWidth: isExpanded ? '310px' : '180px',
        borderRadius: 'var(--radius-sm)',
        background: 'rgba(5, 10, 20, 0.94)',
        border: '1px solid var(--border-medium)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(12px)',
        overflow: 'hidden',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      aria-label="Tactical Map Semantics Legend"
    >
      {/* Header bar */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 10px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: 'none',
          borderBottom: isExpanded ? '1px solid var(--border-subtle)' : 'none',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          textAlign: 'left'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.66rem', fontFamily: 'var(--font-mono)', fontWeight: 800, letterSpacing: '0.04em' }}>
          <Info size={12} style={{ color: 'var(--accent-teal)' }} />
          <span>MAP SEMANTICS</span>
        </span>
        <span style={{ color: 'var(--text-muted)' }}>
          {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </span>
      </button>

      {/* Expanded Legend Content */}
      {isExpanded && (
        <div
          style={{
            padding: '8px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            maxHeight: '220px',
            overflowY: 'auto'
          }}
        >
          {legendItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '24px 1fr auto',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.62rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {/* Graphic Icon / Shape preview */}
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  borderRadius: '3px',
                  background: `${item.color}15`,
                  border: `1px solid ${item.color}50`,
                  color: item.color,
                  fontWeight: 900,
                  fontSize: '0.72rem'
                }}
                title={`${item.shape} — ${item.lineStyle}`}
              >
                {item.icon}
              </span>

              {/* Text Label & Accessibility Line Style */}
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{item.label}</span>
                <span style={{ fontSize: '0.54rem', color: 'var(--text-muted)' }}>{item.desc}</span>
              </div>

              {/* Graphical Line Style Swatch */}
              <svg width="34" height="12" style={{ flexShrink: 0 }}>
                {item.id === 'SLICK' && (
                  <rect x="2" y="2" width="30" height="8" rx="2" fill={`${item.color}25`} stroke={item.color} strokeWidth="1.5" />
                )}
                {item.id === 'ORIGIN' && (
                  <g>
                    <circle cx="17" cy="6" r="5" fill="none" stroke={item.color} strokeWidth="1.2" strokeDasharray="2,2" />
                    <circle cx="17" cy="6" r="2" fill={item.color} />
                  </g>
                )}
                {item.id === 'HINDCAST' && (
                  <line x1="2" y1="6" x2="32" y2="6" stroke={item.color} strokeWidth="2" strokeDasharray="4,2" />
                )}
                {item.id === 'FORECAST' && (
                  <line x1="2" y1="6" x2="32" y2="6" stroke={item.color} strokeWidth="2" strokeDasharray="2,2" />
                )}
                {item.id === 'CANDIDATE' && (
                  <line x1="2" y1="6" x2="32" y2="6" stroke={item.color} strokeWidth="2.5" strokeDasharray="5,3" />
                )}
                {item.id === 'CPA' && (
                  <g>
                    <line x1="12" y1="2" x2="22" y2="10" stroke={item.color} strokeWidth="1.8" />
                    <line x1="22" y1="2" x2="12" y2="10" stroke={item.color} strokeWidth="1.8" />
                  </g>
                )}
                {item.id === 'AIS' && (
                  <line x1="2" y1="6" x2="32" y2="6" stroke={item.color} strokeWidth="1.5" opacity="0.6" />
                )}
                {item.id === 'SENSITIVE' && (
                  <circle cx="17" cy="6" r="5" fill="none" stroke={item.color} strokeWidth="1.5" strokeDasharray="3,2" />
                )}
              </svg>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default TacticalMapLegend
