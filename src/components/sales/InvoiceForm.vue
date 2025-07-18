<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-6">
      {{ mode === 'create' ? 'Nouvelle Facture' : 'Modifier Facture' }}
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Client and Order Selection -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="clientId" class="block text-sm font-medium text-gray-700 mb-1">Client *</label>
          <select
            id="clientId"
            v-model="form.clientId"
            required
            @change="onClientChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">Sélectionner un client</option>
            <option v-for="client in clientsList" :key="client.id" :value="client.id">
              {{ client.company }} - {{ client.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="type" class="block text-sm font-medium text-gray-700 mb-1">Type de facture *</label>
          <select
            id="type"
            v-model="form.type"
            required
            @change="onTypeChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="proforma">Facture Proforma</option>
            <option value="acompte">Facture d'Acompte</option>
            <option value="definitive">Facture Définitive</option>
            <option value="echeancier">Échéancier de Paiement</option>
          </select>
        </div>

        <div>
          <label for="orderId" class="block text-sm font-medium text-gray-700 mb-1">Commande source</label>
          <select
            id="orderId"
            v-model="form.orderId"
            @change="onOrderChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">Facture manuelle</option>
            <option v-for="order in clientOrders" :key="order.id" :value="order.id">
              {{ order.id }} - {{ formatCurrency(order.amount) }}
            </option>
          </select>
        </div>
      </div>

      <!-- Date and Payment Terms -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-1">Date d'échéance *</label>
          <input
            id="dueDate"
            v-model="form.dueDate"
            type="date"
            required
            :min="today"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div>
          <label for="paymentTerms" class="block text-sm font-medium text-gray-700 mb-1">Conditions de paiement</label>
          <select
            id="paymentTerms"
            v-model="form.paymentTerms"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">Sélectionner...</option>
            <option value="À réception">À réception</option>
            <option value="15 jours net">15 jours net</option>
            <option value="30 jours net">30 jours net</option>
            <option value="45 jours net">45 jours net</option>
            <option value="60 jours net">60 jours net</option>
          </select>
        </div>
      </div>

      <!-- Type-specific fields -->
      <div v-if="form.type === 'acompte'" class="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 class="font-medium text-amber-900 mb-3">Paramètres d'acompte</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-amber-700 mb-1">Pourcentage d'acompte</label>
            <select
              v-model="acomptePercentage"
              @change="calculateAcompte"
              class="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="30">30%</option>
              <option value="40">40%</option>
              <option value="50">50%</option>
              <option value="60">60%</option>
            </select>
          </div>
          <div v-if="selectedOrder">
            <label class="block text-sm font-medium text-amber-700 mb-1">Montant restant</label>
            <div class="px-3 py-2 bg-amber-100 border border-amber-300 rounded-lg text-sm font-medium">
              {{ formatCurrency(remainingAmount) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Items Section -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-md font-medium text-gray-900">Articles de la facture</h4>
          <button
            v-if="!form.orderId"
            type="button"
            @click="addItem"
            class="px-3 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm"
          >
            + Ajouter un article
          </button>
        </div>

        <div v-if="form.orderId && selectedOrder" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm text-green-700">
              Articles importés de la commande {{ selectedOrder.id }}
            </span>
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="(item, index) in form.items"
            :key="index"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div class="md:col-span-2">
                <label class="block text-xs font-medium text-gray-700 mb-1">Produit/Service *</label>
                <input
                  v-model="item.productName"
                  type="text"
                  required
                  :readonly="!!form.orderId"
                  placeholder="Nom du produit/service"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  :class="{ 'bg-gray-50': !!form.orderId }"
                />
              </div>
              
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Quantité *</label>
                <input
                  v-model.number="item.quantity"
                  type="number"
                  min="1"
                  required
                  :readonly="!!form.orderId"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  :class="{ 'bg-gray-50': !!form.orderId }"
                />
              </div>
              
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Prix unitaire HT *</label>
                <input
                  v-model.number="item.unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  :readonly="!!form.orderId"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  :class="{ 'bg-gray-50': !!form.orderId }"
                />
              </div>
              
              <div class="flex items-end">
                <div class="flex-1">
                  <label class="block text-xs font-medium text-gray-700 mb-1">Total HT</label>
                  <div class="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm font-medium">
                    {{ formatCurrency(item.quantity * item.unitPrice) }}
                  </div>
                </div>
                <button
                  v-if="!form.orderId"
                  type="button"
                  @click="removeItem(index)"
                  class="ml-2 p-1 text-red-600 hover:text-red-800"
                  title="Supprimer cet article"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="mt-3">
              <label class="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="item.description"
                rows="2"
                :readonly="!!form.orderId"
                placeholder="Description détaillée du produit/service"
                class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                :class="{ 'bg-gray-50': !!form.orderId }"
              ></textarea>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="form.items.length === 0" class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
            <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <p class="mt-2 text-sm text-gray-500">Aucun article ajouté</p>
            <button
              type="button"
              @click="addItem"
              class="mt-2 px-3 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm"
            >
              Ajouter le premier article
            </button>
          </div>
        </div>

        <!-- Totals -->
        <div v-if="form.items.length > 0" class="mt-4 bg-gray-50 rounded-lg p-4">
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Total HT:</span>
              <span class="font-medium ml-2">{{ formatCurrency(totalHT) }}</span>
            </div>
            <div>
              <span class="text-gray-600">TVA (20%):</span>
              <span class="font-medium ml-2">{{ formatCurrency(totalTVA) }}</span>
            </div>
            <div>
              <span class="text-gray-700 font-medium">Total TTC:</span>
              <span class="font-bold ml-2 text-amber-600">{{ formatCurrency(finalAmount) }}</span>
            </div>
          </div>
          <div v-if="form.type === 'acompte' && acomptePercentage" class="mt-2 pt-2 border-t border-gray-200">
            <div class="text-sm">
              <span class="text-amber-700 font-medium">Montant acompte ({{ acomptePercentage }}%):</span>
              <span class="font-bold ml-2 text-amber-600">{{ formatCurrency(acompteAmount) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div>
        <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notes de facturation</label>
        <textarea
          id="notes"
          v-model="form.notes"
          rows="3"
          placeholder="Conditions particulières, références, informations complémentaires..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          :disabled="form.items.length === 0"
          class="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ mode === 'create' ? 'Créer la facture' : 'Modifier la facture' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSalesStore } from '@/stores/sales'
import type { Invoice, InvoiceFormData, Order } from '@/types'

interface Props {
  invoice?: Invoice | null
  mode?: 'create' | 'edit'
}

interface InvoiceItemForm {
  productName: string
  description: string
  quantity: number
  unitPrice: number
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create'
})

const emit = defineEmits<{
  submit: [data: InvoiceFormData]
  cancel: []
}>()

const salesStore = useSalesStore()
const clientsList = computed(() => Array.isArray(salesStore.clients) ? salesStore.clients : [])

const form = ref<{
  clientId: number | ''
  orderId: string
  type: Invoice['type']
  dueDate: string
  paymentTerms: string
  notes: string
  items: InvoiceItemForm[]
}>({
  clientId: '',
  orderId: '',
  type: 'definitive',
  dueDate: '',
  paymentTerms: '30 jours net',
  notes: '',
  items: []
})

const acomptePercentage = ref<number>(50)

// Computed properties
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const clientOrders = computed(() => {
  if (!form.value.clientId) return []
  return salesStore.orders.value.filter(o => 
    o.clientId === form.value.clientId && o.status === 'livre'
  )
})

const selectedOrder = computed(() => {
  if (!form.value.orderId) return null
  return salesStore.orders.value.find((order: Order) => order.id === form.value.orderId) || null
})

const totalHT = computed(() => {
  return form.value.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
})

const totalTVA = computed(() => {
  return totalHT.value * 0.20
})

const totalTTC = computed(() => {
  return totalHT.value + totalTVA.value
})

const acompteAmount = computed(() => {
  if (form.value.type === 'acompte') {
    return totalTTC.value * (acomptePercentage.value / 100)
  }
  return 0
})

const remainingAmount = computed(() => {
  if (selectedOrder.value) {
    return selectedOrder.value.amount - acompteAmount.value
  }
  return 0
})

const finalAmount = computed(() => {
  return form.value.type === 'acompte' ? acompteAmount.value : totalTTC.value
})

const resetForm = () => {
  form.value = {
    clientId: '',
    orderId: '',
    type: 'definitive',
    dueDate: '',
    paymentTerms: '30 jours net',
    notes: '',
    items: []
  }
}

// Watch for invoice prop changes to populate form
watch(
  () => props.invoice,
  (newInvoice) => {
    if (newInvoice) {
      form.value = {
        clientId: newInvoice.clientId,
        orderId: newInvoice.orderId || '',
        type: newInvoice.type,
        dueDate: newInvoice.dueDate,
        paymentTerms: newInvoice.paymentTerms || '',
        notes: newInvoice.notes || '',
        items: newInvoice.items.map(item => ({
          productName: item.productName,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      }
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

// Set default due date
watch(
  () => form.value.type,
  (newType) => {
    if (!form.value.dueDate) {
      const defaultDays = newType === 'proforma' ? 0 : 30
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + defaultDays)
      form.value.dueDate = dueDate.toISOString().split('T')[0]
    }
  },
  { immediate: true }
)



const onClientChange = () => {
  // Reset order selection when client changes
  form.value.orderId = ''
  form.value.items = []
}

const onTypeChange = () => {
  // Reset some fields when type changes
  if (form.value.type !== 'acompte') {
    acomptePercentage.value = 50
  }
}

const onOrderChange = () => {
  if (form.value.orderId) {
    const order = selectedOrder.value
    if (order) {
      // Import items from order
      form.value.items = order.items.map((item: { productName: any; description: any; quantity: any; unitPrice: any }) => ({
        productName: item.productName,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    }
  } else {
    // Clear items if no order selected
    form.value.items = []
  }
}

const calculateAcompte = () => {
  // Force reactivity update when percentage changes
  acomptePercentage.value = Number(acomptePercentage.value)
}

const addItem = () => {
  form.value.items.push({
    productName: '',
    description: '',
    quantity: 1,
    unitPrice: 0
  })
}

const removeItem = (index: number) => {
  form.value.items.splice(index, 1)
}

const handleSubmit = () => {
  if (form.value.clientId === '' || form.value.items.length === 0) {
    return
  }

  const formData: InvoiceFormData = {
    clientId: form.value.clientId as number,
    orderId: form.value.orderId || undefined,
    type: form.value.type,
    dueDate: form.value.dueDate,
    paymentTerms: form.value.paymentTerms || undefined,
    notes: form.value.notes || undefined,
    items: form.value.items
  }

  emit('submit', formData)
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}
</script>