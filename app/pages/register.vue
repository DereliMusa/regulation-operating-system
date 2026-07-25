<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ layout: 'auth' })

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const state = reactive({ name: '', email: '', password: '' })
const pending = ref(false)
const errorMessage = ref('')

const { fetch: refreshSession } = useUserSession()

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  pending.value = true
  errorMessage.value = ''

  try {
    await $fetch('/api/auth/register', { method: 'POST', body: event.data })
    await refreshSession()
    await navigateTo('/dashboard')
  }
  catch (error) {
    const statusCode = (error as { statusCode?: number }).statusCode
    errorMessage.value = statusCode === 409
      ? 'An account with this email already exists.'
      : 'Could not create your account. Please try again.'
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
        Create your account
      </h1>
    </template>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
        :title="errorMessage"
      />

      <UFormField label="Name" name="name">
        <UInput v-model="state.name" placeholder="Jane Doe" class="w-full" />
      </UFormField>

      <UFormField label="Email" name="email">
        <UInput v-model="state.email" type="email" placeholder="you@company.com" class="w-full" />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput v-model="state.password" type="password" class="w-full" />
      </UFormField>

      <UButton type="submit" block :loading="pending">
        Create account
      </UButton>
    </UForm>

    <template #footer>
      <p class="text-center text-sm text-ink-muted">
        Already have an account?
        <NuxtLink to="/login" class="text-brand-500 hover:underline">
          Sign in
        </NuxtLink>
      </p>
    </template>
  </UCard>
</template>
