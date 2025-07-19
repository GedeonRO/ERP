<template>
  <div class="p-6 space-y-6">
    <div class="space-y-6" v-if="quote">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ quote.id }}</h1>
              <p class="text-lg text-gray-600">{{ quote.client }}</p>
              <div class="flex items-center space-x-4 mt-2">
                <span :class="getStatusBadge(quote.status)">
                  {{ getStatusText(quote.status) }}
                </span>
                <span class="text-sm text-gray-500">
                  Créé le {{ formatDate(quote.date) }}
                </span>
                <span class="text-sm text-gray-500">
                  Par {{ quote.createdBy }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex space-x-2">
            <button
              @click="$router.push('/quotes')"
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Retour
            </button>
            <button
              v-if="quote.status === 'en_attente'"
              @click="editQuote"
              class="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
            >
              Modifier
            </button>
            <button
              v-if="quote.status === 'accepte'"
              @click="convertToOrder"
              class="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg transition-colors"
            >
              Convertir en Commande
            </button>
            <button
              @click="downloadPDF"
              class="px-4 py-2 bg-gray-700 text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              Télécharger PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Client and Quote Info -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Client Information -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations Client</h3>
          <div class="space-y-3">
            <div>
              <p class="text-sm font-medium text-gray-500">Entreprise</p>
              <p class="text-gray-900">{{ client?.company }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Contact</p>
              <p class="text-gray-900">{{ client?.name }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Email</p>
              <p class="text-gray-900">{{ client?.email }}</p>
            </div>
            <div v-if="client?.phone">
              <p class="text-sm font-medium text-gray-500">Téléphone</p>
              <p class="text-gray-900">{{ client.phone }}</p>
            </div>
            <div v-if="client?.address">
              <p class="text-sm font-medium text-gray-500">Adresse</p>
              <p class="text-gray-900">{{ client.address }}</p>
            </div>
          </div>
        </div>

        <!-- Quote Details -->
        <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Détails du Devis</h3>
            <div class="space-y-3">
              <div>
                <p class="text-sm font-medium text-gray-500">Date de création</p>
                <p class="text-gray-900">{{ formatDate(quote.date) }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Validité</p>
                <p class="text-gray-900">{{ formatDate(quote.validity) }}</p>
                <p v-if="isExpiringSoon" class="text-xs text-amber-600 mt-1">
                  ⚠️ Expire dans {{ daysUntilExpiry }} jour(s)
                </p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Marge</p>
                <p class="text-gray-900">{{ quote.margin }}%</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Montants</h3>
            <div class="space-y-3">
              <div>
                <p class="text-sm font-medium text-gray-500">Total HT</p>
                <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(quote.totalHT) }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">TVA (20%)</p>
                <p class="text-gray-900">{{ formatCurrency(quote.tva) }}</p>
              </div>
              <div class="pt-2 border-t border-gray-200">
                <p class="text-sm font-medium text-gray-500">Total TTC</p>
                <p class="text-xl font-bold text-blue-600">{{ formatCurrency(quote.totalTTC) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quote Items -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Articles du Devis</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit/Service
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix Unitaire HT
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total HT
                </th>
                <th v-if="hasSupplierPrices" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marge
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in quote.items" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900">{{ item.productName }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-600">{{ item.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="text-gray-900">{{ item.quantity }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="text-gray-900">{{ formatCurrency(item.unitPrice) }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="font-medium text-gray-900">{{ formatCurrency(item.totalPrice) }}</span>
                </td>
                <td v-if="hasSupplierPrices" class="px-6 py-4 whitespace-nowrap text-center">
                  <span v-if="item.margin" :class="getMarginClass(item.margin)">
                    {{ item.margin.toFixed(1) }}%
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50">
              <tr>
                <td colspan="4" class="px-6 py-3 text-right font-medium text-gray-900">
                  Total HT
                </td>
                <td class="px-6 py-3 text-right font-bold text-gray-900">
                  {{ formatCurrency(quote.totalHT) }}
                </td>
                <td v-if="hasSupplierPrices"></td>
              </tr>
              <tr>
                <td colspan="4" class="px-6 py-3 text-right font-medium text-gray-900">
                  TVA (20%)
                </td>
                <td class="px-6 py-3 text-right font-medium text-gray-900">
                  {{ formatCurrency(quote.tva) }}
                </td>
                <td v-if="hasSupplierPrices"></td>
              </tr>
              <tr>
                <td colspan="4" class="px-6 py-3 text-right font-bold text-gray-900">
                  Total TTC
                </td>
                <td class="px-6 py-3 text-right font-bold text-blue-600 text-lg">
                  {{ formatCurrency(quote.totalTTC) }}
                </td>
                <td v-if="hasSupplierPrices"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="quote.notes" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-gray-700 whitespace-pre-wrap">{{ quote.notes }}</p>
        </div>
      </div>

      <!-- Actions History -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Historique</h3>
        <div class="space-y-3">
          <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">Devis créé</p>
              <p class="text-xs text-gray-500">{{ formatDateTime(quote.date) }} par {{ quote.createdBy }}</p>
            </div>
          </div>
          
          <div v-if="relatedOrder" class="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">Converti en commande</p>
              <p class="text-xs text-gray-500">
                {{ formatDateTime(relatedOrder.date) }} - 
                <router-link :to="`/orders/${relatedOrder.id}`" class="text-green-600 hover:text-green-800">
                  {{ relatedOrder.id }}
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">Devis non trouvé</h3>
      <p class="mt-1 text-sm text-gray-500">Le devis demandé n'existe pas ou a été supprimé.</p>
      <div class="mt-6">
        <button
          @click="$router.push('/quotes')"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
        >
          Retour aux devis
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSalesStore } from '@/stores/sales'

const route = useRoute()
const router = useRouter()
const salesStore = useSalesStore()

const quote = computed(() => {
  const quoteId = route.params.id as string
  return salesStore.getQuoteById(quoteId)
})

const client = computed(() => {
  if (!quote.value) return null
  return salesStore.getClientById(quote.value.clientId)
})

const relatedOrder = computed(() => {
  if (!quote.value) return null
  return salesStore.orders.value.find(o => o.quoteId === quote.value?.id)
})

const hasSupplierPrices = computed(() => {
  return quote.value?.items.some(item => item.supplierPrice && item.margin) || false
})

const isExpiringSoon = computed(() => {
  if (!quote.value) return false
  const validityDate = new Date(quote.value.validity)
  const today = new Date()
  const diffTime = validityDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 7 && diffDays > 0
})

const daysUntilExpiry = computed(() => {
  if (!quote.value) return 0
  const validityDate = new Date(quote.value.validity)
  const today = new Date()
  const diffTime = validityDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const editQuote = () => {
  router.push({ path: '/quotes', query: { edit: quote.value?.id } })
}

const convertToOrder = () => {
  if (!quote.value) return
  
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 14) // Default 2 weeks delivery
  
  try {
    const order = salesStore.convertQuoteToOrder(quote.value.id, deliveryDate.toISOString().split('T')[0])
    router.push(`/orders/${order.id}`)
  } catch (error) {
    console.error('Error converting quote to order:', error)
  }
}

const downloadPDF = () => {
  // Generate and download PDF (to be implemented)
  console.log('Download PDF for quote:', quote.value?.id)
  alert(`Téléchargement du PDF pour le devis ${quote.value?.id} (fonctionnalité à implémenter)`)
}

const getStatusBadge = (status: string): string => {
  const badges: Record<string, string> = {
    en_attente: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800',
    accepte: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    refuse: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800',
    expire: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
  }
  return badges[status] || badges['en_attente']
}

const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    en_attente: 'En attente',
    accepte: 'Accepté',
    refuse: 'Refusé',
    expire: 'Expiré'
  }
  return texts[status] || status
}

const getMarginClass = (margin: number): string => {
  if (margin >= 30) return 'text-green-600 font-medium'
  if (margin >= 20) return 'text-yellow-600 font-medium'
  return 'text-red-600 font-medium'
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('fr-FR')
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}
</script>