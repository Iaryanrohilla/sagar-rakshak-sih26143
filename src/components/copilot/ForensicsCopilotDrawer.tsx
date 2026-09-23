import React, { useState, useRef, useEffect } from 'react'
import { useIncident } from '../../state/IncidentContext'
import { COPILOT_PRESET_QUESTIONS } from '../../services/copilotService'
import {
  Bot,
  Send,
  X,
  Sparkles
} from 'lucide-react'

export const ForensicsCopilotDrawer: React.FC = () => {
  const {
    isCopilotOpen,
    setIsCopilotOpen,
    copilotMessages,
    sendCopilotQuery,
    incident
  } = useIncident()

  const [inputVal, setInputVal] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isCopilotOpen) {
      scrollToBottom()
    }
  }, [copilotMessages, isCopilotOpen])

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputVal.trim()) return
    sendCopilotQuery(inputVal)
    setInputVal('')
  }

  const handlePresetClick = (q: string) => {
    sendCopilotQuery(q)
  }

  if (!isCopilotOpen) return null

  return (
    <div
      className="glass-hud copilot-drawer"
      style={{
        position: 'fixed',
        top: '60px',
        right: '14px',
        bottom: '34px',
        width: '450px',
        maxWidth: '94vw',
        zIndex: 1200,
        borderRadius: 'var(--radius-md)',
        border: '1.5px solid var(--accent-teal)',
        boxShadow: 'var(--shadow-hud), 0 0 25px rgba(0, 210, 180, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div
        style={{
          height: '46px',
          background: 'rgba(9, 17, 30, 0.98)',
          borderBottom: '1px solid var(--border-medium)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'rgba(0, 210, 180, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--accent-teal)'
            }}
          >
            <Bot size={15} style={{ color: 'var(--accent-teal)' }} />
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-teal)' }}>
              AI FORENSICS COPILOT
            </span>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
              [{incident.id}]
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsCopilotOpen(false)}
          title="Close Copilot Panel"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Preset Suggestion Chips */}
      <div
        style={{
          padding: '10px 14px',
          background: 'rgba(5, 10, 18, 0.85)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          <Sparkles size={12} style={{ color: 'var(--accent-amber)' }} />
          <span>SUGGESTED FORENSIC INQUIRIES:</span>
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          {COPILOT_PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetClick(q)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 10px',
                fontSize: '0.68rem',
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-teal)'
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Message Chat Feed */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        {copilotMessages.map((msg) => {
          const isUser = msg.sender === 'USER'

          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '88%',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div
                style={{
                  fontSize: '0.62rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  alignSelf: isUser ? 'flex-end' : 'flex-start'
                }}
              >
                {isUser ? 'OPERATOR' : 'FORENSICS COPILOT'} • {msg.timestamp}
              </div>

              <div
                style={{
                  background: isUser ? 'rgba(0, 210, 180, 0.15)' : 'rgba(15, 28, 48, 0.95)',
                  border: `1px solid ${isUser ? 'var(--accent-teal)' : 'var(--border-medium)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  lineHeight: 1.55,
                  boxShadow: 'var(--shadow-tactical)'
                }}
              >
                {/* Text formatting with basic markdown headers & bullets */}
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </div>

                {/* Optional Telemetry Evidence Pills */}
                {msg.evidencePills && msg.evidencePills.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginTop: '10px',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--border-subtle)'
                    }}
                  >
                    {msg.evidencePills.map((p, pIdx) => {
                      const pillColor = p.color === 'teal'
                        ? 'var(--accent-teal)'
                        : p.color === 'amber'
                        ? 'var(--accent-amber-bright)'
                        : p.color === 'coral'
                        ? 'var(--accent-coral)'
                        : 'var(--accent-green)'

                      return (
                        <div
                          key={pIdx}
                          style={{
                            padding: '3px 8px',
                            background: 'rgba(0, 0, 0, 0.4)',
                            border: `1px solid ${pillColor}60`,
                            borderRadius: 'var(--radius-xs)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.66rem'
                          }}
                        >
                          <span style={{ color: 'var(--text-muted)' }}>{p.label}: </span>
                          <strong style={{ color: pillColor }}>{p.value}</strong>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSend}
        style={{
          padding: '12px 14px',
          background: 'rgba(9, 17, 30, 0.98)',
          borderTop: '1px solid var(--border-medium)',
          display: 'flex',
          gap: '8px',
          flexShrink: 0
        }}
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask a question about this incident..."
          style={{
            flex: 1,
            height: '38px',
            background: 'rgba(5, 10, 18, 0.85)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            padding: '0 12px',
            color: '#ffffff',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            outline: 'none'
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent-teal)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
        />

        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="btn-tactical"
          style={{
            width: '42px',
            height: '38px',
            padding: 0,
            opacity: inputVal.trim() ? 1 : 0.4
          }}
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  )
}
