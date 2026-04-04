<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

const { t } = useI18n()

const useDifyOfficial = ref(false)
const difyBaseUrl = ref('')
const difyApiKey = ref('')
const fileUploadEnabled = ref(false)
const voiceEnabled = ref(false)

const DIFY_OFFICIAL_URL = 'https://api.dify.ai/v1/'

watch(useDifyOfficial, (val) => {
  if (val) {
    difyBaseUrl.value = DIFY_OFFICIAL_URL
  } else {
    difyBaseUrl.value = ''
  }
})

function handleSave() {
  // TODO: submit settings
}

function openDifyHelpDoc() {
  // TODO: open help doc
}

function downloadChatflowDSL() {
  // TODO: download DSL
}
</script>

<template>
  <div class="p-4 sm:p-6 max-w-2xl">
    <h1 class="text-2xl font-semibold text-foreground mb-6">
      {{ t('admin.systemSettings') }}
    </h1>

    <div class="space-y-6">
      <h2 class="text-base font-medium">{{ t('admin.systemSettingsPage.difySection') }}</h2>

      <!-- 使用 Dify 官方 -->
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

      <!-- 帮助文档提示 -->
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

      <!-- 功能开关 -->
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

      <div>
        <Button @click="handleSave">{{ t('common.save') }}</Button>
      </div>
    </div>
  </div>
</template>
