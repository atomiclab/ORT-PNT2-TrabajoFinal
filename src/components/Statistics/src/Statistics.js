import servicioCharacters from '../../../servicios/characters'
import servicioBattle from '../../../servicios/battle'
import { useAuthStore } from '../../../stores/auth'

export default {
  name: 'Statistics',
  props: {
    character: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      characters: [],
      selectedCharacterId: '',
      lastBattleResult: null,
      loadingLastBattle: false,
      userId: null,
      formattedBattle: null,
      showRawBattle: false,
      battleEntries: [],
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    isWinner() {
      if (!this.formattedBattle || !this.selectedCharacterId) return false
      
      // PRIORIDAD 1: usar CharacterWonBattle directamente (campo del backend)
      if (this.formattedBattle.characterWonBattle !== null && this.formattedBattle.characterWonBattle !== undefined) {
        return this.formattedBattle.characterWonBattle === true
      }
      
      // FALLBACK 2: comparar por id
      const winnerId = this.formattedBattle.winnerId
      const loserId = this.formattedBattle.loserId
      if (winnerId != null && String(winnerId) === String(this.selectedCharacterId)) return true
      if (loserId != null && String(loserId) === String(this.selectedCharacterId)) return false
      
      // FALLBACK 3: por nombre si IDs faltan
      const selected = this.characters.find((c) => String(c.id) === String(this.selectedCharacterId))
      const selectedName = selected?.name?.trim().toLowerCase()
      const winnerName = this.formattedBattle.winnerName?.trim().toLowerCase()
      const loserName = this.formattedBattle.loserName?.trim().toLowerCase()
      if (selectedName && winnerName && selectedName === winnerName) return true
      if (selectedName && loserName && selectedName === loserName) return false
      return false
    },
    battleOutcomeClass() {
      return this.isWinner ? 'winner' : 'loser'
    },
    battleOutcomeLabel() {
      return this.isWinner ? 'Ganador' : 'Perdedor'
    },
  },
  methods: {
    init() {
      try {
        const auth = useAuthStore()
        this.userId = auth.userId
      } catch (e) {
        // Si Pinia no está disponible aún
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser)
            this.userId = parsed?.id || parsed?.userId || parsed?.data?.id || null
          } catch {e}
        }
      }
      this.loadCharacters()
    },
    async loadCharacters() {
      if (!this.userId) {
        this.characters = []
        return
      }
      try {
        const svc = new servicioCharacters()
        const res = await svc.getByUserId(this.userId)
        if (res.success) {
          this.characters = res.data
          // Auto-seleccionar si solo hay uno
          if (this.characters.length === 1) {
            this.selectedCharacterId = this.characters[0].id
          }
        }
      } catch {
        this.characters = []
      }
    },
    async fetchLastBattle() {
      if (!this.selectedCharacterId) return
      this.loadingLastBattle = true
      this.lastBattleResult = null
      this.formattedBattle = null
      try {
        const battleSvc = new servicioBattle()
        const res = await battleSvc.ObtenerResultadoUltimaBatalla(this.selectedCharacterId)
        this.lastBattleResult = res
        if (res.success) {
          this.formattedBattle = this.formatBattle(res.data)
          this.battleEntries = this.flattenBattle(res.data)
        }
      } catch (e) {
        this.lastBattleResult = { success: false, error: e.message }
      } finally {
        this.loadingLastBattle = false
      }
    },
    flattenBattle(raw) {
      const entries = []
      const walk = (value, path) => {
        if (value === null || value === undefined) {
          entries.push({ path, value: value })
        } else if (typeof value === 'object') {
          if (Array.isArray(value)) {
            value.forEach((v, i) => walk(v, path ? `${path}[${i}]` : `[${i}]`))
          } else {
            Object.keys(value)
              .sort((a, b) => a.localeCompare(b))
              .forEach((k) => {
                walk(value[k], path ? `${path}.${k}` : k)
              })
          }
        } else {
          entries.push({ path, value })
        }
      }
      walk(raw, '')
      // Filtrar campos excluidos
      const filtered = entries.filter((entry) => {
        return entry.path !== 'character.diceResult' && 
               entry.path !== 'opponent.diceResult' &&
               entry.path !== 'character.name' &&
               entry.path !== 'character.id' &&
               entry.path !== 'opponent.id' &&
               entry.path !== 'battleId' &&
               entry.path !== 'dateTimePelea'
      })
      // Ordenar por path para asegurar consistencia
      const sorted = filtered.sort((a, b) => a.path.localeCompare(b.path))
      // Aplicar traducciones de nombres de campos
      const translated = sorted.map((entry) => ({
        path: this.translateFieldName(entry.path),
        value: this.translateFieldValue(entry.path, entry.value),
        originalPath: entry.path,
      }))
      
      // Ordenar con prioridad: resultado de batalla primero, luego nombre del oponente
      return translated.sort((a, b) => {
        const priorityA = this.getFieldPriority(a.originalPath)
        const priorityB = this.getFieldPriority(b.originalPath)
        if (priorityA !== priorityB) return priorityA - priorityB
        return a.path.localeCompare(b.path)
      })
    },
    formatBattle(raw) {
      if (!raw || typeof raw !== 'object') return null
      // IMPORTANTE: CharacterWonBattle indica si el personaje consultado ganó
      const characterWonBattle = raw.CharacterWonBattle ?? raw.characterWonBattle ?? raw.won ?? null
      
      // Intentar detectar estructura común
      const winner = raw.winner || raw.ganador || raw.victor || raw.data?.winner
      const loser = raw.loser || raw.perdedor || raw.defeated || raw.data?.loser
      const winnerName = (winner?.name || winner?.nombre || raw.winnerName || raw.ganadorNombre || (typeof winner === 'string' ? winner : null)) || null
      const loserName = (loser?.name || loser?.nombre || raw.loserName || raw.perdedorNombre || (typeof loser === 'string' ? loser : null)) || null
      const winnerId = winner?.id || winner?.characterId || raw.winnerId || null
      const loserId = loser?.id || loser?.characterId || raw.loserId || null
      const rounds = raw.rounds || raw.rondas || raw.log?.rounds || []
      const roundsCount = Array.isArray(rounds) ? rounds.length : (typeof rounds === 'number' ? rounds : null)
      const damageLog = raw.damageLog || raw.log?.damage || raw.daño || null
      const startedAt = raw.startedAt || raw.inicio || raw.createdAt || raw.fechaInicio || null
      const endedAt = raw.endedAt || raw.fin || raw.updatedAt || raw.fechaFin || null
      const winnerHpRemaining = winner?.hpRemaining || raw.winnerHpRemaining || raw.winner?.hp || null
      const loserHpRemaining = loser?.hpRemaining || raw.loserHpRemaining || raw.loser?.hp || null
      return {
        characterWonBattle,
        winnerName,
        loserName,
        winnerId,
        loserId,
        roundsCount,
        startedAt,
        endedAt,
        winnerHpRemaining,
        loserHpRemaining,
        damageLog,
      }
    },
    toggleRawBattle() {
      this.showRawBattle = !this.showRawBattle
    },
    formatEntryValue(val) {
      if (val === null) return 'null'
      if (val === undefined) return 'undefined'
      if (typeof val === 'boolean') return val ? 'true' : 'false'
      if (typeof val === 'number') return val
      if (typeof val === 'string') return val
      if (Array.isArray(val)) return `[Array(${val.length})]`
      if (typeof val === 'object') return '{Objeto}'
      return String(val)
    },
    translateFieldName(path) {
      // Mapear nombres de campos a español
      const translations = {
        // Character fields
        'character.damageDealt': 'Daño realizado',
        'character.damageReceived': 'Daño recibido',
        'character.diceResult': 'Resultado del dado',
        'character.wonBattle': 'Resultado de batalla',
        'character.id': 'ID del personaje',
        'character.name': 'Nombre del personaje',
        'character.avatar': 'Avatar',
        'character.race': 'Raza',
        'character.class': 'Clase',
        'character.guild': 'Gremio',
        'character.kingdom': 'Reino',
        'character.hp': 'Puntos de vida',
        'character.shield': 'Escudo',
        'character.level': 'Nivel',
        'character.isOnline': 'En línea',
        'character.userId': 'ID del usuario',
        'character.createdAt': 'Fecha de creación',
        'character.updatedAt': 'Fecha de actualización',
        // Opponent fields
        'opponent.name': 'Nombre del oponente',
        'opponent.damageDealt': 'Daño realizado (oponente)',
        'opponent.damageReceived': 'Daño recibido (oponente)',
        'opponent.id': 'ID del oponente',
        // Battle fields
        'battleId': 'ID de batalla',
        'id': 'ID',
        'winner': 'Ganador',
        'loser': 'Perdedor',
        'winnerId': 'ID del ganador',
        'loserId': 'ID del perdedor',
        'winnerName': 'Nombre del ganador',
        'loserName': 'Nombre del perdedor',
        'rounds': 'Rondas',
        'roundsCount': 'Cantidad de rondas',
        'startedAt': 'Inicio',
        'endedAt': 'Fin',
        'createdAt': 'Fecha de creación',
        'updatedAt': 'Fecha de actualización',
        'damageLog': 'Registro de daño',
        'winnerHpRemaining': 'HP restante del ganador',
        'loserHpRemaining': 'HP restante del perdedor',
        'CharacterWonBattle': 'Resultado de batalla',
        'characterWonBattle': 'Resultado de batalla',
        'won': 'Ganó',
        'message': 'Mensaje',
        'success': 'Éxito',
        'data': 'Datos',
      }
      return translations[path] || path
    },
    translateFieldValue(path, value) {
      // Traducir valores específicos según el campo
      if (path === 'character.wonBattle' || path === 'CharacterWonBattle' || path === 'characterWonBattle' || path === 'won') {
        if (value === true) return 'Ganador'
        if (value === false) return 'Perdedor'
      }
      // Traducir valores booleanos para isOnline y success
      if (path === 'character.isOnline' || path === 'isOnline') {
        if (value === true) return 'Sí'
        if (value === false) return 'No'
      }
      if (path === 'success') {
        if (value === true) return 'Sí'
        if (value === false) return 'No'
      }
      return value
    },
    getFieldPriority(path) {
      // Prioridad 1: Resultado de batalla
      if (path === 'character.wonBattle' || path === 'CharacterWonBattle' || path === 'characterWonBattle') {
        return 1
      }
      // Prioridad 2: Nombre del oponente
      if (path === 'opponent.name') {
        return 2
      }
      // Resto de campos en orden alfabético
      return 999
    },
    valueClass(entry) {
      const v = entry.value
      // Daño recibido siempre en rojo
      if (entry.originalPath === 'character.damageReceived' || entry.originalPath === 'opponent.damageReceived') {
        return 'damage-received'
      }
      if (v === 'Ganador') return 'winner'
      if (v === 'Perdedor') return 'loser'
      if (typeof v === 'number') {
        return v > 0 ? 'positive-number' : v < 0 ? 'negative-number' : 'neutral-number'
      }
      return ''
    },
  },
}
