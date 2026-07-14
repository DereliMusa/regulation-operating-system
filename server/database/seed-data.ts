// Demo data blueprints for the MVP seed. Device names, classes, notified
// bodies and readiness figures mirror the approved mockups
// (eski-veriler/certa-mvp/certra_technical_files, certra_saas_dashboard).
// Kept separate from server/database/seed.ts so the insertion logic stays
// short and the demo content is easy to edit on its own.
import type { GsprConformity } from '../../shared/types/gspr'
import type { RiskSeverity, RiskStatus } from '../../shared/types/risk'
import type { ClinicalSourceType, ClinicalEvidenceStatus } from '../../shared/types/clinical'
import type { PmsPlanType, PmsPlanStatus } from '../../shared/types/post-market'
import type { FindingSeverity } from '../../shared/types/auditor'
import type { DeviceClass, Regulation, TechnicalFileStatus } from '../../shared/types/technical-file'

function isoNow(offsetDays = 0): string {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + offsetDays)
  return date.toISOString()
}

function isoDate(offsetDays = 0): string {
  return isoNow(offsetDays).slice(0, 10)
}

export interface GsprBlueprint {
  gsprRef: string
  requirementText: string
  conformity: GsprConformity
  evidenceRefs?: string[]
  standardRefs?: string[]
  notes?: string
}

export interface RiskBlueprint {
  riskId: string
  hazardDescription: string
  severity: RiskSeverity
  probability: string
  status: RiskStatus
  mitigation?: string
  controlMeasureRef?: string
  verificationRef?: string
  traceabilityRefs?: string[]
}

export interface ClinicalBlueprint {
  cerRef: string
  sourceType: ClinicalSourceType
  title: string
  status: ClinicalEvidenceStatus
  aiSummary?: string
  confidence?: number
}

export interface PmsBlueprint {
  planType: PmsPlanType
  nextDueOffsetDays: number
  status: PmsPlanStatus
  confidence?: number
}

export interface FindingBlueprint {
  severity: FindingSeverity
  gsprRef?: string
  description: string
  recommendation?: string
}

export interface FileBlueprint {
  deviceName: string
  udiDi: string
  deviceClass: DeviceClass
  regulation: Regulation
  notifiedBody: string | null
  intendedUse: string
  readinessPercent: number
  status: TechnicalFileStatus
  gspr: GsprBlueprint[]
  risks: RiskBlueprint[]
  clinical?: ClinicalBlueprint[]
  pms?: PmsBlueprint[]
  findings?: FindingBlueprint[]
}

export const SEED_USER = {
  email: 'demo@certra.app',
  name: 'Elena Voss',
  role: 'ra' as const,
  password: 'CertraDemo!2026',
}

