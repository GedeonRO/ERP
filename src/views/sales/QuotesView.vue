<template>
  <div class="p-6">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div class="max-w-md mx-auto">
        <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
        </div>
        
        <h3 class="text-xl font-semibold text-gray-900 mb-3">Gestion des Devis</h3>
        <p class="text-gray-600 mb-6">Module de gestion des devis en cours de développement</p>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-blue-900 mb-2">Fonctionnalités à venir :</h4>
          <ul class="text-blue-800 text-sm space-y-1 text-left">
            <li>• Création et édition de devis personnalisés</li>
            <li>• Suivi des statuts (en attente, accepté, refusé)</li>
            <li>• Génération automatique de documents PDF</li>
            <li>• Conversion automatique en commandes</li>
            <li>• Gestion des dates de validité</li>
            <li>• Calcul automatique des marges</li>
            <li>• Historique et traçabilité complète</li>
          </ul>
        </div>

        <!-- Preview of quote data structure -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-gray-900 mb-3">Aperçu des données actuelles :</h4>
          <div class="space-y-2">
            <div v-for="quote in previewQuotes" :key="quote.id" 
                 class="flex justify-between items-center p-2 bg-white rounded border">
              <div class="text-left">
                <div class="font-medium text-sm">{{ quote.id }}</div>
                <div class="text-xs text-gray-500">{{ quote.client }}</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium">{{ formatCurrency(quote.amount) }}</div>
                <span :class="getStatusBadge(quote.status)">{{ getStatusText(quote.status) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            @click="$router.push('/clients')"
            class="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Gérer les Clients
          </button>
          <button
            @click="$router.push('/dashboard')"
            class="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
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

// Show preview of existing quote data
const previewQuotes = salesStore.recentQuotes

const getStatusBadge = (status: string): string => {
  const badges: Record<string, string> = {
    'en_attente': 'px-1 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded',
    'accepte': 'px-1 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded',
    'refuse': 'px-1 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded'
  }
  return badges[status] || badges['en_attente']
}

const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    'en_attente': 'En attente',
    'accepte': 'Accepté',
    'refuse': 'Refusé'
  }
  return texts[status] || status
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(amount)
}
</script>