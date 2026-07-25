<script setup lang="ts">
import type { DashboardStats } from '#shared/types/dashboard'
import type { DataTableColumn } from '~/utils/table'
// Dashboard (S4, FR-DASH-1..4): portfolio readiness, active files, pending
// approvals, upcoming deadlines, AI drafts, and open findings — all from
// GET /api/dashboard/stats over the seeded database, rendered with the S3
// shared component library.
definePageMeta({ layout: 'app', middleware: ['auth'] })
useHead({ title: 'Dashboard - Certra' })

const EMPTY_STATS: DashboardStats = {
  readiness: { overallPercent: 0, activeFileCount: 0 },
  files: [],
  approvals: [],
  deadlines: [],
  aiDrafts: [],
  findings: [],
  counts: { files: 0, openFindings: 0, pendingApprovals: 0, aiDrafts: 0 },
}

const { data: stats } = await useFetch<DashboardStats>('/api/dashboard/stats', {
  default: () => EMPTY_STATS,
})

const soonest = computed(() => stats.value.deadlines[0])
const laterDeadlines = computed(() => stats.value.deadlines.slice(1))

const findingColumns: DataTableColumn[] = [
  { key: 'severity', label: 'Severity', width: 'w-28' },
  { key: 'description', label: 'Finding' },
  { key: 'gsprRef', label: 'GSPR ref', width: 'w-44' },
  { key: 'recommendation', label: 'Recommendation' },
]

function approvalIcon(kind: string): string {
  if (kind.startsWith('Clinical')) return 'i-material-symbols-clinical-notes'
  if (kind.startsWith('Post')) return 'i-material-symbols-monitoring'
  return 'i-material-symbols-description'
}

function deadlineTone(days: number): { box: string, text: string, label: string } {
  if (days <= 14) return { box: 'border-status-deficiency/30 bg-status-deficiency-bg', text: 'text-status-deficiency', label: 'Action required' }
  if (days <= 30) return { box: 'border-status-review/30 bg-status-review-bg', text: 'text-status-review', label: 'Due soon' }
  return { box: 'border-line bg-surface-2', text: 'text-ink-soft', label: 'Upcoming' }
}

