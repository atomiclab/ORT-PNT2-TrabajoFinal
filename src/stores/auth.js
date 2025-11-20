import { defineStore } from 'pinia'
import servicioAuth from '../servicios/auth.js'

const getInitialUser = () => {
  const storedUser = localStorage.getItem('user')
  return storedUser ? JSON.parse(storedUser) : null
}

const getInitialToken = () => {
  return localStorage.getItem('authToken') || null
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: getInitialUser(),
    token: getInitialToken(),
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userId: (state) => state.user?.id || state.user?.userId || state.user?.data?.id || null,
  },
  actions: {
    setSession({ token, user }) {
      this.token = token || null
      this.user = user || null
      if (token) {
        localStorage.setItem('authToken', token)
      } else {
        localStorage.removeItem('authToken')
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    },
    syncFromStorage() {
      this.token = getInitialToken()
      this.user = getInitialUser()
    },
    async loginWithCredentials({ email, password }) {
      this.loading = true
      this.error = null
      try {
        const servicio = new servicioAuth()
        const response = await servicio.login(email, password)
        if (response.success) {
          const token = response.data?.token || response.data?.tokenJWT || getInitialToken()
          const user = response.data?.user || response.data
          this.setSession({ token, user })
        } else {
          this.error = response.error || 'Error al iniciar sesión'
        }
        return response
      } catch (error) {
        this.error = error.message || 'Error inesperado al iniciar sesión'
        return {
          success: false,
          error: this.error,
        }
      } finally {
        this.loading = false
      }
    },
    async fetchProfile() {
      this.loading = true
      this.error = null
      try {
        const servicio = new servicioAuth()
        const response = await servicio.getProfile()
        if (response.success) {
          const user = response.data?.user || response.data
          this.setSession({ token: this.token, user })
        } else if (response.statusCode === 401) {
          await this.logout()
        }
        return response
      } catch (error) {
        this.error = error.message || 'Error al obtener el perfil'
        return {
          success: false,
          error: this.error,
        }
      } finally {
        this.loading = false
      }
    },
    async logout() {
      try {
        const servicio = new servicioAuth()
        await servicio.logout()
      } catch (error) {
        console.error('Error en logout remoto:', error.message)
      } finally {
        this.setSession({ token: null, user: null })
      }
    },
  },
})

