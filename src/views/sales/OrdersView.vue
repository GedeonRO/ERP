<template>
  <div class="p-6">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div class="max-w-md mx-auto">
        <div class="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            ></path>
          </svg>
        </div>
        
        <h3 class="text-xl font-semibold text-gray-900 mb-3">Gestion des Commandes</h3>
        <p class="text-gray-600 mb-6">Module de gestion des commandes en cours de développement</p>
        
        <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-emerald-900 mb-2">Fonctionnalités à venir :</h4>
          <ul class="text-emerald-800 text-sm space-y-1 text-left">
            <li>• Création de commandes depuis les devis acceptés</li>
            <li>• Suivi des statuts de livraison en temps réel</li>
            <li>• Gestion des dates et délais de livraison</li>
            <li>• Intégration automatique avec la gestion de stock</li>
            <li>• Génération de bordereaux de livraison</li>
            <li>• Notifications automatiques aux clients</li>
            <li>• Tableau de bord de suivi logistique</li>
          </ul>
        </div>

        <!-- Preview of order data structure -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-gray-900 mb-3">Aperçu des données actuelles :</h4>
          <div class="space-y-2">
            <div v-for="order in previewOrders" :key="order.id" 
                 class="flex justify-between items-center p-2 bg-white rounded border">
              <div class="text-left">
                <div class="font-medium text-sm">{{ order.id }}</div>
                <div class="text-xs text-gray-500">{{ order.client }}</div>
                <div class="text-xs text-gray-400">Livraison: {{ formatDate(order.delivery) }}</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium">{{ formatCurrency(order.amount) }}</div>
                <span :class="getStatusBadge(order.status)">{{ getStatusText(order.status) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            @click="$router.push('/quotes')"
            class="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Gérer les Devis
          </button>
          <button
            @click="$router.push('/dashboard')"
            class="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg transition-colors"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSalesStore } from '@/stores/sales'

const salesStore = useSalesStore()

// Show preview of existing order data
const previewOrders = salesStore.recentOrders

const getStatusBadge = (status: string): string => {
  const badges: Record<string, string> = {
    'en_cours': 'px-1 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded',
    'livre': 'px-1 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded',
    'annule': 'px-1 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded'
  }
  return badges[status] || badges['en_cours']
}

const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
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
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(amount)
}
</script>