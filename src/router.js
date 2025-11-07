import { createRouter, createWebHistory } from 'vue-router'
import Formulario from './components/Formulario/index.vue'
import Inicio from './components/Inicio.vue'
import PequenoComercio from './components/PequenoComercio/index.vue'
import Login from './components/Login/index.vue'

const routes = [
  /* ---- definición de la ruta raíz ---- */
  { path: '/formulario', component: Formulario },
  { path: '/pequeno-comercio', component: PequenoComercio },
  { path: '/inicio', component: Inicio },
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
