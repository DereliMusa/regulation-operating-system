<script setup lang="ts">
import type { DataTableColumn } from '~/utils/table'
import type { AuditLogView, AuditActorType } from '#shared/types/audit-log'
// Audit Log screen (FR-LOG-2): KPI cards, filters, and the activity table.
// Entries are written automatically by every mutation (FR-LOG-1).
definePageMeta({ layout: 'app', middleware: ['auth'] })
useHead({ title: 'Audit Log - Certra' })

const filters = reactive({ actorType: 'all', impact: 'all' })
const query = computed(() => ({
  actorType: filters.actorType === 'all' ? undefined : filters.actorType,
  impact: filters.impact === 'all' ? undefined : filters.impact,
}))
const { data } = await useFetch<AuditLogView>('/api/audit-log', { query })
const items = computed(() => data.value?.items ?? [])
const kpis = computed(() => data.value?.kpis)

const cards = computed(() => {
  const k = kpis.value
  return [
    { label: 'Total events', value: k?.total ?? 0 },
    { label: 'High impact', value: k?.highImpact ?? 0 },
    { label: 'AI actions', value: k?.aiActions ?? 0 },
    { label: 'Last 7 days', value: k?.last7Days ?? 0 },
  ]
})

const actorOptions = [
  { label: 'All actors', value: 'all' }, { label: 'User', value: 'user' },
  { label: 'AI', value: 'ai' }, { label: 'System', value: 'system' },
]
const impactOptions = [
  { label: 'All impact', value: 'all' }, { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' }, { label: 'Medium', value: 'medium' }, { label: 'Low', value: 'low' },
]

const columns: DataTableColumn[] = [
  { key: 'logRef', label: 'Ref', mono: true, width: 'w-32' },
  { key: 'actorName', label: 'Actor', width: 'w-44' },
  { key: 'action', label: 'Action' },
  { key: 'entityRef', label: 'Entity', width: 'w-40' },
  { key: 'impact', label: 'Impact', width: 'w-28' },
  { key: 'createdAt', label: 'When', width: 'w-40' },
]

const ACTOR_ICON: Record<AuditActorType, string> = {
  user: 'i-material-symbols-person-outline',
  ai: 'i-material-symbols-auto-awesome',
  system: 'i-material-symbols-settings-outline',
}

function fmtWhen(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="space-y-5">
    <header>
      <h1 class="font-display text-xl font-semibold text-ink">Audit Log</h1>
      <p class="text-sm text-ink-soft">Every create, update, and delete is recorded here.</p>
    </header>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <BentoCard v-for="c in cards" :key="c.label" :label="c.label" :value="c.value" />
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <USelect v-model="filters.actorType" :items="actorOptions" class="w-44" />
      <USelect v-model="filters.impact" :items="impactOptions" class="w-40" />
    </div>

    <DataTable :columns="columns" :rows="items" row-key="id" empty-label="No audit entries match your filters.">
      <template #actorName="{ row }">
        <span class="flex items-center gap-1.5">
          <UIcon :name="ACTOR_ICON[row.actorType]" class="size-4 text-ink-muted" />
          <span class="text-ink">{{ row.actorName }}</span>
        </span>
      </template>
      <template #action="{ row }">
        <p class="text-ink">{{ row.action }}</p>
        <p v-if="row.description" class="text-[12px] text-ink-muted">{{ row.description }}</p>
      </template>
      <template #entityRef="{ row }">
        <span v-if="row.entityRef" class="font-mono text-[12px] text-ink-soft">{{ row.entityRef }}</span>
        <span v-else class="text-ink-muted">—</span>
      </template>
      <template #impact="{ row }">
        <SeverityBadge :severity="row.impact" />
      </template>
      <template #createdAt="{ row }">
        <span class="text-ink-muted">{{ fmtWhen(row.createdAt) }}</span>
      </template>
    </DataTable>
  </div>
</template>
