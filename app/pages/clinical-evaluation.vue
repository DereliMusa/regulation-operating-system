<script setup lang="ts">
import type { DataTableColumn } from '~/utils/table'
import type { ClinicalEvidenceItem, ClinicalOverview, ClinicalSourceType } from '#shared/types/clinical'
import type { TechnicalFileList } from '#shared/types/technical-file'
// Clinical Evaluation screen (FR-CER-1 read, FR-CER-2 CRUD): evidence summary,
// literature table with add/edit/delete, and an AI-suggestions panel.
definePageMeta({ layout: 'app', middleware: ['auth'] })
useHead({ title: 'Clinical Evaluation - Certra' })

const { data, refresh } = await useFetch<ClinicalOverview>('/api/clinical')
const { data: filesData } = await useFetch<TechnicalFileList>('/api/technical-files', { query: { pageSize: 50 } })
const items = computed(() => data.value?.items ?? [])
const summary = computed(() => data.value?.summary)
const aiSuggestions = computed(() => data.value?.aiSuggestions ?? [])
const deviceOptions = computed(() => (filesData.value?.items ?? []).map(f => ({ label: f.deviceName, value: f.id })))

const modal = reactive({ open: false, entry: null as ClinicalEvidenceItem | null })
const confirm = reactive({ open: false, entryId: 0, pending: false })

function openAdd(): void { modal.entry = null; modal.open = true }
function openEdit(entry: ClinicalEvidenceItem): void { modal.entry = entry; modal.open = true }
function askDelete(entryId: number): void { confirm.entryId = entryId; confirm.open = true }

async function onConfirmDelete(): Promise<void> {
  confirm.pending = true
  try {
    await $fetch(`/api/clinical/${confirm.entryId}`, { method: 'DELETE' })
    confirm.open = false
    await refresh()
  }
  finally {
    confirm.pending = false
  }
}
async function onSaved(): Promise<void> { await refresh() }

const cards = computed(() => {
  const s = summary.value
  return [
    { label: 'Evidence records', value: s?.total ?? 0 },
    { label: 'Approved', value: s?.approved ?? 0 },
    { label: 'In review', value: s?.inReview ?? 0 },
    { label: 'Avg AI confidence', value: `${s?.avgConfidence ?? 0}%` },
  ]
})

const columns: DataTableColumn[] = [
  { key: 'cerRef', label: 'Ref', mono: true, width: 'w-28' },
  { key: 'title', label: 'Evidence' },
  { key: 'sourceType', label: 'Source', width: 'w-32' },
  { key: 'deviceName', label: 'Device', width: 'w-52' },
  { key: 'status', label: 'Status', width: 'w-28' },
  { key: 'actions', label: '', align: 'right', width: 'w-24' },
]

const SOURCE_LABEL: Record<ClinicalSourceType, string> = {
  literature: 'Literature',
  investigation: 'Investigation',
  pms: 'Post-market',
}
</script>

<template>
  <div class="space-y-5">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="font-display text-xl font-semibold text-ink">Clinical Evaluation</h1>
        <p class="text-sm text-ink-soft">Clinical evidence and CER drafting across your portfolio.</p>
      </div>
      <UButton icon="i-material-symbols-add" :disabled="!deviceOptions.length" @click="openAdd">Add evidence</UButton>
    </header>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <BentoCard v-for="c in cards" :key="c.label" :label="c.label" :value="c.value" />
    </div>

    <div class="grid gap-5 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <DataTable :columns="columns" :rows="items" row-key="id" empty-label="No clinical evidence yet.">
          <template #title="{ row }">
            <p class="text-ink">{{ row.title }}</p>
          </template>
          <template #sourceType="{ row }">
            <span class="text-ink-soft">{{ SOURCE_LABEL[row.sourceType] }}</span>
          </template>
          <template #deviceName="{ row }">
            <span class="text-ink-soft">{{ row.deviceName }}</span>
          </template>
          <template #status="{ row }">
            <StatusBadge :status="row.status" />
          </template>
          <template #actions="{ row }">
            <div class="flex justify-end gap-1">
              <UButton icon="i-material-symbols-edit-outline" color="neutral" variant="ghost" size="xs" aria-label="Edit" @click="openEdit(row)" />
              <UButton icon="i-material-symbols-delete-outline" color="error" variant="ghost" size="xs" aria-label="Delete" @click="askDelete(row.id)" />
            </div>
          </template>
        </DataTable>
      </div>

      <div class="space-y-4">
        <h2 class="text-[12px] font-medium uppercase tracking-[0.04em] text-ink-muted">AI suggestions</h2>
        <p v-if="!aiSuggestions.length" class="text-sm text-ink-muted">No AI drafts yet.</p>
        <AiPanel
          v-for="s in aiSuggestions"
          :key="s.id"
          label="AI clinical summary"
          :confidence="s.confidence ?? undefined"
        >
          <p class="font-medium text-ink">{{ s.title }}</p>
          <p class="mt-1">{{ s.aiSummary }}</p>
        </AiPanel>
      </div>
    </div>

    <ClinicalEvidenceFormModal v-model:open="modal.open" :entry="modal.entry" :device-options="deviceOptions" @saved="onSaved" />
    <ConfirmDialog
      v-model:open="confirm.open"
      title="Delete this evidence record?"
      message="This permanently removes the clinical evidence record from the portfolio."
      :pending="confirm.pending"
      @confirm="onConfirmDelete"
    />
  </div>
</template>
