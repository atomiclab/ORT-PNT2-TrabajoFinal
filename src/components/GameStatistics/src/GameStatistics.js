import servicioStatistics from '../../../servicios/statistics.js'

export default {
  name: 'GameStatistics',
  data() {
    return {
      statistics: null,
      isLoading: true,
      error: null,
    }
  },
  async mounted() {
    await this.loadStatistics()
  },
  methods: {
    async loadStatistics() {
      this.isLoading = true
      this.error = null

      try {
        const servicio = new servicioStatistics()
        const resultado = await servicio.getStatistics()

        if (resultado.success) {
          this.statistics = resultado.data
        } else {
          this.error = resultado.error || this.$t('statistics.errors.loadError')
        }
      } catch (error) {
        this.error = this.$t('statistics.errors.loadError')
        console.error('Error loading statistics:', error)
      } finally {
        this.isLoading = false
      }
    },
    getPercentage(value, array) {
      if (!array || array.length === 0) return 0
      const total = array.reduce((sum, item) => sum + item.cantidad, 0)
      if (total === 0) return 0
      return (value / total) * 100
    },
  },
}

