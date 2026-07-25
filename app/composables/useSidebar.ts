/**
 * Shared open/closed state for the mobile sidebar drawer. On large screens the
 * sidebar is always visible; on small screens AppTopbar toggles this state and
 * AppSidebar slides in accordingly.
 */
export function useSidebar() {
  const isOpen = useState('app-sidebar-open', () => false)

  return {
    isOpen,
    open: () => { isOpen.value = true },
    close: () => { isOpen.value = false },
    toggle: () => { isOpen.value = !isOpen.value },
  }
}
