import { ref, reactive } from 'vue'
import type { 
  SalesMetrics, 
  Client, 
  Quote, 
  Order, 
  Invoice, 
  SupplierOffer,
  QuoteFormData,
  OrderFormData,
  InvoiceFormData,
  QuoteItem,
  OrderItem,
  InvoiceItem
} from '@/types'

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
    { month: 'Juin', revenue: 480000, orders: 58 }
  ]
}

const mockClients: Client[] = [
  {
    id: 1,
    name: "TechCorp SARL",
    email: "contact@techcorp.com",
    phone: "+33 1 23 45 67 89",
    company: "TechCorp SARL",
    address: "123 Rue de la Tech, 75001 Paris",
    status: "actif",
    lastOrder: "2024-07-15",
    totalSpent: 125000,
    createdAt: "2023-01-15"
  },
  {
    id: 2,
    name: "Digital Solutions",
    email: "info@digitalsol.com",
    phone: "+33 1 98 76 54 32",
    company: "Digital Solutions SAS",
    address: "456 Avenue Digital, 69000 Lyon",
    status: "actif",
    lastOrder: "2024-07-14",
    totalSpent: 85000,
    createdAt: "2023-03-22"
  },
  {
    id: 3,
    name: "Innovation Ltd",
    email: "hello@innovation.com",
    phone: "+33 4 11 22 33 44",
    company: "Innovation Ltd",
    address: "789 Boulevard Innovation, 13000 Marseille",
    status: "nouveau",
    lastOrder: "2024-07-13",
    totalSpent: 15000,
    createdAt: "2024-07-01"
  },
  {
    id: 4,
    name: "StartupXYZ",
    email: "team@startupxyz.com",
    phone: "+33 2 55 66 77 88",
    company: "StartupXYZ",
    address: "321 Rue Startup, 44000 Nantes",
    status: "inactif",
    lastOrder: "2024-05-20",
    totalSpent: 45000,
    createdAt: "2023-08-10"
  },
  {
    id: 5,
    name: "Enterprise Corp",
    email: "contact@enterprise.com",
    phone: "+33 3 99 88 77 66",
    company: "Enterprise Corp",
    address: "654 Place Enterprise, 67000 Strasbourg",
    status: "actif",
    lastOrder: "2024-07-12",
    totalSpent: 200000,
    createdAt: "2022-11-05"
  }
]

const mockQuotes: Quote[] = [
  {
    id: 'DEV-2024-001',
    clientId: 1,
    client: "TechCorp SARL",
    amount: 15000,
    status: "en_attente",
    date: "2024-07-15",
    validity: "2024-08-15",
    totalHT: 12500,
    totalTTC: 15000,
    tva: 2500,
    margin: 25,
    createdBy: "Gedeon RO",
    notes: "Projet de développement application mobile",
    items: [
      {
        id: "item1",
        productName: "Développement Mobile App",
        description: "Application mobile iOS/Android",
        quantity: 1,
        unitPrice: 12500,
        totalPrice: 12500,
        supplierPrice: 9000,
        margin: 38.9
      }
    ]
  },
  {
    id: 'DEV-2024-002',
    clientId: 2,
    client: "Digital Solutions",
    amount: 8500,
    status: "accepte",
    date: "2024-07-14",
    validity: "2024-08-14",
    totalHT: 7083.33,
    totalTTC: 8500,
    tva: 1416.67,
    margin: 20,
    createdBy: "Gedeon RO",
    notes: "Site web e-commerce",
    items: [
      {
        id: "item2",
        productName: "Site Web E-commerce",
        description: "Développement site e-commerce complet",
        quantity: 1,
        unitPrice: 7083.33,
        totalPrice: 7083.33,
        supplierPrice: 5500,
        margin: 28.8
      }
    ]
  },
  {
    id: 'DEV-2024-003',
    clientId: 3,
    client: "Innovation Ltd",
    amount: 22000,
    status: "refuse",
    date: "2024-07-13",
    validity: "2024-08-13",
    totalHT: 18333.33,
    totalTTC: 22000,
    tva: 3666.67,
    margin: 30,
    createdBy: "Gedeon RO",
    notes: "Système de gestion intégré",
    items: [
      {
        id: "item3",
        productName: "ERP Personnalisé",
        description: "Système de gestion sur mesure",
        quantity: 1,
        unitPrice: 18333.33,
        totalPrice: 18333.33,
        supplierPrice: 13000,
        margin: 41
      }
    ]
  }
]

