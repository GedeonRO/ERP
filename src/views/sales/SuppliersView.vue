<template>
  <div class="p-6">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div class="max-w-lg mx-auto">
        <div class="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0v-3.5a1.5 1.5 0 00-1.5-1.5h0a1.5 1.5 0 00-1.5 1.5V21"
            ></path>
          </svg>
        </div>
        
        <h3 class="text-xl font-semibold text-gray-900 mb-3">Gestion des Fournisseurs</h3>
        <p class="text-gray-600 mb-6">Module de gestion des offres fournisseurs en cours de développement</p>
        
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-purple-900 mb-2">Fonctionnalités à venir :</h4>
          <ul class="text-purple-800 text-sm space-y-1 text-left">
            <li>• Enregistrement des offres fournisseurs détaillées</li>
            <li>• Comparaison automatique des prix et caractéristiques</li>
            <li>• Sélection du meilleur fournisseur selon les critères</li>
            <li>• Calcul automatique des marges commerciales</li>
            <li>• Génération de propositions de prix clients</li>
            <li>• Suivi des délais et garanties fournisseurs</li>
            <li>• Historique des relations fournisseurs</li>
          </ul>
        </div>

        <!-- Supplier Process Flow -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-gray-900 mb-4">Processus de gestion :</h4>
          <div class="space-y-3">
            <!-- Step 1 -->
            <div class="flex items-center space-x-3 p-2 bg-white rounded border-l-4 border-blue-400">
              <div class="w-6 h-6 bg-blue-400 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div class="text-left flex-1">
                <div class="font-medium text-sm">Réception Offres</div>
                <div class="text-xs text-gray-500">Enregistrement des prix, délais, garanties</div>
              </div>
            </div>
            
            <!-- Step 2 -->
            <div class="flex items-center space-x-3 p-2 bg-white rounded border-l-4 border-green-400">
              <div class="w-6 h-6 bg-green-400 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div class="text-left flex-1">
                <div class="font-medium text-sm">Comparaison</div>
                <div class="text-xs text-gray-500">Analyse automatique des meilleures offres</div>
              </div>
            </div>
            
            <!-- Step 3 -->
            <div class="flex items-center space-x-3 p-2 bg-white rounded border-l-4 border-amber-400">
              <div class="w-6 h-6 bg-amber-400 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div class="text-left flex-1">
                <div class="font-medium text-sm">Calcul Marge</div>
                <div class="text-xs text-gray-500">Intégration marge commerciale et frais</div>
              </div>
            </div>
            
            <!-- Step 4 -->
            <div class="flex items-center space-x-3 p-2 bg-white rounded border-l-4 border-purple-400">
              <div class="w-6 h-6 bg-purple-400 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
              <div class="text-left flex-1">
                <div class="font-medium text-sm">Proposition Client</div>
                <div class="text-xs text-gray-500">Génération proposition commerciale</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sample Supplier Data Structure -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-gray-900 mb-3">Structure des données fournisseurs :</h4>
          <div class="grid grid-cols-1 gap-2 text-sm">
            <div class="flex justify-between p-2 bg-white rounded">
              <span class="text-gray-600">Fournisseur A</span>
              <span class="font-medium text-green-600">Prix: 1200€ | Délai: 5j</span>
            </div>
            <div class="flex justify-between p-2 bg-white rounded">
              <span class="text-gray-600">Fournisseur B</span>
              <span class="font-medium text-blue-600">Prix: 1150€ | Délai: 7j</span>
            </div>
            <div class="flex justify-between p-2 bg-white rounded">
              <span class="text-gray-600">Fournisseur C</span>
              <span class="font-medium text-amber-600">Prix: 1300€ | Délai: 3j</span>
            </div>
            <div class="text-center p-2 bg-green-50 rounded border-2 border-green-200">
              <span class="text-green-700 font-medium">→ Sélection automatique du meilleur rapport qualité/prix/délai</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            @click="$router.push('/clients')"
            class="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Gérer les Clients
          </button>
          <button
            @click="$router.push('/dashboard')"
            class="px-4 py-2 bg-purple-500 text-white hover:bg-purple-600 rounded-lg transition-colors"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Suppliers management view - placeholder for future development
// This module will handle supplier offers comparison and margin calculation
</script>