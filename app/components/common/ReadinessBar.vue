<script setup lang="ts">
import type { BadgeTone } from '~/utils/badges'
// Horizontal readiness bar (STYLE_GUIDE 5). Fill is primary by default; pass a
// tone to color it by status. Optionally shows a label row with the percent.
const props = withDefaults(defineProps<{
  percent: number
  tone?: BadgeTone
  label?: string
  showValue?: boolean
}>(), { showValue: false })

const value = computed(() => clampPercent(props.percent))
const fillClass = computed(() => (props.tone ? TONE_SOLID[props.tone] : 'bg-brand-500'))
</script>

<template>
  <div class="w-full">
    <div v-if="label || showValue" class="mb-1 flex items-center justify-between text-[13px]">
      <span class="font-medium text-ink">{{ label }}</span>
      <span v-if="showValue" class="font-mono text-ink-muted">{{ value }}%</span>
    </div>
    <div class="h-1.5 w-full overflow-hidden rounded-full bg-line">
      <div
        class="h-full rounded-full transition-all"
        :class="fillClass"
        :style="{ width: `${value}%` }"
      />
    </div>
  </div>
</template>
