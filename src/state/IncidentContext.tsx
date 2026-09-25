import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  Incident,
  AgencyRole,
  DemoScenario,
  SuspectRanking,
  AlertStatus
} from '../types'
import { DEMO_SCENARIOS } from '../data/scenarios'
import { OpsUser } from '../services/supabaseClient'
import {
  WhatIfPerturbation,
  WhatIfResult,
  DEFAULT_PERTURBATION,
  calculateWhatIfSensitivity
} from '../services/whatIfService'
import {
  CopilotMessage,
  generateCopilotResponse
} from '../services/copilotService'

export type AppPage = 'AUTH' | 'LANDING' | 'CONSOLE'
export type ConsoleView = 'MAP' | 'EVIDENCE_GRAPH' | 'SUSPECTS' | 'WHAT_IF' | 'DOSSIER'
export type FocusPreset = 'CORRIDOR' | 'SLICK' | 'ORIGIN' | 'TOP_SUSPECT' | 'DARK_SEGMENT'

export type PipelineStage = 
  | 'INGESTION'
  | 'DETECTION'
  | 'CHARACTERISATION'
  | 'HINDCAST'
  | 'FORECAST'
  | 'CORRELATION'
  | 'ATTRIBUTION'
  | 'ALERTS'
  | 'AGENCY_VIEW';

export type ImageryMode = 'SAR' | 'OPTICAL' | 'FUSION';

interface IncidentContextType {
  // Navigation / Page Flow
  appPage: AppPage
  setAppPage: (page: AppPage) => void
  currentUser: OpsUser | null
  setCurrentUser: (user: OpsUser | null) => void
  login: (user: OpsUser) => void
  logout: () => void

  // Active Console View
  activeConsoleView: ConsoleView
  setActiveConsoleView: (view: ConsoleView) => void

  // Active Scenario & Incident
  currentScenario: DemoScenario
  incident: Incident
  selectScenario: (scenarioId: string) => void

  // Agency Role
  activeRole: AgencyRole
  setActiveRole: (role: AgencyRole) => void

  // Pipeline Navigation & Active Stage
  activeStage: PipelineStage
  setActiveStage: (stage: PipelineStage) => void

  // Visual Imagery Mode (SAR / Optical / AI Fusion)
  imageryMode: ImageryMode
  setImageryMode: (mode: ImageryMode) => void

  // Map Layer Toggles
  showSlickPolygon: boolean
  showDriftCone: boolean
  showForecast: boolean
  showAisTracks: boolean
  showCandidateVessels: boolean
  showCpaIntercept: boolean
  showSensitiveAreas: boolean
  showDarkSegments: boolean
  showCurrentVectors: boolean
  toggleMapLayer: (layer: 'slick' | 'drift' | 'hindcast' | 'forecast' | 'ais' | 'candidate' | 'cpa' | 'sensitive' | 'dark' | 'current') => void

  // Map Focus Presets
  activeFocusPreset: FocusPreset | null
  triggerFocusPreset: (preset: FocusPreset) => void

  // Animated Backward Hindcast
  hindcastPlaybackStep: number
  isHindcastPlaying: boolean
  startHindcastAnimation: () => void
  pauseHindcastAnimation: () => void
  setHindcastPlaybackStep: (step: number) => void

  // Animated Forward Forecast Time Slider (0h - 48h)
  forecastSliderHour: number
  isForecastPlaying: boolean
  setForecastSliderHour: (hour: number) => void
  startForecastAnimation: () => void
  pauseForecastAnimation: () => void

  // Geo-linking & Evidence Highlighting
  activeEvidenceHighlight: string | null
  showEvidenceOnMap: (vesselId: string) => void
  clearEvidenceHighlight: () => void

  // Suspect Selection & Exclude Actions
  selectedSuspect: SuspectRanking | null
  setSelectedSuspect: (suspect: SuspectRanking | null) => void
  excludedSuspectIds: string[]
  excludeSuspect: (suspectId: string, reason?: string) => void
  restoreSuspect: (suspectId: string) => void

  // What-If Sensitivity Testing
  whatIfPerturbation: WhatIfPerturbation
  whatIfResult: WhatIfResult
  setWhatIfPerturbation: (updates: Partial<WhatIfPerturbation>) => void
  resetWhatIfPerturbation: () => void

