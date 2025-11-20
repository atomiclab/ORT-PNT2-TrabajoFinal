# PNT2 – TP Final

Realizar una aplicación frontend basada en Vue CLI, con tema de elección libre, que integre los temas que se detallan a continuación:

## Temas a Integrar

• Vue CLI 3

• Framework CSS (Bootstrap, Materialize, Material)

• Componentes (archivo único, múltiples archivos)

• Uso de métodos y propiedades computadas

• Directivas Data Binding (v-bind ':', v-on '@', v-model)

• Directivas estructurales (v-if, v-show, v-for, v-else, v-else-if)

• Directivas de atributos (:class :style)

• Lifecycle Hooks

• Manejo de Props y eventos

• Formulario con validaciones

• Routeo de componentes con parámetros (manejados desde HTML y desde código)

• Implementación de una API Rest Full mediante axios (con async/await)

• Uso de patrón de estado global

## Notas

Se podrá utilizar el backend desarrollado en otra materia (Ej, el backend Node.js de TP2). Sólo se calificará lo realizado en el frontend.

El trabajo se realizará en equipo (de 3 a 4 integrantes) y se presentará en forma grupal para su defensa en la última fecha de cursada.

## Alumnos

Lucas Evangelista - Gino Tubaro - Facundo Martinez - Akman Manuel.

## Implementaciones destacadas

### Estado global con Pinia
- Se incorporó Pinia (`src/stores/auth.js`) como capa única de sesión. Centraliza token, usuario y acciones de login/logout/profile usando axios/async-await.
- El store se inyecta en `main.js` y se consume con `mapStores` en componentes críticos (`Navbar.vue`, `Formulario`, `Profile`, `Combate`, `Guild`, etc.), reemplazando el uso directo de `localStorage` y eventos globales.
- Para probarlo: iniciar sesión desde `/login`, observar cómo el Navbar reacciona inmediatamente y cómo `Combate`/`Formulario` bloquean la UI si el estado global no tiene sesión válida.

### Routeo con parámetros
- Se agregó la ruta dinámica `profile/:id?` en `src/router.js` (con nombre `profile` y `props: true`).
- Desde HTML se navega con `<RouterLink :to="profileRoute">` en `Navbar.vue`; desde código se redirige con `this.$router.push({ name: 'profile', params: { id } })` al finalizar el login.
- El componente `Profile` consume el parámetro (`props.id` / `$route.params.id`) y vuelve a cargar los datos cuando cambia, validando que sólo se acceda al perfil del usuario autenticado.

### Eventos personalizados entre componentes
- El selector de avatares del formulario se extrajo al componente hijo `AvatarSelector` (`src/components/Formulario/src/AvatarSelector.vue`).
- `Formulario` le pasa props reactivas (`avatars`, `selected`, estados de validación) y escucha el evento `@select-avatar` para actualizar su estado local y las validaciones.
- Esto demuestra manejo de props/emits reales entre padre-hijo, reemplazando la lógica anterior basada sólo en eventos del DOM.

## Cobertura de consignas

### Framework CSS (Bootstrap, Material)
Se centraliza la carga de Bootstrap y SweetAlert en `src/bootstrap.js`, garantizando estilos responsivos y componentes listos.

```1:3:src/bootstrap.js
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'sweetalert2/dist/css/sweetalert2.min.css'
```

### Componentes SFC y multifile
El Navbar existe como SFC tradicional, mientras que el formulario demuestra la estructura de archivos separados.

```1:8:src/components/Navbar.vue
<!-- Este sera un SINGLE FILE COMPONENT -->
<template>
  <nav class="navbar navbar-expand-md navbar-medieval mb-3">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">
        <span class="nav-icon">⚔️</span>
        <span class="brand-text">Reino</span>
      </RouterLink>
```

```1:3:src/components/Formulario/index.vue
<template src="./src/Formulario.html"></template>
<script src="./src/Formulario.js"></script>
<style src="./src/Formulario.css" scoped></style>
```

