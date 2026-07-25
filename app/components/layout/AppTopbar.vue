<script setup lang="ts">
// Sticky top bar (STYLE_GUIDE 6): breadcrumb, search, notifications, and the
// user menu (with sign out). Also hosts the mobile sidebar toggle.
const { current } = useAppNav()
const { toggle } = useSidebar()
const { user, clear } = useUserSession()

const initials = computed(() => {
  const name = user.value?.name ?? user.value?.email ?? ''
  const letters = name
    .split(/\s+/)
    .map(part => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return letters || 'U'
})

async function onSignOut(): Promise<void> {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  await navigateTo('/login')
}
</script>

<template>
  <header class="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-surface px-4 lg:px-6">
    <div class="flex items-center gap-3">
      <button
        class="flex size-9 items-center justify-center rounded-btn text-ink-soft hover:bg-surface-2 lg:hidden"
        aria-label="Open navigation"
        @click="toggle"
      >
        <UIcon name="i-material-symbols-menu" class="size-5" />
      </button>
      <nav class="flex items-center gap-2 text-sm">
        <span class="hidden text-[12px] font-medium uppercase tracking-[0.08em] text-ink-muted sm:inline">Workspace</span>
        <UIcon name="i-material-symbols-chevron-right" class="hidden size-4 text-ink-muted sm:inline" />
        <span class="font-display font-semibold text-ink">{{ current?.label ?? 'Dashboard' }}</span>
      </nav>
    </div>

    <div class="flex items-center gap-2 sm:gap-3">
      <div class="relative hidden md:block">
        <UIcon name="i-material-symbols-search" class="absolute left-2.5 top-1/2 size-5 -translate-y-1/2 text-ink-muted" />
        <input
          type="search"
          placeholder="Search technical files..."
          class="w-56 rounded-btn border border-line bg-surface-2 py-1.5 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
        >
      </div>

      <button
        class="relative flex size-9 items-center justify-center rounded-full text-ink-soft hover:bg-surface-2"
        aria-label="Notifications"
      >
        <UIcon name="i-material-symbols-notifications" class="size-5" />
        <span class="absolute right-2 top-2 size-2 rounded-full border border-surface bg-status-deficiency" />
      </button>

      <UPopover>
        <button class="flex items-center gap-2 rounded-full p-0.5 hover:bg-surface-2" aria-label="Account menu">
          <span class="flex size-8 items-center justify-center rounded-full border border-line bg-primary-wash text-[12px] font-semibold text-brand-500">
            {{ initials }}
          </span>
        </button>

        <template #content>
          <div class="w-56 p-1">
            <div class="border-b border-line px-3 py-2">
              <p class="truncate text-sm font-medium text-ink">{{ user?.name }}</p>
              <p class="truncate text-[12px] text-ink-muted">{{ user?.email }}</p>
            </div>
            <button
              class="mt-1 flex w-full items-center gap-2 rounded-btn px-3 py-2 text-left text-sm text-ink-soft hover:bg-surface-2"
              @click="onSignOut"
            >
              <UIcon name="i-material-symbols-logout" class="size-4" />
              Sign out
            </button>
          </div>
        </template>
      </UPopover>
    </div>
  </header>
</template>
