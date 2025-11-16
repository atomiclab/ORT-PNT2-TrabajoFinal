import axios from 'axios'

class servicioAuth {
  #baseURL = 'https://ort-tp-2-proyecto-final.vercel.app'

  constructor() {
    this.#baseURL = 'https://ort-tp-2-proyecto-final.vercel.app'
  }

  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @param {string} userData.nombre - Nombre del usuario
   * @param {string} userData.email - Email del usuario (requerido)
   * @param {string} userData.password - Contraseña (requerida)
   * @param {string} [userData.telefono] - Teléfono (opcional)
   * @param {number} [userData.edad] - Edad (opcional)
   * @returns {Promise<Object>} Respuesta con datos del usuario y token
   */
  register = async (userData) => {
    try {
      const { data } = await axios.post(`${this.#baseURL}/api/auth/register`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return {
        success: true,
        data: data.data,
        message: data.message || 'Usuario registrado exitosamente',
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Error al registrar usuario'
      const statusCode = error.response?.status || 500
      return {
        success: false,
        error: errorMessage,
        statusCode,
      }
    }
  }

  /**
   * Inicia sesión con email y password
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Respuesta con token y datos del usuario
   */
  login = async (email, password) => {
    try {
      const { data } = await axios.post(
        `${this.#baseURL}/api/auth/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      const token = data.data?.token
      const user = data.data?.user || data.data

      if (token) {
        // Guardar token en localStorage
        localStorage.setItem('authToken', token)
        // Guardar usuario si existe
        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
        }
      }

      return {
        success: true,
        data: data.data,
        message: data.message || 'Inicio de sesión exitoso',
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Error al iniciar sesión'
      const statusCode = error.response?.status || 500
      return {
        success: false,
        error: errorMessage,
        statusCode,
      }
    }
  }

  /**
   * Obtiene el perfil del usuario autenticado
   * @returns {Promise<Object>} Datos del perfil del usuario
   */
  getProfile = async () => {
    try {
      const token = this.getToken()
      if (!token) {
        return {
          success: false,
          error: 'No hay token de autenticación',
          statusCode: 401,
        }
      }

      const { data } = await axios.get(`${this.#baseURL}/api/auth/profile`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      return {
        success: true,
        data: data.data,
        message: data.message || 'Perfil obtenido exitosamente',
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Error al obtener perfil'
      const statusCode = error.response?.status || 500

      // Si el token es inválido, limpiar localStorage
      if (statusCode === 401) {
        await this.logout()
      }

      return {
        success: false,
        error: errorMessage,
        statusCode,
      }
    }
  }

  /**
   * Obtiene el token de autenticación desde localStorage
   * @returns {string|null} Token JWT o null si no existe
   */
  getToken = () => {
    return localStorage.getItem('authToken')
  }

  /**
   * Obtiene los datos del usuario desde localStorage
   * @returns {Object|null} Datos del usuario o null si no existe
   */
  getUser = () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} True si hay un token válido
   */
  isAuthenticated = () => {
    return !!this.getToken()
  }

  /**
   * Cierra sesión llamando al endpoint y limpia el localStorage
   * @returns {Promise<Object>} Respuesta del logout
   */
  logout = async () => {
    const token = this.getToken()
    
    // Intentar llamar al endpoint si hay token
    if (token) {
      try {
        const { data } = await axios.post(
          `${this.#baseURL}/api/auth/logout`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )

        // Limpiar localStorage en caso de éxito
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')

        return {
          success: true,
          message: data.message || 'Logout exitoso',
          statusCode: data.status || 200,
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Error en el logout'
        const statusCode = error.response?.status || 500

        // Limpiar localStorage incluso si hay error
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')

        return {
          success: false,
          error: errorMessage,
          statusCode,
        }
      }
    } else {
      // Si no hay token, solo limpiar localStorage
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')

      return {
        success: true,
        message: 'Logout exitoso',
        statusCode: 200,
      }
    }
  }
}

export default servicioAuth
