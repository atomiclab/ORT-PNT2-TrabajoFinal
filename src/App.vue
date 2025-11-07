<template>
  <div class="container-fluid mt-3">
    <div class="card">
      <div class="card-header">
        <header>
          <h2>Master of the Guilds</h2>
        </header>
      </div>

      <div class="card-body">
        <main>
          <Navbar />

          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
export default {
  name: 'App',
  components: {
    Navbar,
  },
}
</script>

<style scoped>
.container-fluid {
  padding: 1rem;
}

.card {
  background: linear-gradient(135deg, rgba(61, 41, 20, 0.9) 0%, rgba(26, 26, 26, 0.9) 100%);
  border: 3px solid #d4af37;
  border-radius: 12px;
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.6),
    0 0 20px rgba(212, 175, 55, 0.3);
}

.card-header {
  background: linear-gradient(135deg, #3d2914 0%, #5a3d22 100%);
  border-bottom: 3px solid #d4af37;
  padding: 1.5rem;
  text-align: center;
}

.card-header h2 {
  font-family: 'Cinzel Decorative', cursive;
  font-size: 2rem;
  color: #d4af37;
  text-shadow:
    2px 2px 4px rgba(0, 0, 0, 0.8),
    0 0 15px rgba(212, 175, 55, 0.5);
  margin: 0;
  letter-spacing: 2px;
}

.card-body {
  background: rgba(13, 13, 13, 0.5);
  padding: 2rem;
}
</style>
