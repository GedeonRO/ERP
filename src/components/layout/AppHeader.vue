<template>
  <header class="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
    <div class="flex items-center space-x-4">
      <button
        @click="$emit('toggle-sidebar')"
        class="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
      <h1 class="text-xl font-semibold text-gray-900">{{ pageTitle }}</h1>
    </div>

    <div class="flex items-center space-x-4">
      <!-- Search bar -->
      <div class="hidden md:block relative">
        <input
          type="text"
          placeholder="Rechercher..."
          class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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

      <!-- Notifications -->
      <button class="p-2 text-gray-400 hover:text-gray-600 relative">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.586V11a6 6 0 10-12 0v3.586c0 .53-.21 1.04-.595 1.414L4 17h5m6 0a3 3 0 11-6 0h6z"
          ></path>
        </svg>
        <span class="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
      </button>

      <!-- User menu -->
      <div class="relative">
        <button
          @click="showUserMenu = !showUserMenu"
          class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <img
            :src="authStore.user.value?.avatar"
            :alt="authStore.user.value?.name"
            class="w-8 h-8 rounded-full"
          />
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>

        <!-- Dropdown menu -->
        <div
          v-if="showUserMenu"
          class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
          @click.stop
        >
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profil</a>
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Paramètres</a>
          <div class="border-t border-gray-100"></div>
          <button
            @click="logout"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits<{
  'toggle-sidebar': []
}>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showUserMenu = ref(false)

const pageTitle = computed(() => {
  const titleMap: Record<string, string> = {
    'dashboard': 'Tableau de bord',
    'clients': 'Gestion des Clients',
    'client-detail': 'Détail Client',
    'quotes': 'Devis',
    'orders': 'Commandes',
    'invoices': 'Factures',
    'suppliers': 'Fournisseurs'
  }
  return titleMap[route.name as string] || 'ERP Neo Start Technology'
})

const logout = () => {
  authStore.logout()
  router.push('/login')
  showUserMenu.value = false
}

const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>