<script setup lang="ts">
import type { RiskEntry } from '#shared/types/risk'
import type { DataTableColumn } from '~/utils/table'
// Risk register tab: table of entries with add / edit / delete (FR-RISK-1).
defineProps<{ entries: RiskEntry[] }>()
const emit = defineEmits<{ add: [], edit: [RiskEntry], delete: [number] }>()

const columns: DataTableColumn[] = [
  { key: 'riskId', label: 'Risk', mono: true, width: 'w-28' },
  { key: 'hazardDescription', label: 'Hazard' },
  { key: 'severity', label: 'Severity', width: 'w-28' },
  { key: 'status', label: 'Status', width: 'w-28' },
  { key: 'traceabilityRefs', label: 'Traceability', width: 'w-44' },
  { key: 'actions', label: '', align: 'right', width: 'w-24' },
]
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="font-display text-base font-semibold text-ink">
        Risk register <span class="text-ink-muted">({{ entries.length }})</span>
      </h3>
      <UButton icon="i-material-symbols-add" size="sm" @click="emit('add')">Add risk</UButton>
    </div>

    <DataTable :columns="columns" :rows="entries" row-key="id" empty-label="No risks recorded yet. Add the first hazard.">
      <template #hazardDescription="{ row }">
        <p class="text-ink">{{ row.hazardDescription }}</p>
        <p v-if="row.mitigation" class="mt-0.5 text-[12px] text-ink-muted">{{ row.mitigation }}</p>
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
      <template #actions="{ row }">
        <div class="flex justify-end gap-1">
          <UButton icon="i-material-symbols-edit-outline" color="neutral" variant="ghost" size="xs" aria-label="Edit" @click="emit('edit', row)" />
          <UButton icon="i-material-symbols-delete-outline" color="error" variant="ghost" size="xs" aria-label="Delete" @click="emit('delete', row.id)" />
        </div>
      </template>
    </DataTable>
  </div>
</template>
