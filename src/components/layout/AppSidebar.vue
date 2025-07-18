<template>
  <div class="fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto">
    <!-- Mobile overlay -->
    <div
      v-if="isOpen"
      @click="$emit('close')"
      class="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
    ></div>

    <!-- Sidebar -->
    <aside :class="sidebarClasses">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-between h-16 px-6 bg-green-500">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span class="text-green-500 font-bold text-sm">NS</span>
            </div>
            <span class="text-white font-semibold text-lg">Neo Start Tech</span>
          </div>
          <button @click="$emit('close')" class="lg:hidden text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2">
          <router-link to="/dashboard" class="nav-link" active-class="nav-link-active">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z"
              ></path>
            </svg>
            Tableau de bord
          </router-link>

          <router-link to="/clients" class="nav-link" active-class="nav-link-active">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              ></path>
            </svg>
            Clients
          </router-link>

          <div class="nav-section">
            <span class="nav-section-title">Ventes</span>
            <router-link to="/quotes" class="nav-link ml-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              Devis
            </router-link>
            <router-link to="/orders" class="nav-link ml-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
              Commandes
            </router-link>
            <router-link to="/invoices" class="nav-link ml-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                ></path>
              </svg>
              Factures
            </router-link>
          </div>

          <div class="nav-section">
            <span class="nav-section-title">Fournisseurs</span>
            <router-link to="/suppliers" class="nav-link ml-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0v-3.5a1.5 1.5 0 00-1.5-1.5h0a1.5 1.5 0 00-1.5 1.5V21"
                ></path>
              </svg>
              Offres Fournisseurs
            </router-link>
          </div>
        </nav>

        <!-- User info -->
        <div class="p-4 border-t border-gray-200">
          <div class="flex items-center space-x-3">
            <img
              :src="authStore.user?.avatar"
              :alt="authStore.user?.name"
              class="w-8 h-8 rounded-full"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ authStore.user?.name }}
              </p>
              <p class="text-xs text-gray-500">{{ authStore.user?.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const authStore = useAuthStore()

const sidebarClasses = computed(() => {
  const baseClasses =
    'bg-white shadow-lg border-r border-gray-200 w-64 h-screen flex-shrink-0 transition-transform duration-300 ease-in-out'
  if (props.isOpen) {
    return `${baseClasses} transform translate-x-0 fixed lg:relative`
  } else {
    return `${baseClasses} transform -translate-x-full lg:translate-x-0 fixed lg:relative`
  }
})
</script>