export const FILE_BLUEPRINTS: FileBlueprint[] = [
  {
    deviceName: 'CardioGuard Pro S2',
    udiDi: '087625143',
    deviceClass: 'III',
    regulation: 'MDR',
    notifiedBody: 'SZUTEST (2195)',
    intendedUse: 'Implantable cardiac monitoring and guard stent system.',
    readinessPercent: 100,
    status: 'approved',
    gspr: [
      { gsprRef: 'GSPR 1', requirementText: 'General safety and performance requirements', conformity: 'conforming', standardRefs: ['ISO 14971'] },
      { gsprRef: 'GSPR 10.2', requirementText: 'Chemical, physical and biological properties', conformity: 'conforming', standardRefs: ['ISO 10993-1'] },
      { gsprRef: 'GSPR 14', requirementText: 'Protection against radiation', conformity: 'conforming' },
    ],
    risks: [
      { riskId: 'RISK-001', hazardDescription: 'Electrical short circuit during implantation', severity: 'major', probability: 'P2', status: 'mitigated', mitigation: 'Insulated lead housing, redundant fuse.', controlMeasureRef: 'RCM-11', verificationRef: 'V&V-101' },
      { riskId: 'RISK-002', hazardDescription: 'Battery depletion undetected by patient', severity: 'critical', probability: 'P1', status: 'mitigated', mitigation: 'Low-battery alert via companion app.', controlMeasureRef: 'RCM-12', verificationRef: 'V&V-102' },
    ],
    clinical: [
      { cerRef: 'CER-001', sourceType: 'literature', title: 'Long-term outcomes of cardiac guard stents', status: 'approved', aiSummary: 'Five-year follow-up shows stable performance across 1,240 patients.', confidence: 96 },
    ],
    pms: [
      { planType: 'PSUR', nextDueOffsetDays: 96, status: 'active', confidence: 91 },
    ],
  },
  {
    deviceName: 'NeuroScan AI Interface',
    udiDi: '087625990',
    deviceClass: 'IIb',
    regulation: 'MDR',
    notifiedBody: 'TUV SUD (0123)',
    intendedUse: 'AI-assisted neural signal interpretation for diagnostic support.',
    readinessPercent: 78,
    status: 'in_review',
    gspr: [
      { gsprRef: 'GSPR 1', requirementText: 'General safety and performance requirements', conformity: 'conforming' },
      { gsprRef: 'GSPR 10.2', requirementText: 'Chemical, physical and biological properties', conformity: 'partial', notes: 'Awaiting updated biocompatibility report.' },
      { gsprRef: 'GSPR 17.1', requirementText: 'Software lifecycle and cybersecurity (IEC 62304)', conformity: 'partial', standardRefs: ['IEC 62304'] },
    ],
    risks: [
      { riskId: 'RISK-014', hazardDescription: 'AI misclassification of neural signal', severity: 'major', probability: 'P2', status: 'review', mitigation: 'Confidence-threshold gating with human review.', controlMeasureRef: 'RCM-42', verificationRef: 'V&V-201', traceabilityRefs: ['GSPR 17.1'] },
      { riskId: 'RISK-015', hazardDescription: 'Patient data privacy breach', severity: 'moderate', probability: 'P3', status: 'review', mitigation: 'End-to-end encryption of signal data.' },
    ],
    clinical: [
      { cerRef: 'CER-002', sourceType: 'investigation', title: 'Pilot clinical investigation: neural interface accuracy', status: 'in_review', aiSummary: 'Interim data shows 89% classification concordance.', confidence: 89 },
    ],
    pms: [
      { planType: 'PMCF', nextDueOffsetDays: 45, status: 'drafting', confidence: 74 },
    ],
    findings: [
      { severity: 'major', gsprRef: 'GSPR 17.1', description: 'Software lifecycle evidence incomplete for IEC 62304 conformity.', recommendation: 'Submit full verification and validation records for the AI classifier.' },
    ],
  },
  {
    deviceName: 'GlucoCheck IVD Assay',
    udiDi: '011002341',
    deviceClass: 'C',
    regulation: 'IVDR',
    notifiedBody: 'BSI (0531)',
    intendedUse: 'Quantitative in-vitro glucose concentration assay.',
    readinessPercent: 42,
    status: 'deficiency',
    gspr: [
      { gsprRef: 'GSPR 1', requirementText: 'General safety and performance requirements', conformity: 'partial' },
      { gsprRef: 'GSPR 17.1', requirementText: 'Software lifecycle and cybersecurity (IEC 62304)', conformity: 'missing' },
      { gsprRef: 'GSPR 20.1', requirementText: 'Performance evaluation (IVDR)', conformity: 'missing' },
    ],
    risks: [
      { riskId: 'RISK-021', hazardDescription: 'False negative result at low glucose concentration', severity: 'critical', probability: 'P2', status: 'draft' },
      { riskId: 'RISK-022', hazardDescription: 'Reagent degradation before expiry', severity: 'major', probability: 'P3', status: 'draft' },
    ],
    findings: [
      { severity: 'critical', gsprRef: 'GSPR 17.1', description: 'Missing electrical and software safety evidence.', recommendation: 'Submit IEC 62304 lifecycle documentation before resubmission.' },
      { severity: 'major', gsprRef: 'GSPR 20.1', description: 'Literature search not documented for performance evaluation.', recommendation: 'Complete a systematic literature review per IVDR Annex XIII.' },
    ],
  },
  {
    deviceName: 'Orthopedic Fusion System',
    udiDi: '098817223',
    deviceClass: 'IIa',
    regulation: 'MDR',
    notifiedBody: 'DEKRA (0124)',
    intendedUse: 'Spinal fusion fixation hardware.',
    readinessPercent: 15,
    status: 'draft',
    gspr: [
      { gsprRef: 'GSPR 1', requirementText: 'General safety and performance requirements', conformity: 'missing' },
      { gsprRef: 'GSPR 8', requirementText: 'Mechanical properties and construction', conformity: 'missing' },
    ],
    risks: [
      { riskId: 'RISK-030', hazardDescription: 'Implant loosening over time', severity: 'moderate', probability: 'P3', status: 'draft' },
    ],
  },
  {
    deviceName: 'OrthoFix Pro',
    udiDi: '045512207',
    deviceClass: 'IIb',
    regulation: 'MDR',
    notifiedBody: 'TUV SUD (0123)',
    intendedUse: 'Load-bearing bone fixation system.',
    readinessPercent: 88,
    status: 'in_review',
    gspr: [
      { gsprRef: 'GSPR 1', requirementText: 'General safety and performance requirements', conformity: 'conforming' },
      { gsprRef: 'GSPR 10.2', requirementText: 'Chemical, physical and biological properties', conformity: 'conforming' },
      { gsprRef: 'GSPR 14', requirementText: 'Protection against radiation', conformity: 'partial' },
    ],
    risks: [
      { riskId: 'RISK-040', hazardDescription: 'Screw thread fatigue under cyclic load', severity: 'minor', probability: 'P3', status: 'mitigated', mitigation: 'Revised thread geometry, fatigue-tested to 10M cycles.' },
      { riskId: 'RISK-041', hazardDescription: 'MRI compatibility uncertain above 1.5T', severity: 'moderate', probability: 'P2', status: 'review' },
    ],
    clinical: [
      { cerRef: 'CER-003', sourceType: 'literature', title: 'Biomechanical fatigue testing of fixation systems', status: 'approved', aiSummary: 'Fatigue testing exceeds ASTM F1717 thresholds by 22%.', confidence: 94 },
    ],
    pms: [
      { planType: 'PSUR', nextDueOffsetDays: 12, status: 'pending_review', confidence: 88 },
    ],
    findings: [
      { severity: 'minor', description: 'Residual risk rationale unclear for RISK-041.', recommendation: 'Add explicit benefit-risk justification for high-field MRI use.' },
    ],
  },
]

