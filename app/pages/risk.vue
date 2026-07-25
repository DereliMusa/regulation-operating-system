<script setup lang="ts">
// Risk Management route (placeholder). The standalone risk register screen
// lands in S7.
definePageMeta({ layout: 'app', middleware: ['auth'] })

useHead({ title: 'Risk Management - Certra' })
</script>

<template>
  <ModulePlaceholder
    icon="i-material-symbols-warning"
    title="Risk Management"
    description="The device risk register with severity, mitigations, and traceability is built in S7."
  />
</template>
