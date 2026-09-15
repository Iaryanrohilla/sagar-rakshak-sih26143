import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  Incident,
  AgencyRole,
  DemoScenario,
  SuspectRanking,
  AlertStatus
} from '../types'
import { DEMO_SCENARIOS } from '../data/scenarios'
import { SatelliteService } from '../services/satelliteService'
import { SlickDetectionService } from '../services/slickDetectionService'
import { CharacterisationService } from '../services/characterisationService'
import { DriftService } from '../services/driftService'
import { AISService } from '../services/aisService'
import { AttributionService } from '../services/attributionService'
import { AlertService } from '../services/alertService'

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

interface IncidentContextType {
  // Active Scenario & Incident
  currentScenario: DemoScenario;
  incident: Incident;
  selectScenario: (scenarioId: string) => void;

  // Agency Role
  activeRole: AgencyRole;
  setActiveRole: (role: AgencyRole) => void;

  // Pipeline Navigation & Active Stage
  activeStage: PipelineStage;
  setActiveStage: (stage: PipelineStage) => void;

  // Pipeline Execution States
  isProcessing: boolean;
  processingProgress: number;
  processingStatusText: string;

  // Action Triggers
  runPreprocessing: () => Promise<void>;
  runDetection: () => Promise<void>;
  runCharacterisation: () => Promise<void>;
  runHindcast: () => Promise<void>;
  runForecast: () => Promise<void>;
  runAISCorrelation: () => Promise<void>;
  runAttribution: () => Promise<void>;

  // Suspect Selection & Inspect
  selectedSuspect: SuspectRanking | null;
  setSelectedSuspect: (suspect: SuspectRanking | null) => void;

  // Alert Management
  updateAlertStatus: (alertId: string, newStatus: AlertStatus, note?: string) => void;

  // Report Modal
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;

  // Automated Judge Demo Orchestration
  isJudgeDemoRunning: boolean;
  judgeDemoStep: number;
  judgeDemoCaption: string;
  startJudgeDemo: () => void;
  pauseJudgeDemo: () => void;
  resumeJudgeDemo: () => void;
  stopJudgeDemo: () => void;

