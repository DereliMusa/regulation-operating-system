<script setup lang="ts">
import type { TechnicalFileDetail } from '#shared/types/technical-file'
// Overview tab: readiness, device metadata, and GSPR/risk breakdowns.
const props = defineProps<{ file: TechnicalFileDetail }>()

const meta = computed(() => [
  { label: 'Regulation', value: props.file.regulation },
  { label: 'Class', value: props.file.deviceClass ?? '—' },
  { label: 'Notified body', value: props.file.notifiedBody ?? '—' },
  { label: 'UDI-DI', value: props.file.udiDi ?? '—', mono: true },
])

const gsprBreakdown = computed(() => {
  const counts = { conforming: 0, partial: 0, missing: 0 }
  for (const g of props.file.gspr) counts[g.conformity]++
  return [
    { label: 'Conforming', value: counts.conforming, tone: 'bg-status-approved' },
    { label: 'Partial', value: counts.partial, tone: 'bg-status-review' },
    { label: 'Missing', value: counts.missing, tone: 'bg-status-deficiency' },
  ]
})

const riskBreakdown = computed(() => {
  const order = ['critical', 'major', 'moderate', 'minor'] as const
  const counts: Record<string, number> = {}
  for (const r of props.file.risks) counts[r.severity] = (counts[r.severity] ?? 0) + 1
  return order.map(severity => ({ severity, value: counts[severity] ?? 0 }))
})
</script>

<template>
  <div class="space-y-5">
    <div class="grid gap-5 lg:grid-cols-3">
      <BentoCard label="Readiness" class="lg:col-span-1">
        <div class="flex flex-col items-center gap-3 py-2 text-center">
          <ReadinessRing :percent="file.readinessPercent" />
          <p class="text-sm text-ink-soft">Derived from GSPR conformity.</p>
        </div>
      </BentoCard>

      <BentoCard label="Device details" class="lg:col-span-2">
        <dl class="grid grid-cols-2 gap-4">
          <div v-for="m in meta" :key="m.label">
            <dt class="text-[12px] uppercase tracking-[0.04em] text-ink-muted">{{ m.label }}</dt>
            <dd class="mt-0.5 text-sm text-ink" :class="m.mono ? 'font-mono' : ''">{{ m.value }}</dd>
          </div>
          <div class="col-span-2">
            <dt class="text-[12px] uppercase tracking-[0.04em] text-ink-muted">Intended use</dt>
            <dd class="mt-0.5 text-sm text-ink-soft">{{ file.intendedUse ?? '—' }}</dd>
          </div>
        </dl>
      </BentoCard>
    </div>

    <div class="grid gap-5 lg:grid-cols-2">
      <BentoCard :label="`GSPR conformity (${file.gspr.length})`">
        <div class="space-y-2">
          <div v-for="row in gsprBreakdown" :key="row.label" class="flex items-center justify-between text-sm">
            <span class="flex items-center gap-2 text-ink">
              <span class="size-2 rounded-full" :class="row.tone" />
              {{ row.label }}
            </span>
            <span class="font-mono text-ink">{{ row.value }}</span>
          </div>
        </div>
      </BentoCard>

      <BentoCard :label="`Risk register (${file.risks.length})`">
        <div class="space-y-2">
          <div v-for="row in riskBreakdown" :key="row.severity" class="flex items-center justify-between text-sm">
            <SeverityBadge :severity="row.severity" />
            <span class="font-mono text-ink">{{ row.value }}</span>
          </div>
        </div>
      </BentoCard>
    </div>
  </div>
</template>
