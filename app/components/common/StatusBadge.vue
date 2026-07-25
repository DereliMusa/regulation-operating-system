<script setup lang="ts">
// Status pill. Maps any known status/conformity string to a tone via the shared
// badge vocabulary; an explicit label overrides the humanized default.
const props = defineProps<{ status: string, label?: string }>()

const tone = computed(() => statusTone(props.status))
const text = computed(() => props.label ?? statusLabel(props.status))
</script>

<template>
  <ToneBadge :tone="tone" :label="text" />
</template>