const mockOrders: Order[] = [
  {
    id: 'CMD-2024-001',
    clientId: 2,
    client: "Digital Solutions",
    quoteId: 'DEV-2024-002',
    amount: 8500,
    status: "en_cours",
    date: "2024-07-15",
    delivery: "2024-07-25",
    deliveryAddress: "456 Avenue Digital, 69000 Lyon",
    notes: "Livraison urgente demandée",
    items: [
      {
        id: "order_item1",
        productName: "Site Web E-commerce",
        description: "Développement site e-commerce complet",
        quantity: 1,
        unitPrice: 7083.33,
        totalPrice: 7083.33,
        delivered: 0
      }
    ]
  },
  {
    id: 'CMD-2024-002',
    clientId: 1,
    client: "TechCorp SARL",
    amount: 12500,
    status: "livre",
    date: "2024-07-14",
    delivery: "2024-07-20",
    deliveryAddress: "123 Rue de la Tech, 75001 Paris",
    trackingNumber: "TRK-789456",
    items: [
      {
        id: "order_item2",
        productName: "Maintenance Serveur",
        description: "Maintenance préventive serveurs",
        quantity: 1,
        unitPrice: 12500,
        totalPrice: 12500,
        delivered: 1
      }
    ]
  },
  {
    id: 'CMD-2024-003',
    clientId: 4,
    client: "StartupXYZ",
    amount: 5500,
    status: "annule",
    date: "2024-07-13",
    delivery: "2024-07-23",
    notes: "Annulé par le client",
    items: [
      {
        id: "order_item3",
        productName: "Consultation IT",
        description: "Audit et recommandations",
        quantity: 1,
        unitPrice: 5500,
        totalPrice: 5500,
        delivered: 0
      }
    ]
  }
]

const mockInvoices: Invoice[] = [
  {
    id: 'FACT-2024-001',
    clientId: 1,
    client: "TechCorp SARL",
    orderId: 'CMD-2024-002',
    type: "definitive",
    amount: 15000,
    status: "payee",
    date: "2024-07-21",
    dueDate: "2024-08-21",
    totalHT: 12500,
    totalTTC: 15000,
    tva: 2500,
    paymentTerms: "30 jours net",
    items: [
      {
        id: "inv_item1",
        productName: "Maintenance Serveur",
        description: "Maintenance préventive serveurs",
        quantity: 1,
        unitPrice: 12500,
        totalPrice: 12500
      }
    ]
  },
  {
    id: 'FACT-2024-002',
    clientId: 2,
    client: "Digital Solutions",
    type: "acompte",
    amount: 4250,
    status: "payee",
    date: "2024-07-16",
    dueDate: "2024-08-16",
    totalHT: 3541.67,
    totalTTC: 4250,
    tva: 708.33,
    acompteAmount: 4250,
    remainingAmount: 4250,
    paymentTerms: "Acompte 50%",
    items: [
      {
        id: "inv_item2",
        productName: "Site Web E-commerce (Acompte)",
        description: "Acompte 50% développement site",
        quantity: 1,
        unitPrice: 3541.67,
        totalPrice: 3541.67
      }
    ]
  }
]

const mockSupplierOffers: SupplierOffer[] = [
  {
    id: 'OFF-2024-001',
    supplierId: 1,
    supplier: "DevTeam Pro",
    productName: "Développement Mobile",
    description: "Application native iOS/Android",
    price: 9000,
    deliveryTime: 21,
    warranty: "12 mois",
    validUntil: "2024-08-15",
    status: "selected",
    createdAt: "2024-07-10"
  },
  {
    id: 'OFF-2024-002',
    supplierId: 2,
    supplier: "WebCraft Solutions",
    productName: "Site E-commerce",
    description: "Plateforme e-commerce complète",
    price: 5500,
    deliveryTime: 14,
    warranty: "6 mois",
    validUntil: "2024-08-20",
    status: "selected",
    createdAt: "2024-07-12"
  }
]

