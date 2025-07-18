<template>
  <div class="p-6">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div class="max-w-md mx-auto">
        <div class="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
            ></path>
          </svg>
        </div>
        
        <h3 class="text-xl font-semibold text-gray-900 mb-3">Gestion des Factures</h3>
        <p class="text-gray-600 mb-6">Module de facturation en cours de développement</p>
        
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-amber-900 mb-2">Fonctionnalités à venir :</h4>
          <ul class="text-amber-800 text-sm space-y-1 text-left">
            <li>• Génération de factures proforma</li>
            <li>• Facturation d'acompte avec calculs automatiques</li>
            <li>• Factures définitives avec déduction des acomptes</li>
            <li>• Création d'échéanciers de paiement personnalisés</li>
            <li>• Suivi des paiements et relances automatiques</li>
            <li>• Export PDF avec en-tête personnalisé</li>
            <li>• Intégration comptable et reporting fiscal</li>
          </ul>
        </div>

        <!-- Invoice Types Preview -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-gray-900 mb-3">Types de factures :</h4>
          <div class="grid grid-cols-1 gap-2">
            <div class="flex justify-between items-center p-2 bg-white rounded border">
              <div class="text-left">
                <div class="font-medium text-sm">Facture Proforma</div>
                <div class="text-xs text-gray-500">Estimation avant commande</div>
              </div>
              <div class="w-3 h-3 bg-blue-400 rounded-full"></div>
            </div>
            
            <div class="flex justify-between items-center p-2 bg-white rounded border">
              <div class="text-left">
                <div class="font-medium text-sm">Facture d'Acompte</div>
                <div class="text-xs text-gray-500">Paiement partiel anticipé</div>
              </div>
              <div class="w-3 h-3 bg-amber-400 rounded-full"></div>
            </div>
            
            <div class="flex justify-between items-center p-2 bg-white rounded border">
              <div class="text-left">
                <div class="font-medium text-sm">Facture Définitive</div>
                <div class="text-xs text-gray-500">Facturation finale</div>
              </div>
              <div class="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            
            <div class="flex justify-between items-center p-2 bg-white rounded border">
              <div class="text-left">
                <div class="font-medium text-sm">Échéancier</div>
                <div class="text-xs text-gray-500">Paiements échelonnés</div>
              </div>
              <div class="w-3 h-3 bg-purple-400 rounded-full"></div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            @click="$router.push('/orders')"
            class="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Gérer les Commandes
          </button>
          <button
            @click="$router.push('/dashboard')"
            class="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 rounded-lg transition-colors"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Invoice management view - placeholder for future development
</script>