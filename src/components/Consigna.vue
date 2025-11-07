<template>
  <div class="container mt-3">
    <div class="text-center mb-4">
      <h3 class="page-title">📜 TP Final</h3>
      <p class="page-description">
        Debajo se podrá acceder a la consigna del trabajo práctico final.
      </p>
    </div>

    <div class="text-center mb-4">
      <a class="btn btn-primary btn-lg" href="/TPFinal.pdf" target="_blank" rel="noopener">
        <span class="btn-icon">📖</span>
        <span>Abrir consigna en nueva pestaña</span>
      </a>
    </div>

    <div class="ratio ratio-16x9 document-viewer">
      <iframe src="/TPFinal.pdf" title="Consigna del examen" class="document-frame"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConsignaView',
}
</script>

<style scoped>
.page-title {
  font-family: 'Cinzel Decorative', cursive;
  font-size: 2.5rem;
  color: #d4af37;
  text-shadow:
    2px 2px 4px rgba(0, 0, 0, 0.8),
    0 0 15px rgba(212, 175, 55, 0.5);
  margin-bottom: 1rem;
  letter-spacing: 3px;
}

.page-description {
  font-family: 'MedievalSharp', cursive;
  font-size: 1.1rem;
  color: #c0c0c0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  max-width: 600px;
  margin: 0 auto;
}

.btn-lg {
  font-size: 1.1rem;
  padding: 0.75rem 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-icon {
  font-size: 1.25rem;
  filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.5));
}

.document-viewer {
  min-height: 70vh;
  background: linear-gradient(135deg, rgba(61, 41, 20, 0.9) 0%, rgba(26, 26, 26, 0.9) 100%);
  border: 3px solid #d4af37;
  border-radius: 12px;
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.6),
    0 0 20px rgba(212, 175, 55, 0.3);
  padding: 1rem;
  overflow: hidden;
}

.document-frame {
  width: 100%;
  height: 100%;
  border: 2px solid #b8941f;
  border-radius: 8px;
  background: white;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
}
</style>
