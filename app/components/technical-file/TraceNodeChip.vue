<script setup lang="ts">
import type { TraceNode } from '#shared/types/traceability'
import { KIND_META, nodeTone } from '~/utils/traceability'
import { TONE_SOLID } from '~/utils/badges'
// Display-only chip for one traceability node: a tone dot, the kind icon, the
// mono reference, and an optional graph-distance badge. Wrap in a button in the
// parent when it needs to be selectable.
defineProps<{ node: TraceNode, distance?: number }>()
</script>

<template>
  <span class="inline-flex items-center gap-1.5 rounded-chip border border-line bg-surface px-2 py-1" :title="node.label">
    <span class="size-1.5 shrink-0 rounded-full" :class="TONE_SOLID[nodeTone(node)]" />
    <UIcon :name="KIND_META[node.kind].icon" class="size-3.5 shrink-0 text-ink-muted" />
    <span class="font-mono text-[11px] text-ink">{{ node.ref }}</span>
    <span v-if="distance" class="rounded-chip bg-surface-2 px-1 font-mono text-[10px] leading-4 text-ink-muted">d{{ distance }}</span>
  </span>
</template>