  // Docked AI Forensics Copilot
  isCopilotOpen: boolean
  setIsCopilotOpen: (open: boolean) => void
  copilotMessages: CopilotMessage[]
  sendCopilotQuery: (query: string) => void

  // Modals & Panels
  isWhyVesselModalOpen: boolean
  setIsWhyVesselModalOpen: (open: boolean) => void
  openWhyVessel: () => void
  closeWhyVessel: () => void

  isExplainAIModalOpen: boolean
  setIsExplainAIModalOpen: (open: boolean) => void
  explainAITopic: string
  openExplainAI: (topic?: string) => void
  closeExplainAI: () => void

  // Pipeline Execution States
  isProcessing: boolean
  processingProgress: number
  processingStatusText: string

  // Action Triggers
  runPreprocessing: () => Promise<void>
  runDetection: () => Promise<void>
  runCharacterisation: () => Promise<void>
  runHindcast: () => Promise<void>
  runForecast: () => Promise<void>
  runAISCorrelation: () => Promise<void>
  runAttribution: () => Promise<void>

  // Alert Management
  updateAlertStatus: (alertId: string, newStatus: AlertStatus, note?: string) => void

  // Report Modal
  isReportModalOpen: boolean
  setIsReportModalOpen: (open: boolean) => void

  // Automated Judge Demo Orchestration
  isJudgeDemoRunning: boolean
  judgeDemoStep: number
  judgeDemoCaption: string
  startJudgeDemo: () => void
  pauseJudgeDemo: () => void
  resumeJudgeDemo: () => void
  stopJudgeDemo: () => void

