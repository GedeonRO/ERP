<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-6">
      {{ mode === 'create' ? 'Nouvelle Commande' : 'Modifier Commande' }}
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Client and Quote Selection -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="clientId" class="block text-sm font-medium text-gray-700 mb-1">Client *</label>
          <select
            id="clientId"
            v-model="form.clientId"
            required
            @change="onClientChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Sélectionner un client</option>
            <option v-for="client in salesStore.clients.value" :key="client.id" :value="client.id">
              {{ client.company }} - {{ client.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="quoteId" class="block text-sm font-medium text-gray-700 mb-1">Devis source</label>
          <select
            id="quoteId"
            v-model="form.quoteId"
            @change="onQuoteChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Commande manuelle</option>
            <option v-for="quote in clientQuotes" :key="quote.id" :value="quote.id">
              {{ quote.id }} - {{ formatCurrency(quote.amount) }}
            </option>
          </select>
        </div>
      </div>

      <!-- Delivery Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="delivery" class="block text-sm font-medium text-gray-700 mb-1">Date de livraison *</label>
          <input
            id="delivery"
            v-model="form.delivery"
            type="date"
            required
            :min="tomorrow"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label for="deliveryAddress" class="block text-sm font-medium text-gray-700 mb-1">Adresse de livraison</label>
          <textarea
            id="deliveryAddress"
            v-model="form.deliveryAddress"
            rows="2"
            placeholder="Adresse de livraison (par défaut: adresse du client)"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          ></textarea>
        </div>
      </div>

      <!-- Items Section -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-md font-medium text-gray-900">Articles de la commande</h4>
          <button
            v-if="!form.quoteId"
            type="button"
            @click="addItem"
            class="px-3 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
          >
            + Ajouter un article
          </button>
        </div>

        <div v-if="form.quoteId && selectedQuote" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm text-blue-700">
              Articles importés du devis {{ selectedQuote.id }}
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
                  :readonly="!!form.quoteId"
                  placeholder="Nom du produit/service"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  :class="{ 'bg-gray-50': !!form.quoteId }"
                />
              </div>
              
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Quantité *</label>
                <input
                  v-model.number="item.quantity"
                  type="number"
                  min="1"
                  required
                  :readonly="!!form.quoteId"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  :class="{ 'bg-gray-50': !!form.quoteId }"
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
                  :readonly="!!form.quoteId"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  :class="{ 'bg-gray-50': !!form.quoteId }"
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
                  v-if="!form.quoteId"
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
                :readonly="!!form.quoteId"
                placeholder="Description détaillée du produit/service"
                class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                :class="{ 'bg-gray-50': !!form.quoteId }"
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
              class="mt-2 px-3 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
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
              <span class="font-bold ml-2 text-emerald-600">{{ formatCurrency(totalTTC) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div>
        <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notes de commande</label>
        <textarea
          id="notes"
          v-model="form.notes"
          rows="3"
          placeholder="Instructions spéciales, remarques sur la livraison..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
          class="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ mode === 'create' ? 'Créer la commande' : 'Modifier la commande' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSalesStore } from '@/stores/sales'
import type { Order, OrderFormData, Quote } from '@/types'

interface Props {
  order?: Order | null
  mode?: 'create' | 'edit'
}

interface OrderItemForm {
  productName: string
  description: string
  quantity: number
  unitPrice: number
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create'
})

const emit = defineEmits<{
  submit: [data: OrderFormData]
  cancel: []
}>()

const salesStore = useSalesStore()

const form = ref<{
  clientId: number | ''
  quoteId: string
  delivery: string
  deliveryAddress: string
  notes: string
  items: OrderItemForm[]
}>({
  clientId: '',
  quoteId: '',
  delivery: '',
  deliveryAddress: '',
  notes: '',
  items: []
})

// Computed properties
const tomorrow = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().split('T')[0]
})

const clientQuotes = computed(() => {
  if (!form.value.clientId) return []
  return salesStore.quotes.value.filter(q => 
    q.clientId === form.value.clientId && q.status === 'accepte'
  )
})

const selectedQuote = computed(() => {
  if (!form.value.quoteId) return null
  return salesStore.quotes.value.find(q => q.id === form.value.quoteId) || null
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

const resetForm = () => {
  form.value = {
    clientId: '',
    quoteId: '',
    delivery: '',
    deliveryAddress: '',
    notes: '',
    items: []
  }
}

// Watch for order prop changes to populate form
watch(
  () => props.order,
  (newOrder) => {
    if (newOrder) {
      form.value = {
        clientId: newOrder.clientId,
        quoteId: newOrder.quoteId || '',
        delivery: newOrder.delivery,
        deliveryAddress: newOrder.deliveryAddress || '',
        notes: newOrder.notes || '',
        items: newOrder.items.map(item => ({
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



const onClientChange = () => {
  // Reset quote selection when client changes
  form.value.quoteId = ''
  form.value.items = []
  
  // Set default delivery address
  const client = salesStore.getClientById(form.value.clientId as number)
  if (client) {
    form.value.deliveryAddress = client.address || ''
  }
}

const onQuoteChange = () => {
  if (form.value.quoteId) {
    const quote = selectedQuote.value
    if (quote) {
      // Import items from quote
      form.value.items = quote.items.map((item: { productName: any; description: any; quantity: any; unitPrice: any }) => ({
        productName: item.productName,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    }
  } else {
    // Clear items if no quote selected
    form.value.items = []
  }
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

  const formData: OrderFormData = {
    clientId: form.value.clientId as number,
    quoteId: form.value.quoteId || undefined,
    delivery: form.value.delivery,
    deliveryAddress: form.value.deliveryAddress || undefined,
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