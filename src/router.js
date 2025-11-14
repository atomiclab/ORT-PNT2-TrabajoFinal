import { createRouter, createWebHistory } from 'vue-router'
import Formulario from './components/Formulario/index.vue'
import Inicio from './components/Inicio.vue'
import Consigna from './components/Consigna.vue'
import Guild from './components/Guild/index.vue'
import Login from './components/Login/index.vue'
import Register from './components/Register/index.vue'
import Profile from './components/Profile/index.vue'
import Combate from './components/Combate.vue'

const routes = [
  /* ---- definición de la ruta raíz ---- */
  { path: '/formulario', component: Formulario },
  { path: '/guild', component: Guild },
  { path: '/inicio', component: Inicio },
  { path: '/consigna', component: Consigna },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/profile', component: Profile },
  { path: '/combate', component: Combate },
  { path: '/', redirect: '/login' },

  /* ---- definición de las rutas no existentes ---- */
  { path: '/:pathmatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
