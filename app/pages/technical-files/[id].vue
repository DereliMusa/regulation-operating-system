<script setup lang="ts">
import type { TechnicalFileDetail } from '#shared/types/technical-file'
import type { GsprEntry } from '#shared/types/gspr'
import type { RiskEntry } from '#shared/types/risk'
// Technical file detail (FR-TF-3/4): Overview / GSPR / Risk tabs with CRUD.
definePageMeta({ layout: 'app', middleware: ['auth'] })

const route = useRoute()
const id = computed(() => Number(route.params.id))
const { data: file, refresh } = await useFetch<TechnicalFileDetail>(() => `/api/technical-files/${id.value}`)
useHead({ title: () => `${file.value?.deviceName ?? 'Technical file'} - Certra` })

type TabKey = 'overview' | 'gspr' | 'risk'
const tab = ref<TabKey>('overview')
const tabs: Array<{ key: TabKey, label: string }> = [
  { key: 'overview', label: 'Overview' },
  { key: 'gspr', label: 'GSPR matrix' },
  { key: 'risk', label: 'Risk register' },
]

const editOpen = ref(false)
const gsprModal = reactive({ open: false, entry: null as GsprEntry | null })
const riskModal = reactive({ open: false, entry: null as RiskEntry | null })
const confirm = reactive({ open: false, kind: 'gspr' as 'gspr' | 'risk', entryId: 0, pending: false })

function openEdit(): void { editOpen.value = true }
function openGsprAdd(): void { gsprModal.entry = null; gsprModal.open = true }
function openGsprEdit(entry: GsprEntry): void { gsprModal.entry = entry; gsprModal.open = true }
function openRiskAdd(): void { riskModal.entry = null; riskModal.open = true }
function openRiskEdit(entry: RiskEntry): void { riskModal.entry = entry; riskModal.open = true }
function askDelete(kind: 'gspr' | 'risk', entryId: number): void {
  confirm.kind = kind
  confirm.entryId = entryId
  confirm.open = true
}

async function onConfirmDelete(): Promise<void> {
  confirm.pending = true
  try {
    await $fetch(`/api/${confirm.kind}/${confirm.entryId}`, { method: 'DELETE' })
    confirm.open = false
    await refresh()
  }
  finally {
    confirm.pending = false
  }
}
async function onSaved(): Promise<void> {
  await refresh()
}
</script>

<template>
  <div v-if="file" class="space-y-5">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <NuxtLink to="/technical-files" class="mb-1 inline-flex items-center gap-1 text-[13px] text-ink-muted hover:text-brand-500">
          <UIcon name="i-material-symbols-chevron-left" class="size-4" />
          Technical files
        </NuxtLink>
        <h1 class="font-display text-2xl font-semibold text-ink">{{ file.deviceName }}</h1>
        <p v-if="file.udiDi" class="font-mono text-[12px] text-ink-muted">UDI-DI: {{ file.udiDi }}</p>
      </div>
      <div class="flex items-center gap-3">
        <StatusBadge :status="file.status" />
        <UButton icon="i-material-symbols-edit-outline" color="neutral" variant="outline" @click="openEdit">Edit</UButton>
      </div>
    </div>

    <div class="border-b border-line">
      <nav class="flex gap-6">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="-mb-px border-b-2 pb-2.5 text-sm font-medium transition-colors"
          :class="tab === t.key ? 'border-brand-500 text-ink' : 'border-transparent text-ink-muted hover:text-ink'"
          @click="tab = t.key"
        >
          {{ t.label }}
        </button>
      </nav>
    </div>

    <TechnicalFileOverview v-if="tab === 'overview'" :file="file" />
    <GsprMatrix
      v-else-if="tab === 'gspr'"
      :entries="file.gspr"
      @add="openGsprAdd"
      @edit="openGsprEdit"
      @delete="(entryId) => askDelete('gspr', entryId)"
    />
    <RiskRegister
      v-else
      :entries="file.risks"
      @add="openRiskAdd"
      @edit="openRiskEdit"
      @delete="(entryId) => askDelete('risk', entryId)"
    />

    <TechnicalFileFormModal v-model:open="editOpen" :file="file" @saved="onSaved" />
    <GsprFormModal v-model:open="gsprModal.open" :technical-file-id="file.id" :entry="gsprModal.entry" @saved="onSaved" />
    <RiskFormModal v-model:open="riskModal.open" :technical-file-id="file.id" :entry="riskModal.entry" @saved="onSaved" />
    <ConfirmDialog
      v-model:open="confirm.open"
      :title="confirm.kind === 'gspr' ? 'Delete this GSPR entry?' : 'Delete this risk entry?'"
      message="This permanently removes the entry from the technical file."
      :pending="confirm.pending"
      @confirm="onConfirmDelete"
    />
  </div>

  <div v-else class="flex min-h-[50vh] items-center justify-center">
    <p class="text-ink-muted">Technical file not found.</p>
  </div>
</template>
