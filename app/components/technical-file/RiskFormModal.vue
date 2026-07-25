<script setup lang="ts">
import { z } from 'zod'
import type { RiskEntry, RiskSeverity, RiskStatus } from '#shared/types/risk'
// Add / edit a risk entry (ISO 14971) within a technical file.
const props = defineProps<{ open: boolean, technicalFileId?: number, entry?: RiskEntry | null }>()
const emit = defineEmits<{ 'update:open': [boolean], saved: [] }>()

const isEdit = computed(() => !!props.entry)

const schema = z.object({
  riskId: z.string().min(1, 'Required'),
  hazardDescription: z.string().min(1, 'Required'),
  severity: z.enum(['critical', 'major', 'moderate', 'minor']),
  status: z.enum(['draft', 'review', 'mitigated']),
})

const state = reactive({
  riskId: '',
  hazardDescription: '',
  severity: 'major' as RiskSeverity,
  probability: '',
  status: 'draft' as RiskStatus,
  mitigation: '',
  controlMeasureRef: '',
  verificationRef: '',
  traceabilityRefs: '',
})
const pending = ref(false)
const error = ref('')

const severityOptions = [
  { label: 'Critical', value: 'critical' }, { label: 'Major', value: 'major' },
  { label: 'Moderate', value: 'moderate' }, { label: 'Minor', value: 'minor' },
]
const statusOptions = [
  { label: 'Draft', value: 'draft' }, { label: 'Review', value: 'review' }, { label: 'Mitigated', value: 'mitigated' },
]

watch(() => props.open, (open) => { if (open) reset() })
function reset(): void {
  const e = props.entry
  Object.assign(state, {
    riskId: e?.riskId ?? '',
    hazardDescription: e?.hazardDescription ?? '',
    severity: e?.severity ?? 'major',
    probability: e?.probability ?? '',
    status: e?.status ?? 'draft',
    mitigation: e?.mitigation ?? '',
    controlMeasureRef: e?.controlMeasureRef ?? '',
    verificationRef: e?.verificationRef ?? '',
    traceabilityRefs: (e?.traceabilityRefs ?? []).join(', '),
  })
  error.value = ''
}

const toList = (value: string): string[] => value.split(',').map(v => v.trim()).filter(Boolean)

async function onSubmit(): Promise<void> {
  pending.value = true
  error.value = ''
  const body = {
    riskId: state.riskId,
    hazardDescription: state.hazardDescription,
    severity: state.severity,
    probability: state.probability || null,
    status: state.status,
    mitigation: state.mitigation || null,
    controlMeasureRef: state.controlMeasureRef || null,
    verificationRef: state.verificationRef || null,
    traceabilityRefs: toList(state.traceabilityRefs),
  }
  try {
    if (isEdit.value) await $fetch(`/api/risk/${props.entry!.id}`, { method: 'PATCH', body })
    else await $fetch('/api/risk', { method: 'POST', body: { ...body, technicalFileId: props.technicalFileId } })
    emit('saved')
    emit('update:open', false)
  }
  catch {
    error.value = 'Could not save the risk entry. Check the fields and try again.'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <UModal :open="open" :title="isEdit ? 'Edit risk entry' : 'Add risk entry'" @update:open="emit('update:open', $event)">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UAlert v-if="error" color="error" variant="soft" :title="error" />
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Risk id" name="riskId">
            <UInput v-model="state.riskId" placeholder="RISK-014" class="w-full" />
          </UFormField>
          <UFormField label="Probability" name="probability">
            <UInput v-model="state.probability" placeholder="P2" class="w-full" />
          </UFormField>
        </div>
        <UFormField label="Hazard" name="hazardDescription">
          <UTextarea v-model="state.hazardDescription" :rows="2" class="w-full" placeholder="AI misclassification of neural signal" />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Severity" name="severity">
            <USelect v-model="state.severity" :items="severityOptions" class="w-full" />
          </UFormField>
          <UFormField label="Status" name="status">
            <USelect v-model="state.status" :items="statusOptions" class="w-full" />
          </UFormField>
        </div>
        <UFormField label="Mitigation" name="mitigation">
          <UTextarea v-model="state.mitigation" :rows="2" class="w-full" />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-3">
          <UFormField label="Control ref" name="controlMeasureRef">
            <UInput v-model="state.controlMeasureRef" placeholder="RCM-42" class="w-full" />
          </UFormField>
          <UFormField label="Verification ref" name="verificationRef">
            <UInput v-model="state.verificationRef" placeholder="V&V-201" class="w-full" />
          </UFormField>
          <UFormField label="Traceability" name="traceabilityRefs" help="Comma-separated">
            <UInput v-model="state.traceabilityRefs" placeholder="GSPR 17.1" class="w-full" />
          </UFormField>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <UButton color="neutral" variant="ghost" :disabled="pending" @click="emit('update:open', false)">Cancel</UButton>
          <UButton type="submit" :loading="pending">{{ isEdit ? 'Save changes' : 'Add entry' }}</UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
