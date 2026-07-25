export type DemoRequestRole = 'ra_qa' | 'founder_ceo' | 'clinical' | 'consultant'
export type RegulationFocus = 'MDR' | 'IVDR' | 'both'

export interface DemoRequest {
  id: number
  fullName: string
  workEmail: string
  company: string | null
  role: DemoRequestRole | null
  regulationFocus: RegulationFocus | null
  message: string | null
  createdAt: string
}
