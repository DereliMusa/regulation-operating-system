<script setup lang="ts">
import type { BadgeTone } from '~/utils/badges'
// Shared pill primitive behind StatusBadge and SeverityBadge. Uppercase caption
// text with the tone's text+background pair and a hairline border (STYLE_GUIDE 5).
defineProps<{ tone: BadgeTone, label: string }>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-chip border border-black/5 px-2 py-0.5 text-[12px] font-medium uppercase leading-4 tracking-[0.04em]"
    :class="TONE_CLASS[tone]"
  >
    {{ label }}
  </span>
</template>
