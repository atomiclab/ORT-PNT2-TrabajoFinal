import servicioAuth from '../../../servicios/auth.js'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      user: null,
      isLoading: true,
      error: null,
    }
  },
  async mounted() {
    await this.loadProfile()
  },
  methods: {
    async loadProfile() {
      this.isLoading = true
      this.error = null

      try {
        const servicio = new servicioAuth()

        // Verificar si hay token
        if (!servicio.isAuthenticated()) {
          this.error = 'No estás autenticado. Por favor, inicia sesión.'
          this.isLoading = false
          return
        }

        // Obtener perfil del usuario
        const resultado = await servicio.getProfile()

        if (resultado.success) {
          this.user = resultado.data.user || resultado.data
          // Actualizar localStorage con los datos actualizados
          if (this.user) {
            localStorage.setItem('user', JSON.stringify(this.user))
          }
        } else {
          this.error = resultado.error || 'Error al cargar el perfil'
          
          // Si el token es inválido, redirigir al login
          if (resultado.statusCode === 401) {
            await Swal.fire({
              icon: 'warning',
              title: 'Sesión expirada',
              text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
              confirmButtonText: 'Ir al Login',
              background: '#1a1a1a',
              color: '#d4af37',
              confirmButtonColor: '#5a3d22',
            })
            this.$router.push('/login')
          }
        }
      } catch {
        this.error = 'Ocurrió un error inesperado al cargar el perfil'
      } finally {
        this.isLoading = false
      }
    },
    async logout() {
      const result = await Swal.fire({
        icon: 'question',
        title: '¿Cerrar sesión?',
        text: '¿Estás seguro de que deseas cerrar sesión?',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar',
        background: '#1a1a1a',
        color: '#d4af37',
        confirmButtonColor: '#5a3d22',
        cancelButtonColor: '#666',
      })

      if (result.isConfirmed) {
        const servicio = new servicioAuth()
        servicio.logout()

        // Emitir evento para actualizar el Navbar
        window.dispatchEvent(new CustomEvent('auth-change'))

        await Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente.',
          confirmButtonText: 'Aceptar',
          background: '#1a1a1a',
          color: '#d4af37',
          confirmButtonColor: '#5a3d22',
        })

        this.$router.push('/login')
      }
    },
    goToLogin() {
      this.$router.push('/login')
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      } catch {
        return dateString
      }
    },
  },
}

