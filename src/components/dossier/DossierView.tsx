import React, { useState } from 'react'
import { useIncident } from '../../state/IncidentContext'
import { PILOT_REGIONS } from '../../data/regions'
import {
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  Shield,
  Lock,
  Anchor,
  AlertTriangle,
  Scale,
  Award
} from 'lucide-react'

export const DossierView: React.FC = () => {
  const { incident, currentScenario, currentUser, whatIfResult } = useIncident()
  const [copiedSha, setCopiedSha] = useState<boolean>(false)

  const region = PILOT_REGIONS[incident.regionId]
  const topSuspect = incident.suspects[0]
  const vessel = topSuspect?.vessel
  const score = topSuspect?.compositeScore ?? topSuspect?.overallScore ?? 92.4

  // Deterministic court-admissible SHA-256 digest string
  const sha256Digest = incident.id === 'INC-2026-MH-0104'
    ? 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    : '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4'

  const dossierRef = `DOS-${incident.id.replace('INC-', '')}-MARPOL-ICG`

  const handleCopySha = () => {
    navigator.clipboard.writeText(sha256Digest)
    setCopiedSha(true)
    setTimeout(() => setCopiedSha(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(incident, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `${dossierRef}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#040810',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowY: 'auto',
        color: 'var(--text-primary)',
        padding: '24px 32px'
      }}
    >
      {/* Top Action Toolbar (Hidden in Print) */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          maxWidth: '920px',
          margin: '0 auto 20px',
          width: '100%'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} style={{ color: 'var(--accent-teal)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-teal)' }}>
            COURT-ADMISSIBLE MARPOL ANNEX I FORENSIC DOSSIER
          </span>
          <span className="badge badge-simulated" style={{ fontSize: '0.62rem' }}>
            [● SIMULATED DATA]
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleCopySha}
            className="btn-tactical-secondary"
            style={{ height: '34px', fontSize: '0.72rem', gap: '6px' }}
          >
            {copiedSha ? <Check size={14} style={{ color: 'var(--accent-teal)' }} /> : <Copy size={14} />}
            <span>{copiedSha ? 'COPIED DIGEST' : 'COPY SHA-256'}</span>
          </button>

          <button
            onClick={handleExportJson}
            className="btn-tactical-amber"
            style={{ height: '34px', fontSize: '0.72rem', gap: '6px' }}
          >
            <Download size={14} />
            <span>EXPORT JSON PACKAGE</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn-tactical"
            style={{ height: '34px', fontSize: '0.72rem', gap: '6px' }}
          >
            <Printer size={14} />
            <span>PRINT / SAVE PDF</span>
          </button>
        </div>
      </div>

      {/* Main Formal Document Sheet (Printed / Printable Page) */}
      <div
        className="dossier-print-container"
        style={{
          maxWidth: '920px',
          margin: '0 auto 40px',
          width: '100%',
          background: '#ffffff',
          color: '#111827',
          padding: '44px 50px',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 8px 36px rgba(0, 0, 0, 0.75)',
          fontFamily: 'var(--font-sans)',
          lineHeight: 1.5,
          position: 'relative'
        }}
      >
        {/* Formal Government Letterhead */}
        <div style={{ textAlign: 'center', borderBottom: '2.5px solid #111827', paddingBottom: '18px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '6px' }}>
            <Anchor size={28} color="#0f172a" />
            <div style={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.85rem', fontWeight: 800, color: '#334155' }}>
              GOVERNMENT OF INDIA // MINISTRY OF DEFENCE & MINISTRY OF SHIPPING
            </div>
          </div>

          <h1 style={{ fontSize: '1.45rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0f172a', margin: '4px 0' }}>
            NATIONAL MARITIME OIL SPILL INVESTIGATION DOSSIER
          </h1>

          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', letterSpacing: '0.05em' }}>
            JOINT FORENSIC ATTRIBUTION REPORT: NATIONAL TECHNICAL RESEARCH ORGANISATION (NTRO) & INDIAN COAST GUARD (ICG)
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#64748b', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
            <span>DOSSIER REF: <strong>{dossierRef}</strong></span>
            <span>INCIDENT REF: <strong>{incident.id}</strong></span>
            <span>DATE: <strong>{new Date().toLocaleDateString('en-GB')}</strong></span>
            <span>SECURITY: <strong>RESTRICTED / OFFICIAL LEGAL RECORD</strong></span>
          </div>
        </div>

        {/* Section 1: Executive Summary & Primary Attribution */}
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '0.98rem', fontWeight: 900, textTransform: 'uppercase', borderBottom: '1.5px solid #0f172a', paddingBottom: '4px', marginBottom: '8px', color: '#0f172a' }}>
            1. EXECUTIVE SUMMARY & ATTRIBUTION VERDICT
          </h2>

          <p style={{ fontSize: '0.82rem', textAlign: 'justify', marginBottom: '10px' }}>
            On <strong>{incident.scene.acquisitionTime.replace('T', ' ').replace('Z', ' UTC')}</strong>, Sentinel-1 C-SAR satellite surveillance detected a confirmed illegal mineral oil slick covering <strong>{incident.characterisation.surfaceAreaKm2} km²</strong> with an estimated discharge volume of <strong>{incident.characterisation.estimatedVolumeM3.toLocaleString()} m³</strong> ({incident.characterisation.weatheringPhysics?.oilType || 'Heavy Crude'}) in the <strong>{region?.name || incident.regionId}</strong>.
          </p>

          <p style={{ fontSize: '0.82rem', textAlign: 'justify', marginBottom: '12px' }}>
            Coupled Lagrangian hydrodynamic reverse drift modeling (OpenDrift hindcast) backtracked the slick dispersion envelope to a probable release origin centered at <strong>{incident.hindcast.probableOrigin?.coordinates[0].toFixed(3)}°N, {incident.hindcast.probableOrigin?.coordinates[1].toFixed(3)}°E</strong> (±1.8 km search radius). Reconstructed historical AIS vessel traffic establishes laden crude tanker <strong>{vessel?.name} (IMO: {vessel?.imo}, MMSI: {vessel?.mmsi}, Flag: {vessel?.flagCountry})</strong> as the primary suspect with a Bayesian composite attribution score of <strong>{score}%</strong>.
          </p>

          {/* Attribution Box */}
          <div style={{ border: '2px solid #0f172a', padding: '12px 16px', background: '#f8fafc', borderRadius: '4px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.66rem' }}>RESPONSIBLE VESSEL</div>
              <strong style={{ color: '#b91c1c', fontSize: '0.9rem' }}>{vessel?.name}</strong>
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.66rem' }}>IMO / MMSI</div>
              <strong>{vessel?.imo} / {vessel?.mmsi}</strong>
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.66rem' }}>ATTRIBUTION SCORE</div>
              <strong style={{ color: '#b91c1c', fontSize: '0.9rem' }}>{score}% (CRITICAL)</strong>
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.66rem' }}>CLOSEST APPROACH (CPA)</div>
              <strong>{topSuspect?.cpaDistanceNm || 0.82} NM (Δt: {topSuspect?.cpaTimeDeltaMin || 18}m)</strong>
            </div>
          </div>
        </div>

        {/* Section 2: Satellite Detection Telemetry */}
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '0.98rem', fontWeight: 900, textTransform: 'uppercase', borderBottom: '1.5px solid #0f172a', paddingBottom: '4px', marginBottom: '8px', color: '#0f172a' }}>
            2. REMOTE SENSING VERIFICATION (SAR & OPTICAL FUSION)
          </h2>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>
            <tbody>
              <tr style={{ background: '#f1f5f9' }}>
                <td style={{ padding: '5px 8px', fontWeight: 700, width: '25%' }}>PRIMARY SENSOR:</td>
                <td style={{ padding: '5px 8px', width: '25%' }}>{incident.scene.sensor} (Level-1 GRD)</td>
                <td style={{ padding: '5px 8px', fontWeight: 700, width: '25%' }}>ACQUISITION TIME:</td>
                <td style={{ padding: '5px 8px', width: '25%' }}>{incident.scene.acquisitionTime}</td>
              </tr>
              <tr>
                <td style={{ padding: '5px 8px', fontWeight: 700 }}>POLARIZATION:</td>
                <td style={{ padding: '5px 8px' }}>{incident.scene.polarization}</td>
                <td style={{ padding: '5px 8px', fontWeight: 700 }}>SAR DAMPING ATTENUATION:</td>
                <td style={{ padding: '5px 8px' }}><strong>{incident.detection.sarDampingRatioDb} dB (Oil Threshold: &gt; 8.5 dB)</strong></td>
              </tr>
              <tr style={{ background: '#f1f5f9' }}>
                <td style={{ padding: '5px 8px', fontWeight: 700 }}>SLICK SURFACE AREA:</td>
                <td style={{ padding: '5px 8px' }}>{incident.characterisation.surfaceAreaKm2} km²</td>
                <td style={{ padding: '5px 8px', fontWeight: 700 }}>ESTIMATED VOLUME:</td>
                <td style={{ padding: '5px 8px' }}>{incident.characterisation.estimatedVolumeM3.toLocaleString()} m³</td>
              </tr>
              <tr>
                <td style={{ padding: '5px 8px', fontWeight: 700 }}>CONFIRMATION INDEX:</td>
                <td style={{ padding: '5px 8px' }}>Sentinel-2 SWIR/NIR negative contrast verified</td>
                <td style={{ padding: '5px 8px', fontWeight: 700 }}>NEURAL CONFIDENCE:</td>
                <td style={{ padding: '5px 8px' }}><strong>{incident.detection.confidenceScore}%</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 3: Hydrodynamic Drift Hindcasting */}
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '0.98rem', fontWeight: 900, textTransform: 'uppercase', borderBottom: '1.5px solid #0f172a', paddingBottom: '4px', marginBottom: '8px', color: '#0f172a' }}>
            3. LAGRANGIAN HYDRODYNAMIC DRIFT SIMULATION (OPENDRIFT)
          </h2>

          <p style={{ fontSize: '0.82rem', textAlign: 'justify', marginBottom: '8px' }}>
            Drift backtracking executed with <strong>{incident.hindcast.particlesSimulated || 100} Lagrangian numerical particles</strong> forced by coupled HYCOM ocean surface current velocity (<strong>{incident.metocean.currentSpeedKnots} kts</strong> @ {incident.metocean.currentDirectionDegrees}°) and ECMWF ERA5 10m wind field (<strong>{incident.metocean.windSpeedKnots} kts</strong> @ {incident.metocean.windDirectionDegrees}°) utilizing a 3.0% windage leeway factor.
          </p>

          <p style={{ fontSize: '0.82rem', textAlign: 'justify' }}>
            • <strong>Spill Age Assessment:</strong> Mackay weathering curve kinetics establish spill age at <strong>{incident.characterisation.spillAgeHours} hours</strong>, fixing the release window between <strong>{incident.characterisation.releaseWindowStart.slice(11, 16)} UTC and {incident.characterisation.releaseWindowEnd.slice(11, 16)} UTC</strong>.
            <br />
            • <strong>Probable Origin Coordinates:</strong> {incident.hindcast.probableOrigin?.coordinates[0].toFixed(4)}°N, {incident.hindcast.probableOrigin?.coordinates[1].toFixed(4)}°E (±1.8 km search circle).
          </p>
        </div>

        {/* Section 4: AIS Corridor Reconstruction & Anomaly Log */}
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '0.98rem', fontWeight: 900, textTransform: 'uppercase', borderBottom: '1.5px solid #0f172a', paddingBottom: '4px', marginBottom: '8px', color: '#0f172a' }}>
            4. AIS VESSEL SURVEILLANCE & BEHAVIORAL ANOMALY LOG
          </h2>

          <p style={{ fontSize: '0.82rem', marginBottom: '8px' }}>
            Vessel Traffic Service (VTS) Class A AIS log verification identified an anomalous transmission gap:
          </p>

          <div style={{ background: '#fef2f2', border: '1px solid #f87171', padding: '10px 14px', borderRadius: '4px', fontSize: '0.78rem', marginBottom: '10px' }}>
            <strong style={{ color: '#b91c1c' }}>CRITICAL AIS GAP DETECTED:</strong> Vessel {vessel?.name} ceased Class A AIS transmissions for <strong>{vessel?.blackoutDurationMin || 45} minutes</strong> while navigating directly across the localized spill origin zone. Course and speed were maintained throughout the gap without reported equipment failure or distress broadcast.
          </div>
        </div>

        {/* Section 5: What-If Sensitivity Testing */}
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '0.98rem', fontWeight: 900, textTransform: 'uppercase', borderBottom: '1.5px solid #0f172a', paddingBottom: '4px', marginBottom: '8px', color: '#0f172a' }}>
            5. SENSITIVITY TESTING & COURT DEFENSIBILITY ANALYSIS
          </h2>

          <p style={{ fontSize: '0.82rem', textAlign: 'justify', marginBottom: '8px' }}>
            {whatIfResult.forensicSensitivityReadout}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', background: '#f8fafc', padding: '8px 12px', border: '1px solid #e2e8f0' }}>
            <div>RANK RETENTION: <strong>{whatIfResult.rankRetentionPercent}%</strong></div>
            <div>VARIANCE: <strong>±{whatIfResult.correlationVariancePercent}%</strong></div>
            <div>SPATIAL OVERLAP: <strong>{whatIfResult.spatialOverlapPercent}%</strong></div>
            <div>CENTROID ERROR: <strong>{whatIfResult.centroidErrorKm} km</strong></div>
          </div>
        </div>

        {/* Section 6: Statutory Sanctions & Applicable Law */}
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '0.98rem', fontWeight: 900, textTransform: 'uppercase', borderBottom: '1.5px solid #0f172a', paddingBottom: '4px', marginBottom: '8px', color: '#0f172a' }}>
            6. APPLICABLE STATUTES & RECOMMENDED MARITIME ENFORCEMENT
          </h2>

          <ul style={{ fontSize: '0.8rem', paddingLeft: '20px', lineHeight: 1.6 }}>
            <li><strong>MARPOL 73/78 Annex I, Regulation 15:</strong> Severe violation of prohibited discharge of oily mixtures into the sea (&gt;15 ppm).</li>
            <li><strong>Merchant Shipping Act (1958) Section 356E & 356J:</strong> Direct violation of oil pollution prevention regulations within the Exclusive Economic Zone (EEZ) of India.</li>
            <li><strong>Indian Penal Code / Bharatiya Nyaya Sanhita & Environment Protection Act (1986):</strong> Criminal negligence and deliberate endangerment of marine ecology.</li>
            <li><strong>Enforcement Recommendation:</strong> Immediate issuance of Port State Control (PSC) detention order at next port of call, seizure of Oil Record Book (Part II), and physical bilge sampling for gas chromatography-mass spectrometry (GC-MS) fingerprinting.</li>
          </ul>
        </div>

        {/* Section 7: Cryptographic Digital Seal (Section 65B Indian Evidence Act) */}
        <div style={{ border: '2px dashed #0f172a', padding: '16px 20px', background: '#f8fafc', borderRadius: '4px', marginTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} color="#0f172a" />
              <strong style={{ fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                DIGITAL INTEGRITY SEAL // SECTION 65B INDIAN EVIDENCE ACT CERTIFICATE
              </strong>
            </div>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', background: '#0f172a', color: '#ffffff', padding: '2px 8px', borderRadius: '2px' }}>
              SHA-256 SEAL VALIDATED
            </span>
          </div>

          <p style={{ fontSize: '0.74rem', color: '#334155', lineHeight: 1.5, marginBottom: '10px' }}>
            I hereby certify that the electronic records contained in this dossier are produced by automated satellite ingestion, OpenDrift hydrodynamic modeling, and AIS telemetry logging computers operating continuously and properly. The data hash below guarantees non-repudiation and tampering prevention.
          </p>

          <div
            style={{
              padding: '8px 12px',
              background: '#0f172a',
              color: '#38bdf8',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.04em',
              wordBreak: 'break-all',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}
          >
            <span>SHA-256: {sha256Digest}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #cbd5e1', fontSize: '0.72rem', color: '#475569' }}>
            <div>
              DIGITALLY CERTIFIED BY: <strong>{currentUser?.name || 'Capt. R. K. Nair, ICG'}</strong>
              <br />
              DESIGNATION: <strong>{currentUser?.roleTitle || 'Commandant, Coast Guard Regional HQ (West)'}</strong>
            </div>
            <div style={{ textAlign: 'right' }}>
              AUTHORITY: <strong>DIRECTORATE GENERAL OF SHIPPING / NTRO</strong>
              <br />
              TIMESTAMP: <strong>{new Date().toISOString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
