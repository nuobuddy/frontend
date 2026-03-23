<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft, Loader2, MailCheck } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const email = ref('')
const loading = ref(false)
const error = ref('')
const sent = ref(false)

const canSubmit = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))

async function handleSubmit() {
  if (!canSubmit.value || loading.value) return
  loading.value = true
  error.value = ''
  try {
    // TODO: connect to real API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    sent.value = true
  } catch {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center px-6 py-12">
    <div class="w-full max-w-sm">
      <!-- Back to login -->
      <RouterLink
        to="/login"
        class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft class="w-4 h-4" />
        Back to sign in
      </RouterLink>

      <!-- Sent state -->
      <template v-if="sent">
        <div class="flex flex-col items-center text-center">
          <div class="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <MailCheck class="w-6 h-6 text-foreground" />
          </div>
          <h1 class="text-2xl font-semibold tracking-tight text-foreground">Check your email</h1>
          <p class="mt-2 text-sm text-muted-foreground">
            We sent a password reset link to
            <span class="font-medium text-foreground">{{ email }}</span>
          </p>
          <p class="mt-4 text-xs text-muted-foreground">
            Didn't receive it? Check your spam folder or
            <button
              type="button"
              class="underline underline-offset-4 hover:text-foreground transition-colors"
              @click="sent = false"
            >
              try another email
            </button>
          </p>
        </div>
      </template>

      <!-- Form state -->
      <template v-else>
        <div class="mb-8">
          <h1 class="text-2xl font-semibold tracking-tight text-foreground">Forgot password?</h1>
          <p class="mt-1.5 text-sm text-muted-foreground">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-1.5">
            <label for="email" class="text-sm font-medium text-foreground">Email</label>
            <Input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              :disabled="loading"
            />
          </div>

          <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

          <Button type="submit" class="w-full" :disabled="!canSubmit || loading">
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            {{ loading ? 'Sending...' : 'Send reset link' }}
          </Button>
        </form>
      </template>
    </div>
  </div>
</template>
