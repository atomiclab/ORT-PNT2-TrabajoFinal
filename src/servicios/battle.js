import axios from 'axios'

class servicioBattle {
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
   * Realiza una batalla entre dos personajes
   * @param {string} idPersonajeRetador - ID del personaje que reta (debe pertenecer al usuario autenticado)
   * @param {string} idPersonajeRetado - ID del personaje que es retado
   * @returns {Promise<Object>} Respuesta con datos de la batalla realizada
   */
  realizarBatalla = async (idPersonajeRetador, idPersonajeRetado) => {
    try {
      const { data } = await axios.post(
        `${this.#baseURL}/api/battle/${idPersonajeRetador}/${idPersonajeRetado}`,
        {},
        {
          headers: this.getHeaders(),
        },
      )

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Batalla realizada exitosamente',
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Error al realizar la batalla'
      const statusCode = error.response?.status || 500
      const errorCode = error.response?.data?.code || null

      return {
        success: false,
        error: errorMessage,
        statusCode,
        code: errorCode,
      }
    }
  }
}

export default servicioBattle
