// Populates the database with realistic MVP demo data. Content lives in
// seed-data.ts; this module only orchestrates the inserts and keeps
// referential integrity (technical file -> gspr/risk/clinical/pms/findings).
import type { Db } from '../utils/createDb'
import {
  users,
  technicalFiles,
  gsprEntries,
  riskEntries,
  clinicalEvidence,
  pmsPlans,
  auditorFindings,
  auditLog,
} from './schema'
import { SEED_USER, FILE_BLUEPRINTS, AUDIT_LOG_BLUEPRINT, isoNow, isoDate } from './seed-data'

export interface SeedDeps {
  /** Injected so the seed module never hard-depends on nuxt-auth-utils. */
  hashPassword: (password: string) => Promise<string> | string
}

/** Unwrap a single-row insert result; throws if the insert produced no row. */
function insertedRow<T>(rows: T[]): T {
  const [row] = rows
  if (!row) throw new Error('Insert returned no row')
  return row
}

/**
 * Seed a technical file's related records (GSPR, risk, clinical evidence,
 * post-market plans, auditor findings) for one blueprint.
 */
function seedFileDetails(db: Db, technicalFileId: number, blueprint: (typeof FILE_BLUEPRINTS)[number]): void {
  const now = isoNow()

  for (const gspr of blueprint.gspr) {
    db.insert(gsprEntries).values({
      technicalFileId,
      gsprRef: gspr.gsprRef,
      requirementText: gspr.requirementText,
      conformity: gspr.conformity,
      evidenceRefs: gspr.evidenceRefs ?? [],
      standardRefs: gspr.standardRefs ?? [],
      notes: gspr.notes ?? null,
      updatedAt: now,
    }).run()
  }

  for (const risk of blueprint.risks) {
    db.insert(riskEntries).values({
      technicalFileId,
      riskId: risk.riskId,
      hazardDescription: risk.hazardDescription,
      severity: risk.severity,
      probability: risk.probability,
      status: risk.status,
      mitigation: risk.mitigation ?? null,
      controlMeasureRef: risk.controlMeasureRef ?? null,
      verificationRef: risk.verificationRef ?? null,
      traceabilityRefs: risk.traceabilityRefs ?? [],
      updatedAt: now,
    }).run()
  }

  for (const clinical of blueprint.clinical ?? []) {
    db.insert(clinicalEvidence).values({
      technicalFileId,
      cerRef: clinical.cerRef,
      sourceType: clinical.sourceType,
      title: clinical.title,
      status: clinical.status,
      aiSummary: clinical.aiSummary ?? null,
      confidence: clinical.confidence ?? null,
      updatedAt: now,
    }).run()
  }

  for (const pms of blueprint.pms ?? []) {
    db.insert(pmsPlans).values({
      technicalFileId,
      planType: pms.planType,
      deviceRef: blueprint.deviceName,
      nextDue: isoDate(pms.nextDueOffsetDays),
      status: pms.status,
      confidence: pms.confidence ?? null,
      updatedAt: now,
    }).run()
  }

  for (const finding of blueprint.findings ?? []) {
    db.insert(auditorFindings).values({
      technicalFileId,
      severity: finding.severity,
      gsprRef: finding.gsprRef ?? null,
      description: finding.description,
      recommendation: finding.recommendation ?? null,
      status: 'open',
      createdAt: now,
      resolvedAt: null,
    }).run()
  }
}

/**
 * Populate an empty database with one demo user and a handful of technical
 * files spanning MDR/IVDR classes and statuses, each with related GSPR,
 * risk, clinical, and post-market records, plus sample audit-log activity.
 */
export async function seedDatabase(db: Db, deps: SeedDeps): Promise<void> {
  const now = isoNow()
  const passwordHash = await deps.hashPassword(SEED_USER.password)

  const owner = insertedRow(db.insert(users).values({
    email: SEED_USER.email,
    passwordHash,
    name: SEED_USER.name,
    role: SEED_USER.role,
    createdAt: now,
    updatedAt: now,
  }).returning().all())

  for (const blueprint of FILE_BLUEPRINTS) {
    const file = insertedRow(db.insert(technicalFiles).values({
      deviceName: blueprint.deviceName,
      udiDi: blueprint.udiDi,
      deviceClass: blueprint.deviceClass,
      regulation: blueprint.regulation,
      notifiedBody: blueprint.notifiedBody,
      intendedUse: blueprint.intendedUse,
      readinessPercent: blueprint.readinessPercent,
      status: blueprint.status,
      ownerId: owner.id,
      createdAt: now,
      updatedAt: now,
    }).returning().all())

    seedFileDetails(db, file.id, blueprint)
  }

  AUDIT_LOG_BLUEPRINT.forEach((entry, index) => {
    db.insert(auditLog).values({
      logRef: `LOG-${String(10000 + index).padStart(5, '0')}`,
      actorType: entry.actorType,
      actorName: entry.actorName,
      action: entry.action,
      description: entry.description ?? null,
      impact: entry.impact,
      entityType: entry.entityType ?? null,
      entityRef: entry.entityRef ?? null,
      createdAt: isoNow(entry.offsetDays),
    }).run()
  })
}