### Métodos y propiedades computadas
La lógica del formulario define `computed`, `watch` y `methods` para validar, reaccionar y persistir.

```130:236:src/components/Formulario/src/Formulario.js
computed: {
  ...mapStores(useAuthStore),
  errorName() {
    let mensaje = ''
    let name = this.form.name
    if (!name) {
      mensaje = 'El nombre es requerido'
    } else if (name.length < 2) {
      mensaje = 'El nombre debe tener al menos 2 caracteres'
    }
    return {
      mensaje,
      mostrar: mensaje != '' && this.formDirty.name,
      ok: mensaje == '',
    }
  },
  ...
},
methods: {
  getImageUrl(imageName) {
    return new URL(`../../../img/characters/${imageName}`, import.meta.url).href
  },
  generarHP() { ... },
  async onSubmit() { ... },
}
```

### Data binding (v-model, v-on, v-bind)
Los inputs se enlazan bidireccionalmente (`v-model.trim`), se escuchan eventos (`@input`) y se aplican clases dinámicas.

```9:38:src/components/Formulario/src/Formulario.html
<form @submit.prevent="onSubmit" novalidate>
  <input
    id="name"
    type="text"
    class="form-control"
    v-model.trim="form.name"
    @input="formDirty.name = true"
    :class="{ 'is-invalid': errorName.mostrar, 'is-valid': formDirty.name && errorName.ok }"
    placeholder="Ingresa el nombre del personaje"
  />
  <select
    id="race"
    class="form-control"
    v-model="form.race"
    @change="formDirty.race = true"
    :class="{ 'is-invalid': errorRace.mostrar, 'is-valid': formDirty.race && errorRace.ok }"
  >
    <option value="">Selecciona una raza</option>
    <option v-for="raza in razas" :key="raza" :value="raza">{{ raza }}</option>
  </select>
```

### Directivas estructurales (v-if, v-show, v-for, v-else)
El formulario alterna secciones completas según el estado (`v-if`) y genera colecciones con `v-for`.

```43:72:src/components/Formulario/src/Formulario.html
<AvatarSelector
  v-if="form.race"
  :avatars="avataresDisponibles"
  :selected="form.avatar"
  :race="form.race"
  :show-error="errorAvatar.mostrar"
  :error-message="errorAvatar.mensaje"
  :is-valid="formDirty.avatar && errorAvatar.ok"
  @select-avatar="seleccionarAvatar"
/>
<option v-for="clase in clases" :key="clase" :value="clase">{{ clase }}</option>
```

### Directivas de atributos (:class, :style)
Se aplican estilos reactivos para feedback de validación y banners informativos.

```14:34:src/components/Formulario/src/Formulario.html
<input
  id="name"
  ...
  :class="{ 'is-invalid': errorName.mostrar, 'is-valid': formDirty.name && errorName.ok }"
/>
<div
  class="alert alert-info mt-3"
  style="background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; color: #d4af37"
>
  <small>
    <strong>ℹ️ Nota:</strong> La vida (HP) se generará automáticamente entre 50 y 100 puntos.
  </small>
</div>
```

### Lifecycle hooks
El Navbar sincroniza el store global durante `created` para hidratar el estado antes de renderizar.

```80:107:src/components/Navbar.vue
export default {
  name: 'AppNavbar',
  ...
  created() {
    this.authStore.syncFromStorage()
  },
  methods: {
    async logout() {
      await this.authStore.logout()
      this.$router.push('/login')
    },
  },
}
```

### Props y eventos personalizados
`AvatarSelector` recibe props controladas y emite `select-avatar`, integrando el flujo padre-hijo requerido.

