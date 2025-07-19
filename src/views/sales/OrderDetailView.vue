<template>
  <div class="p-6 space-y-6">
    <div class="space-y-6" v-if="order">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ order.id }}</h1>
              <p class="text-lg text-gray-600">{{ order.client }}</p>
              <div class="flex items-center space-x-4 mt-2">
                <span :class="getStatusBadge(order.status)">
                  {{ getStatusText(order.status) }}
                </span>
                <span class="text-sm text-gray-500">
                  Créée le {{ formatDate(order.date) }}
                </span>
                <span v-if="order.trackingNumber" class="text-sm text-emerald-600">
                  📦 {{ order.trackingNumber }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex space-x-2">
            <button
              @click="$router.push('/orders')"
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Retour
            </button>
            <button
              v-if="order.status === 'en_preparation' || order.status === 'en_cours'"
              @click="editOrder"
              class="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg transition-colors"
            >
              Modifier
            </button>
            <button
              v-if="order.status === 'en_cours'"
              @click="markAsDelivered"
              class="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors"
            >
              Marquer Livré
            </button>
            <button
              v-if="order.status === 'livre' && !relatedInvoice"
              @click="generateInvoice"
              class="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 rounded-lg transition-colors"
            >
              Générer Facture
            </button>
            <button
              @click="downloadDeliveryNote"
              class="px-4 py-2 bg-gray-700 text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              Bordereau de Livraison
            </button>
          </div>
        </div>
      </div>

      <!-- Order Progress -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Suivi de la Commande</h3>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-8">
            <!-- Step 1: Preparation -->
            <div class="flex flex-col items-center">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center',
                isStepCompleted('en_preparation') ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
              ]">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h2l3-3 3 3h2a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <p class="text-xs mt-2 text-center">Préparation</p>
            </div>

            <!-- Connector -->
            <div :class="[
              'h-1 w-16',
              isStepCompleted('en_cours') ? 'bg-emerald-500' : 'bg-gray-200'
            ]"></div>

            <!-- Step 2: In Progress -->
            <div class="flex flex-col items-center">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center',
                isStepCompleted('en_cours') ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
              ]">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <p class="text-xs mt-2 text-center">En cours</p>
            </div>

            <!-- Connector -->
            <div :class="[
              'h-1 w-16',
              isStepCompleted('livre') ? 'bg-emerald-500' : 'bg-gray-200'
            ]"></div>

            <!-- Step 3: Delivered -->
            <div class="flex flex-col items-center">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center',
                isStepCompleted('livre') ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
              ]">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p class="text-xs mt-2 text-center">Livré</p>
            </div>
          </div>

          <!-- Delivery Information -->
          <div class="text-right">
            <p class="text-sm font-medium text-gray-500">Date de livraison prévue</p>
            <p class="text-lg font-semibold text-gray-900">{{ formatDate(order.delivery) }}</p>
            <p v-if="isLateDelivery" class="text-sm text-red-600 mt-1">
              ⚠️ Livraison en retard
            </p>
          </div>
        </div>
      </div>

      <!-- Client and Order Info -->
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
          </div>
        </div>

        <!-- Delivery Information -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Livraison</h3>
          <div class="space-y-3">
            <div>
              <p class="text-sm font-medium text-gray-500">Adresse de livraison</p>
              <p class="text-gray-900">{{ order.deliveryAddress || client?.address || 'Non renseignée' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Date prévue</p>
              <p class="text-gray-900">{{ formatDate(order.delivery) }}</p>
            </div>
            <div v-if="order.trackingNumber">
              <p class="text-sm font-medium text-gray-500">Numéro de suivi</p>
              <p class="text-gray-900 font-mono">{{ order.trackingNumber }}</p>
            </div>
          </div>
        </div>

        <!-- Order Details -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Détails Commande</h3>
          <div class="space-y-3">
            <div>
              <p class="text-sm font-medium text-gray-500">Montant TTC</p>
              <p class="text-xl font-bold text-emerald-600">{{ formatCurrency(order.amount) }}</p>
            </div>
            <div v-if="order.quoteId">
              <p class="text-sm font-medium text-gray-500">Devis source</p>
              <router-link 
                :to="`/quotes/${order.quoteId}`" 
                class="text-blue-600 hover:text-blue-800 font-medium"
              >
                {{ order.quoteId }}
              </router-link>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Nombre d'articles</p>
              <p class="text-gray-900">{{ order.items.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Articles de la Commande</h3>
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
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livré
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in order.items" :key="item.id" class="hover:bg-gray-50">
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
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center">
                    <div v-if="item.delivered === item.quantity" class="text-green-600">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div v-else-if="item.delivered && item.delivered > 0" class="text-yellow-600">
                      <span class="text-xs">{{ item.delivered }}/{{ item.quantity }}</span>
                    </div>
                    <div v-else class="text-gray-400">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50">
              <tr>
                <td colspan="4" class="px-6 py-3 text-right font-medium text-gray-900">
                  Total HT
                </td>
                <td class="px-6 py-3 text-right font-bold text-gray-900">
                  {{ formatCurrency(totalHT) }}
                </td>
                <td></td>
              </tr>
              <tr>
                <td colspan="4" class="px-6 py-3 text-right font-medium text-gray-900">
                  TVA (20%)
                </td>
                <td class="px-6 py-3 text-right font-medium text-gray-900">
                  {{ formatCurrency(totalTVA) }}
                </td>
                <td></td>
              </tr>
              <tr>
                <td colspan="4" class="px-6 py-3 text-right font-bold text-gray-900">
                  Total TTC
                </td>
                <td class="px-6 py-3 text-right font-bold text-emerald-600 text-lg">
                  {{ formatCurrency(order.amount) }}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="order.notes" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Notes de Commande</h3>
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-gray-700 whitespace-pre-wrap">{{ order.notes }}</p>
        </div>
      </div>

      <!-- Related Documents -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Documents Associés</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Related Quote -->
          <div v-if="relatedQuote" class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">Devis Source</p>
                <router-link 
                  :to="`/quotes/${relatedQuote.id}`" 
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {{ relatedQuote.id }}
                </router-link>
              </div>
            </div>
          </div>

          <!-- Related Invoice -->
          <div v-if="relatedInvoice" class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">Facture</p>
                <router-link 
                  :to="`/invoices/${relatedInvoice.id}`" 
                  class="text-amber-600 hover:text-amber-800 text-sm"
                >
                  {{ relatedInvoice.id }}
                </router-link>
              </div>
            </div>
          </div>

          <!-- Delivery Note -->
          <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer" @click="downloadDeliveryNote">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">Bordereau de Livraison</p>
                <p class="text-gray-600 text-sm">Télécharger PDF</p>
              </div>
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
      <h3 class="mt-2 text-lg font-medium text-gray-900">Commande non trouvée</h3>
      <p class="mt-1 text-sm text-gray-500">La commande demandée n'existe pas ou a été supprimée.</p>
      <div class="mt-6">
        <button
          @click="$router.push('/orders')"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-500 hover:bg-emerald-600"
        >
          Retour aux commandes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSalesStore } from '@/stores/sales'
import type { InvoiceFormData } from '@/types'

const route = useRoute()
const router = useRouter()
const salesStore = useSalesStore()

const order = computed(() => {
  const orderId = route.params.id as string
  return salesStore.getOrderById(orderId)
})

const client = computed(() => {
  if (!order.value) return null
  return salesStore.getClientById(order.value.clientId)
})

const relatedQuote = computed(() => {
  if (!order.value?.quoteId) return null
  return salesStore.getQuoteById(order.value.quoteId)
})

const relatedInvoice = computed(() => {
  if (!order.value) return null
  return salesStore.invoices.value.find(i => i.orderId === order.value?.id)
})

const totalHT = computed(() => {
  if (!order.value) return 0
  return order.value.items.reduce((sum, item) => sum + item.totalPrice, 0)
})

const totalTVA = computed(() => {
  return totalHT.value * 0.20
})

const isLateDelivery = computed(() => {
  if (!order.value || order.value.status === 'livre' || order.value.status === 'annule') return false
  const delivery = new Date(order.value.delivery)
  const today = new Date()
  return delivery < today
})

const isStepCompleted = (step: string) => {
  if (!order.value) return false
  
  const statusOrder = ['en_preparation', 'en_cours', 'livre']
  const currentIndex = statusOrder.indexOf(order.value.status)
  const stepIndex = statusOrder.indexOf(step)
  
  return currentIndex >= stepIndex
}

const editOrder = () => {
  router.push({ path: '/orders', query: { edit: order.value?.id } })
}

const markAsDelivered = () => {
  if (!order.value) return
  
  if (confirm('Marquer cette commande comme livrée ?')) {
    const trackingNumber = `TRK-${Date.now().toString().slice(-6)}`
    salesStore.updateOrder(order.value.id, { 
      status: 'livre',
      trackingNumber,
      items: order.value.items.map(item => ({
        ...item,
        delivered: item.quantity
      }))
    })
  }
}

const generateInvoice = () => {
  if (!order.value) return
  
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 30) // 30 days payment term

  const invoiceData: InvoiceFormData = {
    clientId: order.value.clientId,
    orderId: order.value.id,
    type: 'definitive',
    dueDate: dueDate.toISOString().split('T')[0],
    paymentTerms: '30 jours net',
    items: order.value.items.map(item => ({
      productName: item.productName,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    }))
  }

  try {
    const invoice = salesStore.addInvoice(invoiceData)
    router.push(`/invoices/${invoice.id}`)
  } catch (error) {
    console.error('Error generating invoice:', error)
  }
}

const downloadDeliveryNote = () => {
  console.log('Download delivery note for order:', order.value?.id)
  alert(`Téléchargement du bordereau de livraison pour la commande ${order.value?.id} (fonctionnalité à implémenter)`)
}

const getStatusBadge = (status: string): string => {
  const badges: Record<string, string> = {
    en_preparation: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800',
    en_cours: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800',
    livre: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    annule: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
  }
  return badges[status] || badges['en_preparation']
}

const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    en_preparation: 'En préparation',
    en_cours: 'En cours',
    livre: 'Livré',
    annule: 'Annulé'
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