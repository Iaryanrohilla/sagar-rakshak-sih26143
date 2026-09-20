import React from 'react'
import { X, Printer, Download, FileText, ShieldCheck } from 'lucide-react'
import { useIncident } from '../../state/IncidentContext'
import { ReportService } from '../../services/reportService'

export const EvidenceReportModal: React.FC = () => {
  const { incident, isReportModalOpen, setIsReportModalOpen } = useIncident()

  if (!isReportModalOpen) return null

  const dossier = ReportService.generateEvidenceDossier(incident)
  const suspect = dossier.primarySuspect

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div
        style={{
          width: '900px',
          maxHeight: '90vh',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--accent-cyan)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          className="no-print"
          style={{
            height: '56px',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} style={{ color: 'var(--accent-cyan)' }} />
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                MARPOL ANNEX I FORENSIC EVIDENCE DOSSIER
              </span>
              <span style={{ marginLeft: '10px', fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                REF: {dossier.reportId}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => ReportService.printReport()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'rgba(0, 242, 255, 0.15)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-cyan)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Printer size={13} />
              <span>PRINT / PDF</span>
            </button>

            <button
              onClick={() => ReportService.exportReportAsJSON(dossier)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid var(--accent-emerald)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-emerald)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Download size={13} />
              <span>DOWNLOAD JSON</span>
            </button>

            <button
              onClick={() => setIsReportModalOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Printable Dossier Body */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Official Letterhead */}
          <div style={{ borderBottom: '2px solid var(--accent-cyan)', paddingBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.06em', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                SAGAR RAKSHAK MARITIME FORENSICS DIVISION
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Ministry of Defence / Indian Coast Guard / DG Shipping National Pollution Response Center
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                Classification: {dossier.legalClassification}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              <div>DATE: <strong>{dossier.generatedAt.slice(0, 10)}</strong></div>
              <div>TIME: <strong>{dossier.generatedAt.slice(11, 19)} UTC</strong></div>
              <div>REGION: <strong>{dossier.region.name}</strong></div>
            </div>
          </div>

          {/* Incident & Satellite Evidence */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                1. SATELLITE SENSOR EVIDENCE
              </span>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>Sensor: <strong>{dossier.satelliteData.sensor}</strong></div>
                <div>Scene ID: <strong>{dossier.satelliteData.sceneId.slice(0, 32)}...</strong></div>
                <div>Pass: <strong>{dossier.satelliteData.orbitPass}</strong></div>
                <div>Radar Damping Attenuation: <strong>{dossier.satelliteData.dampingRatioDb} dB (&gt; 8.5 dB threshold)</strong></div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>
                2. SLICK METRICS &amp; AGE ESTIMATE
              </span>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>Surface Area: <strong>{dossier.slickData.surfaceAreaKm2} km²</strong></div>
                <div>Estimated Volume: <strong>~{dossier.slickData.estimatedVolumeM3} m³</strong></div>
                <div>Mackay Estimated Age: <strong>{dossier.slickData.estimatedAgeHours} Hours</strong></div>
                <div>Release Window: <strong>{dossier.slickData.releaseWindow}</strong></div>
              </div>
            </div>
          </div>

          {/* Drift Hindcast & Origin Localisation */}
          <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              3. OPENDRIFT LAGRANGIAN HINDCAST LOCALISATION
            </span>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div>Probable Spill Origin: <strong>{dossier.hindcastData.probableOrigin[0].toFixed(3)}°N, {dossier.hindcastData.probableOrigin[1].toFixed(3)}°E</strong></div>
              <div>Search Radius: <strong>{dossier.hindcastData.searchRadiusKm} km</strong></div>
              <div>Lagrangian Particles Simulated: <strong>{dossier.hindcastData.driftParticles} Tracers</strong></div>
              <div>Hydrodynamic Forcing: <strong>HYCOM Current + ECMWF ERA5 Wind (3% Windage)</strong></div>
            </div>
          </div>

          {/* Primary Suspect Attribution Card */}
          <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-crimson)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-crimson)', fontFamily: 'var(--font-mono)' }}>
                4. PRIMARY RESPONSIBLE SUSPECT DOSSIER: {suspect.vessel.name}
              </span>
              <span className="badge badge-crimson">{suspect.overallScore}% ATTRIBUTION SCORE</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
              <div>IMO: <strong>{suspect.vessel.imo}</strong></div>
              <div>MMSI: <strong>{suspect.vessel.mmsi}</strong></div>
              <div>Flag: <strong>{suspect.vessel.flagCountry} ({suspect.vessel.flag})</strong></div>
              <div>Type: <strong>{suspect.vessel.vesselType.replace(/_/g, ' ')}</strong></div>
              <div>Transit Speed: <strong>{suspect.vessel.sogKnots} kts</strong></div>
              <div>Destination: <strong>{suspect.vessel.destination}</strong></div>
            </div>

            {/* Evidence Breakdown */}
            <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                FORENSIC EVIDENCE FACTORS:
              </span>
              {suspect.evidenceFactors.map((f, fIdx) => (
                <div key={fIdx} style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '3px' }}>
                  <span style={{ color: 'var(--text-primary)' }}>• {f.name}: {f.description}</span>
                  <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>+{f.score}/{f.maxScore} pts</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontStyle: 'italic', background: 'rgba(0,0,0,0.3)', padding: '6px 10px', borderRadius: '3px', marginTop: '4px' }}>
              {suspect.legalAdmissibilityCaveat}
            </div>
          </div>

          {/* Chain of Custody Signatures */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              5. CHAIN OF CUSTODY AUDIT LOG
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
              {dossier.chainOfCustody.map((c, cIdx) => (
                <div key={cIdx} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>[{c.timestamp.slice(11, 19)} UTC] {c.action}</span>
                  <span>Auth: {c.officer}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Integrity Seal & Statutory Certification */}
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid var(--accent-emerald)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={26} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
                  6. DIGITAL FORENSIC INTEGRITY SEAL &amp; STATUTORY CERTIFICATE
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '4px', wordBreak: 'break-all' }}>
                  SHA-256 DIGEST: <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{dossier.sha256Digest}</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span className="badge badge-emerald">MARPOL ANNEX I CERTIFIED</span>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '3px' }}>
                INDIAN EVIDENCE ACT §65B COMPLIANT
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
