export type GsprConformity = 'conforming' | 'partial' | 'missing'

export interface GsprEntry {
  id: number
  technicalFileId: number
  gsprRef: string
  requirementText: string
  conformity: GsprConformity
  evidenceRefs: string[]
  standardRefs: string[]
  notes: string | null
  updatedAt: string
}
