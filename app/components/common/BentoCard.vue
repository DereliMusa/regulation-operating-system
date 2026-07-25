<script setup lang="ts">
// White surface card primitive (STYLE_GUIDE 5): hairline border, 10px radius.
// Renders an uppercase caption label with an optional metric value and trend,
// plus a default slot for arbitrary content (rings, lists, tables).
defineProps<{
  label?: string
  value?: string | number
  trend?: string
  trendTone?: 'up' | 'down' | 'flat'
}>()
</script>

<template>
  <section class="flex flex-col rounded-card border border-line bg-surface p-5">
    <header v-if="label || $slots.action" class="mb-3 flex items-center justify-between gap-2">
      <h3 v-if="label" class="text-[12px] font-medium uppercase tracking-[0.04em] text-ink-muted">
        {{ label }}
      </h3>
      <slot name="action" />
    </header>
    <div v-if="value !== undefined" class="flex items-end gap-2">
      <span class="font-display text-3xl font-semibold leading-none text-ink">{{ value }}</span>
      <span
        v-if="trend"
        class="mb-0.5 text-[13px] font-medium"
        :class="{
          'text-status-approved': trendTone === 'up',
          'text-status-deficiency': trendTone === 'down',
          'text-ink-muted': !trendTone || trendTone === 'flat',
        }"
      >{{ trend }}</span>
    </div>
    <slot />
  </section>
</template>