export const AUDIT_LOG_BLUEPRINT: Array<{
  deviceName: string
  actorType: 'user' | 'ai' | 'system'
  actorName: string
  action: string
  description?: string
  impact: 'critical' | 'high' | 'medium' | 'low'
  entityType?: string
  entityRef?: string
  offsetDays: number
}> = [
  { deviceName: 'CardioGuard Pro S2', actorType: 'user', actorName: 'Elena Voss', action: 'Approved technical file', impact: 'high', entityType: 'technical_files', entityRef: 'CardioGuard Pro S2', offsetDays: -14 },
  { deviceName: 'NeuroScan AI Interface', actorType: 'ai', actorName: 'Certra AI', action: 'Generated risk hazard draft', description: 'Draft mitigation suggested for RISK-014.', impact: 'medium', entityType: 'risk_entries', entityRef: 'RISK-014', offsetDays: -3 },
  { deviceName: 'NeuroScan AI Interface', actorType: 'user', actorName: 'Marcus Weiss', action: 'Updated GSPR conformity', description: 'GSPR 10.2 marked partial pending biocompatibility report.', impact: 'medium', entityType: 'gspr_entries', entityRef: 'GSPR 10.2', offsetDays: -2 },
  { deviceName: 'GlucoCheck IVD Assay', actorType: 'system', actorName: 'System Service', action: 'Flagged deficiency status', description: 'Two open findings raised on last review pass.', impact: 'critical', entityType: 'technical_files', entityRef: 'GlucoCheck IVD Assay', offsetDays: -5 },
  { deviceName: 'GlucoCheck IVD Assay', actorType: 'user', actorName: 'Sarah Huang', action: 'Created technical file', impact: 'low', entityType: 'technical_files', entityRef: 'GlucoCheck IVD Assay', offsetDays: -20 },
  { deviceName: 'Orthopedic Fusion System', actorType: 'user', actorName: 'Sarah Huang', action: 'Created technical file', impact: 'low', entityType: 'technical_files', entityRef: 'Orthopedic Fusion System', offsetDays: -1 },
  { deviceName: 'OrthoFix Pro', actorType: 'ai', actorName: 'Certra AI', action: 'Generated PSUR draft', description: 'Draft PSUR prepared from post-market surveillance data.', impact: 'medium', entityType: 'pms_plans', entityRef: 'PSUR', offsetDays: -1 },
  { deviceName: 'OrthoFix Pro', actorType: 'system', actorName: 'System Service', action: 'Daily snapshot', impact: 'low', offsetDays: 0 },
]

export { isoNow, isoDate }
