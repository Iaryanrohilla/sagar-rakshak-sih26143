import React, { useState, useEffect } from 'react'
import { X, Cpu, Satellite, Waves, ShieldCheck, Activity, ArrowRight } from 'lucide-react'
import { useIncident } from '../../state/IncidentContext'

export const ExplainAIModal: React.FC = () => {
  const { isExplainAIModalOpen, closeExplainAI, explainAITopic } = useIncident()
  const [activeTab, setActiveTab] = useState<string>('UNET_SEGMENTATION')

  useEffect(() => {
    if (explainAITopic) {
      setActiveTab(explainAITopic)
    }
  }, [explainAITopic])

  if (!isExplainAIModalOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 5, 12, 0.9)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={closeExplainAI}
    >
      <div
        style={{
          width: '920px',
          maxWidth: '96vw',
          maxHeight: '92vh',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--accent-cyan)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 16px 64px rgba(0, 242, 255, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(0, 242, 255, 0.15)',
                border: '1px solid var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Cpu size={20} color="var(--accent-cyan)" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.5px' }}>
                EXPLAIN THE AI & SCIENTIFIC METHODOLOGY
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                SAGAR RAKSHAK Core Physics Models, Neural Architectures & Evidentiary Standards
              </div>
            </div>
          </div>

          <button
            onClick={closeExplainAI}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            background: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border-medium)'
          }}
        >
          <button
            onClick={() => setActiveTab('UNET_SEGMENTATION')}
            style={{
              padding: '12px 8px',
              border: 'none',
              borderBottom: activeTab === 'UNET_SEGMENTATION' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              background: activeTab === 'UNET_SEGMENTATION' ? 'rgba(0, 242, 255, 0.08)' : 'transparent',
              color: activeTab === 'UNET_SEGMENTATION' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Satellite size={14} />
            <span>1. SAR DETECTION</span>
          </button>

          <button
            onClick={() => setActiveTab('MACKAY_WEATHERING')}
            style={{
              padding: '12px 8px',
              border: 'none',
              borderBottom: activeTab === 'MACKAY_WEATHERING' ? '2px solid var(--accent-amber)' : '2px solid transparent',
              background: activeTab === 'MACKAY_WEATHERING' ? 'rgba(255, 187, 0, 0.08)' : 'transparent',
              color: activeTab === 'MACKAY_WEATHERING' ? 'var(--accent-amber)' : 'var(--text-secondary)',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Activity size={14} />
            <span>2. WEATHERING & AGE</span>
          </button>

          <button
            onClick={() => setActiveTab('LAGRANGIAN_DRIFT')}
            style={{
              padding: '12px 8px',
              border: 'none',
              borderBottom: activeTab === 'LAGRANGIAN_DRIFT' ? '2px solid var(--accent-green)' : '2px solid transparent',
              background: activeTab === 'LAGRANGIAN_DRIFT' ? 'rgba(0, 255, 157, 0.08)' : 'transparent',
              color: activeTab === 'LAGRANGIAN_DRIFT' ? 'var(--accent-green)' : 'var(--text-secondary)',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Waves size={14} />
            <span>3. DRIFT HINDCAST</span>
          </button>

          <button
            onClick={() => setActiveTab('BAYESIAN_ATTRIBUTION')}
            style={{
              padding: '12px 8px',
              border: 'none',
              borderBottom: activeTab === 'BAYESIAN_ATTRIBUTION' ? '2px solid var(--accent-red)' : '2px solid transparent',
              background: activeTab === 'BAYESIAN_ATTRIBUTION' ? 'rgba(255, 34, 85, 0.08)' : 'transparent',
              color: activeTab === 'BAYESIAN_ATTRIBUTION' ? 'var(--accent-red)' : 'var(--text-secondary)',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={14} />
            <span>4. ATTRIBUTION AI</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* TAB 1: SAR U-Net DETECTION */}
          {activeTab === 'UNET_SEGMENTATION' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Deep Residual U-Net for SAR Slick Segmentation
                  </h3>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                    Sentinel-1 C-Band (5.405 GHz) & RISAT-1 Synthetic Aperture Radar Backscatter Processing
                  </p>
                </div>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0, 242, 255, 0.15)',
                    border: '1px solid var(--accent-cyan)',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  DAMPING THRESHOLD &gt; 8.5 dB
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr',
                  gap: '16px',
                  background: 'var(--bg-primary)',
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-medium)'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: 0 }}>
                    Physical Mechanism: Capillary Bragg Wave Suppression
                  </h4>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Hydrocarbon films drastically increase surface tension damping on short capillary-gravity ocean waves (wavelength λ ≈ 3–5 cm). Because radar backscatter σ₀ in C-Band VV polarization relies on Bragg resonance:
                  </p>
                  <div
                    style={{
                      background: 'rgba(0,0,0,0.5)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--accent-cyan)',
                      margin: '8px 0'
                    }}
                  >
                    λ_Bragg = λ_radar / (2 • sin θ_incidence) ≈ 4.1 cm
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    The oil slick damps these waves, creating a specular mirror reflection away from the sensor, producing a sharp 8–14 dB drop in normalized radar cross section (NRCS).
                  </p>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 0 }}>
                    Discrimination from "Look-Alikes"
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.03)', padding: '6px 8px', borderRadius: '4px' }}>
                      <strong style={{ color: 'var(--accent-green)' }}>Biogenic Slicks (Algal blooms):</strong> Exhibited as filamentary tendrils with damping &lt; 5 dB and high spatial variance.
                    </div>
                    <div style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.03)', padding: '6px 8px', borderRadius: '4px' }}>
                      <strong style={{ color: 'var(--accent-amber)' }}>Low Wind Zones (&lt; 2 m/s):</strong> Broad diffuse boundaries rejected via ECMWF ERA5 wind reanalysis.
                    </div>
                    <div style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.03)', padding: '6px 8px', borderRadius: '4px' }}>
                      <strong style={{ color: 'var(--accent-cyan)' }}>Mineral Oil Spills:</strong> Sharp gradient boundaries, asymmetric elongation matching prevailing drift, high damping (&gt; 8.5 dB).
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
                <h4 style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
                  Model Pipeline: ResNet-50 Encoder + Feature Pyramid Decoder
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  <span style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>SAR SLC Calibration</span>
                  <ArrowRight size={12} />
                  <span style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>Lee Speckle Filtering (7x7)</span>
                  <ArrowRight size={12} />
                  <span style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>Adaptive Thresholding</span>
                  <ArrowRight size={12} />
                  <span style={{ padding: '4px 8px', background: 'rgba(0,242,255,0.15)', color: 'var(--accent-cyan)', borderRadius: '4px', fontWeight: 700 }}>ResNet-50 Segmentation</span>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: MACKAY WEATHERING */}
          {activeTab === 'MACKAY_WEATHERING' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Mackay 1980 Weathering & Physicochemical Age Estimation
                  </h3>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                    Kinetic mass-balance degradation of crude and refined petroleum fractions at sea
                  </p>
                </div>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 187, 0, 0.15)',
                    border: '1px solid var(--accent-amber)',
                    color: 'var(--accent-amber)',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  ADIOS2 & BONN AGREEMENT CODES
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  background: 'var(--bg-primary)',
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-medium)'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: 0 }}>
                    1. Volatile Fraction Evaporation Kinetics
                  </h4>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Evaporative mass fraction Fv follows Mackay's analytical distillation formulation based on vapor pressure, temperature T_K, and mass transfer coefficient K_m:
                  </p>
                  <div
                    style={{
                      background: 'rgba(0,0,0,0.5)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--accent-amber)',
                      margin: '8px 0'
                    }}
                  >
                    F_v = (T_K / (B • K_e)) • ln(1 + K_e • B • θ)
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    Where θ is the evaporative exposure parameter = (k_m • A • t) / V₀. Light ends (C6–C12) evaporate within the first 12–18 hours.
                  </p>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: 0 }}>
                    2. Emulsification & Water Uptake (Mousse)
                  </h4>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Wave action drives seawater droplet incorporation into the viscous oil matrix:
                  </p>
                  <div
                    style={{
                      background: 'rgba(0,0,0,0.5)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--accent-amber)',
                      margin: '8px 0'
                    }}
                  >
                    Y_w = K_B • (1 - exp(-K_A • (1 + U_wind)² • t))
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    As water content Y_w approaches 60–80%, slick viscosity surges exponentially by 3 orders of magnitude: μ = μ₀ • exp(2.5 • Y_w / (1 - 0.65 • Y_w)).
                  </p>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
                <h4 style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
                  Slick Ageing Inversion Formula
                </h4>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                  By comparing the measured satellite thickness distribution (via Bonn Agreement spectral appearance: Sheen &lt; 0.3μm vs True Color &gt; 100μm) against known sea-surface temperature and 10m wind speed history, SAGAR RAKSHAK back-calculates the release age (t_release = 12.4h ± 2.2h) providing the strict time window for AIS correlation.
                </p>
              </div>
            </>
          )}

          {/* TAB 3: DRIFT HINDCAST */}
          {activeTab === 'LAGRANGIAN_DRIFT' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    OpenDrift 4th-Order Runge-Kutta Lagrangian Dynamics
                  </h3>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                    Hydrodynamic current forcing + atmospheric leeway + Stokes wave drift integration
                  </p>
                </div>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0, 255, 157, 0.15)',
                    border: '1px solid var(--accent-green)',
                    color: 'var(--accent-green)',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  2,500 PARTICLES • RK4 INTEGRATION
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.1fr 1fr',
                  gap: '16px',
                  background: 'var(--bg-primary)',
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-medium)'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-green)', marginTop: 0 }}>
                    Governing Drift Equation
                  </h4>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Each Lagrangian particle position x⃗(t) is governed by three vector fields:
                  </p>
                  <div
                    style={{
                      background: 'rgba(0,0,0,0.5)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--accent-green)',
                      margin: '8px 0'
                    }}
                  >
                    dx⃗/dt = U⃗_current + α • R(θ) • U⃗_wind + U⃗_Stokes + D⃗_turb
                  </div>
                  <ul style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', paddingLeft: '18px', margin: 0, lineHeight: 1.5 }}>
                    <li><strong>U⃗_current:</strong> Surface ocean current from INCOIS / HYCOM (0–2m depth).</li>
                    <li><strong>α • U⃗_wind:</strong> Wind leeway coefficient α = 0.03 (3% of 10m wind).</li>
                    <li><strong>R(θ):</strong> Coriolis deflection angle θ ≈ 15° to the right (Northern Hemisphere).</li>
                    <li><strong>U⃗_Stokes:</strong> Wave Stokes drift derived from significant wave height Hs and peak period Tp.</li>
                    <li><strong>D⃗_turb:</strong> Horizontal turbulent diffusion (random walk parameter K_h ≈ 1.5 m²/s).</li>
                  </ul>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 0 }}>
                    Backward Hindcast (Source Identification)
                  </h4>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    In backward hindcast mode, time is reversed (dt &lt; 0) and particles are propagated back along the inverse hydrodynamic vectors to reconstruct the spill origin distribution:
                  </p>
                  <div
                    style={{
                      background: 'rgba(0,0,0,0.5)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--accent-cyan)',
                      margin: '8px 0'
                    }}
                  >
                    x⃗(t_0) = x⃗(t_sat) - ∫ [U⃗_drift(τ)] dτ
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    The tight spatial cluster at t_0 defines the Probable Spill Origin Zone with 95% confidence bounds.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* TAB 4: BAYESIAN ATTRIBUTION */}
          {activeTab === 'BAYESIAN_ATTRIBUTION' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Bayesian AIS Multi-Hypothesis Suspect Attribution
                  </h3>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                    Probabilistic fusion of kinematic AIS tracks, closest point of approach (CPA), and intentional blackout penalties
                  </p>
                </div>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 34, 85, 0.15)',
                    border: '1px solid var(--accent-red)',
                    color: 'var(--accent-red)',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  BAYES POSTERIOR PROBABILITY
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.1fr 1fr',
                  gap: '16px',
                  background: 'var(--bg-primary)',
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-medium)'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-red)', marginTop: 0 }}>
                    Posterior Probability Formulation
                  </h4>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    For each candidate vessel V_i within the candidate pool:
                  </p>
                  <div
                    style={{
                      background: 'rgba(0,0,0,0.5)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--accent-red)',
                      margin: '8px 0'
                    }}
                  >
                    P(V_i | E) = [ P(E_spatial | V_i) • P(E_temp | V_i) • P(E_maneuver | V_i) • P(V_i) ] / ∑ P(E | V_j) P(V_j)
                  </div>
                  <ul style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', paddingLeft: '18px', margin: 0, lineHeight: 1.5 }}>
                    <li><strong>Spatial Likelihood:</strong> Gaussian decay over distance to origin: exp(-d_CPA² / (2 σ_r²)).</li>
                    <li><strong>Temporal Likelihood:</strong> Gaussian decay over delta t: exp(-(Δt - t_age)² / (2 σ_t²)).</li>
                    <li><strong>Trajectory Correlation:</strong> Cosine alignment between vessel heading and slick principal elongation axis.</li>
                    <li><strong>Blackout Multiplier:</strong> Intentional transponder gap increases culpability prior by 1.85x.</li>
                  </ul>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 0 }}>
                    MARPOL Legal Admissibility Benchmarks
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.03)', padding: '6px 8px', borderRadius: '4px' }}>
                      <strong style={{ color: 'var(--accent-red)' }}>Confidence &gt; 85%:</strong> Prima facie evidence meeting UNCLOS Part XII / MARPOL Annex I standard for Port State Control detention.
                    </div>
                    <div style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.03)', padding: '6px 8px', borderRadius: '4px' }}>
                      <strong style={{ color: 'var(--accent-amber)' }}>Confidence 60–84%:</strong> Sufficient for Coast Guard aerial verification and PSC boarding inspection at next port of call.
                    </div>
                    <div style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.03)', padding: '6px 8px', borderRadius: '4px' }}>
                      <strong style={{ color: 'var(--text-secondary)' }}>Confidence &lt; 60%:</strong> Informational notice logged in maritime surveillance ledger.
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            Methodology: INCOIS / ISRO RISAT-1 / ESA Sentinel-1 Validated Pipeline
          </div>

          <button
            onClick={closeExplainAI}
            style={{
              padding: '8px 18px',
              background: 'var(--accent-cyan)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: '#000',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            DISMISS
          </button>
        </div>

      </div>
    </div>
  )
}
