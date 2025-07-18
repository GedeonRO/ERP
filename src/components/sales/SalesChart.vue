<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Évolution des Ventes</h3>
      <div class="flex space-x-2">
        <button
          v-for="period in periods"
          :key="period"
          @click="selectedPeriod = period"
          :class="[
            'px-3 py-1 text-sm rounded-lg transition-colors',
            selectedPeriod === period
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ period }}
        </button>
      </div>
    </div>
    
    <!-- Chart container -->
    <div class="h-64 flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <h4 class="text-lg font-medium text-gray-900 mb-2">Graphique des Ventes</h4>
        <p class="text-gray-500 mb-4">Visualisation des données de vente sur {{ selectedPeriod }}</p>
        
        <!-- Display sample data -->
        <div class="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div v-for="item in displayData" :key="item.month" class="text-left">
            <div class="text-sm font-medium text-gray-900">{{ item.month }}</div>
            <div class="text-xs text-gray-500">{{ formatCurrency(item.revenue) }}</div>
            <div class="text-xs text-blue-600">{{ item.orders }} commandes</div>
          </div>
        </div>
        
        <div class="mt-4 text-xs text-gray-400">
          Graphique interactif Chart.js à intégrer
        </div>
      </div>
    </div>
    
    <!-- Legend -->
    <div class="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-200">
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
        <span class="text-sm text-gray-600">Chiffre d'affaires</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
        <span class="text-sm text-gray-600">Nombre de commandes</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MonthlyRevenue } from '@/types'

interface Props {
  data: MonthlyRevenue[]
}

const props = defineProps<Props>()

const selectedPeriod = ref('6M')
const periods = ['1M', '3M', '6M', '1A']

const displayData = computed(() => {
  // For demo purposes, show last 3 months
  return props.data.slice(-3)
})

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(amount)
}
</script>