<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>

    <!-- Tabs -->
    <div class="flex space-x-1 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
          activeTab === tab.id
            ? 'bg-green-500 text-white'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        ]"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Quotes Tab -->
    <div v-if="activeTab === 'quotes'" class="space-y-3">
      <div
        v-for="quote in quotes"
        :key="quote.id"
        class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div class="flex-1">
          <div class="flex items-center space-x-2">
            <span class="font-medium text-gray-900">{{ quote.id }}</span>
            <span :class="getStatusBadge(quote.status)">{{ getStatusText(quote.status) }}</span>
          </div>
          <p class="text-sm text-gray-600">{{ quote.client }}</p>
          <p class="text-xs text-gray-500">{{ formatDate(quote.date) }}</p>
        </div>
        <div class="text-right">
          <p class="font-semibold text-gray-900">{{ formatCurrency(quote.amount) }}</p>
          <p class="text-xs text-gray-500">Validité: {{ formatDate(quote.validity) }}</p>
        </div>
      </div>
    </div>

    <!-- Orders Tab -->
    <div v-if="activeTab === 'orders'" class="space-y-3">
      <div
        v-for="order in orders"
        :key="order.id"
        class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div class="flex-1">
          <div class="flex items-center space-x-2">
            <span class="font-medium text-gray-900">{{ order.id }}</span>
            <span :class="getStatusBadge(order.status)">{{ getStatusText(order.status) }}</span>
          </div>
          <p class="text-sm text-gray-600">{{ order.client }}</p>
          <p class="text-xs text-gray-500">{{ formatDate(order.date) }}</p>
        </div>
        <div class="text-right">
          <p class="font-semibold text-gray-900">{{ formatCurrency(order.amount) }}</p>
          <p class="text-xs text-gray-500">Livraison: {{ formatDate(order.delivery) }}</p>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="currentItems.length === 0" class="text-center py-8">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        ></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune activité</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ activeTab === 'quotes' ? 'Aucun devis récent à afficher.' : 'Aucune commande récente à afficher.' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Quote, Order } from '@/types'

interface Props {
  quotes: Quote[]
  orders: Order[]
}

const props = defineProps<Props>()

const activeTab = ref('quotes')
const tabs = [
  { id: 'quotes', name: 'Devis Récents' },
  { id: 'orders', name: 'Commandes Récentes' }
]

const currentItems = computed(() => {
  return activeTab.value === 'quotes' ? props.quotes : props.orders
})

const getStatusBadge = (status: string): string => {
  const badges: Record<string, string> = {
    'en_attente': 'px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full',
    'accepte': 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full',
    'refuse': 'px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full',
    'en_cours': 'px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full',
    'livre': 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full',
    'annule': 'px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full'
  }
  return badges[status] || badges['en_attente']
}

const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    'en_attente': 'En attente',
    'accepte': 'Accepté',
    'refuse': 'Refusé',
    'en_cours': 'En cours',
    'livre': 'Livré',
    'annule': 'Annulé'
  }
  return texts[status] || status
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}
</script>