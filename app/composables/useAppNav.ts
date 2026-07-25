export interface AppNavItem {
  label: string
  icon: string
  to: string
  /** Shown in the shell but not yet navigable (screen lands in a later phase). */
  disabled?: boolean
}

/**
 * Primary + secondary sidebar navigation and the currently active item.
 * Shared by AppSidebar (rendering) and AppTopbar (breadcrumb title) so the
 * navigation model has a single source of truth.
 */
export function useAppNav() {
  const primary: AppNavItem[] = [
    { label: 'Dashboard', icon: 'i-material-symbols-dashboard', to: '/dashboard' },
    { label: 'Technical Documentation', icon: 'i-material-symbols-description', to: '/technical-files' },
    { label: 'Risk Management', icon: 'i-material-symbols-warning', to: '/risk' },
    { label: 'Clinical Evaluation', icon: 'i-material-symbols-analytics', to: '/clinical-evaluation' },
    { label: 'Post-Market', icon: 'i-material-symbols-monitoring', to: '/post-market' },
    { label: 'Audit Log', icon: 'i-material-symbols-history', to: '/audit-log' },
  ]

  // Settings and Support belong in the shell (STYLE_GUIDE 6) but are out of MVP
  // scope, so they render as disabled rather than as dead routes.
  const secondary: AppNavItem[] = [
    { label: 'Settings', icon: 'i-material-symbols-settings', to: '/settings', disabled: true },
    { label: 'Support', icon: 'i-material-symbols-help-outline', to: '/support', disabled: true },
  ]

  const route = useRoute()
  const current = computed<AppNavItem | undefined>(() =>
    primary.find(item => route.path === item.to || route.path.startsWith(`${item.to}/`)),
  )

  return { primary, secondary, current }
}
