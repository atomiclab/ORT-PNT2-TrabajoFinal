export default {
  data() {
    return {
      email: '',
      password: '',
      emailError: '',
      isFormValid: false,
    };
  },
  methods: {
    validateEmail() {
      const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!this.email) {
        this.emailError = '';
      } else if (!emailRegex.test(this.email)) {
        this.emailError = 'Por favor, introduce un formato de email válido.';
      } else {
        this.emailError = '';
      }
      this.validateForm();
    },
    validateForm() {
      this.isFormValid = this.email && !this.emailError && this.password;
    },
    login() {
      if (this.isFormValid) {
        alert('Inicio de sesión exitoso con email: ' + this.email);
        // Aquí iría la lógica real de inicio de sesión
      } else {
        alert('Por favor, completa ambos campos correctamente.');
      }
    },
  },
};