  // Map Controls
  mapFocusTarget: [number, number] | null;
  setMapFocusTarget: (coords: [number, number] | null) => void;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined)

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScenario, setCurrentScenario] = useState<DemoScenario>(DEMO_SCENARIOS[0])
  const [incident, setIncident] = useState<Incident>(DEMO_SCENARIOS[0].incident)
  const [activeRole, setActiveRole] = useState<AgencyRole>('COAST_GUARD')
  const [activeStage, setActiveStage] = useState<PipelineStage>('INGESTION')

  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [processingProgress, setProcessingProgress] = useState<number>(0)
  const [processingStatusText, setProcessingStatusText] = useState<string>('')

  const [selectedSuspect, setSelectedSuspect] = useState<SuspectRanking | null>(
    DEMO_SCENARIOS[0].incident.suspects[0] || null
  )
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false)
  const [mapFocusTarget, setMapFocusTarget] = useState<[number, number] | null>(
    DEMO_SCENARIOS[0].incident.detection.centroid
  )

  // Judge Demo state
  const [isJudgeDemoRunning, setIsJudgeDemoRunning] = useState<boolean>(false)
  const [judgeDemoStep, setJudgeDemoStep] = useState<number>(0)
  const [judgeDemoCaption, setJudgeDemoCaption] = useState<string>('')

  // Scenario Selection (Instant, deterministic)
  const selectScenario = useCallback((scenarioId: string) => {
    const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId)
    if (scenario) {
      setCurrentScenario(scenario)
      setIncident({ ...scenario.incident })
      setSelectedSuspect(scenario.incident.suspects[0] || null)
      setMapFocusTarget(scenario.incident.detection.centroid)
      setActiveStage('INGESTION')
      setIsProcessing(false)
      setProcessingProgress(0)
      setProcessingStatusText('')
    }
  }, [])

  // 1. Run Satellite Ingestion Preprocessing
  const runPreprocessing = async () => {
    setIsProcessing(true)
    setProcessingStatusText('Initializing SNAP Preprocessing Pipeline...')
    setProcessingProgress(10)

    try {
      const preprocessed = await SatelliteService.preprocessScene(incident.scene, (p) => {
        setProcessingStatusText(p.stepName)
        setProcessingProgress(p.percent)
      })

      setIncident((prev) => ({
        ...prev,
        scene: preprocessed
      }))
      setProcessingStatusText('Scene Radiometrically Calibrated & Terrain Corrected')
    } finally {
      setIsProcessing(false)
      setProcessingProgress(100)
    }
  }

  // 2. Run Oil Slick Detection Pipeline
  const runDetection = async () => {
    setIsProcessing(true)
    setProcessingStatusText('Running Neural Dark-Spot Segmentation...')
    setProcessingProgress(15)

    try {
      const detection = await SlickDetectionService.runDetectionPipeline(incident.scene, (p) => {
        setProcessingStatusText(p.stage)
        setProcessingProgress(p.progressPercent)
      })

      setIncident((prev) => ({
        ...prev,
        detection
      }))
      setMapFocusTarget(detection.centroid)
      setActiveStage('DETECTION')
    } finally {
      setIsProcessing(false)
      setProcessingProgress(100)
    }
  }

  // 3. Run Slick Characterisation & Ageing
  const runCharacterisation = async () => {
    setIsProcessing(true)
    setProcessingStatusText('Computing Slick Geometry & Mackay Physical Weathering...')
    setProcessingProgress(30)
    await new Promise((r) => setTimeout(r, 400))

    const char = CharacterisationService.characteriseSlick(incident.detection, incident.metocean)
    setIncident((prev) => ({
      ...prev,
      characterisation: char
    }))

    setIsProcessing(false)
    setProcessingProgress(100)
    setActiveStage('CHARACTERISATION')
  }

  // 4. Run Backward Drift Hindcast
  const runHindcast = async () => {
    setIsProcessing(true)
    setProcessingStatusText('Running OpenDrift Backward Lagrangian Particle Simulation...')
    setProcessingProgress(20)

    try {
      const hindcast = await DriftService.runBackwardHindcast(
        incident.detection,
        incident.characterisation,
        incident.metocean,
        (p) => setProcessingProgress(p)
      )

      setIncident((prev) => ({
        ...prev,
        hindcast
      }))
      setMapFocusTarget(hindcast.probableOrigin.coordinates)
      setActiveStage('HINDCAST')
    } finally {
      setIsProcessing(false)
      setProcessingProgress(100)
    }
  }

  // 5. Run Forward Drift Forecast
  const runForecast = async () => {
    setIsProcessing(true)
    setProcessingStatusText('Simulating 48-Hour Forward Hydrodynamic Trajectory & Coastal Impact...')
    setProcessingProgress(25)

    try {
      const forecast = await DriftService.runForwardForecast(
        incident.detection,
        incident.metocean,
        (p) => setProcessingProgress(p)
      )

      setIncident((prev) => ({
        ...prev,
        forecast
      }))
      setActiveStage('FORECAST')
    } finally {
      setIsProcessing(false)
      setProcessingProgress(100)
    }
  }

  // 6. Run AIS Correlation
  const runAISCorrelation = async () => {
    setIsProcessing(true)
    setProcessingStatusText('Cross-referencing Maritime Traffic Streams & Identifying Anomaly Gaps...')
    setProcessingProgress(25)

    try {
      const corr = await AISService.correlateVesselsWithOrigin(
        incident,
        incident.hindcast,
        (p) => setProcessingProgress(p)
      )

      setIncident((prev) => ({
        ...prev,
        aisVessels: corr.correlatedVessels
      }))
      setActiveStage('CORRELATION')
    } finally {
      setIsProcessing(false)
      setProcessingProgress(100)
    }
  }

  // 7. Run Explainable Attribution
  const runAttribution = async () => {
    setIsProcessing(true)
    setProcessingStatusText('Evaluating Multi-Factor Forensic Attribution Engine...')
    setProcessingProgress(35)
    await new Promise((r) => setTimeout(r, 450))

    const suspects = AttributionService.calculateAttribution(incident, incident.aisVessels)
    setIncident((prev) => ({
      ...prev,
      suspects
    }))

    if (suspects.length > 0) {
      setSelectedSuspect(suspects[0])
      setMapFocusTarget(suspects[0].vessel.currentPosition)
    }

    setIsProcessing(false)
    setProcessingProgress(100)
    setActiveStage('ATTRIBUTION')
  }

  // Alert Status Transition
  const updateAlertStatus = (alertId: string, newStatus: AlertStatus, note?: string) => {
    setIncident((prev) => {
      const updatedAlerts = prev.alerts.map((a) => {
        if (a.id === alertId) {
          return AlertService.updateAlertStatus(
            a,
            newStatus,
            `${activeRole.replace('_', ' ')} Operator`,
            note || `Status transitioned to ${newStatus}`
          )
        }
        return a
      })
      return { ...prev, alerts: updatedAlerts }
    })
  }

  // Automated Single-Click Judge Demo Tour (2-3 Minutes)
  const startJudgeDemo = () => {
    // Reset to baseline scenario
    selectScenario('mumbai-high-crude')
    setIsJudgeDemoRunning(true)
    setJudgeDemoStep(1)
  }

  const pauseJudgeDemo = () => {
    setIsJudgeDemoRunning(false)
  }

  const resumeJudgeDemo = () => {
    setIsJudgeDemoRunning(true)
  }

  const stopJudgeDemo = () => {
    setIsJudgeDemoRunning(false)
    setJudgeDemoStep(0)
    setJudgeDemoCaption('')
  }

  // Judge Demo Flow Execution Engine
  useEffect(() => {
    if (!isJudgeDemoRunning) return

    let timeoutId: ReturnType<typeof setTimeout>

    const executeStep = async () => {
      switch (judgeDemoStep) {
        case 1:
          setJudgeDemoCaption('Step 1/12: Initializing Satellite Pass over Mumbai High Western Fairway (Sentinel-1 SAR C-band Level-1 GRD).')
          setActiveStage('INGESTION')
          setMapFocusTarget(incident.scene.boundingBox[0])
          timeoutId = setTimeout(() => setJudgeDemoStep(2), 2600)
          break

        case 2:
          setJudgeDemoCaption('Step 2/12: Executing SNAP Preprocessing Pipeline — Radiometric Sigma0 Calibration, Speckle Lee Filter & Terrain Correction.')
          await runPreprocessing()
          timeoutId = setTimeout(() => setJudgeDemoStep(3), 1500)
          break

        case 3:
          setJudgeDemoCaption('Step 3/12: Running Deep Learning Segmentation (U-Net + ResNet-50) & Dual-Sensor Look-Alike Rejection.')
          await runDetection()
          timeoutId = setTimeout(() => setJudgeDemoStep(4), 2200)
          break

        case 4:
          setJudgeDemoCaption('Step 4/12: Slick Characterisation — Calculating 38.4 km² Surface Area, 3.25 Elongation Ratio & Mackay Weathering Kinetics.')
          await runCharacterisation()
          timeoutId = setTimeout(() => setJudgeDemoStep(5), 2400)
          break

        case 5:
          setJudgeDemoCaption('Step 5/12: Spill Age Estimated at 14.5 Hours. Release Window: 11:30–14:00 UTC (14 September).')
          timeoutId = setTimeout(() => setJudgeDemoStep(6), 2200)
          break

        case 6:
          setJudgeDemoCaption('Step 6/12: Running OpenDrift Lagrangian Backward Hindcast — Reversing HYCOM ocean currents and ECMWF winds (3% windage).')
          await runHindcast()
          timeoutId = setTimeout(() => setJudgeDemoStep(7), 2800)
          break

        case 7:
          setJudgeDemoCaption('Step 7/12: Probable Spill Origin Localized to 19.284°N, 71.215°E in Western Tanker Fairway (Confidence: 91.5%).')
          timeoutId = setTimeout(() => setJudgeDemoStep(8), 2400)
          break

        case 8:
          setJudgeDemoCaption('Step 8/12: Correlating Historical AIS Traffic — Spatio-temporal intersection flags 2.5h transponder blackout.')
          await runAISCorrelation()
          timeoutId = setTimeout(() => setJudgeDemoStep(9), 2600)
          break

        case 9:
          setJudgeDemoCaption('Step 9/12: Multi-Factor Attribution Engine — Scoring MT OCEANUS PRIDE at 92.4/100 (Course alignment, proximity, AIS blackout).')
          await runAttribution()
          timeoutId = setTimeout(() => setJudgeDemoStep(10), 2800)
          break

        case 10:
          setJudgeDemoCaption('Step 10/12: Selecting Primary Suspect Dossier — IMO 9482176, Laden Crude Tanker bound for Vadinar.')
          if (incident.suspects.length > 0) {
            setSelectedSuspect(incident.suspects[0])
            setMapFocusTarget(incident.suspects[0].vessel.currentPosition)
          }
          timeoutId = setTimeout(() => setJudgeDemoStep(11), 2400)
          break

        case 11:
          setJudgeDemoCaption('Step 11/12: Dispatching Automated Priority Alerts to Indian Coast Guard & DG Shipping.')
          setActiveStage('ALERTS')
          timeoutId = setTimeout(() => setJudgeDemoStep(12), 2400)
          break

        case 12:
          setJudgeDemoCaption('Step 12/12: Generating Court-Admissible MARPOL Annex I Forensic Evidence Dossier.')
          setIsReportModalOpen(true)
          setIsJudgeDemoRunning(false)
          setJudgeDemoCaption('Judge Demo Tour Complete: End-to-End Satellite to Vessel Attribution Verified.')
          break

        default:
          break
      }
    }

    executeStep()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [isJudgeDemoRunning, judgeDemoStep])

  return (
    <IncidentContext.Provider
      value={{
        currentScenario,
        incident,
        selectScenario,
        activeRole,
        setActiveRole,
        activeStage,
        setActiveStage,
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
        selectedSuspect,
        setSelectedSuspect,
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
