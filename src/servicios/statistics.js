import axios from 'axios'

class servicioStatistics {
  #baseURL = 'https://ort-tp-2-proyecto-final.vercel.app'

  constructor() {
    this.#baseURL = 'https://ort-tp-2-proyecto-final.vercel.app'
  }

  /**
   * Obtiene las estadísticas públicas del juego
   * @returns {Promise<Object>} Respuesta con estadísticas del juego
   */
  getStatistics = async () => {
    try {
      const { data } = await axios.get(`${this.#baseURL}/api/statistics`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Estadísticas obtenidas exitosamente',
        statusCode: data.status || 200,
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Error al obtener las estadísticas'
      const statusCode = error.response?.status || 500

      return {
        success: false,
        error: errorMessage,
        statusCode,
        data: null,
      }
    }
  }
}

export default servicioStatistics

