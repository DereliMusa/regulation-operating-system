<script setup lang="ts">
import { z } from 'zod'
import type { ClinicalEvidenceItem, ClinicalEvidenceStatus, ClinicalSourceType } from '#shared/types/clinical'
// Add / edit a clinical evidence record (FR-CER-2). Create when no `entry` is
// passed (POST), edit otherwise (PATCH). On create a device must be picked; on
// edit the device is fixed and shown read-only.
const props = defineProps<{
  open: boolean
  entry?: ClinicalEvidenceItem | null
  deviceOptions: Array<{ label: string, value: number }>
}>()
const emit = defineEmits<{ 'update:open': [boolean], saved: [] }>()

const isEdit = computed(() => !!props.entry)

const schema = z.object({
  cerRef: z.string().min(1, 'Required'),
  title: z.string().min(1, 'Required'),
  sourceType: z.enum(['literature', 'investigation', 'pms']),
  status: z.enum(['approved', 'in_review', 'draft', 'deficiency']),
})

const state = reactive({
  technicalFileId: props.deviceOptions[0]?.value ?? 0,
  cerRef: '',
  sourceType: 'literature' as ClinicalSourceType,
  title: '',
  status: 'draft' as ClinicalEvidenceStatus,
  aiSummary: '',
  confidence: '',
})
const pending = ref(false)
const error = ref('')

const sourceOptions = [
  { label: 'Literature', value: 'literature' },
  { label: 'Investigation', value: 'investigation' },
  { label: 'Post-market', value: 'pms' },
]
const statusOptions = [
  { label: 'Draft', value: 'draft' }, { label: 'In review', value: 'in_review' },
  { label: 'Approved', value: 'approved' }, { label: 'Deficiency', value: 'deficiency' },
]

watch(() => props.open, (open) => { if (open) reset() })
function reset(): void {
  const e = props.entry
  Object.assign(state, {
    technicalFileId: e?.technicalFileId ?? props.deviceOptions[0]?.value ?? 0,
    cerRef: e?.cerRef ?? '',
    sourceType: e?.sourceType ?? 'literature',
    title: e?.title ?? '',
    status: e?.status ?? 'draft',
    aiSummary: e?.aiSummary ?? '',
    confidence: e?.confidence != null ? String(e.confidence) : '',
  })
  error.value = ''
}

async function onSubmit(): Promise<void> {
  pending.value = true
  error.value = ''
  const body = {
    cerRef: state.cerRef,
    sourceType: state.sourceType,
    title: state.title,
    status: state.status,
    aiSummary: state.aiSummary || null,
    confidence: state.confidence.trim() === '' ? null : Number(state.confidence),
  }
  try {
    if (isEdit.value) await $fetch(`/api/clinical/${props.entry!.id}`, { method: 'PATCH', body })
    else await $fetch('/api/clinical', { method: 'POST', body: { ...body, technicalFileId: state.technicalFileId } })
    emit('saved')
    emit('update:open', false)
  }
  catch {
    error.value = 'Could not save the evidence record. Check the fields and try again.'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <UModal :open="open" :title="isEdit ? 'Edit clinical evidence' : 'Add clinical evidence'" @update:open="emit('update:open', $event)">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UAlert v-if="error" color="error" variant="soft" :title="error" />
        <UFormField v-if="isEdit" label="Device">
          <p class="text-sm text-ink-soft">{{ entry?.deviceName }}</p>
        </UFormField>
        <UFormField v-else label="Device" name="technicalFileId">
          <USelect v-model="state.technicalFileId" :items="deviceOptions" class="w-full" />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="CER ref" name="cerRef">
            <UInput v-model="state.cerRef" placeholder="CER-2024-014" class="w-full" />
          </UFormField>
          <UFormField label="Source" name="sourceType">
            <USelect v-model="state.sourceType" :items="sourceOptions" class="w-full" />
          </UFormField>
        </div>
        <UFormField label="Title" name="title">
          <UInput v-model="state.title" placeholder="Systematic literature review of clinical outcomes" class="w-full" />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Status" name="status">
            <USelect v-model="state.status" :items="statusOptions" class="w-full" />
          </UFormField>
          <UFormField label="AI confidence" name="confidence" help="0-100, optional">
            <UInput v-model="state.confidence" type="number" min="0" max="100" placeholder="90" class="w-full" />
          </UFormField>
        </div>
        <UFormField label="AI summary" name="aiSummary" help="Optional mock-AI preview">
          <UTextarea v-model="state.aiSummary" :rows="2" class="w-full" />
        </UFormField>
        <div class="flex justify-end gap-2 pt-2">
          <UButton color="neutral" variant="ghost" :disabled="pending" @click="emit('update:open', false)">Cancel</UButton>
          <UButton type="submit" :loading="pending">{{ isEdit ? 'Save changes' : 'Add evidence' }}</UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
