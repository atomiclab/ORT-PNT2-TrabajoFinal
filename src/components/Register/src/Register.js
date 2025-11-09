import servicioAuth from '../../../servicios/auth.js'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      form: {
        nombre: '',
        email: '',
        password: '',
        telefono: '',
        edad: null,
      },
      errors: {
        nombre: '',
        email: '',
        password: '',
        edad: '',
      },
      isFormValid: false,
      isLoading: false,
    }
  },
  methods: {
    validateEmail() {
      const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
      if (!this.form.email) {
        this.errors.email = ''
      } else if (!emailRegex.test(this.form.email)) {
        this.errors.email = 'Por favor, introduce un formato de email válido.'
      } else {
        this.errors.email = ''
      }
      this.updateFormValidity()
    },
    validateForm() {
      // Validar nombre
      if (!this.form.nombre) {
        this.errors.nombre = 'El nombre es requerido'
      } else if (this.form.nombre.length < 2) {
        this.errors.nombre = 'El nombre debe tener al menos 2 caracteres'
      } else {
        this.errors.nombre = ''
      }

      // Validar password
      if (!this.form.password) {
        this.errors.password = 'La contraseña es requerida'
      } else if (this.form.password.length < 6) {
        this.errors.password = 'La contraseña debe tener al menos 6 caracteres'
      } else {
        this.errors.password = ''
      }

      // Validar edad si se proporciona
      if (this.form.edad !== null && this.form.edad !== '') {
        if (this.form.edad < 1 || this.form.edad > 120) {
          this.errors.edad = 'La edad debe estar entre 1 y 120 años'
        } else {
          this.errors.edad = ''
        }
      } else {
        this.errors.edad = ''
      }

      // Validar email
      const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
      if (!this.form.email) {
        this.errors.email = ''
      } else if (!emailRegex.test(this.form.email)) {
        this.errors.email = 'Por favor, introduce un formato de email válido.'
      } else {
        this.errors.email = ''
      }

      this.updateFormValidity()
    },
    updateFormValidity() {
      // El formulario es válido si no hay errores y los campos requeridos están completos
      this.isFormValid =
        this.form.nombre &&
        !this.errors.nombre &&
        this.form.email &&
        !this.errors.email &&
        this.form.password &&
        !this.errors.password &&
        !this.errors.edad
    },
    async register() {
      if (!this.isFormValid) {
        await Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Por favor, completa todos los campos requeridos correctamente.',
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

        // Preparar datos para el registro (solo enviar campos que tengan valor)
        const userData = {
          nombre: this.form.nombre,
          email: this.form.email,
          password: this.form.password,
        }

        // Agregar campos opcionales solo si tienen valor
        if (this.form.telefono) {
          userData.telefono = this.form.telefono
        }
        if (this.form.edad !== null && this.form.edad !== '') {
          userData.edad = this.form.edad
        }

        const resultado = await servicio.register(userData)

        if (resultado.success) {
          await Swal.fire({
            icon: 'success',
            title: '¡Registro exitoso!',
            text: `Bienvenido, ${resultado.data.user?.nombre || this.form.nombre}. Tu cuenta ha sido creada exitosamente.`,
            confirmButtonText: 'Aceptar',
            background: '#1a1a1a',
            color: '#d4af37',
            confirmButtonColor: '#5a3d22',
          })

          // Redirigir al login después del registro
          this.$router.push('/login')
        } else {
          let errorMessage = resultado.error || 'Error al registrar usuario'

          // Mensajes de error más amigables según el código de estado
          if (resultado.statusCode === 409) {
            errorMessage = 'Este email ya está registrado. Por favor, usa otro email o inicia sesión.'
          } else if (resultado.statusCode === 400) {
            errorMessage =
              'Datos incompletos o inválidos. Por favor, verifica que todos los campos requeridos estén completos.'
          }

          await Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
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

