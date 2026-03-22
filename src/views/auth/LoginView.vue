<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, Loader2 } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const router = useRouter()

const form = ref({
  email: '',
  password: '',
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const canSubmit = computed(() => form.value.email.trim() && form.value.password.trim())

async function handleLogin() {
  if (!canSubmit.value || loading.value) return
  loading.value = true
  error.value = ''
  try {
    // TODO: connect to real API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push('/chat')
  } catch {
    error.value = 'Login failed. Please check your credentials and try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background flex">
    <!-- Left: branding panel (hidden on small screens) -->
    <div class="hidden lg:flex lg:flex-1 bg-muted flex-col justify-between p-12">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span class="text-primary-foreground font-bold text-sm">N</span>
        </div>
        <span class="font-semibold text-foreground">NuoBuddy</span>
      </div>

      <div>
        <blockquote class="text-lg text-foreground leading-relaxed">
          "The most powerful AI assistant I&apos;ve ever used. It transformed the way I work every
          single day."
        </blockquote>
        <p class="mt-4 text-sm text-muted-foreground">— Early Access User</p>
      </div>
    </div>

    <!-- Right: form panel -->
    <div class="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12">
      <!-- Mobile logo -->
      <div class="lg:hidden flex items-center gap-2 mb-8">
        <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span class="text-primary-foreground font-bold text-sm">N</span>
        </div>
        <span class="font-semibold text-foreground">NuoBuddy</span>
      </div>

      <div class="w-full max-w-sm">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
          <p class="mt-1.5 text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <!-- Form -->
        <form class="space-y-4" @submit.prevent="handleLogin">
          <!-- Email -->
          <div class="space-y-1.5">
            <label for="email" class="text-sm font-medium text-foreground">Email</label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              :disabled="loading"
            />
          </div>

          <!-- Password -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label for="password" class="text-sm font-medium text-foreground">Password</label>
              <button
                type="button"
                class="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div class="relative">
              <Input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
                :disabled="loading"
                class="pr-9"
              />
              <button
                type="button"
                tabindex="-1"
                class="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground hover:text-foreground transition-colors"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Error -->
          <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

          <!-- Submit -->
          <Button
            type="submit"
            class="w-full"
            :disabled="!canSubmit || loading"
          >
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </Button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t border-border" />
          </div>
          <div class="relative flex justify-center">
            <span class="bg-background px-3 text-xs text-muted-foreground uppercase tracking-wide">
              or
            </span>
          </div>
        </div>

        <!-- Register link -->
        <p class="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?
          <RouterLink
            to="/register"
            class="font-medium text-foreground hover:underline underline-offset-4 transition-colors"
          >
            Create one
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