```30:66:src/components/Formulario/src/AvatarSelector.vue
export default {
  name: 'AvatarSelector',
  props: {
    avatars: { type: Array, default: () => [] },
    selected: { type: String, default: '' },
    race: { type: String, default: '' },
    showError: { type: Boolean, default: false },
    errorMessage: { type: String, default: '' },
    isValid: { type: Boolean, default: false },
  },
  emits: ['select-avatar'],
  methods: {
    onSelect(url) {
      this.$emit('select-avatar', url)
    },
  },
}
```

### Formulario con validaciones
Las reglas se centralizan en `computed` y se chequean antes del submit.

```130:236:src/components/Formulario/src/Formulario.js
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
async onSubmit() {
  this.formDirty = { name: true, avatar: true, race: true, class: true, guild: true, kingdom: true }
  if (!this.isValid) return
  ...
}
```

### Routeo con parámetros manejados desde HTML y código
El router expone `profile/:id?`, enlazado desde `RouterLink` y navegación programática post-login.

```21:29:src/router.js
{
  path: '/profile/:id?',
  name: 'profile',
  component: Profile,
  props: true,
},
{ path: '/combate', component: Combate },
{ path: '/statistics', component: GameStatistics },
```

### API Rest Full con axios (async/await)
Los servicios encapsulan llamadas HTTP, manejo de headers y parsing de respuestas.

```37:85:src/servicios/characters.js
getAll = async () => {
  try {
    const { data } = await axios.get(`${this.#baseURL}/api/characters`, {
      headers: this.getHeaders(),
    })
    let characters = []
    if (Array.isArray(data)) {
      characters = data
    } else if (data.data && Array.isArray(data.data)) {
      characters = data.data
    } else if (data.data) {
      characters = [data.data]
    }
    return { success: true, data: characters }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      statusCode: error.response?.status || 500,
    }
  }
}
```

### Patrón de estado global
Pinia (`useAuthStore`) mantiene token/usuario y acciones reutilizables, cumpliendo el requisito de estado global.

```13:80:src/stores/auth.js
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: getInitialUser(),
    token: getInitialToken(),
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userId: (state) => state.user?.id || state.user?.userId || state.user?.data?.id || null,
  },
  actions: {
    setSession({ token, user }) { ... },
    async loginWithCredentials({ email, password }) { ... },
    async fetchProfile() { ... },
    async logout() { ... },
  },
})
```

### OpenAPI
El proyecto consume APIs REST mediante `axios`, pero no incluye una especificación OpenAPI documentada. Las llamadas a la API se realizan a través de servicios encapsulados en `src/servicios/` (characters.js, auth.js, usuarios.js, battle.js, statistics.js), que manejan headers, autenticación y parsing de respuestas de forma consistente.

### Composition API
Se implementa Vue 3 Composition API de forma híbrida con Options API:

- **Componente con Composition API**: `LanguageSelector.vue` utiliza `setup()` con `computed()` y `useI18n()` para manejar el cambio de idioma de forma reactiva.

```18:39:src/components/LanguageSelector.vue
  setup() {
    const { locale } = useI18n()

    const currentLocale = computed(() => {
      return availableLocales.find(l => l.code === locale.value) || availableLocales[0]
    })

    // El idioma que se mostrará al hacer clic (el otro idioma)
    const nextLocale = computed(() => {
      const current = currentLocale.value.code
      return availableLocales.find(l => l.code !== current) || availableLocales[0]
    })

    const toggleLanguage = () => {
      setLocale(nextLocale.value.code)
    }

    return {
      nextLocale,
      toggleLanguage
    }
  }
```

- **Configuración de vue-i18n**: Se configura con `legacy: false` para usar Composition API en lugar de la API legacy.

```24:25:src/locales/index.js
const i18n = createI18n({
  legacy: false, // Usar Composition API
```

- **Mayoría de componentes**: Utilizan Options API tradicional (`data()`, `computed`, `methods`, lifecycle hooks) para mantener consistencia y compatibilidad con el resto del código.

## Cómo ejecutar

```bash
npm install
npm run dev
```
