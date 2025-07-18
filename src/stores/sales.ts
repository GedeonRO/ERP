import { ref, reactive } from 'vue'
import type { SalesMetrics, Client, Quote, Order } from '@/types'

// Mock data
const mockMetrics: SalesMetrics = {
  totalSales: 1250000,
  salesThisMonth: 450000,
  totalOrders: 156,
  pendingQuotes: 23,
  totalClients: 89,
  salesTrend: 12.5,
  ordersTrend: 8.3,
  clientsTrend: 15.2,
  monthlyRevenue: [
    { month: 'Jan', revenue: 350000, orders: 45 },
    { month: 'Fév', revenue: 420000, orders: 52 },
    { month: 'Mar', revenue: 380000, orders: 48 },
    { month: 'Avr', revenue: 450000, orders: 55 },
    { month: 'Mai', revenue: 520000, orders: 62 },
    { month: 'Juin', revenue: 480000, orders: 58 },
  ],
}

const mockClients: Client[] = [
  {
    id: 1,
    name: 'TechCorp SARL',
    email: 'contact@techcorp.com',
    phone: '+33 1 23 45 67 89',
    company: 'TechCorp SARL',
    address: '123 Rue de la Tech, 75001 Paris',
    status: 'actif',
    lastOrder: '2024-07-15',
    totalSpent: 125000,
    createdAt: '2023-01-15',
  },
  {
    id: 2,
    name: 'Digital Solutions',
    email: 'info@digitalsol.com',
    phone: '+33 1 98 76 54 32',
    company: 'Digital Solutions SAS',
    address: '456 Avenue Digital, 69000 Lyon',
    status: 'actif',
    lastOrder: '2024-07-14',
    totalSpent: 85000,
    createdAt: '2023-03-22',
  },
  {
    id: 3,
    name: 'Innovation Ltd',
    email: 'hello@innovation.com',
    phone: '+33 4 11 22 33 44',
    company: 'Innovation Ltd',
    address: '789 Boulevard Innovation, 13000 Marseille',
    status: 'nouveau',
    lastOrder: '2024-07-13',
    totalSpent: 15000,
    createdAt: '2024-07-01',
  },
  {
    id: 4,
    name: 'StartupXYZ',
    email: 'team@startupxyz.com',
    phone: '+33 2 55 66 77 88',
    company: 'StartupXYZ',
    address: '321 Rue Startup, 44000 Nantes',
    status: 'inactif',
    lastOrder: '2024-05-20',
    totalSpent: 45000,
    createdAt: '2023-08-10',
  },
  {
    id: 5,
    name: 'Enterprise Corp',
    email: 'contact@enterprise.com',
    phone: '+33 3 99 88 77 66',
    company: 'Enterprise Corp',
    address: '654 Place Enterprise, 67000 Strasbourg',
    status: 'actif',
    lastOrder: '2024-07-12',
    totalSpent: 200000,
    createdAt: '2022-11-05',
  },
]

const mockQuotes: Quote[] = [
  {
    id: 'DEV-2024-001',
    client: 'TechCorp SARL',
    amount: 15000,
    status: 'en_attente',
    date: '2024-07-15',
    validity: '2024-08-15',
  },
  {
    id: 'DEV-2024-002',
    client: 'Digital Solutions',
    amount: 8500,
    status: 'accepte',
    date: '2024-07-14',
    validity: '2024-08-14',
  },
  {
    id: 'DEV-2024-003',
    client: 'Innovation Ltd',
    amount: 22000,
    status: 'refuse',
    date: '2024-07-13',
    validity: '2024-08-13',
  },
]

const mockOrders: Order[] = [
  {
    id: 'CMD-2024-001',
    client: 'Digital Solutions',
    amount: 8500,
    status: 'en_cours',
    date: '2024-07-15',
    delivery: '2024-07-25',
  },
  {
    id: 'CMD-2024-002',
    client: 'TechCorp SARL',
    amount: 12500,
    status: 'livre',
    date: '2024-07-14',
    delivery: '2024-07-20',
  },
  {
    id: 'CMD-2024-003',
    client: 'StartupXYZ',
    amount: 5500,
    status: 'annule',
    date: '2024-07-13',
    delivery: '2024-07-23',
  },
]

// Sales store using Composition API
const metrics = ref<SalesMetrics>(mockMetrics)
const clients = ref<Client[]>(mockClients)
const recentQuotes = ref<Quote[]>(mockQuotes)
const recentOrders = ref<Order[]>(mockOrders)

export const useSalesStore = () => {
  // Client management methods
  const addClient = (
    clientData: Omit<Client, 'id' | 'createdAt' | 'totalSpent' | 'status'>,
  ): void => {
    const newClient: Client = {
      ...clientData,
      id: Date.now(), // Simple ID generation for demo
      createdAt: new Date().toISOString().split('T')[0],
      totalSpent: 0,
      status: 'nouveau',
    }
    clients.value.push(newClient)
  }

  const updateClient = (id: number, clientData: Partial<Client>): void => {
    const index = clients.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      clients.value[index] = { ...clients.value[index], ...clientData }
    }
  }

  const deleteClient = (id: number): void => {
    const index = clients.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      clients.value.splice(index, 1)
    }
  }

  const getClientById = (id: number): Client | undefined => {
    return clients.value.find((c) => c.id === id)
  }

  return {
    // State
    metrics,
    clients,
    recentQuotes,
    recentOrders,
    // Actions
    addClient,
    updateClient,
    deleteClient,
    getClientById,
  }
}
