<script setup lang="ts">
import type { DataTableColumn } from '~/utils/table'
import type { PostMarketOverview } from '#shared/types/post-market'
// Post-Market screen (FR-PMS-1): milestone timeline, surveillance-plans table,
// and an AI insight, read-mostly over seed data.
definePageMeta({ layout: 'app', middleware: ['auth'] })
useHead({ title: 'Post-Market - Certra' })

const { data } = await useFetch<PostMarketOverview>('/api/post-market')
const items = computed(() => data.value?.items ?? [])
const summary = computed(() => data.value?.summary)

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
    <header>
      <h1 class="font-display text-xl font-semibold text-ink">Post-Market Surveillance</h1>
      <p class="text-sm text-ink-soft">PMS, PMCF, and PSUR plans and their upcoming deadlines.</p>
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
    </DataTable>
  </div>
</template>
