import React, { useState, useMemo } from 'react'
import { useIncident } from '../../state/IncidentContext'
import { PILOT_REGIONS } from '../../data/regions'
import { DEMO_SCENARIOS } from '../../data/scenarios'
import {
  Compass,
  Satellite,
  Search,
  ChevronRight,
  Shield,
  Activity,
  Layers,
  Radio,
  FileCheck,
  LogOut,
  MapPin,
  AlertTriangle,
  Waves
} from 'lucide-react'

export const LandingPage: React.FC = () => {
  const {
    currentUser,
    logout,
    setAppPage,
    selectScenario,
    currentScenario
  } = useIncident()

  const [searchQuery, setSearchQuery] = useState<string>('')

  // Search filter across scenarios, vessels, and pilot zones
  const filteredScenarios = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return DEMO_SCENARIOS

    return DEMO_SCENARIOS.filter((s) => {
      const inc = s.incident
      const matchesId = inc.id.toLowerCase().includes(q)
      const matchesTitle = inc.title.toLowerCase().includes(q)
      const matchesRegion = (PILOT_REGIONS[inc.regionId]?.name || '').toLowerCase().includes(q)
      const matchesVessel = inc.aisVessels.some(
        (v) => v.name.toLowerCase().includes(q) || v.mmsi.includes(q) || v.imo.includes(q)
      )
      return matchesId || matchesTitle || matchesRegion || matchesVessel
    })
  }, [searchQuery])

  const handleLaunchScenario = (scenarioId: string) => {
    selectScenario(scenarioId)
    setAppPage('CONSOLE')
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, #0c1a2e 0%, #050a12 85%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowY: 'auto',
        overflowX: 'hidden',
        color: 'var(--text-primary)'
      }}
    >
      {/* Background Animated Tactical Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(0, 210, 180, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 210, 180, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          pointerEvents: 'none'
        }}
      />

      {/* Top Command Bar */}
      <header
        style={{
          height: '60px',
          background: 'rgba(5, 10, 18, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-medium)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '6px',
              background: 'rgba(0, 210, 180, 0.15)',
              border: '1.5px solid var(--accent-teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Compass size={20} style={{ color: 'var(--accent-teal)' }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                SAGAR RAKSHAK
              </span>
              <span className="badge badge-teal" style={{ fontSize: '0.62rem' }}>
                C4I COMMAND
              </span>
              <span className="badge badge-simulated" style={{ fontSize: '0.62rem' }}>
                [● SIMULATED DATA]
              </span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              SIH 2026 // PS 26143 (NTRO) // Space Technology Software
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {currentUser && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '4px 12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem'
              }}
            >
              <Shield size={14} style={{ color: 'var(--accent-teal)' }} />
              <div>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{currentUser.name}</span>
                <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>[{currentUser.badgeId}]</span>
              </div>
            </div>
          )}

          <button
            onClick={() => setAppPage('CONSOLE')}
            className="btn-tactical"
            style={{ height: '36px', padding: '0 18px', fontSize: '0.75rem' }}
          >
            <span>ENTER OPERATIONS CONSOLE</span>
            <ChevronRight size={15} />
          </button>

          <button
            onClick={logout}
            title="Log Out of Console"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '6px'
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '36px 32px 60px', maxWidth: '1380px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
        {/* Full-Bleed Hero Section */}
        <section style={{ textAlign: 'center', marginBottom: '38px', paddingTop: '10px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(0, 210, 180, 0.1)',
              border: '1px solid rgba(0, 210, 180, 0.3)',
              color: 'var(--accent-teal)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              marginBottom: '16px'
            }}
          >
            <Satellite size={14} />
            <span>DUAL-SENSOR RADAR/OPTICAL INGESTION + LAGRANGIAN AIS ATTRIBUTION</span>
          </div>

          <h1
            style={{
              fontSize: '2.8rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: '14px',
              background: 'linear-gradient(180deg, #ffffff 30%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Every Slick Traced, Every Vessel Identified
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              maxWidth: '820px',
              margin: '0 auto 28px',
              lineHeight: 1.6
            }}
          >
            High-precision maritime oil-spill detection and causal attribution platform engineered for the National Technical Research Organisation (NTRO) and Indian Coast Guard. Correlating Sentinel-1 SAR backscatter attenuation with OpenDrift hydrodynamic hindcasting and AIS traffic telemetry.
          </p>

          {/* Quick Search Bar */}
          <div
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              position: 'relative'
            }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Incident ID (e.g. INC-2026-MH-0104), Vessel Name, or MMSI..."
              style={{
                width: '100%',
                height: '48px',
                background: 'rgba(9, 17, 30, 0.9)',
                border: '1.5px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '0 120px 0 44px',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.86rem',
                outline: 'none',
                boxShadow: 'var(--shadow-hud)',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent-teal)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
            />
            <Search
              size={18}
              style={{
                position: 'absolute',
                top: '15px',
                left: '16px',
                color: 'var(--text-muted)'
              }}
            />
            <button
              onClick={() => handleLaunchScenario(filteredScenarios[0]?.id || currentScenario.id)}
              className="btn-tactical"
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                height: '36px',
                padding: '0 14px',
                fontSize: '0.72rem'
              }}
            >
              <span>INSPECT</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </section>

        {/* Persistent Incident Reconstruction Telemetry Ribbon */}
        <section
          className="glass-hud"
          style={{
            borderRadius: 'var(--radius-md)',
            padding: '20px 24px',
            marginBottom: '40px',
            border: '1px solid var(--border-medium)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} style={{ color: 'var(--accent-teal)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-teal)', letterSpacing: '0.06em' }}>
                LIVE INCIDENT RECONSTRUCTION TELEMETRY HUD
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              METOCEAN RE-ANALYSIS: HYCOM (SURFACE CURRENTS) + ECMWF ERA5 (WINDAGE)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div style={{ padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div className="hero-number" style={{ color: 'var(--accent-teal)' }}>
                3 <span className="hero-unit">ZONES</span>
              </div>
              <div className="hero-label">High-Density Offshore Corridors</div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Kutch SPM, Mumbai High, Chennai/Ennore
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div className="hero-number" style={{ color: 'var(--accent-green)' }}>
                10.4 <span className="hero-unit">dB</span>
              </div>
              <div className="hero-label">Mean SAR Damping Ratio</div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Sentinel-1 VV/VH capillary wave attenuation
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div className="hero-number" style={{ color: 'var(--accent-amber)' }}>
                1,840 <span className="hero-unit">VESSELS</span>
              </div>
              <div className="hero-label">Real-Time AIS Correlated</div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Automated dark-vessel blackout screening
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div className="hero-number" style={{ color: 'var(--accent-coral)' }}>
                &lt; 12 <span className="hero-unit">MIN</span>
              </div>
              <div className="hero-label">Mean Attribution Latency</div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                End-to-end satellite ingest to legal dossier
              </div>
            </div>
          </div>
        </section>

        {/* Pilot Regions & Active Scenarios Quick-Launch Grid */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} style={{ color: 'var(--accent-amber)' }} />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.02em' }}>
                Operational Pilot Zones & Active Incidents
              </h2>
            </div>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              SELECT AN INCIDENT TO INITIALIZE MISSION CONSOLE
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            {filteredScenarios.map((scen) => {
              const reg = PILOT_REGIONS[scen.regionId]
              const inc = scen.incident
              const topSuspect = inc.suspects[0]
              const isSelected = currentScenario.id === scen.id

              return (
                <div
                  key={scen.id}
                  className="glass-card"
                  style={{
                    padding: '20px 22px',
                    borderColor: isSelected ? 'var(--accent-teal)' : 'var(--border-subtle)',
                    boxShadow: isSelected ? 'var(--shadow-teal-glow)' : 'var(--shadow-tactical)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {/* Header Pills */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span className="badge badge-teal">{reg?.name || scen.regionId}</span>
                      <span className="badge badge-coral" style={{ fontSize: '0.62rem' }}>
                        {inc.severity} SEVERITY
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '8px', color: '#ffffff' }}>
                      {scen.title}
                    </h3>

                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                      {scen.description}
                    </p>

                    {/* Incident Telemetry Specs */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        background: 'rgba(5, 10, 18, 0.65)',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        marginBottom: '16px'
                      }}
                    >
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>SLICK AREA:</span>{' '}
                        <strong style={{ color: 'var(--accent-teal)' }}>{inc.characterisation.surfaceAreaKm2} km²</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>CONFIDENCE:</span>{' '}
                        <strong style={{ color: 'var(--accent-teal)' }}>{inc.detection.confidenceScore}%</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>SPILL AGE:</span>{' '}
                        <strong>{inc.characterisation.spillAgeHours}h</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>TOP SUSPECT:</span>{' '}
                        <strong style={{ color: 'var(--accent-coral)' }}>{topSuspect?.vessel.name || 'MT OCEANUS'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                      ID: {inc.id}
                    </span>

                    <button
                      onClick={() => handleLaunchScenario(scen.id)}
                      className="btn-tactical"
                      style={{
                        padding: '6px 14px',
                        fontSize: '0.72rem',
                        gap: '6px'
                      }}
                    >
                      <span>LAUNCH CONSOLE</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      {/* Footer Status Bar */}
      <footer
        style={{
          height: '28px',
          background: '#04070d',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          fontSize: '0.64rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="pulse-dot teal" style={{ width: '6px', height: '6px' }} />
          <span style={{ color: 'var(--accent-teal)' }}>SATELLITE DOWNLINK: COPERNICUS HUB + ISRO MOSDAC ACTIVE</span>
          <span>|</span>
          <span>AIS STREAM: COASTAL VTS + S-AIS</span>
        </div>

        <div>
          <span>MARPOL ANNEX I PROTOCOL VERIFIED // TEAM CALCULUS</span>
        </div>
      </footer>
    </div>
  )
}
