import servicioAuth from '../../../servicios/auth.js'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      email: '',
      password: '',
      emailError: '',
      isFormValid: false,
      isLoading: false,
    }
  },
  methods: {
    validateEmail() {
      const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
      if (!this.email) {
        this.emailError = ''
      } else if (!emailRegex.test(this.email)) {
        this.emailError = 'Por favor, introduce un formato de email válido.'
      } else {
        this.emailError = ''
      }
      this.validateForm()
    },
    validateForm() {
      this.isFormValid = this.email && !this.emailError && this.password
    },
    async login() {
      if (!this.isFormValid) {
        await Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Por favor, completa ambos campos correctamente.',
          confirmButtonText: 'Aceptar',
          background: '#1a1a1a',
          color: '#d4af37',
          confirmButtonColor: '#5a3d22',
        })
        return
      }

      this.isLoading = true

      try {
        const servicio = new servicioAuth()
        const resultado = await servicio.login(this.email, this.password)

        if (resultado.success) {
          await Swal.fire({
            icon: 'success',
            title: '¡Inicio de sesión exitoso!',
            text: `Bienvenido, ${resultado.data.user?.nombre || this.email}`,
            confirmButtonText: 'Aceptar',
            background: '#1a1a1a',
            color: '#d4af37',
            confirmButtonColor: '#5a3d22',
          })

          // Emitir evento para actualizar el Navbar
          window.dispatchEvent(new CustomEvent('auth-change'))

          // Redirigir al perfil después del login exitoso
          this.$router.push('/profile')
        } else {
          let errorMessage = resultado.error || 'Error al iniciar sesión'

          // Mensajes de error más amigables según el código de estado
          if (resultado.statusCode === 401) {
            errorMessage = 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.'
          } else if (resultado.statusCode === 403) {
            errorMessage = 'Tu cuenta está desactivada. Contacta al administrador.'
          } else if (resultado.statusCode === 400) {
            errorMessage =
              'Datos incompletos. Por favor, verifica que todos los campos estén completos.'
          }

          await Swal.fire({
            icon: 'error',
            title: 'Error al iniciar sesión',
            text: errorMessage,
            confirmButtonText: 'Aceptar',
            background: '#1a1a1a',
            color: '#d4af37',
            confirmButtonColor: '#5a3d22',
          })
        }
      } catch {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
          confirmButtonText: 'Aceptar',
          background: '#1a1a1a',
          color: '#d4af37',
          confirmButtonColor: '#5a3d22',
        })
      } finally {
        this.isLoading = false
      }
    },
  },
}
