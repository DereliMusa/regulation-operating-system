<script setup lang="ts">
// Technical Documentation route (placeholder). The list + detail screens with
// GSPR and Risk CRUD land in S5.
definePageMeta({ layout: 'app', middleware: ['auth'] })

useHead({ title: 'Technical Documentation - Certra' })
</script>

<template>
  <ModulePlaceholder
    icon="i-material-symbols-description"
    title="Technical Documentation"
    description="Browse technical files and drill into GSPR and risk detail. This screen is built in S5."
  />
</template>
