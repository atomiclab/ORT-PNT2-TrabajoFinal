<!-- Este sera un SINGLE FILE COMPONENT -->

<template>
  <nav class="navbar navbar-expand-md navbar-medieval mb-3">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">
        <span class="nav-icon">⚔️</span>
        <span class="brand-text">{{ $t('nav.home') }}</span>
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon">☰</span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li v-if="isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" to="/formulario" active-class="active">
              <span class="nav-icon">📜</span>
              <span>{{ $t('nav.createCharacter') }}</span>
            </RouterLink>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" to="/guild" active-class="active">
              <span class="nav-icon">🏰</span>
              <span>{{ $t('nav.guildMasters') }}</span>
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/consigna" active-class="active">
              <span class="nav-icon">📖</span>
              <span>{{ $t('nav.assignment') }}</span>
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/statistics" active-class="active">
              <span class="nav-icon">📊</span>
              <span>{{ $t('nav.statistics') }}</span>
            </RouterLink>
          </li>
          <li v-if="isAuthenticated && userId" class="nav-item">
            <RouterLink class="nav-link" :to="profileRoute" active-class="active">
              <span class="nav-icon">👤</span>
              <span>{{ $t('nav.profile') }}</span>
            </RouterLink>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" to="/combate" active-class="active">
              <span class="nav-icon">⚔️</span>
              <span>{{ $t('nav.combat') }}</span>
            </RouterLink>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <a class="nav-link" href="#" @click.prevent="logout">
              <span class="nav-icon">🚪</span>
              <span>{{ $t('nav.logout') }}</span>
            </a>
          </li>
          
          <li v-if="!isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" to="/login" active-class="active">
              <span class="nav-icon">🔐</span>
              <span>{{ $t('nav.login') }}</span>
            </RouterLink>
          </li>
          <li v-if="!isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" to="/register" active-class="active">
              <span class="nav-icon">📝</span>
              <span>{{ $t('nav.register') }}</span>
            </RouterLink>
          </li>

          <!-- Selector de idioma -->
          <li class="nav-item nav-language">
            <LanguageSelector />
          </li>

        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '../stores/auth.js'
import LanguageSelector from './LanguageSelector.vue'
import Swal from 'sweetalert2'

export default {
  name: 'AppNavbar',
  components: {
    LanguageSelector,
  },
  computed: {
    ...mapStores(useAuthStore),
    isAuthenticated() {
      return this.authStore.isAuthenticated
    },
    user() {
      return this.authStore.user
    },
    userId() {
      return this.authStore.userId
    },
    profileRoute() {
      return { name: 'profile', params: { id: this.userId || 'me' } }
    },
  },
  created() {
    this.authStore.syncFromStorage()
  },
  methods: {
    async logout() {
      let confirmed = false
      if (typeof Swal !== 'undefined') {
        const result = await Swal.fire({
          icon: 'question',
          title: this.$t('profile.logout.confirm'),
          text: this.$t('profile.logout.message'),
          showCancelButton: true,
          confirmButtonText: this.$t('profile.logout.yes'),
          cancelButtonText: this.$t('profile.logout.cancel'),
          background: '#1a1a1a',
          color: '#d4af37',
          confirmButtonColor: '#5a3d22',
          cancelButtonColor: '#666',
        })
        confirmed = result.isConfirmed
      } else {
        confirmed = window.confirm(this.$t('profile.logout.message'))
      }

      if (!confirmed) return

      await this.authStore.logout()

      if (typeof Swal !== 'undefined') {
        await Swal.fire({
          icon: 'success',
          title: this.$t('profile.logout.success'),
          text: this.$t('profile.logout.successText'),
          confirmButtonText: this.$t('common.accept'),
          background: '#1a1a1a',
          color: '#d4af37',
          confirmButtonColor: '#5a3d22',
        })
      }

      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
.navbar-medieval {
  background: linear-gradient(135deg, #3d2914 0%, #5a3d22 50%, #3d2914 100%);
  border: 2px solid #d4af37;
  border-radius: 8px;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.5),
    0 0 15px rgba(212, 175, 55, 0.3);
  padding: 0.75rem 1rem;
  position: relative;
  overflow: hidden;
}

.navbar-medieval::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
}

.navbar-brand {
  font-family: 'Cinzel Decorative', cursive;
  font-size: 1.5rem;
  font-weight: 700;
  color: #d4af37 !important;
  text-shadow:
    2px 2px 4px rgba(0, 0, 0, 0.8),
    0 0 10px rgba(212, 175, 55, 0.5);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

.navbar-brand:hover {
  color: #f4d03f !important;
  text-shadow:
    2px 2px 4px rgba(0, 0, 0, 0.8),
    0 0 15px rgba(212, 175, 55, 0.7);
  transform: translateY(-2px);
}

.brand-text {
  letter-spacing: 2px;
}

.nav-icon {
  font-size: 1.25rem;
  filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.5));
}

.nav-link {
  font-family: 'Cinzel', serif;
  font-weight: 600;
  color: #c0c0c0 !important;
  padding: 0.75rem 1.25rem !important;
  margin: 0 0.25rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
  transform: translateX(-50%);
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #d4af37 !important;
  background: rgba(212, 175, 55, 0.1);
  text-shadow: 0 0 8px rgba(212, 175, 55, 0.5);
}

.nav-link:hover::before {
  width: 80%;
}

.nav-link.active {
  color: #d4af37 !important;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(184, 148, 31, 0.2) 100%);
  border: 1px solid #d4af37;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
}

.nav-link.active::before {
  width: 80%;
}

.navbar-toggler {
  border: 2px solid #d4af37;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  background: rgba(26, 26, 26, 0.5);
  color: #d4af37;
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.navbar-toggler:hover,
.navbar-toggler:focus {
  background: rgba(212, 175, 55, 0.2);
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
  border-color: #f4d03f;
}

.navbar-toggler-icon {
  color: #d4af37;
  font-family: 'Cinzel', serif;
  font-weight: 700;
}

@media (max-width: 767px) {
  .navbar-nav {
    margin-top: 1rem;
    border-top: 1px solid rgba(212, 175, 55, 0.3);
    padding-top: 1rem;
  }

  .nav-link {
    margin: 0.25rem 0;
  }
}

/* Estilos para el selector de idioma */
.nav-language {
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
}

.nav-language .language-toggle-button {
  border-color: #d4af37;
  background: rgba(13, 13, 13, 0.8);
}

.nav-language .language-toggle-button:hover {
  border-color: #f4d777;
  background: rgba(212, 175, 55, 0.1);
}

@media (max-width: 767px) {
  .nav-language {
    margin-left: 0;
    margin-top: 0.5rem;
    justify-content: center;
  }
}
</style>
