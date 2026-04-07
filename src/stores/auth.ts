import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import router from '@/router'
import type { User } from '@/lib/api'

export type { User }

export const useAuthStore = defineStore(
  'auth',
  () => {
    // State
    const token = ref<string | null>(null)
    const user = ref<User | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Computed
    const isAuthenticated = computed(() => !!token.value && !!user.value)
    const isAdmin = computed(() => user.value?.role === 'admin')

    // Actions
    async function login(email: string, password: string) {
      loading.value = true
      error.value = null
      try {
        // Dynamic import to avoid circular dependency
        const { api } = await import('@/lib/api')
        const result = await api.login(email, password)

        token.value = result.token
        user.value = result.user

        // Sync to localStorage for axios interceptor
        localStorage.setItem('auth_token', result.token)

        return result
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Login failed'
        throw err
      } finally {
        loading.value = false
      }
    }

    async function register(username: string, email: string, password: string) {
      loading.value = true
      error.value = null
      try {
        const { api } = await import('@/lib/api')
        const result = await api.register(username, email, password)

        token.value = result.token
        user.value = result.user

        // Sync to localStorage for axios interceptor
        localStorage.setItem('auth_token', result.token)

        return result
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Registration failed'
        throw err
      } finally {
        loading.value = false
      }
    }

    async function fetchProfile() {
      if (!token.value) return null

      loading.value = true
      error.value = null
      try {
        const { api } = await import('@/lib/api')
        const profile = await api.getProfile()
        user.value = profile
        return profile
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch profile'
        // If profile fetch fails (e.g., token expired), clear auth state
        if (
          (err as Error).message?.includes('401') ||
          (err as Error).message?.includes('Unauthorized')
        ) {
          logout()
        }
        throw err
      } finally {
        loading.value = false
      }
    }

    async function updateProfile(updates: { username?: string; password?: string }) {
      if (!token.value) throw new Error('Not authenticated')

      loading.value = true
      error.value = null
      try {
        const { api } = await import('@/lib/api')
        const updatedUser = await api.updateProfile(updates)

        // Update local user data
        if (updatedUser) {
          user.value = { ...user.value!, ...updatedUser }
        }

        // If password was updated, need to re-login
        if (updates.password) {
          logout()
        }

        return updatedUser
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Update failed'
        throw err
      } finally {
        loading.value = false
      }
    }

    function logout() {
      token.value = null
      user.value = null
      error.value = null

      // Clear localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')

      // Redirect to login
      router.push('/login')
    }

    // Sync token to localStorage when store is hydrated from persistence
    function $hydrate() {
      if (token.value) {
        localStorage.setItem('auth_token', token.value)
      }
    }

    return {
      // State
      token,
      user,
      loading,
      error,
      // Computed
      isAuthenticated,
      isAdmin,
      // Actions
      login,
      register,
      fetchProfile,
      updateProfile,
      logout,
      $hydrate,
    }
  },
  {
    persist: {
      key: 'auth',
      storage: localStorage,
      pick: ['token', 'user'],
    },
  },
)
