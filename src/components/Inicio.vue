<template>
  <div class="container mt-3">
    <h3>TP Final</h3>
    <p class="mb-3">Debajo se podra acceder a la consigna del trabajo practico final.</p>

    <div class="mb-3">
      <a class="btn btn-primary btn-sm" href="/TPFinal.pdf" target="_blank" rel="noopener">
        Abrir consigna en nueva pestaña
      </a>
    </div>

    <div class="ratio ratio-16x9" style="min-height: 70vh">
      <iframe
        src="/TPFinal.pdf"
        title="Consigna del examen"
        style="width: 100%; height: 100%; border: 1px solid #ddd; border-radius: 4px"
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InicioView',
}
</script>

<style scoped></style>
