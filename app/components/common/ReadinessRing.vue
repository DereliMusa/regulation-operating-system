<script setup lang="ts">
// Circular readiness gauge (STYLE_GUIDE 5): a conic arc in primary with the
// percent and a caption at the center.
const props = withDefaults(defineProps<{
  percent: number
  label?: string
  size?: number
}>(), { label: 'Ready', size: 128 })

const value = computed(() => clampPercent(props.percent))
const ringStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  background: ringGradient(props.percent),
}))
</script>

<template>
  <div class="flex items-center justify-center rounded-full" :style="ringStyle">
    <div class="text-center">
      <span class="block font-display text-2xl font-semibold leading-none text-brand-500">{{ value }}%</span>
      <span class="text-[12px] text-ink-muted">{{ label }}</span>
    </div>
  </div>
</template>
