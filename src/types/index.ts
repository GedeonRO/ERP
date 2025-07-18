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
  clientId: number
  client: string
  amount: number
  status: 'en_attente' | 'accepte' | 'refuse' | 'expire'
  date: string
  validity: string
  items: QuoteItem[]
  notes?: string
  createdBy: string
  margin: number
  totalHT: number
  totalTTC: number
  tva: number
}

export interface QuoteItem {
  id: string
  productName: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  supplierPrice?: number
  margin?: number
}

export interface Order {
  id: string
  clientId: number
  client: string
  quoteId?: string
  amount: number
  status: 'en_cours' | 'livre' | 'annule' | 'en_preparation'
  date: string
  delivery: string
  items: OrderItem[]
  notes?: string
  trackingNumber?: string
  deliveryAddress?: string
}

export interface OrderItem {
  id: string
  productName: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  delivered?: number
}

export interface Invoice {
  id: string
  clientId: number
  client: string
  orderId?: string
  type: 'proforma' | 'acompte' | 'definitive' | 'echeancier'
  amount: number
  status: 'emise' | 'payee' | 'en_attente' | 'en_retard'
  date: string
  dueDate: string
  items: InvoiceItem[]
  notes?: string
  totalHT: number
  totalTTC: number
  tva: number
  acompteAmount?: number
  remainingAmount?: number
  paymentTerms?: string
}

export interface InvoiceItem {
  id: string
  productName: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Supplier {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  contact: string
  rating: number
  status: 'actif' | 'inactif'
}

export interface SupplierOffer {
  id: string
  supplierId: number
  supplier: string
  productName: string
  description: string
  price: number
  deliveryTime: number
  warranty: string
  validUntil: string
  status: 'active' | 'selected' | 'rejected'
  createdAt: string
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

// Form interfaces
export interface QuoteFormData {
  clientId: number
  validity: string
  notes?: string
  items: Omit<QuoteItem, 'id' | 'totalPrice'>[]
}

export interface OrderFormData {
  clientId: number
  quoteId?: string
  delivery: string
  notes?: string
  deliveryAddress?: string
  items: Omit<OrderItem, 'id' | 'totalPrice'>[]
}

export interface InvoiceFormData {
  clientId: number
  orderId?: string
  type: Invoice['type']
  dueDate: string
  notes?: string
  paymentTerms?: string
  items: Omit<InvoiceItem, 'id' | 'totalPrice'>[]
}
