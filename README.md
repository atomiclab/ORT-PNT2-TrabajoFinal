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

## Cómo ejecutar

```bash
npm install
npm run dev
```
