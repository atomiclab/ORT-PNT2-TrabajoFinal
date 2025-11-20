<template>
  <div class="container mt-5">
    <div class="text-center mb-5">
      <h1 class="home-title">⚔️ {{ $t('home.title') }} ⚔️</h1>
      <p class="home-subtitle">{{ $t('home.subtitle') }}</p>
    </div>

    <div class="home-content">
      <div class="intro-section">
        <h2 class="section-title">{{ $t('home.welcome.title') }}</h2>
        <p class="intro-text">
          {{ $t('home.welcome.paragraph1') }}
        </p>
        <p class="intro-text">
          {{ $t('home.welcome.paragraph2') }}
        </p>
      </div>

      <div class="features-section mt-5">
        <h3 class="features-title">{{ $t('home.features.title') }}</h3>
        <div class="features-grid">
          <div class="feature-card">
            <span class="feature-icon">👤</span>
            <h4>{{ $t('home.features.createCharacters.title') }}</h4>
            <p>{{ $t('home.features.createCharacters.description') }}</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">🎲</span>
            <h4>{{ $t('home.features.diceSystem.title') }}</h4>
            <p>{{ $t('home.features.diceSystem.description') }}</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">🗺️</span>
            <h4>{{ $t('home.features.exploreWorlds.title') }}</h4>
            <p>{{ $t('home.features.exploreWorlds.description') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InicioView',
}
</script>

<style scoped>
.home-title {
  font-family: 'Cinzel Decorative', cursive;
  font-size: 3.5rem;
  color: #d4af37;
  text-shadow:
    2px 2px 4px rgba(0, 0, 0, 0.8),
    0 0 20px rgba(212, 175, 55, 0.6);
  margin-bottom: 1rem;
  letter-spacing: 4px;
}

.home-subtitle {
  font-family: 'Cinzel', serif;
  font-size: 1.5rem;
  color: #c0c0c0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
  letter-spacing: 2px;
}

.home-content {
  max-width: 1000px;
  margin: 0 auto;
}

.intro-section {
  background: linear-gradient(135deg, rgba(61, 41, 20, 0.7) 0%, rgba(26, 26, 26, 0.7) 100%);
  border: 2px solid #d4af37;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.6),
    0 0 20px rgba(212, 175, 55, 0.3);
}

.section-title {
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  color: #d4af37;
  text-shadow:
    1px 1px 2px rgba(0, 0, 0, 0.8),
    0 0 10px rgba(212, 175, 55, 0.4);
  margin-bottom: 1.5rem;
  letter-spacing: 2px;
}

.intro-text {
  font-family: 'MedievalSharp', cursive;
  font-size: 1.15rem;
  color: #e0e0e0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  line-height: 1.8;
  margin-bottom: 1rem;
}

.features-section {
  text-align: center;
}

.features-title {
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  color: #d4af37;
  text-shadow:
    1px 1px 2px rgba(0, 0, 0, 0.8),
    0 0 10px rgba(212, 175, 55, 0.4);
  margin-bottom: 2rem;
  letter-spacing: 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: linear-gradient(135deg, rgba(61, 41, 20, 0.8) 0%, rgba(26, 26, 26, 0.8) 100%);
  border: 2px solid #d4af37;
  border-radius: 10px;
  padding: 2rem;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.5),
    0 0 15px rgba(212, 175, 55, 0.2);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.6),
    0 0 25px rgba(212, 175, 55, 0.4);
  border-color: #f4d03f;
}

.feature-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.5));
}

.feature-card h4 {
  font-family: 'Cinzel', serif;
  font-size: 1.3rem;
  color: #d4af37;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  margin-bottom: 0.75rem;
  letter-spacing: 1px;
}

.feature-card p {
  font-family: 'MedievalSharp', cursive;
  font-size: 1rem;
  color: #c0c0c0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .home-title {
    font-size: 2.5rem;
  }

  .home-subtitle {
    font-size: 1.2rem;
  }

  .intro-section {
    padding: 1.5rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
