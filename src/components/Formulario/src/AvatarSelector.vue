<template>
  <div class="row" v-if="race">
    <div class="col-12 mb-3">
      <label class="form-label">Selecciona un Avatar</label>
      <div v-if="avatars.length === 0" class="alert alert-warning">
        No hay avatares disponibles para esta raza: {{ race }}
      </div>
      <div v-else class="avatar-grid">
        <div
          v-for="(avatarUrl, index) in avatars"
          :key="`${race}-${index}`"
          class="avatar-option"
          :class="{ selected: selected === avatarUrl, invalid: showError && !selected }"
          @click="onSelect(avatarUrl)"
        >
          <img
            :src="avatarUrl"
            :alt="`Avatar ${race} ${index + 1}`"
            @error="fallbackImage"
          />
          <div class="avatar-check" v-if="selected === avatarUrl">✓</div>
        </div>
      </div>
      <div class="invalid-feedback" v-if="showError">{{ errorMessage }}</div>
      <div class="valid-feedback" v-else-if="isValid">Avatar seleccionado</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AvatarSelector',
  props: {
    avatars: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: String,
      default: '',
    },
    race: {
      type: String,
      default: '',
    },
    showError: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: '',
    },
    isValid: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['select-avatar'],
  methods: {
    onSelect(url) {
      this.$emit('select-avatar', url)
    },
    fallbackImage(event) {
      event.target.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23ddd' width='150' height='150'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='Arial' font-size='14'%3EError%3C/text%3E%3C/svg%3E"
    },
  },
}
</script>