  // Map Controls
  mapFocusTarget: [number, number] | null
  setMapFocusTarget: (coords: [number, number] | null) => void
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined)

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [appPage, setAppPage] = useState<AppPage>('AUTH')
  const [currentUser, setCurrentUser] = useState<OpsUser | null>(null)
  const [activeConsoleView, setActiveConsoleView] = useState<ConsoleView>('MAP')

  // Core Incident State
  const [currentScenario, setCurrentScenario] = useState<DemoScenario>(DEMO_SCENARIOS[0])
  const [incident, setIncident] = useState<Incident>(DEMO_SCENARIOS[0].incident)
  const [activeRole, setActiveRole] = useState<AgencyRole>('COAST_GUARD')
  const [activeStage, setActiveStage] = useState<PipelineStage>('INGESTION')

  // Map Layer Toggles
  const [showSlickPolygon, setShowSlickPolygon] = useState<boolean>(true)
  const [showDriftCone, setShowDriftCone] = useState<boolean>(true)
  const [showForecast, setShowForecast] = useState<boolean>(true)
  const [showAisTracks, setShowAisTracks] = useState<boolean>(true)
  const [showCandidateVessels, setShowCandidateVessels] = useState<boolean>(true)
  const [showCpaIntercept, setShowCpaIntercept] = useState<boolean>(true)
  const [showSensitiveAreas, setShowSensitiveAreas] = useState<boolean>(true)
  const [showDarkSegments, setShowDarkSegments] = useState<boolean>(true)
  const [showCurrentVectors, setShowCurrentVectors] = useState<boolean>(true)

  // Map Focus Presets
  const [activeFocusPreset, setActiveFocusPreset] = useState<FocusPreset | null>(null)

  // Pipeline Processing
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [processingProgress, setProcessingProgress] = useState<number>(0)
  const [processingStatusText, setProcessingStatusText] = useState<string>('')

  // Suspects & Exclusions
  const [selectedSuspect, setSelectedSuspect] = useState<SuspectRanking | null>(
    DEMO_SCENARIOS[0].incident.suspects[0] || null
  )
  const [excludedSuspectIds, setExcludedSuspectIds] = useState<string[]>([])

  // What-If Simulation
  const [whatIfPerturbation, setWhatIfPerturbationState] = useState<WhatIfPerturbation>(DEFAULT_PERTURBATION)
  const [whatIfResult, setWhatIfResult] = useState<WhatIfResult>(() =>
    calculateWhatIfSensitivity(DEMO_SCENARIOS[0].incident, DEFAULT_PERTURBATION)
  )

  // Copilot State
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false)
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      id: 'init-1',
      sender: 'COPILOT',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: 'SAGAR RAKSHAK Maritime Forensics AI initialized. All satellite observations, Lagrangian drift vectors, and AIS telemetry are loaded for the active incident. Ask me about suspect attribution, sensor physics, or court defensibility.'
    }
  ])

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false)
  const [isWhyVesselModalOpen, setIsWhyVesselModalOpen] = useState<boolean>(false)
  const [isExplainAIModalOpen, setIsExplainAIModalOpen] = useState<boolean>(false)
  const [explainAITopic, setExplainAITopic] = useState<string>('Dual-Sensor SAR/Optical AI Fusion')

  // Map View
  const [mapFocusTarget, setMapFocusTarget] = useState<[number, number] | null>(
    DEMO_SCENARIOS[0].incident.detection.centroid
  )
  const [imageryMode, setImageryMode] = useState<ImageryMode>('SAR')
  const [activeEvidenceHighlight, setActiveEvidenceHighlight] = useState<string | null>(null)

  // Timeline / Scrubber
  const [hindcastPlaybackStep, setHindcastPlaybackStep] = useState<number>(-1)
  const [isHindcastPlaying, setIsHindcastPlaying] = useState<boolean>(false)
  const [forecastSliderHour, setForecastSliderHour] = useState<number>(48)
  const [isForecastPlaying, setIsForecastPlaying] = useState<boolean>(false)

  // Demo Tour
  const [isJudgeDemoRunning, setIsJudgeDemoRunning] = useState<boolean>(false)
  const [judgeDemoStep, setJudgeDemoStep] = useState<number>(0)
  const [judgeDemoCaption, setJudgeDemoCaption] = useState<string>('')

  // Recompute what-if when incident or perturbation changes
  useEffect(() => {
    const updated = calculateWhatIfSensitivity(incident, whatIfPerturbation)
    setWhatIfResult(updated)
  }, [incident, whatIfPerturbation])

  // Authentication Handlers
  const login = useCallback((user: OpsUser) => {
    setCurrentUser(user)
    setAppPage('LANDING')
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    setAppPage('AUTH')
  }, [])

  // Scenario Selection
  const selectScenario = useCallback((scenarioId: string) => {
    const found = DEMO_SCENARIOS.find((s) => s.id === scenarioId)
    if (found) {
      setCurrentScenario(found)
      setIncident(found.incident)
      const sortedSuspects = found.incident.suspects.length > 0
        ? [...found.incident.suspects].sort((a, b) => b.overallScore - a.overallScore)
        : []
      setSelectedSuspect(sortedSuspects[0] || null)
      setMapFocusTarget(null) // Resets to trigger full incident bounds fit
      setHindcastPlaybackStep(-1)
      setIsHindcastPlaying(false)
      setForecastSliderHour(48)
      setIsForecastPlaying(false)
      setActiveEvidenceHighlight(null)
      setExcludedSuspectIds([])
      setWhatIfPerturbationState(DEFAULT_PERTURBATION)
    }
  }, [])

  // Layer Toggles
  const toggleMapLayer = useCallback((layer: 'slick' | 'drift' | 'hindcast' | 'forecast' | 'ais' | 'candidate' | 'cpa' | 'sensitive' | 'dark' | 'current') => {
    switch (layer) {
      case 'slick': setShowSlickPolygon(prev => !prev); break
      case 'drift':
      case 'hindcast': setShowDriftCone(prev => !prev); break
      case 'forecast': setShowForecast(prev => !prev); break
      case 'ais': setShowAisTracks(prev => !prev); break
      case 'candidate': setShowCandidateVessels(prev => !prev); break
      case 'cpa': setShowCpaIntercept(prev => !prev); break
      case 'sensitive': setShowSensitiveAreas(prev => !prev); break
      case 'dark': setShowDarkSegments(prev => !prev); break
      case 'current': setShowCurrentVectors(prev => !prev); break
    }
  }, [])

  // Focus Presets
  const triggerFocusPreset = useCallback((preset: FocusPreset) => {
    setActiveFocusPreset(preset)
    switch (preset) {
      case 'CORRIDOR':
        setMapFocusTarget(null) // Resets to regional center
        break
      case 'SLICK':
        setMapFocusTarget(incident.detection.centroid)
        break
      case 'ORIGIN':
        if (incident.hindcast.probableOrigin?.coordinates) {
          setMapFocusTarget(incident.hindcast.probableOrigin.coordinates)
        }
        break
      case 'TOP_SUSPECT':
        if (incident.suspects[0]?.vessel.currentPosition) {
          setMapFocusTarget(incident.suspects[0].vessel.currentPosition)
        }
        break
      case 'DARK_SEGMENT': {
        const darkVessel = incident.aisVessels.find(v => v.hasBlackout)
        if (darkVessel && darkVessel.trajectory && darkVessel.trajectory.length >= 2) {
          setMapFocusTarget(darkVessel.trajectory[1].position)
        }
        break
      }
    }
  }, [incident])

  // Exclude / Restore Suspect
  const excludeSuspect = useCallback((suspectId: string, _reason?: string) => {
    setExcludedSuspectIds(prev => [...prev, suspectId])
    if (selectedSuspect?.vessel.id === suspectId) {
      const remaining = incident.suspects.filter(s => s.vessel.id !== suspectId && !excludedSuspectIds.includes(s.vessel.id))
      setSelectedSuspect(remaining[0] || null)
    }
  }, [incident, selectedSuspect, excludedSuspectIds])

  const restoreSuspect = useCallback((suspectId: string) => {
    setExcludedSuspectIds(prev => prev.filter(id => id !== suspectId))
  }, [])

  // What-If Perturbations
  const setWhatIfPerturbation = useCallback((updates: Partial<WhatIfPerturbation>) => {
    setWhatIfPerturbationState(prev => ({ ...prev, ...updates }))
  }, [])

  const resetWhatIfPerturbation = useCallback(() => {
    setWhatIfPerturbationState(DEFAULT_PERTURBATION)
  }, [])

  // Copilot Message Dispatch
  const sendCopilotQuery = useCallback((query: string) => {
    if (!query.trim()) return

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'USER',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: query.trim()
    }

    setCopilotMessages(prev => [...prev, userMsg])

    // Generate intelligent response with incident grounding
    setTimeout(() => {
      const response = generateCopilotResponse(query, incident)
      const botMsg: CopilotMessage = {
        id: `bot-${Date.now()}`,
        sender: 'COPILOT',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: response.content,
        evidencePills: response.evidencePills
      }
      setCopilotMessages(prev => [...prev, botMsg])
    }, 350)
  }, [incident])

  // Map Highlighting (Requirement 11)
  const showEvidenceOnMap = useCallback((vesselId: string) => {
    setActiveEvidenceHighlight(vesselId)
    // Guarantee that all primary evidence layers are visible
    setShowSlickPolygon(true)
    setShowCandidateVessels(true)
    setShowCpaIntercept(true)
    setShowDriftCone(true)
    setActiveConsoleView('MAP')

    const suspectMatch = incident.suspects.find((s) => s.vessel.id === vesselId || s.vessel.mmsi === vesselId)
    if (suspectMatch) {
      setSelectedSuspect(suspectMatch)
    }

    setActiveFocusPreset('CORRIDOR')
    setMapFocusTarget(null) // Triggers full forensic bounds fit
  }, [incident])

  const clearEvidenceHighlight = useCallback(() => {
    setActiveEvidenceHighlight(null)
  }, [])

  // Modals
  const openWhyVessel = useCallback(() => setIsWhyVesselModalOpen(true), [])
  const closeWhyVessel = useCallback(() => setIsWhyVesselModalOpen(false), [])

  const openExplainAI = useCallback((topic?: string) => {
    if (topic) setExplainAITopic(topic)
    setIsExplainAIModalOpen(true)
  }, [])
  const closeExplainAI = useCallback(() => setIsExplainAIModalOpen(false), [])

  // Playback Animations
  const startHindcastAnimation = useCallback(() => {
    setIsHindcastPlaying(true)
    setHindcastPlaybackStep(0)
  }, [])

  const pauseHindcastAnimation = useCallback(() => {
    setIsHindcastPlaying(false)
  }, [])

  const startForecastAnimation = useCallback(() => {
    setIsForecastPlaying(true)
    setForecastSliderHour(0)
  }, [])

  const pauseForecastAnimation = useCallback(() => {
    setIsForecastPlaying(false)
  }, [])

  // Ticking Hindcast Simulation Step
  useEffect(() => {
    let intervalId: any
    if (isHindcastPlaying) {
      intervalId = setInterval(() => {
        setHindcastPlaybackStep((prev) => {
          const maxSteps = incident.hindcast.timeSteps.length
          if (prev >= maxSteps - 1) {
            setIsHindcastPlaying(false)
            return maxSteps - 1
          }
          return prev + 1
        })
      }, 750)
    }
    return () => clearInterval(intervalId)
  }, [isHindcastPlaying, incident.hindcast.timeSteps.length])

  // Ticking Forecast Simulation Slider
  useEffect(() => {
    let intervalId: any
    if (isForecastPlaying) {
      intervalId = setInterval(() => {
        setForecastSliderHour((prev) => {
          if (prev >= 48) {
            setIsForecastPlaying(false)
            return 48
          }
          return prev + 6
        })
      }, 500)
    }
    return () => clearInterval(intervalId)
  }, [isForecastPlaying])

  // Pipeline Execution Methods
  const runPreprocessing = useCallback(async () => {
    setIsProcessing(true)
    setProcessingProgress(20)
    setProcessingStatusText('Ingesting Sentinel-1 SAR GRD Level-1 scene...')
    await new Promise((r) => setTimeout(r, 600))
    setProcessingProgress(70)
    setProcessingStatusText('Applying Lee Speckle Filter & Radiometric Calibration...')
    await new Promise((r) => setTimeout(r, 600))
    setProcessingProgress(100)
    setProcessingStatusText('Satellite Preprocessing Complete: Radar Backscatter Calibrated.')
    setIsProcessing(false)
  }, [])

  const runDetection = useCallback(async () => {
    setIsProcessing(true)
    setProcessingProgress(30)
    setProcessingStatusText('Executing Dual-Sensor U-Net segmentation...')
    await new Promise((r) => setTimeout(r, 600))
    setProcessingProgress(75)
    setProcessingStatusText('Cross-validating SWIR/NIR negative contrast with Sentinel-2...')
    await new Promise((r) => setTimeout(r, 600))
    setProcessingProgress(100)
    setProcessingStatusText('Mineral Oil Slick Polygon Confirmed (94.6% Confidence).')
    setIsProcessing(false)
  }, [])

  const runCharacterisation = useCallback(async () => {
    setIsProcessing(true)
    setProcessingProgress(40)
    setProcessingStatusText('Extracting Morphological Parameters (Area, Elongation, Volume)...')
    await new Promise((r) => setTimeout(r, 500))
    setProcessingProgress(80)
    setProcessingStatusText('Simulating Mackay Weathering Kinetics & Evaporation curve...')
    await new Promise((r) => setTimeout(r, 600))
    setProcessingProgress(100)
    setProcessingStatusText('Spill Characterised: Arabian Heavy Crude, ~14.5 Hours Old.')
    setIsProcessing(false)
  }, [])

  const runHindcast = useCallback(async () => {
    setIsProcessing(true)
    setProcessingProgress(30)
    setProcessingStatusText('Loading HYCOM ocean currents & ECMWF wind fields...')
    await new Promise((r) => setTimeout(r, 600))
    setProcessingProgress(70)
    setProcessingStatusText('Executing 100-particle Lagrangian backward drift backtrack...')
    await new Promise((r) => setTimeout(r, 700))
    setProcessingProgress(100)
    setProcessingStatusText('Backward Drift Complete: Release Origin Isolated with 95% Confidence.')
    setIsProcessing(false)
  }, [])

  const runForecast = useCallback(async () => {
    setIsProcessing(true)
    setProcessingProgress(40)
    setProcessingStatusText('Extrapolating 48-Hour Forward Hydrodynamic Trajectory...')
    await new Promise((r) => setTimeout(r, 600))
    setProcessingProgress(100)
    setProcessingStatusText('Forward Drift Cone Generated: Landfall Risk Profile Computed.')
    setIsProcessing(false)
  }, [])

  const runAISCorrelation = useCallback(async () => {
    setIsProcessing(true)
    setProcessingProgress(35)
    setProcessingStatusText('Reconstructing Historical AIS Tracks within Corridor...')
    await new Promise((r) => setTimeout(r, 600))
    setProcessingProgress(80)
    setProcessingStatusText('Screening AIS Transponder Blackout Anomalies...')
    await new Promise((r) => setTimeout(r, 600))
    setProcessingProgress(100)
    setProcessingStatusText('AIS Correlation Complete: 4 Commercial Tankers Tracked.')
    setIsProcessing(false)
  }, [])

  const runAttribution = useCallback(async () => {
    setIsProcessing(true)
    setProcessingProgress(40)
    setProcessingStatusText('Computing 5-Factor Bayesian Attribution Probabilities...')
    await new Promise((r) => setTimeout(r, 700))
    setProcessingProgress(100)
    setProcessingStatusText('Attribution Ranked: Primary Suspect Identified with 92.4% Probability.')
    setIsProcessing(false)
  }, [])

  const updateAlertStatus = useCallback((alertId: string, newStatus: AlertStatus) => {
    setIncident((prev) => ({
      ...prev,
      alerts: prev.alerts.map((alt) =>
        alt.id === alertId ? { ...alt, status: newStatus } : alt
      )
    }))
  }, [])

  // Judge Demo Tour Controls
  const startJudgeDemo = useCallback(() => {
    setIsJudgeDemoRunning(true)
    setJudgeDemoStep(1)
  }, [])

  const pauseJudgeDemo = useCallback(() => {
    setIsJudgeDemoRunning(false)
  }, [])

  const resumeJudgeDemo = useCallback(() => {
    setIsJudgeDemoRunning(true)
  }, [])

  const stopJudgeDemo = useCallback(() => {
    setIsJudgeDemoRunning(false)
    setJudgeDemoStep(0)
    setJudgeDemoCaption('')
  }, [])

  return (
    <IncidentContext.Provider
      value={{
        appPage,
        setAppPage,
        currentUser,
        setCurrentUser,
        login,
        logout,
        activeConsoleView,
        setActiveConsoleView,
        currentScenario,
        incident,
        selectScenario,
        activeRole,
        setActiveRole,
        activeStage,
        setActiveStage,
        imageryMode,
        setImageryMode,
        showSlickPolygon,
        showDriftCone,
        showForecast,
        showAisTracks,
        showCandidateVessels,
        showCpaIntercept,
        showSensitiveAreas,
        showDarkSegments,
        showCurrentVectors,
        toggleMapLayer,
        activeFocusPreset,
        triggerFocusPreset,
        hindcastPlaybackStep,
        isHindcastPlaying,
        startHindcastAnimation,
        pauseHindcastAnimation,
        setHindcastPlaybackStep,
        forecastSliderHour,
        isForecastPlaying,
        setForecastSliderHour,
        startForecastAnimation,
        pauseForecastAnimation,
        activeEvidenceHighlight,
        showEvidenceOnMap,
        clearEvidenceHighlight,
        selectedSuspect,
        setSelectedSuspect,
        excludedSuspectIds,
        excludeSuspect,
        restoreSuspect,
        whatIfPerturbation,
        whatIfResult,
        setWhatIfPerturbation,
        resetWhatIfPerturbation,
        isCopilotOpen,
        setIsCopilotOpen,
        copilotMessages,
        sendCopilotQuery,
        isWhyVesselModalOpen,
        setIsWhyVesselModalOpen,
        openWhyVessel,
        closeWhyVessel,
        isExplainAIModalOpen,
        setIsExplainAIModalOpen,
        explainAITopic,
        openExplainAI,
        closeExplainAI,
        isProcessing,
        processingProgress,
        processingStatusText,
        runPreprocessing,
        runDetection,
        runCharacterisation,
        runHindcast,
        runForecast,
        runAISCorrelation,
        runAttribution,
        updateAlertStatus,
        isReportModalOpen,
        setIsReportModalOpen,
        isJudgeDemoRunning,
        judgeDemoStep,
        judgeDemoCaption,
        startJudgeDemo,
        pauseJudgeDemo,
        resumeJudgeDemo,
        stopJudgeDemo,
        mapFocusTarget,
        setMapFocusTarget
      }}
    >
      {children}
    </IncidentContext.Provider>
  )
}

export const useIncident = () => {
  const context = useContext(IncidentContext)
  if (!context) {
    throw new Error('useIncident must be used within an IncidentProvider')
  }
  return context
}
