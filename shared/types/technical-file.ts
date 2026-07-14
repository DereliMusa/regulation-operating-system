export type DeviceClass = 'I' | 'IIa' | 'IIb' | 'III' | 'A' | 'B' | 'C' | 'D'
export type Regulation = 'MDR' | 'IVDR'
export type TechnicalFileStatus = 'draft' | 'in_review' | 'approved' | 'deficiency'

export interface TechnicalFile {
  id: number
  deviceName: string
  udiDi: string | null
  deviceClass: DeviceClass | null
  regulation: Regulation
  notifiedBody: string | null
  intendedUse: string | null
  readinessPercent: number
  status: TechnicalFileStatus
  ownerId: number
  createdAt: string
  updatedAt: string
}
