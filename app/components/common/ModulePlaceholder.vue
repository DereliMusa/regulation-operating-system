<script setup lang="ts">
// Navigational placeholder for app modules whose full screens land in a later
// sprint (S4-S7). Keeps the shell fully navigable without dead routes; each
// page is replaced by its real module screen when that sprint is built.
defineProps<{
  icon?: string
  title: string
  description?: string
}>()
</script>

<template>
  <div class="flex min-h-[60vh] flex-col items-center justify-center rounded-card border border-dashed border-line bg-surface px-6 py-16 text-center">
    <div class="mb-4 flex size-14 items-center justify-center rounded-full bg-primary-wash">
      <UIcon :name="icon ?? 'i-material-symbols-construction'" class="size-7 text-brand-500" />
    </div>
    <h2 class="mb-2 font-display text-xl font-semibold text-ink">{{ title }}</h2>
    <p class="max-w-md text-sm text-ink-soft">
      {{ description ?? 'This module is part of the Certra MVP and arrives in an upcoming sprint.' }}
    </p>
  </div>
</template>
