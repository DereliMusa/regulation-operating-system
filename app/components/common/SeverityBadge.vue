<script setup lang="ts">
// Severity pill (STYLE_GUIDE severity mapping) for risk and finding severities.
const props = defineProps<{ severity: string, label?: string }>()

const tone = computed(() => severityTone(props.severity))
const text = computed(() => props.label ?? severityLabel(props.severity))
</script>

<template>
  <ToneBadge :tone="tone" :label="text" />
</template>
