// Types and interfaces for the ERP application

export interface User {
  id: number
  name: string
  email: string
  role: string
  avatar: string
}

export interface Client {
  id: number
  name: string
  email: string
  phone?: string
  company: string
  address?: string
  status: 'actif' | 'nouveau' | 'inactif'
  lastOrder: string
  totalSpent: number
  createdAt: string
}

export interface SalesMetrics {
  totalSales: number
  salesThisMonth: number
  totalOrders: number
  pendingQuotes: number
  totalClients: number
  salesTrend: number
  ordersTrend: number
  clientsTrend: number
  monthlyRevenue: MonthlyRevenue[]
}

export interface MonthlyRevenue {
  month: string
  revenue: number
  orders: number
}

export interface Quote {
  id: string
  client: string
  amount: number
  status: 'en_attente' | 'accepte' | 'refuse'
  date: string
  validity: string
}

export interface Order {
  id: string
  client: string
  amount: number
  status: 'en_cours' | 'livre' | 'annule'
  date: string
  delivery: string
}

export interface AuthResult {
  success: boolean
  error?: string
}

export interface MetricCardProps {
  title: string
  value: string | number
  trend?: number
  icon: string
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger'
  description?: string
}
