<script setup lang="ts">
import { buildAuditorReportMarkdown } from '~/utils/auditorReport'
import type { AuditorSimulationResult, FindingSeverity } from '#shared/types/auditor'
// Auditor Simulation tab (FR-AUD-1/2): runs the mock rule engine for this file
// and shows findings with a Markdown export. Deterministic (ADR-005) — re-running
// yields the same result until the file's GSPR/risk state changes.
const props = defineProps<{ technicalFileId: number, deviceName: string }>()

const result = ref<AuditorSimulationResult | null>(null)
const pending = ref(false)
const error = ref('')

async function run(): Promise<void> {
  pending.value = true
  error.value = ''
  try {
    result.value = await $fetch<AuditorSimulationResult>('/api/auditor/simulate', {
      method: 'POST',
      body: { technicalFileId: props.technicalFileId },
    })
  }
  catch {
    error.value = 'Could not run the simulation. Please try again.'
  }
  finally {
    pending.value = false
  }
}

function exportReport(): void {
  if (!result.value) return
  const blob = new Blob([buildAuditorReportMarkdown(result.value)], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `auditor-report-${props.deviceName.replace(/\s+/g, '-').toLowerCase()}.md`
  link.click()
  URL.revokeObjectURL(url)
}

const summaryChips = computed<Array<{ label: string, value: number, severity: FindingSeverity }>>(() => {
  const s = result.value?.summary
  if (!s) return []
  return [
    { label: 'Critical', value: s.critical, severity: 'critical' },
    { label: 'Major', value: s.major, severity: 'major' },
    { label: 'Minor', value: s.minor, severity: 'minor' },
  ]
})

onMounted(run)
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3 rounded-card border border-ai/20 bg-ai-wash p-4">
      <div class="flex gap-3">
        <UIcon name="i-material-symbols-auto-awesome" class="mt-0.5 size-5 shrink-0 text-ai" />
        <div>
          <h3 class="font-display text-base font-semibold text-ink">Auditor Simulation</h3>
          <p class="max-w-xl text-sm text-ink-soft">
            Mock AI review of GSPR conformity and ISO 14971 risk state. Deterministic rule engine
            (Phase 1: Claude). Not a regulatory determination.
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <UButton icon="i-material-symbols-refresh" color="neutral" variant="outline" size="sm" :loading="pending" @click="run">Re-run</UButton>
        <UButton icon="i-material-symbols-file-download-outline" size="sm" :disabled="!result || pending" @click="exportReport">Export report</UButton>
      </div>
    </div>

    <UAlert v-if="error" color="error" variant="soft" :title="error" />

    <div v-if="pending && !result" class="flex items-center justify-center py-12 text-ink-muted">
      <UIcon name="i-material-symbols-progress-activity" class="size-5 animate-spin" />
      <span class="ml-2 text-sm">Running simulation...</span>
    </div>

    <template v-else-if="result">
      <div v-if="result.passed" class="flex items-center gap-3 rounded-card border border-status-approved/30 bg-status-approved-bg p-4">
        <UIcon name="i-material-symbols-verified" class="size-6 shrink-0 text-status-approved" />
        <div>
          <p class="font-medium text-status-approved">No deficiencies found</p>
          <p class="text-sm text-ink-soft">This file passes the auditor simulation at {{ result.readinessPercent }}% readiness.</p>
        </div>
      </div>

      <div v-else class="flex flex-wrap items-center gap-3">
        <div v-for="chip in summaryChips" :key="chip.label" class="flex items-center gap-2 rounded-btn border border-line bg-surface px-3 py-2">
          <SeverityBadge :severity="chip.severity" />
          <span class="font-mono text-lg text-ink">{{ chip.value }}</span>
        </div>
        <div class="flex items-center gap-2 rounded-btn border border-line bg-surface px-3 py-2">
          <span class="text-[12px] uppercase tracking-[0.04em] text-ink-muted">Total</span>
          <span class="font-mono text-lg text-ink">{{ result.summary.total }}</span>
        </div>
      </div>

      <div v-if="result.findings.length" class="divide-y divide-line rounded-card border border-line">
        <div v-for="(f, i) in result.findings" :key="i" class="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:gap-4">
          <div class="flex items-center gap-2 sm:w-44 sm:shrink-0">
            <SeverityBadge :severity="f.severity" />
            <TraceabilityChip v-if="f.reference" :refs="[f.reference]" />
          </div>
          <div class="min-w-0">
            <p class="text-ink">{{ f.description }}</p>
            <p class="mt-1 flex items-start gap-1.5 text-sm text-ink-soft">
              <UIcon name="i-material-symbols-lightbulb-outline" class="mt-0.5 size-4 shrink-0 text-ai" />
              {{ f.recommendation }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
