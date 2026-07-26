<script setup lang="ts">
import { z } from 'zod'
import type { PmsPlanItem, PmsPlanStatus, PmsPlanType } from '#shared/types/post-market'
// Add / edit a post-market surveillance plan (FR-PMS-2). Create when no `plan`
// is passed (POST), edit otherwise (PATCH). On create a device must be picked;
// on edit the device is fixed and shown read-only.
const props = defineProps<{
  open: boolean
  plan?: PmsPlanItem | null
  deviceOptions: Array<{ label: string, value: number }>
}>()
const emit = defineEmits<{ 'update:open': [boolean], saved: [] }>()

const isEdit = computed(() => !!props.plan)

const schema = z.object({
  planType: z.enum(['PMS', 'PMCF', 'PSUR']),
  nextDue: z.string().min(1, 'Required'),
  status: z.enum(['pending_review', 'active', 'drafting', 'deficiency']),
})

const state = reactive({
  technicalFileId: props.deviceOptions[0]?.value ?? 0,
  planType: 'PMS' as PmsPlanType,
  nextDue: '',
  status: 'pending_review' as PmsPlanStatus,
  confidence: '',
})
const pending = ref(false)
const error = ref('')

const typeOptions = [
  { label: 'PMS', value: 'PMS' }, { label: 'PMCF', value: 'PMCF' }, { label: 'PSUR', value: 'PSUR' },
]
const statusOptions = [
  { label: 'Pending review', value: 'pending_review' }, { label: 'Active', value: 'active' },
  { label: 'Drafting', value: 'drafting' }, { label: 'Deficiency', value: 'deficiency' },
]

watch(() => props.open, (open) => { if (open) reset() })
function reset(): void {
  const p = props.plan
  Object.assign(state, {
    technicalFileId: p?.technicalFileId ?? props.deviceOptions[0]?.value ?? 0,
    planType: p?.planType ?? 'PMS',
    nextDue: p?.nextDue ? p.nextDue.slice(0, 10) : '',
    status: p?.status ?? 'pending_review',
    confidence: p?.confidence != null ? String(p.confidence) : '',
  })
  error.value = ''
}

async function onSubmit(): Promise<void> {
  pending.value = true
  error.value = ''
  const body = {
    planType: state.planType,
    nextDue: state.nextDue,
    status: state.status,
    confidence: state.confidence.trim() === '' ? null : Number(state.confidence),
  }
  try {
    if (isEdit.value) await $fetch(`/api/post-market/${props.plan!.id}`, { method: 'PATCH', body })
    else await $fetch('/api/post-market', { method: 'POST', body: { ...body, technicalFileId: state.technicalFileId } })
    emit('saved')
    emit('update:open', false)
  }
  catch {
    error.value = 'Could not save the plan. Check the fields and try again.'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <UModal :open="open" :title="isEdit ? 'Edit surveillance plan' : 'Add surveillance plan'" @update:open="emit('update:open', $event)">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UAlert v-if="error" color="error" variant="soft" :title="error" />
        <UFormField v-if="isEdit" label="Device">
          <p class="text-sm text-ink-soft">{{ plan?.deviceName }}</p>
        </UFormField>
        <UFormField v-else label="Device" name="technicalFileId">
          <USelect v-model="state.technicalFileId" :items="deviceOptions" class="w-full" />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Plan type" name="planType">
            <USelect v-model="state.planType" :items="typeOptions" class="w-full" />
          </UFormField>
          <UFormField label="Next due" name="nextDue">
            <UInput v-model="state.nextDue" type="date" class="w-full" />
          </UFormField>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Status" name="status">
            <USelect v-model="state.status" :items="statusOptions" class="w-full" />
          </UFormField>
          <UFormField label="AI confidence" name="confidence" help="0-100, optional">
            <UInput v-model="state.confidence" type="number" min="0" max="100" placeholder="80" class="w-full" />
          </UFormField>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <UButton color="neutral" variant="ghost" :disabled="pending" @click="emit('update:open', false)">Cancel</UButton>
          <UButton type="submit" :loading="pending">{{ isEdit ? 'Save changes' : 'Add plan' }}</UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
