import servicioCharacters from '../../../servicios/characters.js'
import Swal from 'sweetalert2'
import { mapStores } from 'pinia'
import { useAuthStore } from '../../../stores/auth.js'
import AvatarSelector from './AvatarSelector.vue'

export default {
  name: 'Formulario',

  components: {
    AvatarSelector,
  },

  props: {
    // ejemplo: titulo: { type: String, default: '' }
  },

  data() {
    return {
      form: {
        name: '',
        avatar: '',
        race: '',
        class: '',
        guild: '',
        kingdom: '',
      },
      formDirty: {
        name: false,
        avatar: false,
        race: false,
        class: false,
        guild: false,
        kingdom: false,
      },
      razas: ['Humano', 'Elfo', 'Orco', 'Enano', 'Semielfo', 'Tiefling'],
      clases: ['Guerrero', 'Mago', 'Paladin', 'Arquero', 'Ladrón', 'Bárbaro'],
      gremios: [
        'Las Espadas de Plata',
        'El Pacto de Hierro',
        'Centinelas Lunares',
        'La Legión del Trueno',
        'Los Ecos de la Eternidad',
        'La Alianza de las Sombras',
        'El Juramento Dorado',
        'Los Custodios del Alba',
        'El Círculo Arcano',
        'La Orden del Fénix Carmesí',
      ],
      reinos: [
        'Valoria',
        'Eldara',
        'Thandor',
        'Lunaris',
        'Kareth',
        'Avernia',
        'Nocthelm',
        'Solmara',
        'Mirvalen',
        'Dravossia',
      ],
      avataresPorRaza: {
        Humano: [
          'image_1.png',
          'image_2.png',
          'image_3.png',
          'image_4.png',
          'image_5.png',
          'image_6.png',
          'image_7.png',
          'image_8.png',
          'image_9.png',
        ],
        Elfo: [
          'image_10.png',
          'image_11.png',
          'image_12.png',
          'image_13.png',
          'image_14.png',
          'image_15.png',
          'image_16.png',
          'image_17.png',
          'image_18.png',
        ],
        Orco: [
          'image_19.png',
          'image_20.png',
          'image_21.png',
          'image_22.png',
          'image_23.png',
          'image_24.png',
          'image_25.png',
          'image_26.png',
          'image_27.png',
        ],
        Enano: [
          'image_28.png',
          'image_29.png',
          'image_30.png',
          'image_31.png',
          'image_32.png',
          'image_33.png',
          'image_34.png',
          'image_35.png',
          'image_36.png',
        ],
        Semielfo: [
          'image_37.png',
          'image_38.png',
          'image_39.png',
          'image_40.png',
          'image_41.png',
          'image_42.png',
          'image_43.png',
          'image_44.png',
        ],
        Tiefling: [
          'image_45.png',
          'image_46.png',
          'image_47.png',
          'image_48.png',
          'image_49.png',
          'image_50.png',
        ],
      },
      enviando: false,
    }
  },

  computed: {
    ...mapStores(useAuthStore),
    errorName() {
      let mensaje = ''
      let name = this.form.name

      // name: requerido y mínimo 2 caracteres
      if (!name) {
        mensaje = this.$t('character.form.validations.nameRequired')
      } else if (name.length < 2) {
        mensaje = this.$t('character.form.validations.nameMinLength')
      }

      return {
        mensaje: mensaje,
        mostrar: mensaje != '' && this.formDirty.name,
        ok: mensaje == '',
      }
    },
    errorAvatar() {
      let mensaje = ''
      let avatar = this.form.avatar

      // avatar: requerido
      if (!avatar) {
        mensaje = this.$t('character.form.validations.avatarRequired')
      }

      return {
        mensaje: mensaje,
        mostrar: mensaje != '' && this.formDirty.avatar,
        ok: mensaje == '',
      }
    },
    avataresDisponibles() {
      if (!this.form.race) {
        return []
      }
      const nombresImagenes = this.avataresPorRaza[this.form.race] || []
      return nombresImagenes.map((nombre) => this.getImageUrl(nombre))
    },
    errorRace() {
      let mensaje = ''
      let race = this.form.race

      if (!race) {
        mensaje = this.$t('character.form.validations.raceRequired')
      }

      return {
        mensaje: mensaje,
        mostrar: mensaje != '' && this.formDirty.race,
        ok: mensaje == '',
      }
    },
    errorClass() {
      let mensaje = ''
      let classValue = this.form.class

      if (!classValue) {
        mensaje = this.$t('character.form.validations.classRequired')
      }

      return {
        mensaje: mensaje,
        mostrar: mensaje != '' && this.formDirty.class,
        ok: mensaje == '',
      }
    },
    errorGuild() {
      let mensaje = ''
      let guild = this.form.guild

      if (!guild) {
        mensaje = this.$t('character.form.validations.guildRequired')
      }

      return {
        mensaje: mensaje,
        mostrar: mensaje != '' && this.formDirty.guild,
        ok: mensaje == '',
      }
    },
    errorKingdom() {
      let mensaje = ''
      let kingdom = this.form.kingdom

      if (!kingdom) {
        mensaje = this.$t('character.form.validations.kingdomRequired')
      }

      return {
        mensaje: mensaje,
        mostrar: mensaje != '' && this.formDirty.kingdom,
        ok: mensaje == '',
      }
    },
    isValid() {
      return (
        this.errorName.ok &&
        this.errorAvatar.ok &&
        this.errorRace.ok &&
        this.errorClass.ok &&
        this.errorGuild.ok &&
        this.errorKingdom.ok
      )
    },
  },

  watch: {
    'form.race'(newRace, oldRace) {
      // Limpiar el avatar cuando cambia la raza
      if (newRace !== oldRace) {
        this.form.avatar = ''
        this.formDirty.avatar = false
      }
    },
  },

  methods: {
    getImageUrl(imageName) {
      return new URL(`../../../img/characters/${imageName}`, import.meta.url).href
    },
    getInicialData() {
      return {
        name: '',
        avatar: '',
        race: '',
        class: '',
        guild: '',
        kingdom: '',
      }
    },
    generarHP() {
      // Genera HP aleatorio entre 50 y 100
      return Math.floor(Math.random() * (100 - 50 + 1)) + 50
    },
    generarShield() {
      // Genera Shield aleatorio entre 10 y 30
      return Math.floor(Math.random() * (30 - 10 + 1)) + 10
    },
    generarLevel() {
      // Genera Level inicial (1 para nuevos personajes)
      return 1
    },
    async onSubmit() {
      this.formDirty = {
        name: true,
        avatar: true,
        race: true,
        class: true,
        guild: true,
        kingdom: true,
      }
      if (!this.isValid) return

      // Verificar autenticación
      if (!this.authStore.isAuthenticated) {
        await Swal.fire({
          icon: 'warning',
          title: 'No autenticado',
          text: 'Debes iniciar sesión para crear un personaje.',
          confirmButtonText: 'Ir al Login',
          background: '#1a1a1a',
          color: '#d4af37',
          confirmButtonColor: '#5a3d22',
        })
        this.$router.push('/login')
        return
      }

      // Obtener el userId del usuario autenticado
      let userId = this.authStore.userId

      // Si no tenemos userId sincronizado, intentar obtener el perfil desde el store
      if (!userId) {
        const profileResult = await this.authStore.fetchProfile()
        if (profileResult.success) {
          userId = this.authStore.userId
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text:
              profileResult.error ||
              'No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.',
            confirmButtonText: 'Ir al Login',
            background: '#1a1a1a',
            color: '#d4af37',
            confirmButtonColor: '#5a3d22',
          })
          this.$router.push('/login')
          return
        }
      }

      // Si aún no tenemos el userId, mostrar error
      if (!userId) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.',
          confirmButtonText: 'Aceptar',
          background: '#1a1a1a',
          color: '#d4af37',
          confirmButtonColor: '#5a3d22',
        })
        this.$router.push('/login')
        return
      }

      this.enviando = true

      try {
        const servicio = new servicioCharacters()
        const nuevoCharacter = {
          userId: userId,
          name: this.form.name,
          avatar: this.form.avatar,
          race: this.form.race.toLowerCase(),
          class: this.form.class,
          guild: this.form.guild,
          kingdom: this.form.kingdom,
          hp: this.generarHP(),
          shield: this.generarShield(),
          level: this.generarLevel(),
          isOnline: false,
        }

        const resultado = await servicio.create(nuevoCharacter)

        if (resultado.success) {
          await Swal.fire({
            icon: 'success',
            title: '¡Personaje creado!',
            text: `${nuevoCharacter.name} ha sido creado exitosamente.`,
            confirmButtonText: 'Aceptar',
            background: '#1a1a1a',
            color: '#d4af37',
            confirmButtonColor: '#5a3d22',
          })
          this.resetForm()
        } else {
          throw new Error(resultado.error || 'Error al crear personaje')
        }
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo crear el personaje. Por favor, intenta nuevamente.',
          confirmButtonText: 'Aceptar',
          background: '#1a1a1a',
          color: '#d4af37',
          confirmButtonColor: '#5a3d22',
        })
      } finally {
        this.enviando = false
      }
    },
    seleccionarAvatar(url) {
      this.form.avatar = url
      this.formDirty.avatar = true
    },
    resetForm() {
      this.form = this.getInicialData()
      this.formDirty = {
        name: false,
        avatar: false,
        race: false,
        class: false,
        guild: false,
        kingdom: false,
      }
    },
  },

  created() {
    // hook de creación
  },
  mounted() {
    // hook de montaje
  },
  unmounted() {
    // hook de desmontaje
  },
}
