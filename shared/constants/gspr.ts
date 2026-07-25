export interface GsprReference {
  ref: string
  title: string
}

// A minimal reference subset of MDR Annex I General Safety and Performance
// Requirements, used for demo seeding and future GSPR pickers. Not
// exhaustive; expand as real GSPR content is incorporated (Phase 1).
export const GSPR_REFERENCE: GsprReference[] = [
  { ref: 'GSPR 1', title: 'General safety and performance requirements' },
  { ref: 'GSPR 8', title: 'Mechanical properties and construction' },
  { ref: 'GSPR 10.2', title: 'Chemical, physical and biological properties' },
  { ref: 'GSPR 14', title: 'Protection against radiation' },
  { ref: 'GSPR 17.1', title: 'Software lifecycle and cybersecurity (IEC 62304)' },
  { ref: 'GSPR 20.1', title: 'Performance evaluation (IVDR)' },
]
