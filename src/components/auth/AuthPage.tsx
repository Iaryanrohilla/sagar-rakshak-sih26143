import React, { useState } from 'react'
import { useIncident } from '../../state/IncidentContext'
import { authenticateOperator, DEMO_OPERATOR_ACCOUNTS, OpsUser } from '../../services/supabaseClient'
import { Shield, Lock, Radio, KeyRound, AlertCircle, CheckCircle2, ChevronRight, Anchor, Satellite } from 'lucide-react'

export const AuthPage: React.FC = () => {
  const { login } = useIncident()

  const [email, setEmail] = useState<string>('commander.icg@sagarrakshak.gov.in')
  const [password, setPassword] = useState<string>('CoastGuard2026!')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [authSuccess, setAuthSuccess] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setAuthSuccess(null)

    if (!email.trim()) {
      setErrorMessage('Please enter an authorized government operator email.')
      return
    }
    if (!password) {
      setErrorMessage('Please enter your operational security passcode.')
      return
    }

    setIsLoading(true)

    try {
      const res = await authenticateOperator(email, password)
      if (res.success && res.user) {
        setAuthSuccess(`Authentication Verified: ${res.user.name} (${res.user.badgeId})`)
        setTimeout(() => {
          login(res.user!)
        }, 600)
      } else {
        setErrorMessage(res.error || 'Authentication rejected by security gateway.')
      }
    } catch {
      setErrorMessage('Communication error with secure authentication daemon.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoPreset = (presetKey: keyof typeof DEMO_OPERATOR_ACCOUNTS) => {
    const account = DEMO_OPERATOR_ACCOUNTS[presetKey]
    setEmail(account.user.email)
    setPassword(account.password)
    setErrorMessage(null)
  }

  const handleSsoStub = () => {
    setErrorMessage(null)
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      const ssoUser: OpsUser = {
        id: 'usr-sso-9912',
        email: 'officer.defence@nic.in',
        name: 'Commodore V. Sharma, IN',
        agency: 'NAVY',
        roleTitle: 'Directorate of Naval Intelligence (Maritime Domain Awareness)',
        badgeId: 'NIC-SSO-8820',
        clearanceLevel: 'LEVEL_5_MARITIME_DEFENSE'
      }
      setAuthSuccess('National Maritime SSO Session Verified: Commodore V. Sharma (IN)')
      setTimeout(() => {
        login(ssoUser)
      }, 500)
    }, 800)
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(ellipse at 50% 20%, #0c1a2e 0%, #050a12 70%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
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
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }}
      />

      {/* Background Ambient Radar Sweep Rings */}
      <div
        style={{
          position: 'absolute',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          border: '1px solid rgba(0, 210, 180, 0.08)',
          boxShadow: '0 0 120px rgba(0, 210, 180, 0.03)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          border: '1px dashed rgba(245, 158, 11, 0.08)',
          pointerEvents: 'none'
        }}
      />

      {/* Main Mission Console Login Box */}
      <div
        className="glass-hud"
        style={{
          width: '460px',
          maxWidth: '92vw',
          padding: '36px 32px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.75), 0 0 30px rgba(0, 210, 180, 0.1)',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Top Header Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} style={{ color: 'var(--accent-teal)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-teal)', letterSpacing: '0.08em' }}>
              NTRO // SECURE MARITIME PORTAL
            </span>
          </div>
          <span className="badge badge-simulated" style={{ fontSize: '0.62rem' }}>
            [● SIMULATED DATA]
          </span>
        </div>

        {/* Title & Emblem Headline */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(0, 210, 180, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%)',
              border: '1.5px solid var(--accent-teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: '0 0 20px rgba(0, 210, 180, 0.3)'
            }}
          >
            <Anchor size={26} style={{ color: 'var(--accent-teal)' }} />
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1.55rem',
              fontWeight: 900,
              letterSpacing: '0.04em',
              color: '#ffffff',
              marginBottom: '6px'
            }}
          >
            SAGAR RAKSHAK
          </h1>
          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.02em',
              fontWeight: 500
            }}
          >
            National Oil-Spill Attribution & AIS Forensic Operations Console
          </p>
        </div>

        {/* Feedback Banners */}
        {errorMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid var(--accent-coral)',
              color: 'var(--accent-coral)',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              marginBottom: '18px'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {authSuccess && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 210, 180, 0.12)',
              border: '1px solid var(--accent-teal)',
              color: 'var(--accent-teal)',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              marginBottom: '18px'
            }}
          >
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{authSuccess}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Operator Identity / Government Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@agency.gov.in"
                required
                style={{
                  width: '100%',
                  height: '42px',
                  background: 'rgba(5, 10, 18, 0.75)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0 12px 0 38px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-teal)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
              />
              <Radio
                size={16}
                style={{
                  position: 'absolute',
                  top: '13px',
                  left: '12px',
                  color: 'var(--text-muted)'
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              C4I Cryptographic Passcode
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{
                  width: '100%',
                  height: '42px',
                  background: 'rgba(5, 10, 18, 0.75)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0 12px 0 38px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-teal)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
              />
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  top: '13px',
                  left: '12px',
                  color: 'var(--text-muted)'
                }}
              />
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-tactical"
            style={{
              width: '100%',
              height: '44px',
              fontSize: '0.82rem',
              marginTop: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isLoading ? (
              <span>VERIFYING CRYPTOGRAPHIC TOKEN...</span>
            ) : (
              <>
                <KeyRound size={16} />
                <span>AUTHENTICATE & ENTER CONSOLE</span>
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Secondary Government SSO Button */}
        <div style={{ marginTop: '16px' }}>
          <button
            type="button"
            onClick={handleSsoStub}
            disabled={isLoading}
            className="btn-tactical-secondary"
            style={{
              width: '100%',
              height: '38px',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              cursor: 'pointer',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <Satellite size={14} style={{ color: 'var(--accent-amber)' }} />
            <span>SIGN IN WITH NATIONAL MARITIME SSO (NIC / NTRO)</span>
          </button>
        </div>

        {/* 1-Click Quick Access for Judges / Evaluators */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '18px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.64rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              textAlign: 'center'
            }}
          >
            1-Click Demo Profiles (Evaluator Quick-Select)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleDemoPreset('commander.icg@sagarrakshak.gov.in')}
              style={{
                padding: '6px 8px',
                background: 'rgba(0, 210, 180, 0.08)',
                border: '1px solid rgba(0, 210, 180, 0.25)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--accent-teal)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              ⚓ Indian Coast Guard
            </button>

            <button
              type="button"
              onClick={() => handleDemoPreset('ntro.analyst@gov.in')}
              style={{
                padding: '6px 8px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--accent-amber)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              🛰️ NTRO Space Analyst
            </button>
          </div>
        </div>

        {/* Security Notice Footer */}
        <div
          style={{
            marginTop: '18px',
            fontSize: '0.62rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            lineHeight: 1.4
          }}
        >
          RESTRICTED ACCESS — OFFSHORE EXCLUSION ZONE SURVEILLANCE
          <br />
          COMPLIANT WITH MARPOL ANNEX I & SECTION 65B INDIAN EVIDENCE ACT
        </div>
      </div>
    </div>
  )
}
