<template>
  <div class="p-6 space-y-6">
    <div class="space-y-6" v-if="invoice">
      <!-- Header -->
      <div class="bg-white  rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="h-12 w-12 rounded-full bg-amber-500 flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                ></path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ invoice.id }}</h1>
              <p class="text-lg text-gray-600">{{ invoice.client }}</p>
              <div class="flex items-center space-x-4 mt-2">
                <span :class="getTypeBadge(invoice.type)">
                  {{ getTypeText(invoice.type) }}
                </span>
                <span :class="getStatusBadge(invoice.status)">
                  {{ getStatusText(invoice.status) }}
                </span>
                <span class="text-sm text-gray-500"> Émise le {{ formatDate(invoice.date) }} </span>
              </div>
            </div>
          </div>
          <div class="flex space-x-2">
            <button
              @click="$router.push('/invoices')"
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Retour
            </button>
            <button
              v-if="invoice.status === 'emise'"
              @click="editInvoice"
              class="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 rounded-lg transition-colors"
            >
              Modifier
            </button>
            <button
              v-if="invoice.status === 'emise' || invoice.status === 'en_attente'"
              @click="markAsPaid"
              class="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors"
            >
              Marquer Payée
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

      <!-- Payment Status -->
      <div
        v-if="invoice.status !== 'payee'"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Statut de Paiement</h3>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-8">
            <!-- Step 1: Émise -->
            <div class="flex flex-col items-center">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  isStepCompleted('emise')
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-200 text-gray-400',
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <p class="text-xs mt-2 text-center">Émise</p>
            </div>

            <!-- Connector -->
            <div
              :class="['h-1 w-16', isStepCompleted('en_attente') ? 'bg-amber-500' : 'bg-gray-200']"
            ></div>

            <!-- Step 2: En attente -->
            <div class="flex flex-col items-center">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  isStepCompleted('en_attente')
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-200 text-gray-400',
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <p class="text-xs mt-2 text-center">En attente</p>
            </div>

            <!-- Connector -->
            <div
              :class="['h-1 w-16', isStepCompleted('payee') ? 'bg-green-500' : 'bg-gray-200']"
            ></div>

            <!-- Step 3: Payée -->
            <div class="flex flex-col items-center">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  isStepCompleted('payee')
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-400',
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <p class="text-xs mt-2 text-center">Payée</p>
            </div>
          </div>

          <!-- Payment Information -->
          <div class="text-right">
            <p class="text-sm font-medium text-gray-500">Échéance</p>
            <p class="text-lg font-semibold text-gray-900">{{ formatDate(invoice.dueDate) }}</p>
            <p v-if="isOverdue" class="text-sm text-red-600 mt-1">
              ⚠️ {{ daysOverdue }} jour(s) de retard
            </p>
            <p v-else-if="daysUntilDue <= 7" class="text-sm text-amber-600 mt-1">
              ⚠️ Échéance dans {{ daysUntilDue }} jour(s)
            </p>
          </div>
        </div>
      </div>

      <!-- Client and Invoice Info -->
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
              <p class="text-sm font-medium text-gray-500">Adresse de facturation</p>
              <p class="text-gray-900">{{ client.address }}</p>
            </div>
          </div>
        </div>

        <!-- Invoice Details -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Détails de la Facture</h3>
          <div class="space-y-3">
            <div>
              <p class="text-sm font-medium text-gray-500">Type</p>
              <span :class="getTypeBadge(invoice.type)">{{ getTypeText(invoice.type) }}</span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Date d'émission</p>
              <p class="text-gray-900">{{ formatDate(invoice.date) }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Date d'échéance</p>
              <p class="text-gray-900">{{ formatDate(invoice.dueDate) }}</p>
            </div>
            <div v-if="invoice.paymentTerms">
              <p class="text-sm font-medium text-gray-500">Conditions de paiement</p>
              <p class="text-gray-900">{{ invoice.paymentTerms }}</p>
            </div>
          </div>
        </div>

        <!-- Amounts -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Montants</h3>
          <div class="space-y-3">
            <div>
              <p class="text-sm font-medium text-gray-500">Total HT</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ formatCurrency(invoice.totalHT) }}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">TVA (20%)</p>
              <p class="text-gray-900">{{ formatCurrency(invoice.tva) }}</p>
            </div>
            <div class="pt-2 border-t border-gray-200">
              <p class="text-sm font-medium text-gray-500">Total TTC</p>
              <p class="text-xl font-bold text-amber-600">{{ formatCurrency(invoice.totalTTC) }}</p>
            </div>
            <div v-if="invoice.type === 'acompte' && invoice.acompteAmount">
              <div class="mt-4 pt-3 border-t border-amber-200 bg-amber-50 rounded-lg p-3">
                <p class="text-sm font-medium text-amber-700">Montant acompte</p>
                <p class="text-lg font-bold text-amber-600">
                  {{ formatCurrency(invoice.acompteAmount) }}
                </p>
                <p v-if="invoice.remainingAmount" class="text-xs text-amber-600 mt-1">
                  Solde restant: {{ formatCurrency(invoice.remainingAmount) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoice Items -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Articles Facturés</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Produit/Service
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantité
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Prix Unitaire HT
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total HT
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in invoice.items" :key="item.id" class="hover:bg-gray-50">
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
                  <span class="font-medium text-gray-900">{{
                    formatCurrency(item.totalPrice)
                  }}</span>
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50">
              <tr>
                <td colspan="4" class="px-6 py-3 text-right font-medium text-gray-900">Total HT</td>
                <td class="px-6 py-3 text-right font-bold text-gray-900">
                  {{ formatCurrency(invoice.totalHT) }}
                </td>
              </tr>
              <tr>
                <td colspan="4" class="px-6 py-3 text-right font-medium text-gray-900">
                  TVA (20%)
                </td>
                <td class="px-6 py-3 text-right font-medium text-gray-900">
                  {{ formatCurrency(invoice.tva) }}
                </td>
              </tr>
              <tr>
                <td colspan="4" class="px-6 py-3 text-right font-bold text-gray-900">
                  {{ invoice.type === 'acompte' ? 'Montant Acompte' : 'Total TTC' }}
                </td>
                <td class="px-6 py-3 text-right font-bold text-amber-600 text-lg">
                  {{ formatCurrency(invoice.amount) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="invoice.notes" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Notes de Facturation</h3>
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-gray-700 whitespace-pre-wrap">{{ invoice.notes }}</p>
        </div>
      </div>

      <!-- Related Documents -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Documents Associés</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Related Order -->
          <div v-if="relatedOrder" class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg
                  class="w-4 h-4 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">Commande Source</p>
                <router-link
                  :to="`/orders/${relatedOrder.id}`"
                  class="text-emerald-600 hover:text-emerald-800 text-sm"
                >
                  {{ relatedOrder.id }}
                </router-link>
              </div>
            </div>
          </div>

          <!-- Related Quote -->
          <div v-if="relatedQuote" class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  class="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">Devis Origine</p>
                <router-link
                  :to="`/quotes/${relatedQuote.id}`"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {{ relatedQuote.id }}
                </router-link>
              </div>
            </div>
          </div>

          <!-- PDF Invoice -->
          <div
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
            @click="downloadPDF"
          >
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg
                  class="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">Facture PDF</p>
                <p class="text-gray-600 text-sm">Télécharger PDF</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment History (if paid) -->
      <div
        v-if="invoice.status === 'payee'"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Historique des Paiements</h3>
        <div class="space-y-3">
          <div class="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">Paiement reçu</p>
              <p class="text-xs text-gray-500">{{ formatDateTime(invoice.date) }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-green-600">{{ formatCurrency(invoice.amount) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
        ></path>
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">Facture non trouvée</h3>
      <p class="mt-1 text-sm text-gray-500">La facture demandée n'existe pas ou a été supprimée.</p>
      <div class="mt-6">
        <button
          @click="$router.push('/invoices')"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600"
        >
          Retour aux factures
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

const invoice = computed(() => {
  const invoiceId = route.params.id as string
  return salesStore.getInvoiceById(invoiceId)
})

const client = computed(() => {
  if (!invoice.value) return null
  return salesStore.getClientById(invoice.value.clientId)
})

const relatedOrder = computed(() => {
  if (!invoice.value?.orderId) return null
  return salesStore.getOrderById(invoice.value.orderId)
})

const relatedQuote = computed(() => {
  if (!relatedOrder.value?.quoteId) return null
  return salesStore.getQuoteById(relatedOrder.value.quoteId)
})

const isOverdue = computed(() => {
  if (!invoice.value || invoice.value.status === 'payee') return false
  const due = new Date(invoice.value.dueDate)
  const today = new Date()
  return due < today
})

const daysOverdue = computed(() => {
  if (!invoice.value || !isOverdue.value) return 0
  const due = new Date(invoice.value.dueDate)
  const today = new Date()
  const diffTime = today.getTime() - due.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const daysUntilDue = computed(() => {
  if (!invoice.value || isOverdue.value) return 0
  const due = new Date(invoice.value.dueDate)
  const today = new Date()
  const diffTime = due.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const isStepCompleted = (step: string) => {
  if (!invoice.value) return false

  const statusOrder = ['emise', 'en_attente', 'payee']
  const currentIndex = statusOrder.indexOf(invoice.value.status)
  const stepIndex = statusOrder.indexOf(step)

  return currentIndex >= stepIndex
}

const editInvoice = () => {
  router.push({ path: '/invoices', query: { edit: invoice.value?.id } })
}

const markAsPaid = () => {
  if (!invoice.value) return

  if (confirm('Marquer cette facture comme payée ?')) {
    salesStore.updateInvoice(invoice.value.id, { status: 'payee' })
  }
}

const downloadPDF = () => {
  console.log('Download PDF for invoice:', invoice.value?.id)
  alert(`Téléchargement du PDF pour la facture ${invoice.value?.id} (fonctionnalité à implémenter)`)
}

const getTypeBadge = (type: string): string => {
  const badges: Record<string, string> = {
    proforma:
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800',
    acompte:
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800',
    definitive:
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    echeancier:
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800',
  }
  return badges[type] || badges['definitive']
}

const getTypeText = (type: string): string => {
  const texts: Record<string, string> = {
    proforma: 'Proforma',
    acompte: 'Acompte',
    definitive: 'Définitive',
    echeancier: 'Échéancier',
  }
  return texts[type] || type
}

const getStatusBadge = (status: string): string => {
  const badges: Record<string, string> = {
    emise:
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800',
    en_attente:
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800',
    payee:
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    en_retard:
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800',
  }
  return badges[status] || badges['emise']
}

const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    emise: 'Émise',
    en_attente: 'En attente',
    payee: 'Payée',
    en_retard: 'En retard',
  }
  return texts[status] || status
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
    currency: 'EUR',
  }).format(amount)
}
</script>
