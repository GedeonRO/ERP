<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Gestion des Devis</h1>
      <button
        @click="showForm = true"
        class="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors flex items-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
        <span>Nouveau Devis</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <MetricCard
        title="Total Devis"
        :value="salesStore.quotes.value.length"
        :trend="12.5"
        icon="📄"
        color="accent"
      />
      <MetricCard
        title="En Attente"
        :value="pendingQuotes"
        :trend="-5.2"
        icon="⏳"
        color="warning"
      />
      <MetricCard
        title="Acceptés"
        :value="acceptedQuotes"
        :trend="18.3"
        icon="✅"
        color="success"
      />
      <MetricCard
        title="Valeur Totale"
        :value="totalQuotesValue"
        :trend="8.7"
        icon="💰"
        color="primary"
      />
    </div>

    <!-- Quote Form Modal -->
    <div
      v-if="showForm"
      class="fixed inset-0 bg-[#00000065]  flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
        <QuoteForm
          :quote="editingQuote"
          :mode="editingQuote ? 'edit' : 'create'"
          @submit="handleSubmit"
          @cancel="closeForm"
        />
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
      >
        <div class="flex-1 max-w-lg">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un devis..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              class="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        <div class="flex space-x-2">
          <select
            v-model="statusFilter"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="accepte">Accepté</option>
            <option value="refuse">Refusé</option>
            <option value="expire">Expiré</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Quotes Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Devis
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Client
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Statut
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Montant TTC
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Validité
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="quote in filteredQuotes" :key="quote.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ quote.id }}</div>
                  <div class="text-sm text-gray-500">{{ formatDate(quote.date) }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ quote.client }}</div>
                <div class="text-sm text-gray-500">{{ quote.createdBy }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadge(quote.status)">
                  {{ getStatusText(quote.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(quote.amount) }}
                </div>
                <div class="text-sm text-gray-500">HT: {{ formatCurrency(quote.totalHT) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>{{ formatDate(quote.validity) }}</div>
                <div v-if="isExpiringSoon(quote.validity)" class="text-xs text-amber-600">
                  ⚠️ Expire bientôt
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="viewQuote(quote)"
                    class="text-blue-500 hover:text-blue-700"
                    title="Voir détails"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    v-if="quote.status === 'en_attente'"
                    @click="editQuote(quote)"
                    class="text-green-500 hover:text-green-700"
                    title="Modifier"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    v-if="quote.status === 'accepte'"
                    @click="convertToOrder(quote)"
                    class="text-emerald-500 hover:text-emerald-700"
                    title="Convertir en commande"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    v-if="quote.status === 'en_attente'"
                    @click="deleteQuote(quote.id)"
                    class="text-red-600 hover:text-red-800"
                    title="Supprimer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-if="filteredQuotes.length === 0" class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun devis trouvé</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{
            searchQuery
              ? 'Aucun devis ne correspond à votre recherche.'
              : 'Commencez par créer un nouveau devis.'
          }}
        </p>
        <div class="mt-6">
          <button
            @click="showForm = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Nouveau Devis
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MetricCard from '@/components/shared/MetricCard.vue'
import QuoteForm from '@/components/sales/QuoteForm.vue'
import { useSalesStore } from '@/stores/sales'
import type { Quote, QuoteFormData } from '@/types'

const router = useRouter()
const salesStore = useSalesStore()

const showForm = ref(false)
const editingQuote = ref<Quote | null>(null)
const searchQuery = ref('')
const statusFilter = ref('')

const filteredQuotes = computed(() => {
  let filtered = salesStore.quotes.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (quote) =>
        quote.id.toLowerCase().includes(query) ||
        quote.client.toLowerCase().includes(query) ||
        quote.createdBy.toLowerCase().includes(query),
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter((quote) => quote.status === statusFilter.value)
  }

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const pendingQuotes = computed(() => {
  return salesStore.quotes.value.filter((q) => q.status === 'en_attente').length
})

const acceptedQuotes = computed(() => {
  return salesStore.quotes.value.filter((q) => q.status === 'accepte').length
})

const totalQuotesValue = computed(() => {
  return salesStore.quotes.value.reduce((sum, quote) => sum + quote.amount, 0)
})

const handleSubmit = (quoteData: QuoteFormData) => {
  if (editingQuote.value) {
    // Update existing quote logic would go here
    salesStore.updateQuote(editingQuote.value.id, quoteData)
  } else {
    salesStore.addQuote(quoteData)
  }
  closeForm()
}

const closeForm = () => {
  showForm.value = false
  editingQuote.value = null
}

const editQuote = (quote: Quote) => {
  editingQuote.value = quote
  showForm.value = true
}

const viewQuote = (quote: Quote) => {
  router.push(`/quotes/${quote.id}`)
}

const convertToOrder = (quote: Quote) => {
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 14) // Default 2 weeks delivery

  try {
    const order = salesStore.convertQuoteToOrder(quote.id, deliveryDate.toISOString().split('T')[0])
    router.push('/orders')
    // Show success notification
    console.log('Quote converted to order:', order.id)
  } catch (error) {
    console.error('Error converting quote to order:', error)
  }
}

const deleteQuote = (quoteId: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
    salesStore.deleteQuote(quoteId)
  }
}

const isExpiringSoon = (validity: string): boolean => {
  const validityDate = new Date(validity)
  const today = new Date()
  const diffTime = validityDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 7 && diffDays > 0
}

const getStatusBadge = (status: string): string => {
  const badges: Record<string, string> = {
    en_attente:
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800',
    accepte:
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    refuse: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800',
    expire:
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800',
  }
  return badges[status] || badges['en_attente']
}

const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    en_attente: 'En attente',
    accepte: 'Accepté',
    refuse: 'Refusé',
    expire: 'Expiré',
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
  }).format(amount)
}
</script>
