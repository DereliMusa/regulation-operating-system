<script setup lang="ts">
import type { DataTableColumn } from '~/utils/table'
import type { PmsPlanItem, PostMarketOverview } from '#shared/types/post-market'
import type { TechnicalFileList } from '#shared/types/technical-file'
// Post-Market screen (FR-PMS-1 read, FR-PMS-2 CRUD): milestone timeline,
// surveillance-plans table with add/edit/delete, and an AI insight.
definePageMeta({ layout: 'app', middleware: ['auth'] })
useHead({ title: 'Post-Market - Certra' })

const { data, refresh } = await useFetch<PostMarketOverview>('/api/post-market')
const { data: filesData } = await useFetch<TechnicalFileList>('/api/technical-files', { query: { pageSize: 50 } })
const items = computed(() => data.value?.items ?? [])
const summary = computed(() => data.value?.summary)
const deviceOptions = computed(() => (filesData.value?.items ?? []).map(f => ({ label: f.deviceName, value: f.id })))

const modal = reactive({ open: false, plan: null as PmsPlanItem | null })
const confirm = reactive({ open: false, planId: 0, pending: false })

function openAdd(): void { modal.plan = null; modal.open = true }
function openEdit(plan: PmsPlanItem): void { modal.plan = plan; modal.open = true }
function askDelete(planId: number): void { confirm.planId = planId; confirm.open = true }

async function onConfirmDelete(): Promise<void> {
  confirm.pending = true
  try {
    await $fetch(`/api/post-market/${confirm.planId}`, { method: 'DELETE' })
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
    { label: 'Active plans', value: s?.total ?? 0 },
    { label: 'Due within 30 days', value: s?.dueSoon ?? 0 },
    { label: 'Overdue', value: s?.overdue ?? 0 },
    { label: 'PSUR / PMCF / PMS', value: s ? `${s.byType.PSUR}/${s.byType.PMCF}/${s.byType.PMS}` : '0/0/0' },
  ]
})

const aiInsight = computed(() => {
  const soonest = items.value[0]
  if (!soonest) return null
  const when = soonest.daysRemaining < 0
    ? `overdue by ${-soonest.daysRemaining} days`
    : `due in ${soonest.daysRemaining} days`
  return {
    confidence: soonest.confidence ?? undefined,
    text: `${soonest.planType} for ${soonest.deviceName} is ${when}. A draft has been prepared from surveillance data — verify before submission.`,
  }
})

const columns: DataTableColumn[] = [
  { key: 'planType', label: 'Plan', mono: true, width: 'w-24' },
  { key: 'deviceName', label: 'Device' },
  { key: 'nextDue', label: 'Next due', width: 'w-36' },
  { key: 'daysRemaining', label: 'Remaining', width: 'w-32' },
  { key: 'status', label: 'Status', width: 'w-32' },
  { key: 'actions', label: '', align: 'right', width: 'w-24' },
]

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
function remainingLabel(days: number): string {
  return days < 0 ? `${-days}d overdue` : `${days} days`
}
</script>

<template>
  <div class="space-y-5">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="font-display text-xl font-semibold text-ink">Post-Market Surveillance</h1>
        <p class="text-sm text-ink-soft">PMS, PMCF, and PSUR plans and their upcoming deadlines.</p>
      </div>
      <UButton icon="i-material-symbols-add" :disabled="!deviceOptions.length" @click="openAdd">Add plan</UButton>
    </header>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <BentoCard v-for="c in cards" :key="c.label" :label="c.label" :value="c.value" />
    </div>

    <div class="grid gap-5 lg:grid-cols-3">
      <BentoCard label="Milestone timeline" class="lg:col-span-2">
        <ol class="space-y-3">
          <li v-for="p in items" :key="p.id" class="flex items-center gap-3">
            <span
              class="flex size-9 shrink-0 items-center justify-center rounded-full font-mono text-[10px]"
              :class="p.daysRemaining < 0 ? 'bg-status-deficiency-bg text-status-deficiency' : p.daysRemaining <= 30 ? 'bg-status-review-bg text-status-review' : 'bg-status-approved-bg text-status-approved'"
            >{{ p.planType }}</span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm text-ink">{{ p.deviceName }}</p>
              <p class="text-[12px] text-ink-muted">Due {{ fmtDate(p.nextDue) }}</p>
            </div>
            <span
              class="shrink-0 font-mono text-sm"
              :class="p.daysRemaining < 0 ? 'font-medium text-status-deficiency' : 'text-ink-soft'"
            >{{ remainingLabel(p.daysRemaining) }}</span>
          </li>
        </ol>
      </BentoCard>

      <AiPanel v-if="aiInsight" label="AI post-market insight" :confidence="aiInsight.confidence">
        {{ aiInsight.text }}
      </AiPanel>
    </div>

    <DataTable :columns="columns" :rows="items" row-key="id" empty-label="No surveillance plans yet.">
      <template #deviceName="{ row }">
        <span class="text-ink">{{ row.deviceName }}</span>
      </template>
      <template #nextDue="{ row }">
        <span class="text-ink-soft">{{ fmtDate(row.nextDue) }}</span>
      </template>
      <template #daysRemaining="{ row }">
        <span :class="row.daysRemaining < 0 ? 'font-medium text-status-deficiency' : 'text-ink-soft'">
          {{ remainingLabel(row.daysRemaining) }}
        </span>
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

    <PmsPlanFormModal v-model:open="modal.open" :plan="modal.plan" :device-options="deviceOptions" @saved="onSaved" />
    <ConfirmDialog
      v-model:open="confirm.open"
      title="Delete this surveillance plan?"
      message="This permanently removes the plan from the portfolio."
      :pending="confirm.pending"
      @confirm="onConfirmDelete"
    />
  </div>
</template>
