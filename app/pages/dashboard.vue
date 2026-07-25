<script setup lang="ts">
// Dashboard route. In S3 it adopts the app shell; the full metrics dashboard
// (readiness, files, approvals, deadlines, AI activity, findings) lands in S4.
definePageMeta({ layout: 'app', middleware: ['auth'] })

useHead({ title: 'Dashboard - Certra' })
</script>

<template>
  <ModulePlaceholder
    icon="i-material-symbols-dashboard"
    title="Dashboard"
    description="Your compliance readiness, active technical files, approvals, deadlines, AI activity, and open findings appear here in the next sprint (S4)."
  />
</template>
