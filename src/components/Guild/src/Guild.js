import servicioProductos from '../../../servicios/productos.js'

export default {
  name: 'Guild',

  components: {
    // componentes hijos
  },

  props: {
    // ejemplo: titulo: { type: String, default: '' }
  },

  data() {
    return {
      usuarios: [],
      cargando: false,
      error: null,
      paginaActual: 1,
      usuariosPorPagina: 9,
    }
  },

  computed: {
    totalPaginas() {
      return Math.ceil(this.usuarios.length / this.usuariosPorPagina)
    },
    usuariosPaginados() {
      const inicio = (this.paginaActual - 1) * this.usuariosPorPagina
      const fin = inicio + this.usuariosPorPagina
      return this.usuarios.slice(inicio, fin)
    },
  },

  watch: {
    // observadores
  },

  methods: {
    async obtenerUsuarios() {
      this.cargando = true
      this.error = null
      try {
        const servicio = new servicioProductos()
        const usuarios = await servicio.getAll()
        this.usuarios = usuarios || []
        this.paginaActual = 1 
      } catch (error) {
        this.error = 'Error al cargar los usuarios'
        console.error('Error al obtener usuarios:', error)
      } finally {
        this.cargando = false
      }
    },
    irAPagina(pagina) {
      if (pagina >= 1 && pagina <= this.totalPaginas) {
        this.paginaActual = pagina
      }
    },
    paginaAnterior() {
      if (this.paginaActual > 1) {
        this.paginaActual--
      }
    },
    paginaSiguiente() {
      if (this.paginaActual < this.totalPaginas) {
        this.paginaActual++
      }
    },
  },

  created() {
    // hook de creación
  },
  mounted() {
    // hook de montaje
    this.obtenerUsuarios()
  },
  unmounted() {
    // hook de desmontaje
  }
}

