<template>
  <div class="fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto">
    <!-- Mobile overlay with smooth backdrop -->
    <div
      v-if="isOpen"
      @click="$emit('close')"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
    ></div>

    <!-- Main sidebar container -->
    <aside :class="sidebarClasses">
      <div class="flex flex-col h-full bg-white shadow-xl">
        
        <!-- Header section with logo and branding -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <!-- Logo with gradient background -->
            <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-white font-bold text-lg">NS</span>
            </div>
            <div>
              <h1 class="text-lg font-bold text-gray-900">Neo Start Tech</h1>
              <p class="text-xs text-gray-500 font-medium">Business Manager</p>
            </div>
          </div>
          
          <!-- Close button for mobile -->
          <button 
            @click="$emit('close')" 
            class="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Navigation section -->
        <nav class="flex-1 px-4 py-6 space-y-1">
          
          <!-- Dashboard - Main navigation item -->
          <router-link 
            to="/dashboard" 
            class="nav-item"
            :class="{ 'nav-item-active': $route.path === '/dashboard' }"
          >
            <div class="nav-icon">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <p class="nav-label">Tableau de bord</p>
              <p class="nav-description">Vue d'ensemble</p>
            </div>
          </router-link>

          <!-- Clients -->
          <router-link 
            to="/clients" 
            class="nav-item"
            :class="{ 'nav-item-active': $route.path === '/clients' }"
          >
            <div class="nav-icon">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <p class="nav-label">Clients</p>
              <p class="nav-description">Gestion clientèle</p>
            </div>
          </router-link>

          <!-- Sales section -->
          <div class="nav-section">
            <h3 class="nav-section-title">Ventes</h3>
            
            <router-link 
              to="/quotes" 
              class="nav-item nav-item-nested"
              :class="{ 'nav-item-active': $route.path === '/quotes' }"
            >
              <div class="nav-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="nav-label">Devis</p>
                <p class="nav-description">Propositions commerciales</p>
              </div>
            </router-link>

            <router-link 
              to="/orders" 
              class="nav-item nav-item-nested"
              :class="{ 'nav-item-active': $route.path === '/orders' }"
            >
              <div class="nav-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="nav-label">Commandes</p>
                <p class="nav-description">Suivi des ventes</p>
              </div>
            </router-link>

            <router-link 
              to="/invoices" 
              class="nav-item nav-item-nested"
              :class="{ 'nav-item-active': $route.path === '/invoices' }"
            >
              <div class="nav-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16l3.5-2 3.5 2 3.5-2 3.5 2z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="nav-label">Factures</p>
                <p class="nav-description">Facturation client</p>
              </div>
            </router-link>
          </div>

          <!-- Suppliers section -->
          <div class="nav-section">
            <h3 class="nav-section-title">Fournisseurs</h3>
            
            <router-link 
              to="/suppliers" 
              class="nav-item nav-item-nested"
              :class="{ 'nav-item-active': $route.path === '/suppliers' }"
            >
              <div class="nav-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-4m-5 0H3m2 0v-3.5a1.5 1.5 0 00-1.5-1.5h0a1.5 1.5 0 00-1.5 1.5V21"></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="nav-label">Offres Fournisseurs</p>
                <p class="nav-description">Achats & approvisionnement</p>
              </div>
            </router-link>
          </div>
        </nav>

        <!-- Footer section with upgrade promotion -->
        <div class="p-4 border-t border-gray-100">
       

          <!-- User info section -->
          <div class="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <img
              :src="authStore.user.value?.avatar || '/default-avatar.png'"
              :alt="authStore.user.value?.name"
              class="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 truncate">
                {{ authStore.user.value?.name || 'Utilisateur' }}
              </p>
              <p class="text-xs text-gray-500 font-medium">
                {{ authStore.user.value?.role || 'Gestionnaire' }}
              </p>
            </div>
            <!-- Status indicator -->
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Domain types - Following domain-first architecture
interface SidebarProps {
  isOpen: boolean
}

interface SidebarEmits {
  close: []
}

// Component props and emits
const props = defineProps<SidebarProps>()
const emit = defineEmits<SidebarEmits>()

// Store access
const authStore = useAuthStore()

// Computed properties for dynamic styling
const sidebarClasses = computed(() => {
  const baseClasses = 'bg-white w-64 h-screen flex-shrink-0 transition-all duration-300 ease-in-out border-r border-gray-100'
  
  if (props.isOpen) {
    return `${baseClasses} transform translate-x-0 fixed lg:relative z-50`
  } else {
    return `${baseClasses} transform -translate-x-full lg:translate-x-0 fixed lg:relative`
  }
})
</script>

<style scoped>
/* Navigation item base styles */
@reference "tailwindcss";

.nav-item {
  @apply flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ;
  @apply text-gray-700 hover:bg-gray-50 hover:text-gray-900;
}

/* Active navigation item */
.nav-item-active {
  @apply bg-green-50 border-l-4 border-green-600 text-green-900;
  @apply shadow-sm;
}

/* Nested navigation items (under sections) */
.nav-item-nested {
  @apply ml-4 relative;
}

.nav-item-nested::before {
  content: '';
  @apply absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200;
}

.nav-item-nested.nav-item-active::before {
  @apply bg-green-600;
}

/* Icon container */
.nav-icon {
  @apply p-2 rounded-lg transition-all duration-200;
  @apply bg-gray-100 text-gray-600;
}

.nav-item-active .nav-icon {
  @apply bg-green-100 text-green-600;
}

.nav-item:hover .nav-icon {
  @apply bg-gray-200 text-gray-700;
}

.nav-item-active:hover .nav-icon {
  @apply bg-green-200 text-green-700;
}

/* Text labels */
.nav-label {
  @apply font-semibold text-sm;
}

.nav-description {
  @apply text-xs opacity-70 font-medium;
}

/* Section styling */
.nav-section {
  @apply mt-6 space-y-1;
}

.nav-section-title {
  @apply text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-2;
  @apply border-b border-gray-100 mb-2;
}

/* Smooth animations */
.nav-item {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item:hover {
  transform: translateX(2px);
}

.nav-item-active:hover {
  transform: translateX(0);
}
</style>