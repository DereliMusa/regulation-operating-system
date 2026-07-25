<script setup lang="ts">
// Clinical Evaluation route (placeholder). Screen lands in S7.
definePageMeta({ layout: 'app', middleware: ['auth'] })

useHead({ title: 'Clinical Evaluation - Certra' })
</script>

<template>
  <ModulePlaceholder
    icon="i-material-symbols-analytics"
    title="Clinical Evaluation"
    description="Clinical evaluation planning and literature tracking are built in S7."
  />
</template>
