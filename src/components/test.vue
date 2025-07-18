<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neo Start Technology - ERP Dashboard</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://unpkg.com/vue-router@4/dist/vue-router.global.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/chart.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#14A800',
                        secondary: '#034C53',
                        accent: '#3B82F6',
                        success: '#10B981',
                        warning: '#F59E0B',
                        danger: '#EF4444'
                    }
                }
            }
        }
    </script>
    <style>
        [v-cloak] { display: none; }
        .sidebar-enter-active, .sidebar-leave-active {
            transition: transform 0.3s ease;
        }
        .sidebar-enter-from, .sidebar-leave-to {
            transform: translateX(-100%);
        }
    </style>
</head>
<body class="bg-gray-50">
    <div id="app" v-cloak></div>

    <script>
        const { createApp, ref, reactive, computed, onMounted, watch } = Vue;
        const { createRouter, createWebHashHistory } = VueRouter;

        // ============= TYPES & INTERFACES =============
        // Simulate TypeScript interfaces with JSDoc comments

        /**
         * @typedef {Object} User
         * @property {number} id
         * @property {string} name
         * @property {string} email
         * @property {string} role
         * @property {string} avatar
         */

        /**
         * @typedef {Object} Client
         * @property {number} id
         * @property {string} name
         * @property {string} email
         * @property {string} phone
         * @property {string} company
         * @property {string} address
         * @property {string} status
         * @property {string} lastOrder
         * @property {number} totalSpent
         * @property {string} createdAt
         */

        /**
         * @typedef {Object} SalesMetrics
         * @property {number} totalSales
         * @property {number} salesThisMonth
         * @property {number} totalOrders
         * @property {number} pendingQuotes
         * @property {number} totalClients
         * @property {number} salesTrend
         * @property {number} ordersTrend
         * @property {number} clientsTrend
         */

        // ============= MOCK DATA =============
        const mockData = {
            user: {
                id: 1,
                name: "Gedeon RO",
                email: "gedeon@neostart.com",
                role: "Administrateur",
                avatar: "https://ui-avatars.com/api/?name=Gedeon+RO&background=14A800&color=fff"
            },
            salesMetrics: {
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
            },
            clients: [
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
            ],
            recentQuotes: [
                {
                    id: 'DEV-2024-001',
                    client: "TechCorp SARL",
                    amount: 15000,
                    status: "en_attente",
                    date: "2024-07-15",
                    validity: "2024-08-15"
                },
                {
                    id: 'DEV-2024-002',
                    client: "Digital Solutions",
                    amount: 8500,
                    status: "accepte",
                    date: "2024-07-14",
                    validity: "2024-08-14"
                },
                {
                    id: 'DEV-2024-003',
                    client: "Innovation Ltd",
                    amount: 22000,
                    status: "refuse",
                    date: "2024-07-13",
                    validity: "2024-08-13"
                }
            ],
            recentOrders: [
                {
                    id: 'CMD-2024-001',
                    client: "Digital Solutions",
                    amount: 8500,
                    status: "en_cours",
                    date: "2024-07-15",
                    delivery: "2024-07-25"
                },
                {
                    id: 'CMD-2024-002',
                    client: "TechCorp SARL",
                    amount: 12500,
                    status: "livre",
                    date: "2024-07-14",
                    delivery: "2024-07-20"
                },
                {
                    id: 'CMD-2024-003',
                    client: "StartupXYZ",
                    amount: 5500,
                    status: "annule",
                    date: "2024-07-13",
                    delivery: "2024-07-23"
                }
            ]
        };

        // ============= STORES =============
        const authStore = reactive({
            isAuthenticated: false,
            user: null,
            
            login(email, password) {
                // Simulate authentication
                if (email === "admin@neostart.com" && password === "admin123") {
                    this.isAuthenticated = true;
                    this.user = mockData.user;
                    localStorage.setItem('auth_token', 'mock_token_123');
                    return { success: true };
                }
                return { success: false, error: "Identifiants incorrects" };
            },
            
            logout() {
                this.isAuthenticated = false;
                this.user = null;
                localStorage.removeItem('auth_token');
            },
            
            checkAuth() {
                const token = localStorage.getItem('auth_token');
                if (token) {
                    this.isAuthenticated = true;
                    this.user = mockData.user;
                }
            }
        });

        const salesStore = reactive({
            metrics: mockData.salesMetrics,
            clients: mockData.clients,
            recentQuotes: mockData.recentQuotes,
            recentOrders: mockData.recentOrders,
            
            // Client management methods
            addClient(client) {
                const newClient = {
                    ...client,
                    id: Date.now(),
                    createdAt: new Date().toISOString().split('T')[0],
                    totalSpent: 0,
                    status: 'nouveau'
                };
                this.clients.push(newClient);
            },
            
            updateClient(id, clientData) {
                const index = this.clients.findIndex(c => c.id === id);
                if (index !== -1) {
                    this.clients[index] = { ...this.clients[index], ...clientData };
                }
            },
            
            deleteClient(id) {
                const index = this.clients.findIndex(c => c.id === id);
                if (index !== -1) {
                    this.clients.splice(index, 1);
                }
            },
            
            getClientById(id) {
                return this.clients.find(c => c.id === id);
            }
        });

        // ============= SHARED COMPONENTS =============
        
        // MetricCard component
        const MetricCard = {
            props: {
                title: String,
                value: [String, Number],
                trend: Number,
                icon: String,
                color: {
                    type: String,
                    default: 'primary'
                },
                description: String
            },
            template: `
                <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <div :class="iconClasses">
                                <i :class="icon" class="text-white text-xl"></i>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-600">{{ title }}</p>
                                <p class="text-2xl font-bold text-gray-900">{{ formattedValue }}</p>
                                <p v-if="description" class="text-xs text-gray-500 mt-1">{{ description }}</p>
                            </div>
                        </div>
                        <div v-if="trend !== undefined" :class="trendClasses">
                            <span class="text-xs font-medium">
                                {{ trend > 0 ? '+' : '' }}{{ trend.toFixed(1) }}%
                            </span>
                        </div>
                    </div>
                </div>
            `,
            computed: {
                formattedValue() {
                    if (typeof this.value === 'number' && this.value > 1000) {
                        return new Intl.NumberFormat('fr-FR').format(this.value);
                    }
                    return this.value;
                },
                iconClasses() {
                    const baseClasses = 'p-3 rounded-lg';
                    const colorMap = {
                        primary: 'bg-primary bg-opacity-10',
                        accent: 'bg-accent bg-opacity-10',
                        success: 'bg-success bg-opacity-10',
                        warning: 'bg-warning bg-opacity-10'
                    };
                    return `${baseClasses} ${colorMap[this.color] || colorMap.primary}`;
                },
                trendClasses() {
                    const baseClasses = 'flex items-center px-2 py-1 rounded-full text-xs';
                    if (this.trend > 0) {
                        return `${baseClasses} bg-green-100 text-green-600`;
                    } else if (this.trend < 0) {
                        return `${baseClasses} bg-red-100 text-red-600`;
                    } else {
                        return `${baseClasses} bg-gray-100 text-gray-600`;
                    }
                }
            }
        };

        // ============= LAYOUT COMPONENTS =============
        
        // AppSidebar component
        const AppSidebar = {
            props: {
                isOpen: Boolean
            },
            emits: ['close'],
            template: `
                <div class="fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto">
                    <!-- Mobile overlay -->
                    <div v-if="isOpen" @click="$emit('close')" 
                         class="fixed inset-0 bg-black bg-opacity-50 lg:hidden"></div>
                    
                    <!-- Sidebar -->
                    <aside :class="sidebarClasses">
                        <div class="flex flex-col h-full">
                            <!-- Logo -->
                            <div class="flex items-center justify-between h-16 px-6 bg-primary">
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                        <span class="text-primary font-bold text-sm">NS</span>
                                    </div>
                                    <span class="text-white font-semibold text-lg">Neo Start Tech</span>
                                </div>
                                <button @click="$emit('close')" class="lg:hidden text-white">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            
                            <!-- Navigation -->
                            <nav class="flex-1 px-4 py-6 space-y-2">
                                <router-link 
                                    to="/dashboard" 
                                    class="nav-link"
                                    active-class="nav-link-active"
                                >
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z"></path>
                                    </svg>
                                    Tableau de bord
                                </router-link>
                                
                                <router-link 
                                    to="/clients" 
                                    class="nav-link"
                                    active-class="nav-link-active"
                                >
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                                    </svg>
                                    Clients
                                </router-link>
                                
                                <div class="nav-section">
                                    <span class="nav-section-title">Ventes</span>
                                    <router-link to="/quotes" class="nav-link ml-4">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        Devis
                                    </router-link>
                                    <router-link to="/orders" class="nav-link ml-4">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                        </svg>
                                        Commandes
                                    </router-link>
                                    <router-link to="/invoices" class="nav-link ml-4">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"></path>
                                        </svg>
                                        Factures
                                    </router-link>
                                </div>
                                
                                <div class="nav-section">
                                    <span class="nav-section-title">Fournisseurs</span>
                                    <router-link to="/suppliers" class="nav-link ml-4">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0v-3.5a1.5 1.5 0 00-1.5-1.5h0a1.5 1.5 0 00-1.5 1.5V21"></path>
                                        </svg>
                                        Offres Fournisseurs
                                    </router-link>
                                </div>
                            </nav>
                            
                            <!-- User info -->
                            <div class="p-4 border-t border-gray-200">
                                <div class="flex items-center space-x-3">
                                    <img :src="authStore.user?.avatar" :alt="authStore.user?.name" 
                                         class="w-8 h-8 rounded-full">
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900 truncate">{{ authStore.user?.name }}</p>
                                        <p class="text-xs text-gray-500">{{ authStore.user?.role }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            `,
            computed: {
                sidebarClasses() {
                    const baseClasses = 'bg-white shadow-lg border-r border-gray-200 w-64 h-screen flex-shrink-0 transition-transform duration-300 ease-in-out';
                    if (this.isOpen) {
                        return `${baseClasses} transform translate-x-0 fixed lg:relative`;
                    } else {
                        return `${baseClasses} transform -translate-x-full lg:translate-x-0 fixed lg:relative`;
                    }
                }
            }
        };

        // AppHeader component
        const AppHeader = {
            emits: ['toggle-sidebar'],
            template: `
                <header class="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
                    <div class="flex items-center space-x-4">
                        <button @click="$emit('toggle-sidebar')" 
                                class="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                        <h1 class="text-xl font-semibold text-gray-900">{{ pageTitle }}</h1>
                    </div>
                    
                    <div class="flex items-center space-x-4">
                        <!-- Search bar -->
                        <div class="hidden md:block relative">
                            <input type="text" 
                                   placeholder="Rechercher..." 
                                   class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                            <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        
                        <!-- Notifications -->
                        <button class="p-2 text-gray-400 hover:text-gray-600 relative">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5-5-5 5h5zm0 0v1a3 3 0 01-6 0v-1m6 0H9"></path>
                            </svg>
                            <span class="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                        </button>
                        
                        <!-- User menu -->
                        <div class="relative">
                            <button @click="showUserMenu = !showUserMenu" 
                                    class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                                <img :src="authStore.user?.avatar" :alt="authStore.user?.name" 
                                     class="w-8 h-8 rounded-full">
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            
                            <!-- Dropdown menu -->
                            <div v-if="showUserMenu" 
                                 class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profil</a>
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Paramètres</a>
                                <div class="border-t border-gray-100"></div>
                                <button @click="logout" 
                                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Déconnexion
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
            `,
            data() {
                return {
                    showUserMenu: false
                };
            },
            computed: {
                pageTitle() {
                    const route = this.$route;
                    const titleMap = {
                        'dashboard': 'Tableau de bord',
                        'clients': 'Gestion des Clients',
                        'client-detail': 'Détail Client',
                        'quotes': 'Devis',
                        'orders': 'Commandes',
                        'invoices': 'Factures',
                        'suppliers': 'Fournisseurs'
                    };
                    return titleMap[route.name] || 'ERP Neo Start Technology';
                }
            },
            methods: {
                logout() {
                    authStore.logout();
                    this.$router.push('/login');
                }
            },
            mounted() {
                // Close user menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (!this.$el.contains(e.target)) {
                        this.showUserMenu = false;
                    }
                });
            }
        };

        // AppLayout component
        const AppLayout = {
            components: {
                AppSidebar,
                AppHeader
            },
            template: `
                <div class="flex h-screen bg-gray-50">
                    <AppSidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
                    <div class="flex-1 flex flex-col min-w-0">
                        <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
                        <main class="flex-1 overflow-auto">
                            <router-view />
                        </main>
                    </div>
                </div>
            `,
            data() {
                return {
                    sidebarOpen: false
                };
            }
        };

        // ============= AUTH COMPONENTS =============
        
        const LoginPage = {
            template: `
                <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
                    <div class="max-w-md w-full mx-4">
                        <div class="bg-white rounded-xl shadow-2xl p-8">
                            <div class="text-center mb-8">
                                <div class="mx-auto h-20 w-20 bg-primary rounded-full flex items-center justify-center mb-4">
                                    <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0v-3.5a1.5 1.5 0 00-1.5-1.5h0a1.5 1.5 0 00-1.5 1.5V21" />
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
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="admin@neostart.com"
                                    >
                                </div>
                                
                                <div class="mb-6">
                                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                                    <input 
                                        id="password" 
                                        v-model="password" 
                                        type="password" 
                                        required 
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="••••••••"
                                    >
                                </div>
                                
                                <div class="flex items-center justify-between mb-6">
                                    <div class="flex items-center">
                                        <input id="remember" v-model="remember" type="checkbox" class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded">
                                        <label for="remember" class="ml-2 block text-sm text-gray-900">Se souvenir de moi</label>
                                    </div>
                                    <a href="#" class="text-sm text-primary hover:text-secondary">Mot de passe oublié ?</a>
                                </div>
                                
                                <button 
                                    type="submit" 
                                    :disabled="loading"
                                    class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
                                >
                                    <span v-if="loading" class="flex items-center">
                                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
            `,
            data() {
                return {
                    email: '',
                    password: '',
                    remember: false,
                    loading: false,
                    error: ''
                };
            },
            methods: {
                async handleLogin() {
                    this.loading = true;
                    this.error = '';
                    
                    // Simulate API call delay
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    const result = authStore.login(this.email, this.password);
                    
                    if (result.success) {
                        this.$router.push('/dashboard');
                    } else {
                        this.error = result.error;
                    }
                    
                    this.loading = false;
                }
            }
        };

        // ============= DASHBOARD COMPONENTS =============
        
        const SalesChart = {
            props: {
                data: Array
            },
            template: `
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">Évolution des Ventes</h3>
                        <div class="flex space-x-2">
                            <button 
                                v-for="period in periods" 
                                :key="period"
                                @click="selectedPeriod = period"
                                :class="[
                                    'px-3 py-1 text-sm rounded-lg transition-colors',
                                    selectedPeriod === period 
                                        ? 'bg-primary text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                ]"
                            >
                                {{ period }}
                            </button>
                        </div>
                    </div>
                    <canvas ref="chart" width="400" height="200"></canvas>
                </div>
            `,
            data() {
                return {
                    selectedPeriod: '6M',
                    periods: ['1M', '3M', '6M', '1A'],
                    chart: null
                };
            },
            mounted() {
                this.initChart();
            },
            watch: {
                data: {
                    handler() {
                        this.updateChart();
                    },
                    deep: true
                }
            },
            methods: {
                initChart() {
                    const ctx = this.$refs.chart.getContext('2d');
                    this.chart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: this.data.map(d => d.month),
                            datasets: [{
                                label: 'Chiffre d\'affaires (€)',
                                data: this.data.map(d => d.revenue),
                                borderColor: '#14A800',
                                backgroundColor: 'rgba(20, 168, 0, 0.1)',
                                borderWidth: 3,
                                fill: true,
                                tension: 0.4
                            }, {
                                label: 'Nombre de commandes',
                                data: this.data.map(d => d.orders),
                                borderColor: '#3B82F6',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                borderWidth: 2,
                                fill: false,
                                yAxisID: 'y1'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'bottom'
                                }
                            },
                            scales: {
                                y: {
                                    type: 'linear',
                                    display: true,
                                    position: 'left',
                                    beginAtZero: true,
                                    ticks: {
                                        callback: function(value) {
                                            return new Intl.NumberFormat('fr-FR', {
                                                style: 'currency',
                                                currency: 'EUR',
                                                minimumFractionDigits: 0
                                            }).format(value);
                                        }
                                    }
                                },
                                y1: {
                                    type: 'linear',
                                    display: true,
                                    position: 'right',
                                    beginAtZero: true,
                                    grid: {
                                        drawOnChartArea: false,
                                    },
                                }
                            }
                        }
                    });
                },
                updateChart() {
                    if (this.chart) {
                        this.chart.data.labels = this.data.map(d => d.month);
                        this.chart.data.datasets[0].data = this.data.map(d => d.revenue);
                        this.chart.data.datasets[1].data = this.data.map(d => d.orders);
                        this.chart.update();
                    }
                }
            }
        };

        const QuickActions = {
            template: `
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                            v-for="action in actions" 
                            :key="action.id"
                            @click="handleAction(action.id)"
                            :class="[
                                'flex items-center p-4 border-2 border-dashed rounded-lg transition-colors',
                                action.color + '-border',
                                'hover:' + action.color + '-bg hover:' + action.color + '-border-solid'
                            ]"
                        >
                            <div :class="['p-2 rounded-lg mr-3', action.color + '-bg']">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="action.icon"></path>
                                </svg>
                            </div>
                            <div class="text-left">
                                <p class="font-medium text-gray-900">{{ action.title }}</p>
                                <p class="text-sm text-gray-500">{{ action.description }}</p>
                            </div>
                        </button>
                    </div>
                </div>
            `,
            data() {
                return {
                    actions: [
                        {
                            id: 'new-client',
                            title: 'Nouveau Client',
                            description: 'Ajouter un client',
                            icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
                            color: 'bg-primary'
                        },
                        {
                            id: 'new-quote',
                            title: 'Nouveau Devis',
                            description: 'Créer un devis',
                            icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                            color: 'bg-accent'
                        },
                        {
                            id: 'new-order',
                            title: 'Nouvelle Commande',
                            description: 'Enregistrer une commande',
                            icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
                            color: 'bg-success'
                        },
                        {
                            id: 'new-invoice',
                            title: 'Nouvelle Facture',
                            description: 'Générer une facture',
                            icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z',
                            color: 'bg-warning'
                        }
                    ]
                };
            },
            methods: {
                handleAction(actionId) {
                    const routeMap = {
                        'new-client': '/clients/new',
                        'new-quote': '/quotes/new',
                        'new-order': '/orders/new',
                        'new-invoice': '/invoices/new'
                    };
                    
                    if (routeMap[actionId]) {
                        this.$router.push(routeMap[actionId]);
                    }
                }
            }
        };

        const RecentActivity = {
            props: {
                quotes: Array,
                orders: Array
            },
            template: `
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
                    
                    <!-- Tabs -->
                    <div class="flex space-x-1 mb-4">
                        <button 
                            v-for="tab in tabs" 
                            :key="tab.id"
                            @click="activeTab = tab.id"
                            :class="[
                                'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                                activeTab === tab.id 
                                    ? 'bg-primary text-white' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            ]"
                        >
                            {{ tab.name }}
                        </button>
                    </div>
                    
                    <!-- Quotes Tab -->
                    <div v-if="activeTab === 'quotes'" class="space-y-3">
                        <div v-for="quote in quotes" :key="quote.id" 
                             class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div class="flex-1">
                                <div class="flex items-center space-x-2">
                                    <span class="font-medium text-gray-900">{{ quote.id }}</span>
                                    <span :class="getStatusBadge(quote.status)">{{ getStatusText(quote.status) }}</span>
                                </div>
                                <p class="text-sm text-gray-600">{{ quote.client }}</p>
                                <p class="text-xs text-gray-500">{{ formatDate(quote.date) }}</p>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold text-gray-900">{{ formatCurrency(quote.amount) }}</p>
                                <p class="text-xs text-gray-500">Validité: {{ formatDate(quote.validity) }}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Orders Tab -->
                    <div v-if="activeTab === 'orders'" class="space-y-3">
                        <div v-for="order in orders" :key="order.id" 
                             class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div class="flex-1">
                                <div class="flex items-center space-x-2">
                                    <span class="font-medium text-gray-900">{{ order.id }}</span>
                                    <span :class="getStatusBadge(order.status)">{{ getStatusText(order.status) }}</span>
                                </div>
                                <p class="text-sm text-gray-600">{{ order.client }}</p>
                                <p class="text-xs text-gray-500">{{ formatDate(order.date) }}</p>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold text-gray-900">{{ formatCurrency(order.amount) }}</p>
                                <p class="text-xs text-gray-500">Livraison: {{ formatDate(order.delivery) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            data() {
                return {
                    activeTab: 'quotes',
                    tabs: [
                        { id: 'quotes', name: 'Devis Récents' },
                        { id: 'orders', name: 'Commandes Récentes' }
                    ]
                };
            },
            methods: {
                getStatusBadge(status) {
                    const badges = {
                        'en_attente': 'px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full',
                        'accepte': 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full',
                        'refuse': 'px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full',
                        'en_cours': 'px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full',
                        'livre': 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full',
                        'annule': 'px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full'
                    };
                    return badges[status] || badges['en_attente'];
                },
                getStatusText(status) {
                    const texts = {
                        'en_attente': 'En attente',
                        'accepte': 'Accepté',
                        'refuse': 'Refusé',
                        'en_cours': 'En cours',
                        'livre': 'Livré',
                        'annule': 'Annulé'
                    };
                    return texts[status] || status;
                },
                formatDate(dateString) {
                    return new Date(dateString).toLocaleDateString('fr-FR');
                },
                formatCurrency(amount) {
                    return new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                    }).format(amount);
                }
            }
        };

        const DashboardPage = {
            components: {
                MetricCard,
                SalesChart,
                QuickActions,
                RecentActivity
            },
            template: `
                <div class="p-6 space-y-6">
                    <!-- Metrics Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            title="Chiffre d'Affaires Total"
                            :value="metrics.totalSales"
                            :trend="metrics.salesTrend"
                            icon="📊"
                            color="primary"
                            description="Revenus depuis le début"
                        />
                        <MetricCard
                            title="Ventes ce Mois"
                            :value="metrics.salesThisMonth"
                            :trend="metrics.salesTrend"
                            icon="💰"
                            color="success"
                            description="Chiffre d'affaires mensuel"
                        />
                        <MetricCard
                            title="Commandes Totales"
                            :value="metrics.totalOrders"
                            :trend="metrics.ordersTrend"
                            icon="📦"
                            color="accent"
                            description="Nombre de commandes"
                        />
                        <MetricCard
                            title="Devis en Attente"
                            :value="metrics.pendingQuotes"
                            :trend="-5.2"
                            icon="📄"
                            color="warning"
                            description="Devis à traiter"
                        />
                    </div>

                    <!-- Charts and Quick Actions Row -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-2">
                            <SalesChart :data="metrics.monthlyRevenue" />
                        </div>
                        <div>
                            <QuickActions />
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <RecentActivity :quotes="salesStore.recentQuotes" :orders="salesStore.recentOrders" />
                </div>
            `,
            computed: {
                metrics() {
                    return salesStore.metrics;
                }
            }
        };

        // ============= CLIENT MANAGEMENT COMPONENTS =============
        
        const ClientForm = {
            props: {
                client: Object,
                mode: {
                    type: String,
                    default: 'create' // create or edit
                }
            },
            emits: ['submit', 'cancel'],
            template: `
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
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="Nom du contact"
                                >
                            </div>
                            
                            <div>
                                <label for="company" class="block text-sm font-medium text-gray-700 mb-1">Entreprise *</label>
                                <input 
                                    id="company"
                                    v-model="form.company" 
                                    type="text" 
                                    required 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="Nom de l'entreprise"
                                >
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
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="contact@entreprise.com"
                                >
                            </div>
                            
                            <div>
                                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                <input 
                                    id="phone"
                                    v-model="form.phone" 
                                    type="tel" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="+33 1 23 45 67 89"
                                >
                            </div>
                        </div>
                        
                        <div>
                            <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                            <textarea 
                                id="address"
                                v-model="form.address" 
                                rows="3" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
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
                                class="px-4 py-2 bg-primary text-white hover:bg-secondary rounded-lg transition-colors"
                            >
                                {{ mode === 'create' ? 'Créer' : 'Modifier' }}
                            </button>
                        </div>
                    </form>
                </div>
            `,
            data() {
                return {
                    form: {
                        name: '',
                        company: '',
                        email: '',
                        phone: '',
                        address: ''
                    }
                };
            },
            watch: {
                client: {
                    immediate: true,
                    handler(newClient) {
                        if (newClient) {
                            this.form = { ...newClient };
                        }
                    }
                }
            },
            methods: {
                handleSubmit() {
                    this.$emit('submit', this.form);
                }
            }
        };

        const ClientsList = {
            components: {
                ClientForm
            },
            template: `
                <div class="p-6 space-y-6">
                    <!-- Header -->
                    <div class="flex justify-between items-center">
                        <h1 class="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
                        <button 
                            @click="showForm = true"
                            class="px-4 py-2 bg-primary text-white hover:bg-secondary rounded-lg transition-colors flex items-center space-x-2"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            <span>Nouveau Client</span>
                        </button>
                    </div>

                    <!-- Stats Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MetricCard
                            title="Total Clients"
                            :value="clients.length"
                            :trend="15.2"
                            icon="👥"
                            color="primary"
                        />
                        <MetricCard
                            title="Clients Actifs"
                            :value="activeClients"
                            :trend="8.3"
                            icon="✅"
                            color="success"
                        />
                        <MetricCard
                            title="Nouveaux ce Mois"
                            :value="newClientsThisMonth"
                            :trend="25.5"
                            icon="🆕"
                            color="accent"
                        />
                    </div>

                    <!-- Client Form Modal -->
                    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div class="bg-white rounded-lg max-w-2xl w-full max-h-full overflow-y-auto">
                            <ClientForm 
                                :client="editingClient"
                                :mode="editingClient ? 'edit' : 'create'"
                                @submit="handleSubmit"
                                @cancel="closeForm"
                            />
                        </div>
                    </div>

                    <!-- Search and Filters -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <div class="flex-1 max-w-lg">
                                <div class="relative">
                                    <input 
                                        v-model="searchQuery"
                                        type="text" 
                                        placeholder="Rechercher un client..." 
                                        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    >
                                    <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                            </div>
                            
                            <div class="flex space-x-2">
                                <select 
                                    v-model="statusFilter"
                                    class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                >
                                    <option value="">Tous les statuts</option>
                                    <option value="actif">Actif</option>
                                    <option value="nouveau">Nouveau</option>
                                    <option value="inactif">Inactif</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Clients Table -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Client
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Statut
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Dépensé
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Dernière Commande
                                        </th>
                                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="client in filteredClients" :key="client.id" class="hover:bg-gray-50">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                <div class="h-10 w-10 flex-shrink-0">
                                                    <div class="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                                                        <span class="text-white font-medium text-sm">
                                                            {{ client.name.charAt(0).toUpperCase() }}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="ml-4">
                                                    <div class="text-sm font-medium text-gray-900">{{ client.name }}</div>
                                                    <div class="text-sm text-gray-500">{{ client.company }}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">{{ client.email }}</div>
                                            <div class="text-sm text-gray-500">{{ client.phone }}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span :class="getStatusBadge(client.status)">
                                                {{ getStatusText(client.status) }}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {{ formatCurrency(client.totalSpent) }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {{ formatDate(client.lastOrder) }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div class="flex justify-end space-x-2">
                                                <button 
                                                    @click="viewClient(client)"
                                                    class="text-primary hover:text-secondary"
                                                    title="Voir détails"
                                                >
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                    </svg>
                                                </button>
                                                <button 
                                                    @click="editClient(client)"
                                                    class="text-accent hover:text-blue-700"
                                                    title="Modifier"
                                                >
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                    </svg>
                                                </button>
                                                <button 
                                                    @click="deleteClient(client.id)"
                                                    class="text-red-600 hover:text-red-800"
                                                    title="Supprimer"
                                                >
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <!-- Empty state -->
                        <div v-if="filteredClients.length === 0" class="text-center py-12">
                            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                            </svg>
                            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun client trouvé</h3>
                            <p class="mt-1 text-sm text-gray-500">
                                {{ searchQuery ? 'Aucun client ne correspond à votre recherche.' : 'Commencez par ajouter un nouveau client.' }}
                            </p>
                            <div class="mt-6">
                                <button 
                                    @click="showForm = true"
                                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary"
                                >
                                    <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                    Nouveau Client
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            components: {
                MetricCard
            },
            data() {
                return {
                    showForm: false,
                    editingClient: null,
                    searchQuery: '',
                    statusFilter: ''
                };
            },
            computed: {
                clients() {
                    return salesStore.clients;
                },
                filteredClients() {
                    let filtered = this.clients;
                    
                    if (this.searchQuery) {
                        const query = this.searchQuery.toLowerCase();
                        filtered = filtered.filter(client => 
                            client.name.toLowerCase().includes(query) ||
                            client.company.toLowerCase().includes(query) ||
                            client.email.toLowerCase().includes(query)
                        );
                    }
                    
                    if (this.statusFilter) {
                        filtered = filtered.filter(client => client.status === this.statusFilter);
                    }
                    
                    return filtered;
                },
                activeClients() {
                    return this.clients.filter(c => c.status === 'actif').length;
                },
                newClientsThisMonth() {
                    const currentMonth = new Date().getMonth();
                    const currentYear = new Date().getFullYear();
                    return this.clients.filter(c => {
                        const createdDate = new Date(c.createdAt);
                        return createdDate.getMonth() === currentMonth && 
                               createdDate.getFullYear() === currentYear;
                    }).length;
                }
            },
            methods: {
                handleSubmit(clientData) {
                    if (this.editingClient) {
                        salesStore.updateClient(this.editingClient.id, clientData);
                    } else {
                        salesStore.addClient(clientData);
                    }
                    this.closeForm();
                },
                closeForm() {
                    this.showForm = false;
                    this.editingClient = null;
                },
                editClient(client) {
                    this.editingClient = client;
                    this.showForm = true;
                },
                viewClient(client) {
                    this.$router.push(`/clients/${client.id}`);
                },
                deleteClient(clientId) {
                    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
                        salesStore.deleteClient(clientId);
                    }
                },
                getStatusBadge(status) {
                    const badges = {
                        'actif': 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
                        'nouveau': 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800',
                        'inactif': 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
                    };
                    return badges[status] || badges['actif'];
                },
                getStatusText(status) {
                    const texts = {
                        'actif': 'Actif',
                        'nouveau': 'Nouveau',
                        'inactif': 'Inactif'
                    };
                    return texts[status] || status;
                },
                formatDate(dateString) {
                    return new Date(dateString).toLocaleDateString('fr-FR');
                },
                formatCurrency(amount) {
                    return new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                    }).format(amount);
                }
            }
        };

        const ClientDetailPage = {
            template: `
                <div class="p-6 space-y-6">
                    <div v-if="client">
                        <!-- Header with client info -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-4">
                                    <div class="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                                        <span class="text-white font-bold text-xl">
                                            {{ client.name.charAt(0).toUpperCase() }}
                                        </span>
                                    </div>
                                    <div>
                                        <h1 class="text-2xl font-bold text-gray-900">{{ client.name }}</h1>
                                        <p class="text-lg text-gray-600">{{ client.company }}</p>
                                        <div class="flex items-center space-x-4 mt-2">
                                            <span :class="getStatusBadge(client.status)">
                                                {{ getStatusText(client.status) }}
                                            </span>
                                            <span class="text-sm text-gray-500">
                                                Client depuis {{ formatDate(client.createdAt) }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex space-x-2">
                                    <button 
                                        @click="$router.push('/clients')"
                                        class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Retour
                                    </button>
                                    <button class="px-4 py-2 bg-primary text-white hover:bg-secondary rounded-lg transition-colors">
                                        Modifier
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Contact info and stats -->
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <!-- Contact Information -->
                            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations de Contact</h3>
                                <div class="space-y-3">
                                    <div class="flex items-center space-x-3">
                                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                        <span class="text-gray-900">{{ client.email }}</span>
                                    </div>
                                    <div class="flex items-center space-x-3">
                                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                        </svg>
                                        <span class="text-gray-900">{{ client.phone || 'Non renseigné' }}</span>
                                    </div>
                                    <div class="flex items-start space-x-3">
                                        <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        <span class="text-gray-900">{{ client.address || 'Non renseignée' }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Stats -->
                            <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <MetricCard
                                    title="Total Dépensé"
                                    :value="client.totalSpent"
                                    icon="💰"
                                    color="success"
                                    description="Montant total des achats"
                                />
                                <MetricCard
                                    title="Dernière Commande"
                                    :value="formatDate(client.lastOrder)"
                                    icon="📦"
                                    color="accent"
                                    description="Date de la dernière commande"
                                />
                            </div>
                        </div>

                        <!-- Tabs for orders, quotes, etc. -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div class="border-b border-gray-200">
                                <nav class="-mb-px flex space-x-8 px-6">
                                    <button 
                                        v-for="tab in tabs" 
                                        :key="tab.id"
                                        @click="activeTab = tab.id"
                                        :class="[
                                            'py-4 px-1 border-b-2 font-medium text-sm',
                                            activeTab === tab.id 
                                                ? 'border-primary text-primary' 
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        ]"
                                    >
                                        {{ tab.name }}
                                    </button>
                                </nav>
                            </div>
                            
                            <div class="p-6">
                                <div v-if="activeTab === 'orders'">
                                    <p class="text-gray-500">Historique des commandes à venir...</p>
                                </div>
                                <div v-if="activeTab === 'quotes'">
                                    <p class="text-gray-500">Historique des devis à venir...</p>
                                </div>
                                <div v-if="activeTab === 'invoices'">
                                    <p class="text-gray-500">Historique des factures à venir...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div v-else class="text-center py-12">
                        <p class="text-gray-500">Client non trouvé</p>
                    </div>
                </div>
            `,
            components: {
                MetricCard
            },
            data() {
                return {
                    activeTab: 'orders',
                    tabs: [
                        { id: 'orders', name: 'Commandes' },
                        { id: 'quotes', name: 'Devis' },
                        { id: 'invoices', name: 'Factures' }
                    ]
                };
            },
            computed: {
                client() {
                    const clientId = parseInt(this.$route.params.id);
                    return salesStore.getClientById(clientId);
                }
            },
            methods: {
                getStatusBadge(status) {
                    const badges = {
                        'actif': 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
                        'nouveau': 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800',
                        'inactif': 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
                    };
                    return badges[status] || badges['actif'];
                },
                getStatusText(status) {
                    const texts = {
                        'actif': 'Actif',
                        'nouveau': 'Nouveau',
                        'inactif': 'Inactif'
                    };
                    return texts[status] || status;
                },
                formatDate(dateString) {
                    return new Date(dateString).toLocaleDateString('fr-FR');
                }
            }
        };

        // ============= PLACEHOLDER PAGES =============
        
        const QuotesPage = {
            template: `
                <div class="p-6">
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Gestion des Devis</h3>
                        <p class="text-gray-500 mb-4">Module de gestion des devis en cours de développement</p>
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p class="text-blue-800 text-sm">
                                Ce module permettra de créer, gérer et suivre tous vos devis.
                                Fonctionnalités à venir : création de devis, suivi des statuts, conversion en commandes.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        const OrdersPage = {
            template: `
                <div class="p-6">
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        </svg>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Gestion des Commandes</h3>
                        <p class="text-gray-500 mb-4">Module de gestion des commandes en cours de développement</p>
                        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p class="text-green-800 text-sm">
                                Ce module permettra de gérer toutes vos commandes client.
                                Fonctionnalités à venir : suivi des commandes, gestion des livraisons, statuts en temps réel.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        const InvoicesPage = {
            template: `
                <div class="p-6">
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"></path>
                        </svg>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Gestion des Factures</h3>
                        <p class="text-gray-500 mb-4">Module de facturation en cours de développement</p>
                        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p class="text-yellow-800 text-sm">
                                Ce module permettra de gérer toute votre facturation.
                                Fonctionnalités à venir : factures proforma, d'acompte, définitives, échéanciers.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        const SuppliersPage = {
            template: `
                <div class="p-6">
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0v-3.5a1.5 1.5 0 00-1.5-1.5h0a1.5 1.5 0 00-1.5 1.5V21"></path>
                        </svg>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Gestion des Fournisseurs</h3>
                        <p class="text-gray-500 mb-4">Module de gestion des offres fournisseurs en cours de développement</p>
                        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <p class="text-purple-800 text-sm">
                                Ce module permettra de gérer vos relations fournisseurs.
                                Fonctionnalités à venir : comparaison d'offres, sélection automatique, calcul de marges.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        // ============= ROUTER SETUP =============
        const routes = [
            {
                path: '/login',
                name: 'login',
                component: LoginPage
            },
            {
                path: '/',
                component: AppLayout,
                meta: { requiresAuth: true },
                children: [
                    {
                        path: '',
                        redirect: '/dashboard'
                    },
                    {
                        path: '/dashboard',
                        name: 'dashboard',
                        component: DashboardPage
                    },
                    {
                        path: '/clients',
                        name: 'clients',
                        component: ClientsList
                    },
                    {
                        path: '/clients/:id',
                        name: 'client-detail',
                        component: ClientDetailPage
                    },
                    {
                        path: '/quotes',
                        name: 'quotes',
                        component: QuotesPage
                    },
                    {
                        path: '/orders',
                        name: 'orders',
                        component: OrdersPage
                    },
                    {
                        path: '/invoices',
                        name: 'invoices',
                        component: InvoicesPage
                    },
                    {
                        path: '/suppliers',
                        name: 'suppliers',
                        component: SuppliersPage
                    }
                ]
            }
        ];

        const router = createRouter({
            history: createWebHashHistory(),
            routes
        });

        // Navigation guard
        router.beforeEach((to, from, next) => {
            if (to.meta.requiresAuth && !authStore.isAuthenticated) {
                next('/login');
            } else if (to.path === '/login' && authStore.isAuthenticated) {
                next('/dashboard');
            } else {
                next();
            }
        });

        // ============= APP SETUP =============
        const app = createApp({
            template: '<router-view />'
        });

        // Global CSS classes
        const style = document.createElement('style');
        style.textContent = `
            .nav-link {
                @apply flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors;
            }
            .nav-link-active {
                @apply bg-primary text-white hover:bg-secondary hover:text-white;
            }
            .nav-section {
                @apply mt-6;
            }
            .nav-section-title {
                @apply block px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider;
            }
        `;
        document.head.appendChild(style);

        app.use(router);

        // Make stores available globally
        app.config.globalProperties.authStore = authStore;
        app.config.globalProperties.salesStore = salesStore;

        // Check authentication on app start
        authStore.checkAuth();

        app.mount('#app');
    </script>
</body>
</html>