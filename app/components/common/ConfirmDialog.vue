<script setup lang="ts">
// Small branded confirmation dialog for destructive actions. The parent owns
// the delete itself and listens for @confirm; visibility is controlled with
// v-model:open.
defineProps<{
  open: boolean
  title?: string
  message?: string
  confirmLabel?: string
  pending?: boolean
}>()
const emit = defineEmits<{ 'update:open': [boolean], confirm: [] }>()
</script>

<template>
  <UModal :open="open" :title="title ?? 'Are you sure?'" @update:open="emit('update:open', $event)">
    <template #body>
      <p class="text-sm text-ink-soft">{{ message ?? 'This action cannot be undone.' }}</p>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton color="neutral" variant="ghost" :disabled="pending" @click="emit('update:open', false)">
          Cancel
        </UButton>
        <UButton color="error" :loading="pending" @click="emit('confirm')">
          {{ confirmLabel ?? 'Delete' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
