// Drizzle schema for the Certra MVP. SQLite now; the same schema moves to
// PostgreSQL in Phase 1 via a dialect change (see SDLC/01-architecture/adr).
// Full entity reference: SDLC/01-architecture/data-model.md.
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

/** Shared ISO-8601 created/updated timestamp columns. */
function timestamps() {
  return {
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  }
}

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['admin', 'ra', 'qa', 'viewer'] }).notNull().default('viewer'),
  ...timestamps(),
})

export const technicalFiles = sqliteTable('technical_files', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  deviceName: text('device_name').notNull(),
  udiDi: text('udi_di'),
  deviceClass: text('device_class', { enum: ['I', 'IIa', 'IIb', 'III', 'A', 'B', 'C', 'D'] }),
  regulation: text('regulation', { enum: ['MDR', 'IVDR'] }).notNull(),
  notifiedBody: text('notified_body'),
  intendedUse: text('intended_use'),
  readinessPercent: integer('readiness_percent').notNull().default(0),
  status: text('status', { enum: ['draft', 'in_review', 'approved', 'deficiency'] }).notNull().default('draft'),
  ownerId: integer('owner_id').notNull().references(() => users.id),
  ...timestamps(),
})

export const gsprEntries = sqliteTable('gspr_entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  technicalFileId: integer('technical_file_id').notNull().references(() => technicalFiles.id),
  gsprRef: text('gspr_ref').notNull(),
  requirementText: text('requirement_text').notNull(),
  conformity: text('conformity', { enum: ['conforming', 'partial', 'missing'] }).notNull().default('missing'),
  evidenceRefs: text('evidence_refs', { mode: 'json' }).$type<string[]>().notNull(),
  standardRefs: text('standard_refs', { mode: 'json' }).$type<string[]>().notNull(),
  notes: text('notes'),
  updatedAt: text('updated_at').notNull(),
})

export const riskEntries = sqliteTable('risk_entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  technicalFileId: integer('technical_file_id').notNull().references(() => technicalFiles.id),
  riskId: text('risk_id').notNull(),
  hazardDescription: text('hazard_description').notNull(),
  severity: text('severity', { enum: ['critical', 'major', 'moderate', 'minor'] }).notNull(),
  probability: text('probability'),
  status: text('status', { enum: ['draft', 'review', 'mitigated'] }).notNull().default('draft'),
  mitigation: text('mitigation'),
  controlMeasureRef: text('control_measure_ref'),
  verificationRef: text('verification_ref'),
  traceabilityRefs: text('traceability_refs', { mode: 'json' }).$type<string[]>().notNull(),
  updatedAt: text('updated_at').notNull(),
})

export const clinicalEvidence = sqliteTable('clinical_evidence', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  technicalFileId: integer('technical_file_id').notNull().references(() => technicalFiles.id),
  cerRef: text('cer_ref').notNull(),
  sourceType: text('source_type', { enum: ['literature', 'investigation', 'pms'] }).notNull(),
  title: text('title').notNull(),
  status: text('status', { enum: ['approved', 'in_review', 'draft', 'deficiency'] }).notNull().default('draft'),
  aiSummary: text('ai_summary'),
  confidence: integer('confidence'),
  updatedAt: text('updated_at').notNull(),
})

export const pmsPlans = sqliteTable('pms_plans', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  technicalFileId: integer('technical_file_id').notNull().references(() => technicalFiles.id),
  planType: text('plan_type', { enum: ['PMS', 'PMCF', 'PSUR'] }).notNull(),
  deviceRef: text('device_ref'),
  nextDue: text('next_due').notNull(),
  status: text('status', { enum: ['pending_review', 'active', 'drafting', 'deficiency'] }).notNull().default('pending_review'),
  confidence: integer('confidence'),
  updatedAt: text('updated_at').notNull(),
})

export const auditorFindings = sqliteTable('auditor_findings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  technicalFileId: integer('technical_file_id').notNull().references(() => technicalFiles.id),
  severity: text('severity', { enum: ['critical', 'major', 'minor'] }).notNull(),
  gsprRef: text('gspr_ref'),
  description: text('description').notNull(),
  recommendation: text('recommendation'),
  status: text('status', { enum: ['open', 'resolved'] }).notNull().default('open'),
  createdAt: text('created_at').notNull(),
  resolvedAt: text('resolved_at'),
})

export const auditLog = sqliteTable('audit_log', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  logRef: text('log_ref').notNull(),
  actorType: text('actor_type', { enum: ['user', 'ai', 'system'] }).notNull(),
  actorName: text('actor_name').notNull(),
  action: text('action').notNull(),
  description: text('description'),
  impact: text('impact', { enum: ['critical', 'high', 'medium', 'low'] }).notNull(),
  entityType: text('entity_type'),
  entityRef: text('entity_ref'),
  createdAt: text('created_at').notNull(),
})

export const demoRequests = sqliteTable('demo_requests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fullName: text('full_name').notNull(),
  workEmail: text('work_email').notNull(),
  company: text('company'),
  role: text('role', { enum: ['ra_qa', 'founder_ceo', 'clinical', 'consultant'] }),
  regulationFocus: text('regulation_focus', { enum: ['MDR', 'IVDR', 'both'] }),
  message: text('message'),
  createdAt: text('created_at').notNull(),
})
