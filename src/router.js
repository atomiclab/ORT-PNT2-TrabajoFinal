import { createRouter, createWebHistory } from 'vue-router'
import Formulario from './components/Formulario/index.vue'
import Inicio from './components/Inicio.vue'
import Consigna from './components/Consigna.vue'
import Guild from './components/Guild/index.vue'
import Login from './components/Login/index.vue'

const routes = [
  /* ---- definición de la ruta raíz ---- */
  { path: '/formulario', component: Formulario },
  { path: '/guild', component: Guild },
  { path: '/inicio', component: Inicio },
  { path: '/consigna', component: Consigna },
  { path: '/login', component: Login },
  { path: '/', redirect: '/inicio' },

  /* ---- definición de las rutas no existentes ---- */
  { path: '/:pathmatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
