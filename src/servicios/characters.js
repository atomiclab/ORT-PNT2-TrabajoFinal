import axios from 'axios'

class servicioCharacters {
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
   * Obtiene todos los personajes
   * @returns {Promise<Array>} Lista de personajes
   */
  getAll = async () => {
    try {
      const { data } = await axios.get(`${this.#baseURL}/api/characters`, {
        headers: this.getHeaders(),
      })
      // El endpoint puede devolver directamente un array o dentro de data
      let characters = []
      if (Array.isArray(data)) {
        characters = data
      } else if (data.data && Array.isArray(data.data)) {
        characters = data.data
      } else if (data.data) {
        characters = [data.data]
      }
      return {
        success: true,
        data: characters,
      }
    } catch (error) {
      console.error('Error characters GET', error.message)
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        statusCode: error.response?.status || 500,
      }
    }
  }

  /**
   * Obtiene un personaje por ID
   * @param {string} characterId - ID del personaje
   * @returns {Promise<Object>} Datos del personaje
   */
  getById = async (characterId) => {
    try {
      const { data } = await axios.get(`${this.#baseURL}/api/characters/${characterId}`, {
        headers: this.getHeaders(),
      })
      return {
        success: true,
        data: data.data || data,
      }
    } catch (error) {
      console.error('Error characters GET by ID', error.message)
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        statusCode: error.response?.status || 500,
      }
    }
  }

  /**
   * Obtiene todos los personajes de un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>} Lista de personajes del usuario
   */
  getByUserId = async (userId) => {
    try {
      const url = `${this.#baseURL}/api/usuarios/${userId}/characters`
      console.log('Llamando al endpoint:', url)
      console.log('Headers:', this.getHeaders())

      const response = await axios.get(url, {
        headers: this.getHeaders(),
      })

      console.log('Respuesta completa del servidor:', response)
      console.log('Datos de la respuesta:', response.data)

      const { data } = response

      // El endpoint puede devolver directamente un array o dentro de data
      let characters = []

      // Si la respuesta es un array directamente
      if (Array.isArray(data)) {
        characters = data
      }
      // Si la respuesta tiene una propiedad data que es un array
      else if (data && data.data && Array.isArray(data.data)) {
        characters = data.data
      }
      // Si la respuesta tiene una propiedad data que no es un array (un solo objeto)
      else if (data && data.data && !Array.isArray(data.data)) {
        characters = [data.data]
      }
      // Si la respuesta es un objeto con propiedades de personaje directamente
      else if (data && typeof data === 'object' && data.id) {
        characters = [data]
      }
      // Si no hay datos, retornar array vacío
      else {
        characters = []
      }

      console.log('Personajes procesados en servicio:', characters)

      return {
        success: true,
        data: characters,
      }
    } catch (error) {
      console.error('Error characters GET by userId:', error)
      console.error('Detalles del error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      })

      // Si es 404, puede que simplemente no haya personajes
      if (error.response?.status === 404) {
        return {
          success: true,
          data: [],
        }
      }

      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || error.message,
        statusCode: error.response?.status || 500,
      }
    }
  }

  /**
   * Crea un nuevo personaje
   * @param {Object} characterData - Datos del personaje
   * @param {string} characterData.userId - ID del usuario (requerido)
   * @param {string} characterData.name - Nombre del personaje (requerido)
   * @param {string} [characterData.avatar] - URL del avatar
   * @param {string} [characterData.race] - Raza del personaje
   * @param {string} [characterData.class] - Clase del personaje
   * @param {string} [characterData.guild] - Gremio del personaje
   * @param {string} [characterData.kingdom] - Reino del personaje
   * @param {number} [characterData.hp] - Puntos de vida
   * @param {number} [characterData.shield] - Puntos de escudo
   * @param {number} [characterData.level] - Nivel del personaje
   * @param {boolean} [characterData.isOnline] - Estado online
   * @returns {Promise<Object>} Datos del personaje creado
   */
  create = async (characterData) => {
    try {
      const { data } = await axios.post(`${this.#baseURL}/api/characters`, characterData, {
        headers: this.getHeaders(),
      })
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Personaje creado exitosamente',
      }
    } catch (error) {
      console.error('Error characters POST', error.message)
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Error al crear personaje'
      const statusCode = error.response?.status || 500
      return {
        success: false,
        error: errorMessage,
        statusCode,
      }
    }
  }

  /**
   * Actualiza un personaje
   * @param {string} characterId - ID del personaje
   * @param {Object} characterData - Datos a actualizar
   * @returns {Promise<Object>} Datos del personaje actualizado
   */
  update = async (characterId, characterData) => {
    try {
      const { data } = await axios.put(
        `${this.#baseURL}/api/characters/${characterId}`,
        characterData,
        {
          headers: this.getHeaders(),
        },
      )
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Personaje actualizado exitosamente',
      }
    } catch (error) {
      console.error('Error characters PUT', error.message)
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Error al actualizar personaje'
      const statusCode = error.response?.status || 500
      return {
        success: false,
        error: errorMessage,
        statusCode,
      }
    }
  }

  /**
   * Elimina un personaje
   * @param {string} characterId - ID del personaje
   * @returns {Promise<boolean>} True si se eliminó correctamente
   */
  delete = async (characterId) => {
    try {
      await axios.delete(`${this.#baseURL}/api/characters/${characterId}`, {
        headers: this.getHeaders(),
      })
      return {
        success: true,
        message: 'Personaje eliminado exitosamente',
      }
    } catch (error) {
      console.error('Error characters DELETE', error.message)
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        statusCode: error.response?.status || 500,
      }
    }
  }
}

export default servicioCharacters