// Sales store using Composition API
const metrics = ref<SalesMetrics>(mockMetrics)
const clients = ref<Client[]>(mockClients)
const quotes = ref<Quote[]>(mockQuotes)
const orders = ref<Order[]>(mockOrders)
const invoices = ref<Invoice[]>(mockInvoices)
const supplierOffers = ref<SupplierOffer[]>(mockSupplierOffers)

export const useSalesStore = () => {
  // Utility functions
  const generateId = (prefix: string): string => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `${prefix}-${new Date().getFullYear()}-${String(random).padStart(3, '0')}`
  }

  const calculateTotals = (items: Array<{ unitPrice: number; quantity: number }>) => {
    const totalHT = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
    const tva = totalHT * 0.20 // 20% TVA
    const totalTTC = totalHT + tva
    return { totalHT, tva, totalTTC }
  }

  // Client management methods
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'totalSpent' | 'status'>): void => {
    const newClient: Client = {
      ...clientData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      totalSpent: 0,
      status: 'nouveau'
    }
    clients.value.push(newClient)
  }

  const updateClient = (id: number, clientData: Partial<Client>): void => {
    const index = clients.value.findIndex(c => c.id === id)
    if (index !== -1) {
      clients.value[index] = { ...clients.value[index], ...clientData }
    }
  }

  const deleteClient = (id: number): void => {
    const index = clients.value.findIndex(c => c.id === id)
    if (index !== -1) {
      clients.value.splice(index, 1)
    }
  }

  const getClientById = (id: number): Client | undefined => {
    return clients.value.find(c => c.id === id)
  }

  // Quote management methods
  const addQuote = (quoteData: QuoteFormData): Quote => {
    const client = getClientById(quoteData.clientId)
    if (!client) throw new Error('Client not found')

    const itemsWithIds: QuoteItem[] = quoteData.items.map(item => ({
      ...item,
      id: `item_${Date.now()}_${Math.random()}`,
      totalPrice: item.unitPrice * item.quantity
    }))

    const totals = calculateTotals(itemsWithIds)

    const newQuote: Quote = {
      id: generateId('DEV'),
      clientId: quoteData.clientId,
      client: client.company,
      date: new Date().toISOString().split('T')[0],
      validity: quoteData.validity,
      items: itemsWithIds,
      notes: quoteData.notes,
      status: 'en_attente',
      createdBy: 'Gedeon RO',
      margin: 25, // Default margin
      amount: totals.totalTTC,
      ...totals
    }

    quotes.value.push(newQuote)
    return newQuote
  }

  const updateQuote = (id: string, quoteData: Partial<Quote>): void => {
    const index = quotes.value.findIndex(q => q.id === id)
    if (index !== -1) {
      quotes.value[index] = { ...quotes.value[index], ...quoteData }
    }
  }

  const deleteQuote = (id: string): void => {
    const index = quotes.value.findIndex(q => q.id === id)
    if (index !== -1) {
      quotes.value.splice(index, 1)
    }
  }

  const getQuoteById = (id: string): Quote | undefined => {
    return quotes.value.find(q => q.id === id)
  }

  // Order management methods
  const convertQuoteToOrder = (quoteId: string, deliveryDate: string): Order => {
    const quote = getQuoteById(quoteId)
    if (!quote) throw new Error('Quote not found')

    const client = getClientById(quote.clientId)
    if (!client) throw new Error('Client not found')

    const orderItems: OrderItem[] = quote.items.map(item => ({
      id: `order_${Date.now()}_${Math.random()}`,
      productName: item.productName,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      delivered: 0
    }))

    const newOrder: Order = {
      id: generateId('CMD'),
      clientId: quote.clientId,
      client: quote.client,
      quoteId: quote.id,
      amount: quote.amount,
      status: 'en_preparation',
      date: new Date().toISOString().split('T')[0],
      delivery: deliveryDate,
      deliveryAddress: client.address,
      items: orderItems
    }

    orders.value.push(newOrder)
    
    // Update quote status
    updateQuote(quoteId, { status: 'accepte' })
    
    return newOrder
  }

  const addOrder = (orderData: OrderFormData): Order => {
    const client = getClientById(orderData.clientId)
    if (!client) throw new Error('Client not found')

    const itemsWithIds: OrderItem[] = orderData.items.map(item => ({
      ...item,
      id: `order_${Date.now()}_${Math.random()}`,
      totalPrice: item.unitPrice * item.quantity,
      delivered: 0
    }))

    const amount = itemsWithIds.reduce((sum, item) => sum + item.totalPrice, 0)

    const newOrder: Order = {
      id: generateId('CMD'),
      clientId: orderData.clientId,
      client: client.company,
      quoteId: orderData.quoteId,
      amount: amount * 1.20, // Include TVA
      status: 'en_preparation',
      date: new Date().toISOString().split('T')[0],
      delivery: orderData.delivery,
      deliveryAddress: orderData.deliveryAddress || client.address,
      notes: orderData.notes,
      items: itemsWithIds
    }

    orders.value.push(newOrder)
    return newOrder
  }

  const updateOrder = (id: string, orderData: Partial<Order>): void => {
    const index = orders.value.findIndex(o => o.id === id)
    if (index !== -1) {
      orders.value[index] = { ...orders.value[index], ...orderData }
    }
  }

  const deleteOrder = (id: string): void => {
    const index = orders.value.findIndex(o => o.id === id)
    if (index !== -1) {
      orders.value.splice(index, 1)
    }
  }

  const getOrderById = (id: string): Order | undefined => {
    return orders.value.find(o => o.id === id)
  }

  // Invoice management methods
  const addInvoice = (invoiceData: InvoiceFormData): Invoice => {
    const client = getClientById(invoiceData.clientId)
    if (!client) throw new Error('Client not found')

    const itemsWithIds: InvoiceItem[] = invoiceData.items.map(item => ({
      ...item,
      id: `inv_${Date.now()}_${Math.random()}`,
      totalPrice: item.unitPrice * item.quantity
    }))

    const totals = calculateTotals(itemsWithIds)

    const newInvoice: Invoice = {
      id: generateId('FACT'),
      clientId: invoiceData.clientId,
      client: client.company,
      orderId: invoiceData.orderId,
      type: invoiceData.type,
      amount: totals.totalTTC,
      status: 'emise',
      date: new Date().toISOString().split('T')[0],
      dueDate: invoiceData.dueDate,
      items: itemsWithIds,
      notes: invoiceData.notes,
      paymentTerms: invoiceData.paymentTerms,
      ...totals
    }

    // Calculate acompte/remaining amounts for acompte invoices
    if (invoiceData.type === 'acompte') {
      newInvoice.acompteAmount = totals.totalTTC
      // If there's an order, calculate remaining amount
      if (invoiceData.orderId) {
        const order = getOrderById(invoiceData.orderId)
        if (order) {
          newInvoice.remainingAmount = order.amount - totals.totalTTC
        }
      }
    }

    invoices.value.push(newInvoice)
    return newInvoice
  }

  const updateInvoice = (id: string, invoiceData: Partial<Invoice>): void => {
    const index = invoices.value.findIndex(i => i.id === id)
    if (index !== -1) {
      invoices.value[index] = { ...invoices.value[index], ...invoiceData }
    }
  }

  const deleteInvoice = (id: string): void => {
    const index = invoices.value.findIndex(i => i.id === id)
    if (index !== -1) {
      invoices.value.splice(index, 1)
    }
  }

  const getInvoiceById = (id: string): Invoice | undefined => {
    return invoices.value.find(i => i.id === id)
  }

  // Computed properties for recent data
  const recentQuotes = quotes.value.slice(-3)
  const recentOrders = orders.value.slice(-3)

  return {
    // State
    metrics,
    clients,
    quotes,
    orders,
    invoices,
    supplierOffers,
    recentQuotes,
    recentOrders,
    // Client actions
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    // Quote actions
    addQuote,
    updateQuote,
    deleteQuote,
    getQuoteById,
    // Order actions
    convertQuoteToOrder,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrderById,
    // Invoice actions
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceById,
    // Utilities
    calculateTotals
  }
}



