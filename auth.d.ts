// Session user shape for nuxt-auth-utils. See
// https://github.com/atinux/nuxt-auth-utils#typescript
import type { UserRole } from './shared/types/user'

declare module '#auth-utils' {
  interface User {
    id: number
    email: string
    name: string
    role: UserRole
  }
}

export {}
