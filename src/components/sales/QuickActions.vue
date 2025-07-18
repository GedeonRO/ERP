<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
    <div class="grid grid-cols-1 gap-4">
      <button
        v-for="action in actions"
        :key="action.id"
        @click="handleAction(action.id)"
        :class="[
          'flex items-center p-4 border-2 border-dashed rounded-lg transition-all duration-200 group',
          action.colorClasses,
          'hover:border-solid hover:shadow-md'
        ]"
      >
        <div :class="['p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform', action.iconBg]">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="action.icon"></path>
          </svg>
        </div>
        <div class="text-left">
          <p class="font-medium text-gray-900 group-hover:text-gray-700">{{ action.title }}</p>
          <p class="text-sm text-gray-500">{{ action.description }}</p>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  colorClasses: string
  iconBg: string
}

const actions: QuickAction[] = [
  {
    id: 'new-client',
    title: 'Nouveau Client',
    description: 'Ajouter un client',
    icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    colorClasses: 'border-green-200 hover:border-green-400 hover:bg-green-50',
    iconBg: 'bg-green-500'
  },
  {
    id: 'new-quote',
    title: 'Nouveau Devis',
    description: 'Créer un devis',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    colorClasses: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50',
    iconBg: 'bg-blue-500'
  },
  {
    id: 'new-order',
    title: 'Nouvelle Commande',
    description: 'Enregistrer une commande',
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    colorClasses: 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50',
    iconBg: 'bg-emerald-500'
  },
  {
    id: 'new-invoice',
    title: 'Nouvelle Facture',
    description: 'Générer une facture',
    icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z',
    colorClasses: 'border-amber-200 hover:border-amber-400 hover:bg-amber-50',
    iconBg: 'bg-amber-500'
  }
]

const handleAction = (actionId: string) => {
  const routeMap: Record<string, string> = {
    'new-client': '/clients',
    'new-quote': '/quotes',
    'new-order': '/orders',
    'new-invoice': '/invoices'
  }

  if (routeMap[actionId]) {
    router.push(routeMap[actionId])
  }
}
</script>