import axios from 'axios'

class servicioProductos {
  #url = ''

  constructor() {
    this.#url = 'https://690a49e91a446bb9cc222198.mockapi.io/api/usersrpg'
  }

  getAll = async () => {
    try {
      const { data: productos } = await axios.get(this.#url)
      return productos
    } catch (error) {
      console.error('Error productos GET', error.message)
      return []
    }
  }

  post = async (producto) => {
    try {
      const { data: productoGuardado } = await axios.post(this.#url, producto)
      return productoGuardado
    } catch (error) {
      console.error('Error productos POST', error.message)
    }
  }
}

export default servicioProductos
