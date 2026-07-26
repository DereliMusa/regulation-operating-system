<script setup lang="ts">
import type { DataTableColumn } from '~/utils/table'
import type { RiskRegisterView } from '#shared/types/risk'
// Standalone Risk Management screen (FR-RISK-2): portfolio ISO 14971 register
// with summary cards, read-mostly over seed data.
definePageMeta({ layout: 'app', middleware: ['auth'] })
useHead({ title: 'Risk Management - Certra' })

const { data } = await useFetch<RiskRegisterView>('/api/risk')
const items = computed(() => data.value?.items ?? [])
const summary = computed(() => data.value?.summary)

const cards = computed(() => {
  const s = summary.value
  return [
    { label: 'Total risks', value: s?.total ?? 0 },
    { label: 'Critical', value: s?.bySeverity.critical ?? 0 },
    { label: 'Unmitigated', value: s?.unmitigated ?? 0 },
    { label: 'Mitigated', value: s ? s.total - s.unmitigated : 0 },
  ]
})

const columns: DataTableColumn[] = [
  { key: 'riskId', label: 'Risk', mono: true, width: 'w-28' },
  { key: 'hazardDescription', label: 'Hazard' },
  { key: 'deviceName', label: 'Device', width: 'w-52' },
  { key: 'severity', label: 'Severity', width: 'w-28' },
  { key: 'status', label: 'Status', width: 'w-28' },
  { key: 'traceabilityRefs', label: 'Traceability', width: 'w-44' },
]
</script>

<template>
  <div class="space-y-5">
    <header>
      <h1 class="font-display text-xl font-semibold text-ink">Risk Management</h1>
      <p class="text-sm text-ink-soft">ISO 14971 risk register across your technical files.</p>
    </header>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <BentoCard v-for="c in cards" :key="c.label" :label="c.label" :value="c.value" />
    </div>

    <DataTable :columns="columns" :rows="items" row-key="id" empty-label="No risks recorded yet.">
      <template #hazardDescription="{ row }">
        <p class="text-ink">{{ row.hazardDescription }}</p>
        <p v-if="row.mitigation" class="mt-0.5 text-[12px] text-ink-muted">{{ row.mitigation }}</p>
      </template>
      <template #deviceName="{ row }">
        <span class="text-ink-soft">{{ row.deviceName }}</span>
      </template>
      <template #severity="{ row }">
        <SeverityBadge :severity="row.severity" />
      </template>
      <template #status="{ row }">
        <StatusBadge :status="row.status" />
      </template>
      <template #traceabilityRefs="{ row }">
        <TraceabilityChip v-if="row.traceabilityRefs.length" :refs="row.traceabilityRefs" />
        <span v-else class="text-ink-muted">—</span>
      </template>
    </DataTable>
  </div>
</template>
