<script setup lang="ts">
// Fixed left navigation shell (STYLE_GUIDE 6): ~240px, always visible on large
// screens and a slide-in drawer on small screens. Active item uses primary
// text, a primary-wash background, and a 2px primary right border.
const { primary, secondary } = useAppNav()
const { isOpen, close } = useSidebar()
const route = useRoute()

function isActive(to: string): boolean {
  return route.path === to || route.path.startsWith(`${to}/`)
}

// Close the mobile drawer whenever navigation happens.
watch(() => route.path, () => close())
</script>

<template>
  <div>
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 bg-ink/40 lg:hidden"
      @click="close"
    />

    <aside
      class="fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-line bg-surface p-4 transition-transform duration-200 lg:translate-x-0"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <NuxtLink to="/dashboard" class="mb-6 flex flex-col px-2 py-1">
        <span class="flex items-center gap-1.5">
          <UIcon name="i-material-symbols-biotech" class="size-6 text-brand-500" />
          <span class="font-display text-xl font-semibold tracking-tight text-ink">Certra</span>
        </span>
        <span class="pl-[30px] text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted">
          Regulatory Suite
        </span>
      </NuxtLink>

      <UButton to="/technical-files" icon="i-material-symbols-add" block class="mb-4">
        New Submission
      </UButton>

      <nav class="flex-1 space-y-1">
        <NuxtLink
          v-for="item in primary"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-btn px-2 py-2 text-sm transition-colors"
          :class="isActive(item.to)
            ? 'border-r-2 border-brand-500 bg-primary-wash font-medium text-brand-500'
            : 'text-ink-soft hover:bg-surface-2'"
        >
          <UIcon :name="item.icon" class="size-5 shrink-0" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="mt-auto space-y-1 border-t border-line pt-4">
        <span
          v-for="item in secondary"
          :key="item.to"
          class="flex cursor-not-allowed items-center gap-3 rounded-btn px-2 py-2 text-sm text-ink-muted"
          :title="`${item.label} arrives in a later phase`"
        >
          <UIcon :name="item.icon" class="size-5 shrink-0" />
          {{ item.label }}
        </span>
      </div>
    </aside>
  </div>
</template>
