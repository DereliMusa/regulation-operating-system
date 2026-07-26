<script setup lang="ts">
import type { TraceabilityGraph, TraceNode } from '#shared/types/traceability'
import { computeChangeImpact, buildTraceabilityReportMarkdown, KIND_META } from '~/utils/traceability'
// Traceability tab (FR-TRC-2): GSPR x risk coverage matrix, cross-artifact change
// impact, coverage gaps, and a Markdown export. The graph is derived server-side
// from the file's reference fields (see server/utils/traceability.ts).
const props = defineProps<{ technicalFileId: number, deviceName: string }>()

const graph = ref<TraceabilityGraph | null>(null)
const pending = ref(false)
const error = ref('')
const selectedId = ref<string | null>(null)

async function run(): Promise<void> {
  pending.value = true
  error.value = ''
  try {
    graph.value = await $fetch<TraceabilityGraph>(`/api/technical-files/${props.technicalFileId}/traceability`)
    selectedId.value = null
  }
  catch {
    error.value = 'Could not load the traceability graph. Please try again.'
  }
  finally {
    pending.value = false
  }
}

const byId = computed(() => new Map((graph.value?.nodes ?? []).map(n => [n.id, n])))
const impact = computed(() =>
  graph.value && selectedId.value ? computeChangeImpact(graph.value, selectedId.value) : null,
)
const impactedIds = computed(() => new Set(impact.value?.impacted.map(i => i.nodeId) ?? []))
const impactedNodes = computed(() =>
  (impact.value?.impacted ?? []).map(i => ({ node: byId.value.get(i.nodeId)!, distance: i.distance })),
)
const selectedNode = computed<TraceNode | null>(() => (selectedId.value ? byId.value.get(selectedId.value) ?? null : null))
const otherNodes = computed(() => (graph.value?.nodes ?? []).filter(n => n.kind !== 'gspr' && n.kind !== 'risk'))

const stats = computed(() => {
  const s = graph.value?.summary
  if (!s) return []
  return [
    { label: 'GSPR coverage', value: `${s.coveragePercent}%`, accent: true },
    { label: 'Requirements traced', value: `${s.gsprTraced}/${s.gsprTotal}`, accent: false },
    { label: 'Risks traced', value: `${s.riskTraced}/${s.riskTotal}`, accent: false },
    { label: 'Open gaps', value: String(s.gapCount), accent: false },
    { label: 'Links', value: String(s.linkCount), accent: false },
  ]
})

const kindLegend = Object.entries(KIND_META).map(([kind, meta]) => ({ kind, ...meta }))

function select(id: string): void {
  selectedId.value = selectedId.value === id ? null : id
}
function clearSelection(): void {
  selectedId.value = null
}

function exportReport(): void {
  if (!graph.value) return
  const blob = new Blob([buildTraceabilityReportMarkdown(graph.value)], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `traceability-${props.deviceName.replace(/\s+/g, '-').toLowerCase()}.md`
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(run)
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3 rounded-card border border-brand-500/15 bg-primary-wash p-4">
      <div class="flex gap-3">
        <UIcon name="i-material-symbols-account-tree-outline" class="mt-0.5 size-5 shrink-0 text-brand-500" />
        <div>
          <h3 class="font-display text-base font-semibold text-ink">Traceability matrix</h3>
          <p class="max-w-xl text-sm text-ink-soft">
            Cross-artifact links (GSPR to risk, test, clinical evidence and standards) derived from
            this file's references. Select a requirement or risk to trace its change impact.
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <UButton icon="i-material-symbols-refresh" color="neutral" variant="outline" size="sm" :loading="pending" @click="run">Refresh</UButton>
        <UButton icon="i-material-symbols-file-download-outline" size="sm" :disabled="!graph || pending" @click="exportReport">Export report</UButton>
      </div>
    </div>

    <UAlert v-if="error" color="error" variant="soft" :title="error" />

    <div v-if="pending && !graph" class="flex items-center justify-center py-12 text-ink-muted">
      <UIcon name="i-material-symbols-progress-activity" class="size-5 animate-spin" />
      <span class="ml-2 text-sm">Building traceability graph...</span>
    </div>

    <template v-else-if="graph">
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div v-for="stat in stats" :key="stat.label" class="rounded-card border border-line bg-surface px-4 py-3">
          <p class="text-[11px] uppercase tracking-[0.04em] text-ink-muted">{{ stat.label }}</p>
          <p class="font-display text-2xl font-semibold" :class="stat.accent ? 'text-brand-500' : 'text-ink'">{{ stat.value }}</p>
        </div>
      </div>

      <TraceabilityGrid :matrix="graph.matrix" :selected-id="selectedId" :impacted-ids="impactedIds" @select="select" />

      <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-ink-muted">
        <span class="font-medium">Legend:</span>
        <span v-for="item in kindLegend" :key="item.kind" class="inline-flex items-center gap-1">
          <UIcon :name="item.icon" class="size-3.5" />{{ item.label }}
        </span>
      </div>

      <div v-if="otherNodes.length" class="space-y-2">
        <h4 class="text-[12px] font-medium uppercase tracking-[0.04em] text-ink-muted">Other linked artifacts</h4>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="node in otherNodes"
            :key="node.id"
            type="button"
            class="rounded-chip transition-shadow"
            :class="node.id === selectedId ? 'ring-2 ring-brand-500' : impactedIds.has(node.id) ? 'ring-1 ring-brand-500/40' : ''"
            @click="select(node.id)"
          >
            <TraceNodeChip :node="node" />
          </button>
        </div>
      </div>

      <div v-if="selectedNode" class="rounded-card border border-brand-500/20 bg-surface p-4">
        <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2 text-sm">
            <span class="text-ink-muted">Change impact of</span>
            <TraceNodeChip :node="selectedNode" />
            <span class="text-ink-muted">— {{ impactedNodes.length }} linked artifact(s)</span>
          </div>
          <UButton icon="i-material-symbols-close" color="neutral" variant="ghost" size="xs" @click="clearSelection">Clear</UButton>
        </div>
        <p v-if="impactedNodes.length === 0" class="text-sm text-ink-muted">
          {{ selectedNode.ref }} has no traceability links — a change here is isolated (see gaps below).
        </p>
        <div v-else class="flex flex-wrap gap-2">
          <button v-for="item in impactedNodes" :key="item.node.id" type="button" class="rounded-chip" @click="select(item.node.id)">
            <TraceNodeChip :node="item.node" :distance="item.distance" />
          </button>
        </div>
      </div>

      <div class="rounded-card border border-line bg-surface p-4">
        <h4 class="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
          <UIcon name="i-material-symbols-report-outline" class="size-4 text-status-review" />
          Traceability gaps <span class="text-ink-muted">({{ graph.gaps.length }})</span>
        </h4>
        <p v-if="graph.gaps.length === 0" class="text-sm text-status-approved">No open traceability gaps.</p>
        <ul v-else class="space-y-1.5">
          <li v-for="gap in graph.gaps" :key="gap.nodeId" class="flex items-start gap-2 text-sm text-ink-soft">
            <UIcon name="i-material-symbols-chevron-right" class="mt-0.5 size-4 shrink-0 text-ink-muted" />
            <span><span class="font-mono text-ink">{{ gap.ref }}</span> — {{ gap.reason }}</span>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>
