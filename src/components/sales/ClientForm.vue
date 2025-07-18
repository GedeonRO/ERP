<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-6">
      {{ mode === 'create' ? 'Nouveau Client' : 'Modifier Client' }}
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Nom du contact"
          />
        </div>

        <div>
          <label for="company" class="block text-sm font-medium text-gray-700 mb-1">Entreprise *</label>
          <input
            id="company"
            v-model="form.company"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Nom de l'entreprise"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="contact@entreprise.com"
          />
        </div>

        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="+33 1 23 45 67 89"
          />
        </div>
      </div>

      <div>
        <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
        <textarea
          id="address"
          v-model="form.address"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Adresse complète"
        ></textarea>
      </div>

      <div class="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-green-500 text-white hover:bg-teal-700 rounded-lg transition-colors"
        >
          {{ mode === 'create' ? 'Créer' : 'Modifier' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Client } from '@/types'

interface Props {
  client?: Client | null
  mode?: 'create' | 'edit'
}

interface FormData {
  name: string
  company: string
  email: string
  phone?: string
  address?: string
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create'
})

const emit = defineEmits<{
  submit: [data: FormData]
  cancel: []
}>()

const form = ref<FormData>({
  name: '',
  company: '',
  email: '',
  phone: '',
  address: ''
})

// Watch for client prop changes to populate form
watch(
  () => props.client,
  (newClient) => {
    if (newClient) {
      form.value = {
        name: newClient.name,
        company: newClient.company,
        email: newClient.email,
        phone: newClient.phone || '',
        address: newClient.address || ''
      }
    } else {
      // Reset form for new client
      form.value = {
        name: '',
        company: '',
        email: '',
        phone: '',
        address: ''
      }
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  emit('submit', form.value)
}
</script>