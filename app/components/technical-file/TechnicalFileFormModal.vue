<script setup lang="ts">
import { z } from 'zod'
import type { TechnicalFile, Regulation } from '#shared/types/technical-file'
// Create / edit a technical file's metadata. Create when no `file` is passed
// (POST), edit otherwise (PATCH). Emits `saved` with the persisted file.
const props = defineProps<{ open: boolean, file?: TechnicalFile | null }>()
const emit = defineEmits<{ 'update:open': [boolean], saved: [TechnicalFile] }>()

const isEdit = computed(() => !!props.file)

const schema = z.object({
  deviceName: z.string().min(1, 'Device name is required'),
  regulation: z.enum(['MDR', 'IVDR']),
})

const state = reactive({
  deviceName: '',
  deviceClass: '',
  regulation: 'MDR' as Regulation,
  notifiedBody: '',
  udiDi: '',
  intendedUse: '',
  status: 'draft',
})
const pending = ref(false)
const error = ref('')

const classOptions = [
  { label: 'Not set', value: '' },
  { label: 'I', value: 'I' }, { label: 'IIa', value: 'IIa' }, { label: 'IIb', value: 'IIb' }, { label: 'III', value: 'III' },
  { label: 'A', value: 'A' }, { label: 'B', value: 'B' }, { label: 'C', value: 'C' }, { label: 'D', value: 'D' },
]
const regulationOptions = [{ label: 'MDR', value: 'MDR' }, { label: 'IVDR', value: 'IVDR' }]
const statusOptions = [
  { label: 'Draft', value: 'draft' }, { label: 'In review', value: 'in_review' },
  { label: 'Approved', value: 'approved' }, { label: 'Deficiency', value: 'deficiency' },
]

watch(() => props.open, (open) => { if (open) reset() })
function reset(): void {
  const f = props.file
  Object.assign(state, {
    deviceName: f?.deviceName ?? '',
    deviceClass: f?.deviceClass ?? '',
    regulation: f?.regulation ?? 'MDR',
    notifiedBody: f?.notifiedBody ?? '',
    udiDi: f?.udiDi ?? '',
    intendedUse: f?.intendedUse ?? '',
    status: f?.status ?? 'draft',
  })
  error.value = ''
}

async function onSubmit(): Promise<void> {
  pending.value = true
  error.value = ''
  const body = {
    deviceName: state.deviceName,
    deviceClass: state.deviceClass || null,
    regulation: state.regulation,
    notifiedBody: state.notifiedBody || null,
    udiDi: state.udiDi || null,
    intendedUse: state.intendedUse || null,
    ...(isEdit.value ? { status: state.status } : {}),
  }
  try {
    const saved = isEdit.value
      ? await $fetch<TechnicalFile>(`/api/technical-files/${props.file!.id}`, { method: 'PATCH', body })
      : await $fetch<TechnicalFile>('/api/technical-files', { method: 'POST', body })
    emit('saved', saved)
    emit('update:open', false)
  }
  catch {
    error.value = 'Could not save the technical file. Check the fields and try again.'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <UModal :open="open" :title="isEdit ? 'Edit technical file' : 'New technical file'" @update:open="emit('update:open', $event)">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UAlert v-if="error" color="error" variant="soft" :title="error" />
        <UFormField label="Device name" name="deviceName">
          <UInput v-model="state.deviceName" placeholder="CardioGuard Pro S2" class="w-full" />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-3">
          <UFormField label="Class" name="deviceClass">
            <USelect v-model="state.deviceClass" :items="classOptions" class="w-full" />
          </UFormField>
          <UFormField label="Regulation" name="regulation">
            <USelect v-model="state.regulation" :items="regulationOptions" class="w-full" />
          </UFormField>
          <UFormField v-if="isEdit" label="Status" name="status">
            <USelect v-model="state.status" :items="statusOptions" class="w-full" />
          </UFormField>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Notified body" name="notifiedBody">
            <UInput v-model="state.notifiedBody" placeholder="TUV SUD (0123)" class="w-full" />
          </UFormField>
          <UFormField label="UDI-DI" name="udiDi">
            <UInput v-model="state.udiDi" placeholder="087625143" class="w-full" />
          </UFormField>
        </div>
        <UFormField label="Intended use" name="intendedUse">
          <UTextarea v-model="state.intendedUse" :rows="2" class="w-full" />
        </UFormField>
        <div class="flex justify-end gap-2 pt-2">
          <UButton color="neutral" variant="ghost" :disabled="pending" @click="emit('update:open', false)">Cancel</UButton>
          <UButton type="submit" :loading="pending">{{ isEdit ? 'Save changes' : 'Create file' }}</UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
