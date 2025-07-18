<template>
  <div class="p-6 space-y-6">
    <!-- Metrics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Chiffre d'Affaires Total"
        :value="salesStore.metrics.value.totalSales"
        :trend="salesStore.metrics.value.salesTrend"
        icon="📊"
        color="primary"
        description="Revenus depuis le début"
      />
      <MetricCard
        title="Ventes ce Mois"
        :value="salesStore.metrics.value.salesThisMonth"
        :trend="salesStore.metrics.value.salesTrend"
        icon="💰"
        color="success"
        description="Chiffre d'affaires mensuel"
      />
      <MetricCard
        title="Commandes Totales"
        :value="salesStore.metrics.value.totalOrders"
        :trend="salesStore.metrics.value.ordersTrend"
        icon="📦"
        color="accent"
        description="Nombre de commandes"
      />
      <MetricCard
        title="Devis en Attente"
        :value="salesStore.metrics.value.pendingQuotes"
        :trend="-5.2"
        icon="📄"
        color="warning"
        description="Devis à traiter"
      />
    </div>

    <!-- Charts and Quick Actions Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <SalesChart :data="salesStore.metrics.value.monthlyRevenue" />
      </div>
      <div>
        <QuickActions />
      </div>
    </div>

    <!-- Recent Activity -->
    <RecentActivity 
      :quotes="salesStore.recentQuotes.value" 
      :orders="salesStore.recentOrders.value" 
    />
  </div>
</template>

<script setup lang="ts">
import MetricCard from '@/components/shared/MetricCard.vue'
import SalesChart from '@/components/sales/SalesChart.vue'
import QuickActions from '@/components/sales/QuickActions.vue'
import RecentActivity from '@/components/sales/RecentActivity.vue'
import { useSalesStore } from '@/stores/sales'

const salesStore = useSalesStore()
</script>