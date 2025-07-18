<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Gestion des Commandes</h1>
      <button
        @click="showForm = true"
        class="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg transition-colors flex items-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
        <span>Nouvelle Commande</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <MetricCard
        title="Total Commandes"
        :value="salesStore.orders.value.length"
        :trend="8.3"
        icon="📦"
        color="success"
      />
      <MetricCard
        title="En Cours"
        :value="ordersInProgress"
        :trend="15.2"
        icon="🔄"
        color="accent"
      />
      <MetricCard
        title="Livrées"
        :value="deliveredOrders"
        :trend="12.5"
        icon="✅"
        color="primary"
      />
      <MetricCard
        title="Valeur Totale"
        :value="totalOrdersValue"
        :trend="18.7"
        icon="💰"
        color="success"
      />
    </div>

    <!-- Order Form Modal -->
    <div
      v-if="showForm"
      class="fixed inset-0 bg-[#00000069]  flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
        <OrderForm
          :order="editingOrder"
          :mode="editingOrder ? 'edit' : 'create'"
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
              placeholder="Rechercher une commande..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Tous les statuts</option>
            <option value="en_preparation">En préparation</option>
            <option value="en_cours">En cours</option>
            <option value="livre">Livré</option>
            <option value="annule">Annulé</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Commande
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
                Livraison
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ order.id }}</div>
                  <div class="text-sm text-gray-500">{{ formatDate(order.date) }}</div>
                  <div v-if="order.quoteId" class="text-xs text-blue-600">
                    Depuis {{ order.quoteId }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ order.client }}</div>
                <div v-if="order.trackingNumber" class="text-sm text-gray-500">
                  📦 {{ order.trackingNumber }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadge(order.status)">
                  {{ getStatusText(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(order.amount) }}
                </div>
                <div class="text-sm text-gray-500">{{ order.items.length }} article(s)</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(order.delivery) }}</div>
                <div
                  v-if="isLateDelivery(order.delivery, order.status)"
                  class="text-xs text-red-600"
                >
                  ⚠️ En retard
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="viewOrder(order)"
                    class="text-emerald-500 hover:text-emerald-700"
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
                    v-if="order.status === 'en_preparation' || order.status === 'en_cours'"
                    @click="editOrder(order)"
                    class="text-blue-500 hover:text-blue-700"
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
                    v-if="order.status === 'en_cours'"
                    @click="markAsDelivered(order.id)"
                    class="text-green-500 hover:text-green-700"
                    title="Marquer comme livré"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </button>
                  <button
                    v-if="order.status === 'livre'"
                    @click="generateInvoice(order)"
                    class="text-amber-500 hover:text-amber-700"
                    title="Générer facture"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    v-if="order.status === 'en_preparation'"
                    @click="deleteOrder(order.id)"
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
      <div v-if="filteredOrders.length === 0" class="text-center py-12">
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
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          ></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune commande trouvée</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{
            searchQuery
              ? 'Aucune commande ne correspond à votre recherche.'
              : 'Commencez par créer une nouvelle commande.'
          }}
        </p>
        <div class="mt-6">
          <button
            @click="showForm = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-500 hover:bg-emerald-600"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Nouvelle Commande
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
import OrderForm from '@/components/sales/OrderForm.vue'
import { useSalesStore } from '@/stores/sales'
import type { Order, OrderFormData, InvoiceFormData } from '@/types'

const router = useRouter()
const salesStore = useSalesStore()

const showForm = ref(false)
const editingOrder = ref<Order | null>(null)
const searchQuery = ref('')
const statusFilter = ref('')

const filteredOrders = computed(() => {
  let filtered = salesStore.orders.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.client.toLowerCase().includes(query) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(query)),
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter((order) => order.status === statusFilter.value)
  }

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const ordersInProgress = computed(() => {
  return salesStore.orders.value.filter(
    (o) => o.status === 'en_cours' || o.status === 'en_preparation',
  ).length
})

const deliveredOrders = computed(() => {
  return salesStore.orders.value.filter((o) => o.status === 'livre').length
})

const totalOrdersValue = computed(() => {
  return salesStore.orders.value.reduce((sum, order) => sum + order.amount, 0)
})

const handleSubmit = (orderData: OrderFormData) => {
  if (editingOrder.value) {
    // Update existing order logic would go here
    salesStore.updateOrder(editingOrder.value.id, orderData)
  } else {
    salesStore.addOrder(orderData)
  }
  closeForm()
}

const closeForm = () => {
  showForm.value = false
  editingOrder.value = null
}

const editOrder = (order: Order) => {
  editingOrder.value = order
  showForm.value = true
}

const viewOrder = (order: Order) => {
  // Navigate to order detail view (to be implemented)
  console.log('View order:', order.id)
}

const markAsDelivered = (orderId: string) => {
  if (confirm('Marquer cette commande comme livrée ?')) {
    const trackingNumber = `TRK-${Date.now().toString().slice(-6)}`
    salesStore.updateOrder(orderId, {
      status: 'livre',
      trackingNumber,
    })
  }
}

const generateInvoice = (order: Order) => {
  // Navigate to invoice creation with pre-filled data
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 30) // 30 days payment term

  const invoiceData: InvoiceFormData = {
    clientId: order.clientId,
    orderId: order.id,
    type: 'definitive',
    dueDate: dueDate.toISOString().split('T')[0],
    paymentTerms: '30 jours net',
    items: order.items.map((item) => ({
      productName: item.productName,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  }

  try {
    const invoice = salesStore.addInvoice(invoiceData)
    router.push('/invoices')
    console.log('Invoice generated:', invoice.id)
  } catch (error) {
    console.error('Error generating invoice:', error)
  }
}

const deleteOrder = (orderId: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
    salesStore.deleteOrder(orderId)
  }
}

const isLateDelivery = (deliveryDate: string, status: string): boolean => {
  if (status === 'livre' || status === 'annule') return false
  const delivery = new Date(deliveryDate)
  const today = new Date()
  return delivery < today
}

const getStatusBadge = (status: string): string => {
  const badges: Record<string, string> = {
    en_preparation:
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800',
    en_cours:
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800',
    livre:
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    annule:
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800',
  }
  return badges[status] || badges['en_preparation']
}

const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    en_preparation: 'En préparation',
    en_cours: 'En cours',
    livre: 'Livré',
    annule: 'Annulé',
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
