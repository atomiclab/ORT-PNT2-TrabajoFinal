import servicioAuth from '../../../servicios/auth.js'
import servicioCharacters from '../../../servicios/characters.js'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      user: null,
      characters: [],
      isLoading: true,
      isLoadingCharacters: false,
      error: null,
      charactersError: null,
      currentCharacterIndex: 0,
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
          console.log('Usuario cargado en perfil:', this.user)
          // Intentar obtener el userId de diferentes ubicaciones
          const userId = this.user?.id || this.user?.userId || this.user?.data?.id
          console.log('UserId del usuario:', userId)
          console.log('Claves del objeto usuario:', this.user ? Object.keys(this.user) : [])
          
          // Actualizar localStorage con los datos actualizados
          if (this.user) {
            localStorage.setItem('user', JSON.stringify(this.user))
            // Cargar personajes del usuario después de obtener el perfil
            // Esperar un poco para asegurar que el usuario está completamente cargado
            await this.$nextTick()
            await this.loadCharacters()
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
        const resultado = await servicio.logout()

        // Emitir evento para actualizar el Navbar
        window.dispatchEvent(new CustomEvent('auth-change'))

        // Mostrar mensaje según el resultado
        if (resultado.success) {
          await Swal.fire({
            icon: 'success',
            title: 'Sesión cerrada',
            text: resultado.message || 'Has cerrado sesión correctamente.',
            confirmButtonText: 'Aceptar',
            background: '#1a1a1a',
            color: '#d4af37',
            confirmButtonColor: '#5a3d22',
          })
        } else {
          // Aún así mostrar éxito si el logout falló en el servidor pero se limpió localmente
          await Swal.fire({
            icon: 'warning',
            title: 'Sesión cerrada',
            text: 'Se ha cerrado la sesión localmente. ' + (resultado.error || ''),
            confirmButtonText: 'Aceptar',
            background: '#1a1a1a',
            color: '#d4af37',
            confirmButtonColor: '#5a3d22',
          })
        }

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
    async loadCharacters() {
      // Obtener el userId de diferentes posibles ubicaciones
      const userId = this.user?.id || this.user?.userId || this.user?.data?.id
      
      if (!this.user || !userId) {
        console.warn('No se puede cargar personajes: usuario o userId no disponible', {
          user: this.user,
          userId: userId,
          userKeys: this.user ? Object.keys(this.user) : [],
        })
        return
      }

      this.isLoadingCharacters = true
      this.charactersError = null

      try {
        const servicio = new servicioCharacters()
        console.log('Cargando personajes para userId:', userId)
        
        const resultado = await servicio.getByUserId(userId)
        console.log('Resultado de getByUserId:', resultado)

        if (resultado.success) {
          // El endpoint puede devolver un array directamente o dentro de data
          const charactersData = resultado.data
          console.log('Datos de personajes recibidos:', charactersData)
          
          if (Array.isArray(charactersData)) {
            this.characters = charactersData
          } else if (charactersData && Array.isArray(charactersData.data)) {
            this.characters = charactersData.data
          } else if (charactersData && charactersData.data) {
            this.characters = [charactersData.data]
          } else {
            this.characters = []
          }
          
          console.log('Personajes procesados:', this.characters)
          // Resetear el índice del carrusel cuando se cargan nuevos personajes
          this.currentCharacterIndex = 0
        } else {
          this.charactersError = resultado.error || 'Error al cargar los personajes'
          console.error('Error al obtener personajes:', resultado)
          // Si es un error 404, puede que el usuario no tenga personajes todavía
          if (resultado.statusCode === 404) {
            this.characters = []
            this.charactersError = null // No mostrar error si simplemente no hay personajes
          }
        }
      } catch (error) {
        this.charactersError = 'Error al cargar los personajes'
        console.error('Error al obtener personajes (catch):', error)
        console.error('Detalles del error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        })
      } finally {
        this.isLoadingCharacters = false
      }
    },
    nextCharacter() {
      if (this.characters.length > 0) {
        this.currentCharacterIndex = (this.currentCharacterIndex + 1) % this.characters.length
      }
    },
    prevCharacter() {
      if (this.characters.length > 0) {
        this.currentCharacterIndex =
          this.currentCharacterIndex === 0
            ? this.characters.length - 1
            : this.currentCharacterIndex - 1
      }
    },
    goToCharacter(index) {
      if (index >= 0 && index < this.characters.length) {
        this.currentCharacterIndex = index
      }
    },
  },
  computed: {
    currentCharacter() {
      if (this.characters.length > 0 && this.currentCharacterIndex < this.characters.length) {
        return this.characters[this.currentCharacterIndex]
      }
      return null
    },
    hasMultipleCharacters() {
      return this.characters.length > 1
    },
  },
}

