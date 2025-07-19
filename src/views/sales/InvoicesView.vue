<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Gestion des Factures</h1>
      <button
        @click="showForm = true"
        class="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 rounded-lg transition-colors flex items-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>Nouvelle Facture</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <MetricCard
        title="Total Factures"
        :value="salesStore.invoices.value.length"
        :trend="15.2"
        icon="📋"
        color="warning"
      />
      <MetricCard
        title="En Attente"
        :value="pendingInvoices"
        :trend="-3.1"
        icon="⏳"
        color="accent"
      />
      <MetricCard
        title="Payées"
        :value="paidInvoices"
        :trend="22.7"
        icon="✅"
        color="success"
      />
      <MetricCard
        title="Chiffre Facturé"
        :value="totalInvoicesValue"
        :trend="18.9"
        icon="💰"
        color="primary"
      />
    </div>

    <!-- Invoice Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-[#00000067] flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
        <InvoiceForm
          :invoice="editingInvoice"
          :mode="editingInvoice ? 'edit' : 'create'"
          @submit="handleSubmit"
          @cancel="closeForm"
        />
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div class="flex-1 max-w-lg">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher une facture..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            v-model="typeFilter"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">Tous les types</option>
            <option value="proforma">Proforma</option>
            <option value="acompte">Acompte</option>
            <option value="definitive">Définitive</option>
            <option value="echeancier">Échéancier</option>
          </select>
          <select
            v-model="statusFilter"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">Tous les statuts</option>
            <option value="emise">Émise</option>
            <option value="en_attente">En attente</option>
            <option value="payee">Payée</option>
            <option value="en_retard">En retard</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Invoices Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Facture
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant TTC
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Échéance
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="invoice in filteredInvoices" :key="invoice.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ invoice.id }}</div>
                  <div class="text-sm text-gray-500">{{ formatDate(invoice.date) }}</div>
                  <div v-if="invoice.orderId" class="text-xs text-green-600">
                    Depuis {{ invoice.orderId }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ invoice.client }}</div>
                <div v-if="invoice.paymentTerms" class="text-sm text-gray-500">
                  {{ invoice.paymentTerms }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getTypeBadge(invoice.type)">
                  {{ getTypeText(invoice.type) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadge(invoice.status)">
                  {{ getStatusText(invoice.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ formatCurrency(invoice.amount) }}</div>
                <div class="text-sm text-gray-500">HT: {{ formatCurrency(invoice.totalHT) }}</div>
                <div v-if="invoice.acompteAmount" class="text-xs text-amber-600">
                  Acompte: {{ formatCurrency(invoice.acompteAmount) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(invoice.dueDate) }}</div>
                <div v-if="isOverdue(invoice.dueDate, invoice.status)" class="text-xs text-red-600">
                  ⚠️ En retard
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="viewInvoice(invoice)"
                    class="text-amber-500 hover:text-amber-700"
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
                    @click="downloadPDF(invoice)"
                    class="text-blue-500 hover:text-blue-700"
                    title="Télécharger PDF"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    v-if="invoice.status === 'emise' || invoice.status === 'en_attente'"
                    @click="markAsPaid(invoice.id)"
                    class="text-green-500 hover:text-green-700"
                    title="Marquer comme payée"
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
                    v-if="invoice.status === 'emise'"
                    @click="editInvoice(invoice)"
                    class="text-purple-500 hover:text-purple-700"
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
                    v-if="invoice.status === 'emise'"
                    @click="deleteInvoice(invoice.id)"
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
      <div v-if="filteredInvoices.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
          ></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune facture trouvée</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ searchQuery ? 'Aucune facture ne correspond à votre recherche.' : 'Commencez par créer une nouvelle facture.' }}
        </p>
        <div class="mt-6">
          <button
            @click="showForm = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Nouvelle Facture
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MetricCard from '@/components/shared/MetricCard.vue'
import InvoiceForm from '@/components/sales/InvoiceForm.vue'
import { useSalesStore } from '@/stores/sales'
import type { Invoice, InvoiceFormData } from '@/types'
import router from '@/router'

const salesStore = useSalesStore()

const showForm = ref(false)
const editingInvoice = ref<Invoice | null>(null)
const searchQuery = ref('')
const typeFilter = ref('')
const statusFilter = ref('')

const filteredInvoices = computed(() => {
  let filtered = salesStore.invoices.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (invoice) =>
        invoice.id.toLowerCase().includes(query) ||
        invoice.client.toLowerCase().includes(query) ||
        (invoice.orderId && invoice.orderId.toLowerCase().includes(query))
    )
  }

  if (typeFilter.value) {
    filtered = filtered.filter((invoice) => invoice.type === typeFilter.value)
  }

  if (statusFilter.value) {
    filtered = filtered.filter((invoice) => invoice.status === statusFilter.value)
  }

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const pendingInvoices = computed(() => {
  return salesStore.invoices.value.filter((i) => i.status === 'en_attente' || i.status === 'emise').length
})

const paidInvoices = computed(() => {
  return salesStore.invoices.value.filter((i) => i.status === 'payee').length
})

const totalInvoicesValue = computed(() => {
  return salesStore.invoices.value.reduce((sum, invoice) => sum + invoice.amount, 0)
})

const handleSubmit = (invoiceData: InvoiceFormData) => {
  if (editingInvoice.value) {
    // Update existing invoice logic would go here
    salesStore.updateInvoice(editingInvoice.value.id, invoiceData)
  } else {
    salesStore.addInvoice(invoiceData)
  }
  closeForm()
}

const closeForm = () => {
  showForm.value = false
  editingInvoice.value = null
}

const editInvoice = (invoice: Invoice) => {
  editingInvoice.value = invoice
  showForm.value = true
}

const viewInvoice = (invoice: Invoice) => {
  router.push(`/invoices/${invoice.id}`)
}

const downloadPDF = (invoice: Invoice) => {
  // Generate and download PDF (to be implemented)
  console.log('Download PDF for invoice:', invoice.id)
  alert(`Téléchargement du PDF pour la facture ${invoice.id} (fonctionnalité à implémenter)`)
}

const markAsPaid = (invoiceId: string) => {
  if (confirm('Marquer cette facture comme payée ?')) {
    salesStore.updateInvoice(invoiceId, { status: 'payee' })
  }
}

const deleteInvoice = (invoiceId: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
    salesStore.deleteInvoice(invoiceId)
  }
}

const isOverdue = (dueDate: string, status: string): boolean => {
  if (status === 'payee') return false
  const due = new Date(dueDate)
  const today = new Date()
  return due < today
}

const getTypeBadge = (type: string): string => {
  const badges: Record<string, string> = {
    proforma: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800',
    acompte: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800',
    definitive: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    echeancier: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800'
  }
  return badges[type] || badges['definitive']
}

const getTypeText = (type: string): string => {
  const texts: Record<string, string> = {
    proforma: 'Proforma',
    acompte: 'Acompte',
    definitive: 'Définitive',
    echeancier: 'Échéancier'
  }
  return texts[type] || type
}

const getStatusBadge = (status: string): string => {
  const badges: Record<string, string> = {
    emise: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800',
    en_attente: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800',
    payee: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    en_retard: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'
  }
  return badges[status] || badges['emise']
}

const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    emise: 'Émise',
    en_attente: 'En attente',
    payee: 'Payée',
    en_retard: 'En retard'
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