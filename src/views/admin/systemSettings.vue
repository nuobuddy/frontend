<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Loader2 } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useAdminStore } from '@/stores/admin'

const { t } = useI18n()
const adminStore = useAdminStore()

const useDifyOfficial = ref(false)
const difyBaseUrl = ref('')
const difyApiKey = ref('')
const fileUploadEnabled = ref(false)
const voiceEnabled = ref(false)
const saving = ref(false)
const saveSuccess = ref(false)
const saveError = ref('')

const DIFY_OFFICIAL_URL = 'https://api.dify.ai'

// Load settings from backend on mount
onMounted(async () => {
  try {
    await adminStore.fetchSettings()
    populateForm()
  } catch (err) {
    console.error('Failed to fetch settings:', err)
  }
})

// Populate form fields from store settings
function populateForm() {
  const baseUrl = adminStore.getSetting('dify.base_url') ?? ''
  const apiKey = adminStore.getSetting('dify.api_key') ?? ''
  const fileUpload = adminStore.getSetting('app.file_upload') ?? 'false'
  const voice = adminStore.getSetting('app.voice') ?? 'false'

  difyBaseUrl.value = baseUrl
  difyApiKey.value = apiKey
  useDifyOfficial.value = baseUrl === DIFY_OFFICIAL_URL
  fileUploadEnabled.value = fileUpload === 'true'
  voiceEnabled.value = voice === 'true'
}

watch(useDifyOfficial, (val) => {
  if (val) {
    difyBaseUrl.value = DIFY_OFFICIAL_URL
  } else {
    difyBaseUrl.value = ''
  }
})

async function handleSave() {
  saving.value = true
  saveSuccess.value = false
  saveError.value = ''

  try {
    await adminStore.updateSettings({
      'dify.base_url': difyBaseUrl.value,
      'dify.api_key': difyApiKey.value,
      'app.file_upload': fileUploadEnabled.value ? 'true' : 'false',
      'app.voice': voiceEnabled.value ? 'true' : 'false',
    })
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
  } catch (err) {
    saveError.value = err instanceof Error ? err.message : t('common.error')
  } finally {
    saving.value = false
  }
}

function openDifyHelpDoc() {
  // TODO: open help doc URL when available
}

function downloadChatflowDSL() {
  // TODO: download DSL when available
}
</script>

<template>
  <div class="p-4 sm:p-6 max-w-2xl">
    <h1 class="text-2xl font-semibold text-foreground mb-6">
      {{ t('admin.systemSettings') }}
    </h1>

    <!-- Loading state -->
    <div v-if="adminStore.settingsLoading && adminStore.settings.length === 0" class="py-8">
      <div class="flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 class="h-5 w-5 animate-spin" />
        <span>{{ t('common.loading') }}</span>
      </div>
    </div>

    <div v-else class="space-y-6">
      <h2 class="text-base font-medium">{{ t('admin.systemSettingsPage.difySection') }}</h2>

      <!-- Use Dify Official -->
      <div class="flex items-center gap-3">
        <Switch
          id="dify-official"
          :checked="useDifyOfficial"
          @update:checked="useDifyOfficial = $event"
        />
        <Label for="dify-official" class="flex flex-col gap-0.5 items-start cursor-pointer">
          <span>{{ t('admin.systemSettingsPage.useDifyOfficial') }}</span>
          <span class="font-normal text-muted-foreground text-xs">
            {{ t('admin.systemSettingsPage.useDifyOfficialDesc') }}
          </span>
        </Label>
      </div>

      <!-- Dify Base URL -->
      <div class="space-y-2">
        <Label for="dify-base-url">{{ t('admin.systemSettingsPage.difyBaseUrl') }}</Label>
        <Input
          id="dify-base-url"
          v-model="difyBaseUrl"
          :placeholder="t('admin.systemSettingsPage.difyBaseUrlPlaceholder')"
          :disabled="useDifyOfficial"
        />
      </div>

      <!-- Dify API Key -->
      <div class="space-y-2">
        <Label for="dify-api-key">{{ t('admin.systemSettingsPage.difyApiKey') }}</Label>
        <Input
          id="dify-api-key"
          v-model="difyApiKey"
          type="password"
          :placeholder="t('admin.systemSettingsPage.difyApiKeyPlaceholder')"
        />
      </div>

      <!-- Help doc hint -->
      <p class="text-xs text-muted-foreground">
        {{ t('admin.systemSettingsPage.helpDocPrefix') }}
        <Button variant="link" size="sm" class="text-xs h-auto p-0" @click="openDifyHelpDoc">
          {{ t('admin.systemSettingsPage.helpDoc') }}
        </Button>
        {{ t('admin.systemSettingsPage.helpDocAnd') }}
        <Button variant="link" size="sm" class="text-xs h-auto p-0" @click="downloadChatflowDSL">
          {{ t('admin.systemSettingsPage.chatflowDSL') }}
        </Button>
      </p>

      <Separator />

      <!-- Feature toggles -->
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <Switch
            id="file-upload"
            :checked="fileUploadEnabled"
            @update:checked="fileUploadEnabled = $event"
          />
          <Label for="file-upload" class="cursor-pointer">
            {{ t('admin.systemSettingsPage.fileUpload') }}
          </Label>
        </div>

        <div class="flex items-center gap-3">
          <Switch id="voice" :checked="voiceEnabled" @update:checked="voiceEnabled = $event" />
          <Label for="voice" class="cursor-pointer">
            {{ t('admin.systemSettingsPage.voice') }}
          </Label>
        </div>

        <p class="text-xs text-muted-foreground">
          {{ t('admin.systemSettingsPage.featureNote') }}
        </p>
      </div>

      <!-- Save button with feedback -->
      <div class="flex items-center gap-3">
        <Button :disabled="saving" @click="handleSave">
          <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
          {{ t('common.save') }}
        </Button>
        <span v-if="saveSuccess" class="text-sm text-green-600">
          {{ t('common.success') }}
        </span>
        <span v-if="saveError" class="text-sm text-destructive">
          {{ saveError }}
        </span>
      </div>
    </div>
  </div>
</template>
