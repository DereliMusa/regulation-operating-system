<script setup lang="ts">
import { z } from 'zod'
import type { GsprEntry, GsprConformity } from '#shared/types/gspr'
// Add / edit a GSPR entry. The parent refreshes the file on @saved so the
// recomputed readiness shows immediately.
const props = defineProps<{ open: boolean, technicalFileId?: number, entry?: GsprEntry | null }>()
const emit = defineEmits<{ 'update:open': [boolean], saved: [] }>()

const isEdit = computed(() => !!props.entry)

const schema = z.object({
  gsprRef: z.string().min(1, 'Required'),
  requirementText: z.string().min(1, 'Required'),
  conformity: z.enum(['conforming', 'partial', 'missing']),
})

const state = reactive({
  gsprRef: '',
  requirementText: '',
  conformity: 'missing' as GsprConformity,
  evidenceRefs: '',
  standardRefs: '',
  notes: '',
})
const pending = ref(false)
const error = ref('')

const conformityOptions = [
  { label: 'Conforming', value: 'conforming' },
  { label: 'Partial', value: 'partial' },
  { label: 'Missing', value: 'missing' },
]

watch(() => props.open, (open) => { if (open) reset() })
function reset(): void {
  const e = props.entry
  Object.assign(state, {
    gsprRef: e?.gsprRef ?? '',
    requirementText: e?.requirementText ?? '',
    conformity: e?.conformity ?? 'missing',
    evidenceRefs: (e?.evidenceRefs ?? []).join(', '),
    standardRefs: (e?.standardRefs ?? []).join(', '),
    notes: e?.notes ?? '',
  })
  error.value = ''
}

const toList = (value: string): string[] => value.split(',').map(v => v.trim()).filter(Boolean)

async function onSubmit(): Promise<void> {
  pending.value = true
  error.value = ''
  const body = {
    gsprRef: state.gsprRef,
    requirementText: state.requirementText,
    conformity: state.conformity,
    evidenceRefs: toList(state.evidenceRefs),
    standardRefs: toList(state.standardRefs),
    notes: state.notes || null,
  }
  try {
    if (isEdit.value) await $fetch(`/api/gspr/${props.entry!.id}`, { method: 'PATCH', body })
    else await $fetch('/api/gspr', { method: 'POST', body: { ...body, technicalFileId: props.technicalFileId } })
    emit('saved')
    emit('update:open', false)
  }
  catch {
    error.value = 'Could not save the GSPR entry. Check the fields and try again.'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <UModal :open="open" :title="isEdit ? 'Edit GSPR entry' : 'Add GSPR entry'" @update:open="emit('update:open', $event)">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UAlert v-if="error" color="error" variant="soft" :title="error" />
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="GSPR reference" name="gsprRef">
            <UInput v-model="state.gsprRef" placeholder="GSPR 10.2" class="w-full" />
          </UFormField>
          <UFormField label="Conformity" name="conformity">
            <USelect v-model="state.conformity" :items="conformityOptions" class="w-full" />
          </UFormField>
        </div>
        <UFormField label="Requirement text" name="requirementText">
          <UTextarea v-model="state.requirementText" :rows="2" class="w-full" placeholder="Chemical, physical and biological properties" />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Evidence refs" name="evidenceRefs" help="Comma-separated">
            <UInput v-model="state.evidenceRefs" placeholder="TEST-88, DOC-12" class="w-full" />
          </UFormField>
          <UFormField label="Standard refs" name="standardRefs" help="Comma-separated">
            <UInput v-model="state.standardRefs" placeholder="ISO 10993-1" class="w-full" />
          </UFormField>
        </div>
        <UFormField label="Notes" name="notes">
          <UTextarea v-model="state.notes" :rows="2" class="w-full" />
        </UFormField>
        <div class="flex justify-end gap-2 pt-2">
          <UButton color="neutral" variant="ghost" :disabled="pending" @click="emit('update:open', false)">Cancel</UButton>
          <UButton type="submit" :loading="pending">{{ isEdit ? 'Save changes' : 'Add entry' }}</UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
