import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, SettingItem, SystemSettings } from '@/lib/api'

export const useAdminStore = defineStore('admin', () => {
  // User management state
  const users = ref<User[]>([])
  const usersLoading = ref(false)
  const usersError = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalUsers = ref(0)
  const itemsPerPage = ref(10)

  // Settings state
  const settings = ref<SettingItem[]>([])
  const settingsLoading = ref(false)
  const settingsError = ref<string | null>(null)

  // Computed
  const hasMoreUsers = computed(() => currentPage.value < totalPages.value)
  const usersIsEmpty = computed(() => users.value.length === 0)

  // ==================== User Management ====================

  async function fetchUsers(page: number = 1, pageSize: number = 10) {
    usersLoading.value = true
    usersError.value = null
    try {
      const { api } = await import('@/lib/api')
      const result = await api.getAdminUsers(page, pageSize)

      if (page === 1) {
        users.value = result.users
      } else {
        users.value.push(...result.users)
      }

      currentPage.value = result.pagination.page
      totalPages.value = result.pagination.totalPages
      totalUsers.value = result.pagination.total
      itemsPerPage.value = result.pagination.limit

      return result
    } catch (err) {
      usersError.value = err instanceof Error ? err.message : 'Failed to fetch users'
      throw err
    } finally {
      usersLoading.value = false
    }
  }

  async function loadMoreUsers() {
    if (!hasMoreUsers.value || usersLoading.value) return
    await fetchUsers(currentPage.value + 1, itemsPerPage.value)
  }

  async function createUser(data: {
    username: string
    email: string
    password: string
    role?: 'user' | 'admin'
  }) {
    usersLoading.value = true
    usersError.value = null
    try {
      const { api } = await import('@/lib/api')
      const createdUser = await api.createAdminUser(data)

      // Add new user to the beginning of the list
      users.value.unshift(createdUser)

      return createdUser
    } catch (err) {
      usersError.value = err instanceof Error ? err.message : 'Failed to create user'
      throw err
    } finally {
      usersLoading.value = false
    }
  }

  async function deleteUser(userId: string) {
    usersLoading.value = true
    usersError.value = null
    try {
      const { api } = await import('@/lib/api')
      await api.deleteAdminUser(userId)

      // Remove from list
      users.value = users.value.filter((u) => u.id !== userId)
    } catch (err) {
      usersError.value = err instanceof Error ? err.message : 'Failed to delete user'
      throw err
    } finally {
      usersLoading.value = false
    }
  }

  async function resetUserPassword(userId: string, newPassword: string) {
    usersLoading.value = true
    usersError.value = null
    try {
      const { api } = await import('@/lib/api')
      await api.resetUserPassword(userId, newPassword)
    } catch (err) {
      usersError.value = err instanceof Error ? err.message : 'Failed to reset password'
      throw err
    } finally {
      usersLoading.value = false
    }
  }

  async function updateUserStatus(userId: string, isActive: boolean) {
    usersLoading.value = true
    usersError.value = null
    try {
      const { api } = await import('@/lib/api')
      await api.updateUserStatus(userId, isActive)

      // Update user in list
      const user = users.value.find((u) => u.id === userId)
      if (user) {
        user.isActive = isActive
      }
    } catch (err) {
      usersError.value = err instanceof Error ? err.message : 'Failed to update user status'
      throw err
    } finally {
      usersLoading.value = false
    }
  }

  function getUserById(userId: string) {
    return users.value.find((u) => u.id === userId)
  }

  // ==================== Settings Management ====================

  async function fetchSettings() {
    settingsLoading.value = true
    settingsError.value = null
    try {
      const { api } = await import('@/lib/api')
      const result = await api.getSystemSettings()

      // Store as array of SettingItem
      settings.value = result.settings

      return result.settings
    } catch (err) {
      settingsError.value = err instanceof Error ? err.message : 'Failed to fetch settings'
      throw err
    } finally {
      settingsLoading.value = false
    }
  }

  async function updateSettings(newSettings: SystemSettings) {
    settingsLoading.value = true
    settingsError.value = null
    try {
      const { api } = await import('@/lib/api')
      await api.updateSystemSettings(newSettings)

      // Update local settings array
      for (const [key, value] of Object.entries(newSettings)) {
        const existing = settings.value.find((s) => s.key === key)
        if (existing) {
          existing.value = value
        } else {
          settings.value.push({ key, value })
        }
      }
    } catch (err) {
      settingsError.value = err instanceof Error ? err.message : 'Failed to update settings'
      throw err
    } finally {
      settingsLoading.value = false
    }
  }

  /** Get a setting value by key */
  function getSetting(key: string): string | undefined {
    return settings.value.find((s) => s.key === key)?.value
  }

  /** Update a single setting locally (use updateSettings to persist) */
  function setSettingLocal(key: string, value: string) {
    const existing = settings.value.find((s) => s.key === key)
    if (existing) {
      existing.value = value
    } else {
      settings.value.push({ key, value })
    }
  }

  return {
    // User management state
    users,
    usersLoading,
    usersError,
    currentPage,
    totalPages,
    totalUsers,
    itemsPerPage,
    // Settings state
    settings,
    settingsLoading,
    settingsError,
    // Computed
    hasMoreUsers,
    usersIsEmpty,
    // User actions
    fetchUsers,
    loadMoreUsers,
    createUser,
    deleteUser,
    resetUserPassword,
    updateUserStatus,
    getUserById,
    // Settings actions
    fetchSettings,
    updateSettings,
    getSetting,
    setSettingLocal,
  }
})
