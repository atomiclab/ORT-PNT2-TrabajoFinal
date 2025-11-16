/*Este endpoint lo vamos a usar para traer datos mas precisos del usuario, por ahora si esta online*/

import axios from 'axios'

class servicioUsuarios {
  #baseURL = 'https://ort-tp-2-proyecto-final.vercel.app'

  constructor() {
    this.#baseURL = 'https://ort-tp-2-proyecto-final.vercel.app'
  }

  /**
   * Obtiene el token de autenticación desde localStorage
   * @returns {string|null} Token JWT o null si no existe
   */
  getToken = () => {
    return localStorage.getItem('authToken')
  }

  /**
   * Obtiene los headers con autenticación
   * @returns {Object} Headers para las peticiones
   */
  getHeaders = () => {
    const token = this.getToken()
    const headers = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    return headers
  }

  /**
   * Obtiene los usuarios en línea
   * @returns {Promise<Object>} Respuesta con lista de usuarios online
   */
  getOnlineUsers = async () => {
    try {
      const { data } = await axios.get(`${this.#baseURL}/api/usuarios/online`, {
        headers: this.getHeaders(),
      })

      // El endpoint puede devolver directamente un array o dentro de data
      let usuarios = []
      if (Array.isArray(data)) {
        usuarios = data
      } else if (data.data && Array.isArray(data.data)) {
        usuarios = data.data
      } else if (data.data) {
        usuarios = [data.data]
      }

      return {
        success: true,
        data: usuarios,
        count: data.count || usuarios.length,
        message: data.message || 'Usuarios en línea obtenidos exitosamente',
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Error al obtener usuarios online'
      const statusCode = error.response?.status || 500

      return {
        success: false,
        error: errorMessage,
        statusCode,
        data: [],
        count: 0,
      }
    }
  }
}

export default servicioUsuarios
