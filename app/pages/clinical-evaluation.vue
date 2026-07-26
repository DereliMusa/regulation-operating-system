<script setup lang="ts">
import type { DataTableColumn } from '~/utils/table'
import type { ClinicalOverview, ClinicalSourceType } from '#shared/types/clinical'
// Clinical Evaluation screen (FR-CER-1): evidence summary, literature table, and
// an AI-suggestions panel, read-mostly over seed data.
definePageMeta({ layout: 'app', middleware: ['auth'] })
useHead({ title: 'Clinical Evaluation - Certra' })

const { data } = await useFetch<ClinicalOverview>('/api/clinical')
const items = computed(() => data.value?.items ?? [])
const summary = computed(() => data.value?.summary)
const aiSuggestions = computed(() => data.value?.aiSuggestions ?? [])

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
]

const SOURCE_LABEL: Record<ClinicalSourceType, string> = {
  literature: 'Literature',
  investigation: 'Investigation',
  pms: 'Post-market',
}
</script>

<template>
  <div class="space-y-5">
    <header>
      <h1 class="font-display text-xl font-semibold text-ink">Clinical Evaluation</h1>
      <p class="text-sm text-ink-soft">Clinical evidence and CER drafting across your portfolio.</p>
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
  </div>
</template>
