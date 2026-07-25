<script setup lang="ts">
// Audit Log route (placeholder). Screen + auto-write on mutations land in S7.
definePageMeta({ layout: 'app', middleware: ['auth'] })

useHead({ title: 'Audit Log - Certra' })
</script>

<template>
  <ModulePlaceholder
    icon="i-material-symbols-history"
    title="Audit Log"
    description="A chronological record of every change across the workspace is built in S7."
  />
</template>
