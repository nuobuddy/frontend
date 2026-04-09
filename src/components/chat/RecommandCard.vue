<script setup lang="ts">
export interface RecommendQuestion {
  title: string
  category: string
}

const props = defineProps<{
  question: RecommendQuestion
}>()

const emit = defineEmits<{
  select: [question: string]
}>()

function handleClick() {
  emit('select', props.question.title)
}
</script>

<template>
  <button
    type="button"
    class="group flex flex-col justify-between items-start rounded-xl border border-amber-100/70 p-3 text-left transition-all duration-200 bg-linear-to-br from-amber-50/80 to-white hover:from-amber-100/80 hover:to-amber-50/30 hover:border-amber-200/80 hover:shadow-md hover:shadow-amber-100/30 active:scale-[0.98] cursor-pointer w-full sm:aspect-square"
    @click="handleClick"
  >
    <p class="text-xs font-medium text-foreground leading-snug line-clamp-4 flex-1">
      {{ question.title }}
    </p>
    <span
      class="mt-2 inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-muted/60 border border-border/40 shrink-0"
    >
      {{ question.category }}
    </span>
  </button>
</template>
