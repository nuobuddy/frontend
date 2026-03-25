<script setup lang="ts">
import type { ChartConfig } from '@/components/ui/chart'
import { Donut } from '@unovis/ts'
import {
  VisAxis,
  VisCrosshair as ChartCrosshair,
  VisDonut,
  VisLine,
  VisSingleContainer,
  VisTooltip as ChartTooltip,
  VisXYContainer,
} from '@unovis/vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent, componentToString } from '@/components/ui/chart'

const { t } = useI18n()

// ─── Conversation Line Chart ───────────────────────────────────────────────
const conversationData = [
  { date: new Date('2025-10-01'), count: 120 },
  { date: new Date('2025-10-08'), count: 145 },
  { date: new Date('2025-10-15'), count: 138 },
  { date: new Date('2025-10-22'), count: 162 },
  { date: new Date('2025-10-29'), count: 178 },
  { date: new Date('2025-11-05'), count: 195 },
  { date: new Date('2025-11-12'), count: 183 },
  { date: new Date('2025-11-19'), count: 210 },
  { date: new Date('2025-11-26'), count: 228 },
  { date: new Date('2025-12-03'), count: 205 },
  { date: new Date('2025-12-10'), count: 248 },
  { date: new Date('2025-12-17'), count: 274 },
  { date: new Date('2025-12-24'), count: 231 },
  { date: new Date('2025-12-31'), count: 298 },
  { date: new Date('2026-01-07'), count: 312 },
  { date: new Date('2026-01-14'), count: 287 },
  { date: new Date('2026-01-21'), count: 334 },
  { date: new Date('2026-01-28'), count: 358 },
  { date: new Date('2026-02-04'), count: 322 },
  { date: new Date('2026-02-11'), count: 389 },
  { date: new Date('2026-02-18'), count: 412 },
  { date: new Date('2026-02-25'), count: 376 },
  { date: new Date('2026-03-04'), count: 445 },
  { date: new Date('2026-03-11'), count: 468 },
  { date: new Date('2026-03-18'), count: 492 },
]
type ConvData = (typeof conversationData)[number]