function formatDue(dateIso: string): string {
  return new Date(dateIso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}
</script>

<template>
  <div class="space-y-5">
    <header>
      <h1 class="font-display text-xl font-semibold text-ink">Regulatory portfolio</h1>
      <p class="text-sm text-ink-soft">Compliance readiness and open work across your active technical files.</p>
    </header>

    <!-- Row 1: readiness, active files, pending approvals -->
    <section class="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <BentoCard label="Compliance readiness" class="lg:col-span-3">
        <div class="flex flex-1 flex-col items-center justify-center gap-3 py-2 text-center">
          <ReadinessRing :percent="stats.readiness.overallPercent" />
          <p class="text-sm text-ink-soft">Portfolio mean across {{ stats.readiness.activeFileCount }} active files.</p>
        </div>
      </BentoCard>

      <BentoCard :label="`Active technical files (${stats.counts.files})`" class="lg:col-span-5">
        <template #action>
          <NuxtLink to="/technical-files" class="text-[13px] font-medium text-brand-500 hover:underline">View all</NuxtLink>
        </template>
        <div class="space-y-4">
          <div v-for="file in stats.files" :key="file.id">
            <div class="mb-1.5 flex items-center justify-between gap-2">
              <NuxtLink to="/technical-files" class="truncate text-sm font-medium text-ink hover:text-brand-500">{{ file.deviceName }}</NuxtLink>
              <StatusBadge :status="file.status" />
            </div>
            <ReadinessBar :percent="file.readinessPercent" :tone="statusTone(file.status)" show-value />
          </div>
        </div>
      </BentoCard>

      <BentoCard :label="`Pending approvals (${stats.counts.pendingApprovals})`" class="lg:col-span-4">
        <div v-if="stats.approvals.length" class="space-y-1">
          <div
            v-for="(approval, index) in stats.approvals"
            :key="index"
            class="flex items-center gap-3 rounded-btn border border-transparent p-2 transition-colors hover:border-line hover:bg-surface-2"
          >
            <span class="flex size-8 shrink-0 items-center justify-center rounded bg-primary-wash text-brand-500">
              <UIcon :name="approvalIcon(approval.kind)" class="size-[18px]" />
            </span>
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-ink">{{ approval.title }}</p>
              <p class="truncate text-[12px] text-ink-muted">{{ approval.kind }} · {{ approval.deviceName }}</p>
            </div>
          </div>
        </div>
        <p v-else class="text-sm text-ink-muted">Nothing awaiting approval.</p>
      </BentoCard>
    </section>

    <!-- Row 2: AI activity, upcoming deadlines -->
    <section class="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <AiPanel label="AI assistance activity" class="lg:col-span-8">
        <p class="mb-3">{{ stats.counts.aiDrafts }} automation drafts require human verification.</p>
        <div v-if="stats.aiDrafts.length" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="(draft, index) in stats.aiDrafts" :key="index" class="rounded-btn border border-line bg-surface p-3">
            <p class="mb-1 font-mono text-[11px] text-ai">{{ draft.ref }}</p>
            <p class="mb-3 line-clamp-2 text-sm font-medium text-ink">{{ draft.title }}</p>
            <div class="flex items-center justify-between text-[12px]">
              <span class="italic text-ink-muted">Confidence {{ draft.confidence }}%</span>
              <span class="truncate pl-2 font-medium text-brand-500">{{ draft.deviceName }}</span>
            </div>
          </div>
        </div>
      </AiPanel>

      <BentoCard label="Upcoming deadlines" class="lg:col-span-4">
        <div v-if="stats.deadlines.length" class="space-y-3">
          <div v-if="soonest" class="rounded-btn border p-3" :class="deadlineTone(soonest.daysRemaining).box">
            <div class="mb-1 flex items-center justify-between">
              <span class="text-[12px] font-semibold uppercase tracking-[0.04em]" :class="deadlineTone(soonest.daysRemaining).text">
                {{ deadlineTone(soonest.daysRemaining).label }}
              </span>
              <span class="font-mono text-sm" :class="deadlineTone(soonest.daysRemaining).text">{{ soonest.daysRemaining }} days</span>
            </div>
            <p class="text-sm font-medium text-ink">{{ soonest.planType }} · {{ soonest.deviceName }}</p>
          </div>
          <div
            v-for="(deadline, index) in laterDeadlines"
            :key="index"
            class="flex items-center justify-between border-b border-line pb-2 text-sm last:border-0 last:pb-0"
          >
            <span class="truncate text-ink">{{ deadline.planType }} · {{ deadline.deviceName }}</span>
            <span class="shrink-0 pl-2 text-ink-muted">{{ formatDue(deadline.dueDate) }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-ink-muted">No upcoming deadlines.</p>
      </BentoCard>
    </section>

    <!-- Row 3: open deficiency findings -->
    <section>
      <div class="mb-3 flex items-center gap-2">
        <h2 class="font-display text-base font-semibold text-ink">Open deficiency findings</h2>
        <span class="rounded-chip bg-status-deficiency-bg px-2 py-0.5 text-[12px] font-medium text-status-deficiency">
          {{ stats.counts.openFindings }} open
        </span>
      </div>
      <DataTable :columns="findingColumns" :rows="stats.findings" row-key="id" empty-label="No open findings.">
        <template #severity="{ row }">
          <SeverityBadge :severity="row.severity" />
        </template>
        <template #description="{ row }">
          <p class="font-medium text-ink">{{ row.description }}</p>
          <p class="text-[12px] text-ink-muted">{{ row.deviceName }}</p>
        </template>
        <template #gsprRef="{ row }">
          <TraceabilityChip v-if="row.gsprRef" :refs="row.gsprRef" />
          <span v-else class="text-ink-muted">—</span>
        </template>
        <template #recommendation="{ row }">
          <span class="text-ink-soft">{{ row.recommendation ?? '—' }}</span>
        </template>
      </DataTable>
    </section>
  </div>
</template>
