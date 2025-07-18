<template>
  <div class="p-6 space-y-6">
    <div v-if="client">
      <!-- Header with client info -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center">
              <span class="text-white font-bold text-xl">
                {{ client.name.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ client.name }}</h1>
              <p class="text-lg text-gray-600">{{ client.company }}</p>
              <div class="flex items-center space-x-4 mt-2">
                <span :class="getStatusBadge(client.status)">
                  {{ getStatusText(client.status) }}
                </span>
                <span class="text-sm text-gray-500">
                  Client depuis {{ formatDate(client.createdAt) }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex space-x-2">
            <button
              @click="$router.push('/clients')"
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Retour
            </button>
            <button 
              @click="editClient"
              class="px-4 py-2 bg-green-500 text-white hover:bg-teal-700 rounded-lg transition-colors"
            >
              Modifier
            </button>
          </div>
        </div>
      </div>

      <!-- Contact info and stats -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Contact Information -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations de Contact</h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              <span class="text-gray-900">{{ client.email }}</span>
            </div>
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                ></path>
              </svg>
              <span class="text-gray-900">{{ client.phone || 'Non renseigné' }}</span>
            </div>
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              <span class="text-gray-900">{{ client.address || 'Non renseignée' }}</span>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard
            title="Total Dépensé"
            :value="client.totalSpent"
            icon="💰"
            color="success"
            description="Montant total des achats"
          />
          <MetricCard
            title="Dernière Commande"
            :value="formatDate(client.lastOrder)"
            icon="📦"
            color="accent"
            description="Date de la dernière commande"
          />
        </div>
      </div>

      <!-- Tabs for orders, quotes, etc. -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-green-500 text-green-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <div v-if="activeTab === 'orders'" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              ></path>
            </svg>
            <h4 class="text-lg font-medium text-gray-900 mb-2">Historique des Commandes</h4>
            <p class="text-gray-500">Module en cours de développement</p>
          </div>
          
          <div v-if="activeTab === 'quotes'" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <h4 class="text-lg font-medium text-gray-900 mb-2">Historique des Devis</h4>
            <p class="text-gray-500">Module en cours de développement</p>
          </div>
          
          <div v-if="activeTab === 'invoices'" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
              ></path>
            </svg>
            <h4 class="text-lg font-medium text-gray-900 mb-2">Historique des Factures</h4>
            <p class="text-gray-500">Module en cours de développement</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
        ></path>
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">Client non trouvé</h3>
      <p class="mt-1 text-sm text-gray-500">Le client demandé n'existe pas ou a été supprimé.</p>
      <div class="mt-6">
        <button
          @click="$router.push('/clients')"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-teal-700"
        >
          Retour à la liste
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MetricCard from '@/components/shared/MetricCard.vue'
import { useSalesStore } from '@/stores/sales'

const route = useRoute()
const router = useRouter()
const salesStore = useSalesStore()

const activeTab = ref('orders')
const tabs = [
  { id: 'orders', name: 'Commandes' },
  { id: 'quotes', name: 'Devis' },
  { id: 'invoices', name: 'Factures' }
]

const client = computed(() => {
  const clientId = parseInt(route.params.id as string)
  return salesStore.getClientById(clientId)
})

const editClient = () => {
  // Navigate back to clients list with edit mode
  router.push({ path: '/clients', query: { edit: client.value?.id } })
}

const getStatusBadge = (status: string): string => {
  const badges: Record<string, string> = {
    actif: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    nouveau: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800',
    inactif: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
  }
  return badges[status] || badges['actif']
}

const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    actif: 'Actif',
    nouveau: 'Nouveau',
    inactif: 'Inactif'
  }
  return texts[status] || status
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}
</script>