<template>
  <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div :class="iconClasses">
          <span class="text-white text-xl">{{ icon }}</span>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-600">{{ title }}</p>
          <p class="text-2xl font-bold text-gray-900">{{ formattedValue }}</p>
          <p v-if="description" class="text-xs text-gray-500 mt-1">{{ description }}</p>
        </div>
      </div>
      <div v-if="trend !== undefined" :class="trendClasses">
        <span class="text-xs font-medium">
          {{ trend > 0 ? '+' : '' }}{{ trend.toFixed(1) }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MetricCardProps } from '@/types'

interface Props {
  title: string
  value: string | number
  trend?: number
  icon: string
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger'
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary'
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number' && props.value > 1000) {
    return new Intl.NumberFormat('fr-FR').format(props.value)
  }
  return props.value
})

const iconClasses = computed(() => {
  const baseClasses = 'p-3 rounded-lg'
  const colorMap = {
    primary: 'bg-green-500 bg-opacity-10',
    secondary: 'bg-teal-700 bg-opacity-10',
    accent: 'bg-blue-500 bg-opacity-10',
    success: 'bg-emerald-500 bg-opacity-10',
    warning: 'bg-amber-500 bg-opacity-10',
    danger: 'bg-red-500 bg-opacity-10'
  }
  return `${baseClasses} ${colorMap[props.color]}`
})

const trendClasses = computed(() => {
  const baseClasses = 'flex items-center px-2 py-1 rounded-full text-xs'
  if (props.trend! > 0) {
    return `${baseClasses} bg-green-100 text-green-600`
  } else if (props.trend! < 0) {
    return `${baseClasses} bg-red-100 text-red-600`
  } else {
    return `${baseClasses} bg-gray-100 text-gray-600`
  }
})
</script>