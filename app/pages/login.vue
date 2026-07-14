<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ layout: 'auth' })

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

const state = reactive({ email: '', password: '' })
const pending = ref(false)
const errorMessage = ref('')

const { fetch: refreshSession } = useUserSession()

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  pending.value = true
  errorMessage.value = ''

  try {
    await $fetch('/api/auth/login', { method: 'POST', body: event.data })
    await refreshSession()
    await navigateTo('/dashboard')
  }
  catch {
    errorMessage.value = 'Invalid email or password.'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <h1 class="font-display text-lg font-semibold text-ink">
        Sign in
      </h1>
    </template>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
        :title="errorMessage"
      />

      <UFormField label="Email" name="email">
        <UInput v-model="state.email" type="email" placeholder="you@company.com" class="w-full" />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput v-model="state.password" type="password" class="w-full" />
      </UFormField>

      <UButton type="submit" block :loading="pending">
        Sign in
      </UButton>
    </UForm>

    <template #footer>
      <p class="text-center text-sm text-ink-muted">
        No account yet?
        <NuxtLink to="/register" class="text-brand-500 hover:underline">
          Create one
        </NuxtLink>
      </p>
    </template>
  </UCard>
</template>
