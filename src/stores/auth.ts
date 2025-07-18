import { ref, reactive } from 'vue'
import type { User, AuthResult } from '@/types'

// Mock user data
const mockUser: User = {
  id: 1,
  name: 'Gedeon RO',
  email: 'gedeon@neostart.com',
  role: 'Administrateur',
  avatar: 'https://ui-avatars.com/api/?name=Gedeon+RO&background=14A800&color=fff',
}

// Authentication store using Composition API
const isAuthenticated = ref<boolean>(false)
const user = ref<User | null>(null)

export const useAuthStore = () => {
  const login = (email: string, password: string): AuthResult => {
    // Simulate authentication - in real app, this would call an API
    if (email === 'admin@neostart.com' && password === 'admin123') {
      isAuthenticated.value = true
      user.value = mockUser
      localStorage.setItem('auth_token', 'mock_token_123')
      return { success: true }
    }
    return { success: false, error: 'Identifiants incorrects' }
  }

  const logout = (): void => {
    isAuthenticated.value = false
    user.value = null
    localStorage.removeItem('auth_token')
  }

  const checkAuth = (): void => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      isAuthenticated.value = true
      user.value = mockUser
    }
  }

  // Initialize auth check
  checkAuth()

  return {
    // State
    isAuthenticated,
    user,
    // Actions
    login,
    logout,
    checkAuth,
  }
}
