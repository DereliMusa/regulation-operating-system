<script setup lang="ts">
import type { DataTableColumn } from '~/utils/table'
import type { TechnicalFile, TechnicalFileList } from '#shared/types/technical-file'
// Technical files list (FR-TF-1/2): filterable, paginated table + create modal.
definePageMeta({ layout: 'app', middleware: ['auth'] })
useHead({ title: 'Technical Documentation - Certra' })

const PAGE_SIZE = 10
const filters = reactive({ status: 'all', regulation: 'all', search: '', page: 1 })
const query = computed(() => ({
  status: filters.status === 'all' ? undefined : filters.status,
  regulation: filters.regulation === 'all' ? undefined : filters.regulation,
  search: filters.search || undefined,
  page: filters.page,
  pageSize: PAGE_SIZE,
}))
const { data } = await useFetch<TechnicalFileList>('/api/technical-files', { query })

// Reset to page 1 whenever a filter changes.
watch(() => [filters.status, filters.regulation, filters.search], () => { filters.page = 1 })

const items = computed(() => data.value?.items ?? [])
const total = computed(() => data.value?.total ?? 0)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

const createOpen = ref(false)
function openCreate(): void { createOpen.value = true }
function onCreated(file: TechnicalFile): void {
  navigateTo(`/technical-files/${file.id}`)
}
function prevPage(): void { filters.page-- }
function nextPage(): void { filters.page++ }

const columns: DataTableColumn[] = [
  { key: 'deviceName', label: 'Device' },
  { key: 'deviceClass', label: 'Class', width: 'w-20' },
  { key: 'regulation', label: 'Reg', width: 'w-20' },
  { key: 'notifiedBody', label: 'Notified body' },
  { key: 'readinessPercent', label: 'Readiness', width: 'w-44' },
  { key: 'status', label: 'Status', width: 'w-32' },
  { key: 'updatedAt', label: 'Updated', width: 'w-32' },
]
const statusOptions = [
  { label: 'All statuses', value: 'all' }, { label: 'Draft', value: 'draft' }, { label: 'In review', value: 'in_review' },
  { label: 'Approved', value: 'approved' }, { label: 'Deficiency', value: 'deficiency' },
]
const regulationOptions = [{ label: 'All regs', value: 'all' }, { label: 'MDR', value: 'MDR' }, { label: 'IVDR', value: 'IVDR' }]

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="space-y-5">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="font-display text-xl font-semibold text-ink">Technical files</h1>
        <p class="text-sm text-ink-soft">Your MDR/IVDR technical documentation portfolio.</p>
      </div>
      <UButton icon="i-material-symbols-add" @click="openCreate">New technical file</UButton>
    </header>

    <div class="flex flex-wrap items-center gap-3">
      <USelect v-model="filters.status" :items="statusOptions" class="w-44" />
      <USelect v-model="filters.regulation" :items="regulationOptions" class="w-36" />
      <UInput v-model="filters.search" icon="i-material-symbols-search" placeholder="Search device name..." class="w-64" />
    </div>

    <DataTable :columns="columns" :rows="items" row-key="id" empty-label="No technical files match your filters.">
      <template #deviceName="{ row }">
        <NuxtLink :to="`/technical-files/${row.id}`" class="font-medium text-ink hover:text-brand-500">{{ row.deviceName }}</NuxtLink>
        <p v-if="row.udiDi" class="font-mono text-[11px] text-ink-muted">UDI-DI: {{ row.udiDi }}</p>
      </template>
      <template #deviceClass="{ row }">
        <span v-if="row.deviceClass" class="rounded border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[12px] text-ink-soft">{{ row.deviceClass }}</span>
        <span v-else class="text-ink-muted">—</span>
      </template>
      <template #notifiedBody="{ row }">
        <span class="text-ink-soft">{{ row.notifiedBody ?? '—' }}</span>
      </template>
      <template #readinessPercent="{ row }">
        <ReadinessBar :percent="row.readinessPercent" :tone="statusTone(row.status)" show-value />
      </template>
      <template #status="{ row }">
        <StatusBadge :status="row.status" />
      </template>
      <template #updatedAt="{ row }">
        <span class="text-ink-muted">{{ fmtDate(row.updatedAt) }}</span>
      </template>
    </DataTable>

    <div class="flex items-center justify-between text-sm">
      <span class="text-ink-muted">{{ total }} files</span>
      <div class="flex items-center gap-2">
        <UButton icon="i-material-symbols-chevron-left" color="neutral" variant="ghost" size="sm" :disabled="filters.page <= 1" aria-label="Previous page" @click="prevPage" />
        <span class="text-ink-soft">Page {{ filters.page }} of {{ totalPages }}</span>
        <UButton icon="i-material-symbols-chevron-right" color="neutral" variant="ghost" size="sm" :disabled="filters.page >= totalPages" aria-label="Next page" @click="nextPage" />
      </div>
    </div>

    <TechnicalFileFormModal v-model:open="createOpen" @saved="onCreated" />
  </div>
</template>
