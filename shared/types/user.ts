export type UserRole = 'admin' | 'ra' | 'qa' | 'viewer'

// Password hash is intentionally excluded: this is the API/client-facing shape.
export interface User {
  id: number
  email: string
  name: string
  role: UserRole
  createdAt: string
  updatedAt: string
}