const conversationConfig = {
  count: {
    label: '发起对话数',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

// ─── Pie Chart (Question Types) ────────────────────────────────────────────
const questionTypeData = [
  { type: 'technical', count: 438, fill: 'var(--color-technical)' },
  { type: 'billing', count: 215, fill: 'var(--color-billing)' },
  { type: 'general', count: 312, fill: 'var(--color-general)' },
  { type: 'feedback', count: 189, fill: 'var(--color-feedback)' },
  { type: 'other', count: 124, fill: 'var(--color-other)' },
]
type PieData = (typeof questionTypeData)[number]

const pieConfig = {
  count: { label: '对话数', color: undefined },
  technical: { label: '技术问题', color: 'var(--chart-1)' },
  billing: { label: '账单问题', color: 'var(--chart-2)' },
  general: { label: '一般咨询', color: 'var(--chart-3)' },
  feedback: { label: '意见反馈', color: 'var(--chart-4)' },
  other: { label: '其他', color: 'var(--chart-5)' },
} satisfies ChartConfig

const totalConversations = computed(() =>
  questionTypeData.reduce((acc, curr) => acc + curr.count, 0),
)

// ─── Keyword List ──────────────────────────────────────────────────────────
const keywords = [
  { keyword: '账号登录', count: 312, trend: 'up' },
  { keyword: '密码重置', count: 278, trend: 'up' },
  { keyword: '订单查询', count: 245, trend: 'down' },
  { keyword: '退款申请', count: 198, trend: 'up' },
  { keyword: '功能使用', count: 187, trend: 'stable' },
  { keyword: '价格咨询', count: 165, trend: 'down' },
  { keyword: '技术报错', count: 143, trend: 'up' },
  { keyword: 'API 接入', count: 128, trend: 'stable' },
  { keyword: '数据导出', count: 112, trend: 'down' },
  { keyword: '权限设置', count: 98, trend: 'up' },
]
const maxKeywordCount = computed(() => Math.max(...keywords.map((k) => k.count)))
</script>

<template>
  <div class="p-4 sm:p-6">
    <h1 class="text-2xl font-semibold text-foreground mb-6">
      {{ t('admin.conversationAnalysis') }}
    </h1>

    <!-- 8-col grid on PC, 2-col on mobile -->
    <div class="grid grid-cols-2 sm:grid-cols-8 gap-4">
      <!-- Conversation Line Chart: col-span-6 on PC, full-width on mobile -->
      <Card class="col-span-2 sm:col-span-6 py-4 sm:py-0">
        <CardHeader class="flex flex-col items-stretch border-b p-0! sm:flex-row">
          <div class="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 pt-4 sm:py-6">
            <CardTitle>近期发起对话数</CardTitle>
            <CardDescription>过去 6 个月每周对话趋势</CardDescription>
          </div>
        </CardHeader>
        <CardContent class="px-2 sm:p-6">
          <ChartContainer :config="conversationConfig" class="aspect-auto h-55 w-full" cursor>
            <VisXYContainer
              :data="conversationData"
              :margin="{ left: -24 }"
              :y-domain="[0, undefined]"
            >
              <VisLine
                :x="(d: ConvData) => d.date"
                :y="(d: ConvData) => d.count"
                :color="conversationConfig.count.color"
              />
              <VisAxis
                type="x"
                :x="(d: ConvData) => d.date"
                :tick-line="false"
                :domain-line="false"
                :grid-line="false"
                :num-ticks="6"
                :tick-format="
                  (d: number) =>
                    new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
                "
              />
              <VisAxis type="y" :num-ticks="3" :tick-line="false" :domain-line="false" />
              <ChartTooltip />
              <ChartCrosshair
                :template="
                  componentToString(conversationConfig, ChartTooltipContent, {
                    labelFormatter: (d) =>
                      new Date(d).toLocaleDateString('zh-CN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }),
                  })
                "
                :color="conversationConfig.count.color"
              />
            </VisXYContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <!-- Pie Chart: col-span-2 on both PC and mobile -->
      <Card class="col-span-2 flex flex-col">
        <CardHeader class="items-center pb-0">
          <CardTitle>问题类型分布</CardTitle>
          <CardDescription>近一周</CardDescription>
        </CardHeader>
        <CardContent class="flex-1 pb-0">
          <ChartContainer
            :config="pieConfig"
            class="mx-auto aspect-square max-h-55"
            :style="{
              '--vis-donut-central-label-font-size': 'var(--text-2xl)',
              '--vis-donut-central-label-font-weight': 'var(--font-weight-bold)',
              '--vis-donut-central-label-text-color': 'var(--foreground)',
              '--vis-donut-central-sub-label-text-color': 'var(--muted-foreground)',
            }"
          >
            <VisSingleContainer :data="questionTypeData" :margin="{ top: 20, bottom: 20 }">
              <VisDonut
                :value="(d: PieData) => d.count"
                :color="(d: PieData) => pieConfig[d.type as keyof typeof pieConfig].color"
                :arc-width="28"
                :central-label-offset-y="10"
                :central-label="totalConversations.toLocaleString()"
                central-sub-label="对话总数"
              />
              <ChartTooltip
                :triggers="{
                  [Donut.selectors.segment]: componentToString(pieConfig, ChartTooltipContent, {
                    hideLabel: true,
                  })!,
                }"
              />
            </VisSingleContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <!-- Keyword List: col-span-6 on PC, full-width on mobile -->
      <Card class="col-span-2 sm:col-span-6">
        <CardHeader>
          <CardTitle>问题关键词</CardTitle>
          <CardDescription>近一周高频关键词 Top 10</CardDescription>
        </CardHeader>
        <CardContent>
          <ul class="space-y-2">
            <li
              v-for="(item, index) in keywords"
              :key="item.keyword"
              class="flex items-center gap-3"
            >
              <span class="w-5 shrink-0 text-right text-sm text-muted-foreground">{{
                index + 1
              }}</span>
              <span class="w-24 shrink-0 truncate text-sm font-medium">{{ item.keyword }}</span>
              <div class="relative flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  class="absolute inset-y-0 left-0 rounded-full bg-chart-2"
                  :style="{ width: `${(item.count / maxKeywordCount) * 100}%` }"
                />
              </div>
              <span class="w-10 shrink-0 text-right text-sm text-muted-foreground">{{
                item.count
              }}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
