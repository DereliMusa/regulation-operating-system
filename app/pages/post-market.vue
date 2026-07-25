<script setup lang="ts">
// Post-Market route (placeholder). Screen lands in S7.
definePageMeta({ layout: 'app', middleware: ['auth'] })

useHead({ title: 'Post-Market - Certra' })
</script>

<template>
  <ModulePlaceholder
    icon="i-material-symbols-monitoring"
    title="Post-Market Surveillance"
    description="Post-market signals, PMS plans, and PSUR tracking are built in S7."
  />
</template>
