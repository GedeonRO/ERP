<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-teal-700">
    <div class="max-w-md w-full mx-4">
      <div class="bg-white rounded-xl shadow-2xl p-8">
        <div class="text-center mb-8">
          <div class="mx-auto h-20 w-20 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0v-3.5a1.5 1.5 0 00-1.5-1.5h0a1.5 1.5 0 00-1.5 1.5V21"
              />
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">Neo Start Technology</h2>
          <p class="text-gray-600 mt-2">Système de gestion ERP</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div v-if="error" class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {{ error }}
          </div>

          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="admin@neostart.com"
            />
          </div>

          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="••••••••"
            />
          </div>

          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="remember"
                type="checkbox"
                class="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-900">Se souvenir de moi</label>
            </div>
            <a href="#" class="text-sm text-green-500 hover:text-teal-700">Mot de passe oublié ?</a>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-green-500 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Connexion...
            </span>
            <span v-else>Se connecter</span>
          </button>

          <div class="text-center text-xs text-gray-500 mt-4">
            Demo: admin@neostart.com / admin123
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const remember = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  const result = authStore.login(email.value, password.value)

  if (result.success) {
    router.push('/dashboard')
  } else {
    error.value = result.error || 'Erreur de connexion'
  }

  loading.value = false
}
</script>