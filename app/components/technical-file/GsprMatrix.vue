<script setup lang="ts">
import type { GsprEntry } from '#shared/types/gspr'
import type { DataTableColumn } from '~/utils/table'
// GSPR matrix tab: table of entries with add / edit / delete (FR-GSPR-1).
defineProps<{ entries: GsprEntry[] }>()
const emit = defineEmits<{ add: [], edit: [GsprEntry], delete: [number] }>()

const columns: DataTableColumn[] = [
  { key: 'gsprRef', label: 'GSPR', mono: true, width: 'w-28' },
  { key: 'requirementText', label: 'Requirement' },
  { key: 'conformity', label: 'Conformity', width: 'w-32' },
  { key: 'standardRefs', label: 'Standards', width: 'w-48' },
  { key: 'actions', label: '', align: 'right', width: 'w-24' },
]
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="font-display text-base font-semibold text-ink">
        GSPR matrix <span class="text-ink-muted">({{ entries.length }})</span>
      </h3>
      <UButton icon="i-material-symbols-add" size="sm" @click="emit('add')">Add GSPR</UButton>
    </div>

    <DataTable :columns="columns" :rows="entries" row-key="id" empty-label="No GSPR entries yet. Add the first requirement.">
      <template #requirementText="{ row }">
        <p class="text-ink">{{ row.requirementText }}</p>
        <p v-if="row.evidenceRefs.length" class="mt-1">
          <TraceabilityChip :refs="row.evidenceRefs" />
        </p>
      </template>
      <template #conformity="{ row }">
        <StatusBadge :status="row.conformity" />
      </template>
      <template #standardRefs="{ row }">
        <span v-if="row.standardRefs.length" class="font-mono text-[12px] text-ink-soft">{{ row.standardRefs.join(', ') }}</span>
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
