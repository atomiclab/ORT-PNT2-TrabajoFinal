import servicioProductos from '../../../servicios/productos.js'
import Swal from 'sweetalert2'

export default {
  name: 'Guild',

  components: {
    // componentes hijos
  },

  props: {
    // ejemplo: titulo: { type: String, default: '' }
  },

  data() {
    return {
      usuarios: [],
      cargando: false,
      error: null,
      paginaActual: 1,
      usuariosPorPagina: 9,
    }
  },

  computed: {
    totalPaginas() {
      return Math.ceil(this.usuarios.length / this.usuariosPorPagina)
    },
    usuariosPaginados() {
      const inicio = (this.paginaActual - 1) * this.usuariosPorPagina
      const fin = inicio + this.usuariosPorPagina
      return this.usuarios.slice(inicio, fin)
    },
  },

  watch: {
    // observadores
  },

  methods: {
    async obtenerUsuarios() {
      this.cargando = true
      this.error = null
      try {
        const servicio = new servicioProductos()
        const usuarios = await servicio.getAll()
        this.usuarios = usuarios || []
        this.paginaActual = 1
      } catch (error) {
        this.error = 'Error al cargar los usuarios'
        console.error('Error al obtener usuarios:', error)
      } finally {
        this.cargando = false
      }
    },
    irAPagina(pagina) {
      if (pagina >= 1 && pagina <= this.totalPaginas) {
        this.paginaActual = pagina
      }
    },
    paginaAnterior() {
      if (this.paginaActual > 1) {
        this.paginaActual--
      }
    },
    paginaSiguiente() {
      if (this.paginaActual < this.totalPaginas) {
        this.paginaActual++
      }
    },
    mostrarMasInfo(usuario) {
      Swal.fire({
        title: `<span style="font-family: 'Cinzel Decorative', cursive; color: #d4af37; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">${usuario.name}</span>`,
        html: `
          <div style="font-family: 'MedievalSharp', cursive; color: #c0c0c0; text-align: left;">
            <div style="text-align: center; margin-bottom: 1.5rem;">
              <img src="${usuario.avatar}" alt="${usuario.name}" 
                   style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid #d4af37; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.5);"
                   onerror="this.src='https://via.placeholder.com/120'">
            </div>
            <div style="background: rgba(26, 26, 26, 0.6); padding: 1rem; border-radius: 8px; border: 2px solid #b8941f; margin-bottom: 0.5rem;">
              <p style="margin: 0.5rem 0;"><strong style="color: #d4af37; font-family: 'Cinzel', serif;">Raza:</strong> <span style="color: #c0c0c0;">${usuario.race}</span></p>
              <p style="margin: 0.5rem 0;"><strong style="color: #d4af37; font-family: 'Cinzel', serif;">Clase:</strong> <span style="color: #c0c0c0;">${usuario.class}</span></p>
              <p style="margin: 0.5rem 0;"><strong style="color: #d4af37; font-family: 'Cinzel', serif;">Gremio:</strong> <span style="color: #c0c0c0;">${usuario.guild}</span></p>
            </div>
            <div style="background: rgba(26, 26, 26, 0.6); padding: 1rem; border-radius: 8px; border: 2px solid #b8941f; margin-bottom: 0.5rem;">
              <p style="margin: 0.5rem 0;"><strong style="color: #d4af37; font-family: 'Cinzel', serif;">HP:</strong> 
                <span class="badge ${usuario.hp > 50 ? 'bg-success' : usuario.hp > 20 ? 'bg-warning' : 'bg-danger'}" 
                      style="padding: 0.35rem 0.7rem; font-weight: 700;">${usuario.hp}</span>
              </p>
              <p style="margin: 0.5rem 0;"><strong style="color: #d4af37; font-family: 'Cinzel', serif;">Reino:</strong> <span style="color: #c0c0c0;">${usuario.kingdom}</span></p>
              <p style="margin: 0.5rem 0;"><strong style="color: #d4af37; font-family: 'Cinzel', serif;">Estado:</strong> 
                <span class="badge ${usuario.isOnline ? 'bg-success' : 'bg-secondary'}" 
                      style="padding: 0.35rem 0.7rem; font-weight: 600;">${usuario.isOnline ? 'En línea' : 'Offline'}</span>
              </p>
            </div>
          </div>
        `,
        width: '600px',
        background:
          'linear-gradient(135deg, rgba(61, 41, 20, 0.98) 0%, rgba(26, 26, 26, 0.98) 100%)',
        color: '#c0c0c0',
        backdrop: `
          rgba(0,0,0,0.8)
        `,
        customClass: {
          popup: 'swal-medieval-popup',
          title: 'swal-medieval-title',
          htmlContainer: 'swal-medieval-content',
          confirmButton: 'swal-medieval-confirm',
        },
        buttonsStyling: false,
        confirmButtonText:
          '<span style="font-family: \'Cinzel\', serif; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Cerrar</span>',
        confirmButtonColor: 'transparent',
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      })
    },
    async borrarUsuario(id) {
      const usuario = this.usuarios.find((u) => u.id === id)
      const resultado = await Swal.fire({
        title:
          '<span style="font-family: \'Cinzel Decorative\', cursive; color: #d4af37; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">¿Eliminar Personaje?</span>',
        html: `
          <div style="font-family: 'MedievalSharp', cursive; color: #c0c0c0;">
            <p>¿Estás seguro de que deseas borrar a <strong style="color: #d4af37; font-family: 'Cinzel', serif;">${usuario ? usuario.name : 'este personaje'}</strong>?</p>
            <p style="color: #e74c3c; font-size: 0.9rem;">Esta acción no se puede deshacer.</p>
          </div>
        `,
        icon: 'warning',
        iconColor: '#e74c3c',
        showCancelButton: true,
        background:
          'linear-gradient(135deg, rgba(61, 41, 20, 0.98) 0%, rgba(26, 26, 26, 0.98) 100%)',
        color: '#c0c0c0',
        customClass: {
          popup: 'swal-medieval-popup',
          title: 'swal-medieval-title',
          htmlContainer: 'swal-medieval-content',
          confirmButton: 'swal-medieval-confirm-delete',
          cancelButton: 'swal-medieval-cancel',
        },
        buttonsStyling: false,
        confirmButtonText:
          '<span style="font-family: \'Cinzel\', serif; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Sí, Borrar</span>',
        cancelButtonText:
          '<span style="font-family: \'Cinzel\', serif; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Cancelar</span>',
        confirmButtonColor: 'transparent',
        cancelButtonColor: 'transparent',
        reverseButtons: true,
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      })

      if (resultado.isConfirmed) {
        try {
          const servicio = new servicioProductos()
          const exito = await servicio.delete(id)
          if (exito) {
            // Remover el usuario de la lista local
            this.usuarios = this.usuarios.filter((usuario) => usuario.id !== id)
            // Ajustar la página actual si es necesario
            if (this.usuariosPaginados.length === 0 && this.paginaActual > 1) {
              this.paginaActual--
            }
            await Swal.fire({
              title:
                '<span style="font-family: \'Cinzel Decorative\', cursive; color: #d4af37; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">¡Eliminado!</span>',
              html: '<div style="font-family: \'MedievalSharp\', cursive; color: #c0c0c0;">El personaje ha sido borrado exitosamente.</div>',
              icon: 'success',
              iconColor: '#28a745',
              background:
                'linear-gradient(135deg, rgba(61, 41, 20, 0.98) 0%, rgba(26, 26, 26, 0.98) 100%)',
              color: '#c0c0c0',
              customClass: {
                popup: 'swal-medieval-popup',
                title: 'swal-medieval-title',
                htmlContainer: 'swal-medieval-content',
                confirmButton: 'swal-medieval-confirm',
              },
              buttonsStyling: false,
              confirmButtonText:
                '<span style="font-family: \'Cinzel\', serif; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Aceptar</span>',
              confirmButtonColor: 'transparent',
              timer: 2000,
              showClass: {
                popup: 'animate__animated animate__fadeInDown',
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp',
              },
            })
          } else {
            await Swal.fire({
              title:
                '<span style="font-family: \'Cinzel Decorative\', cursive; color: #d4af37; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">Error</span>',
              html: '<div style="font-family: \'MedievalSharp\', cursive; color: #c0c0c0;">No se pudo borrar el personaje. Intenta nuevamente.</div>',
              icon: 'error',
              iconColor: '#e74c3c',
              background:
                'linear-gradient(135deg, rgba(61, 41, 20, 0.98) 0%, rgba(26, 26, 26, 0.98) 100%)',
              color: '#c0c0c0',
              customClass: {
                popup: 'swal-medieval-popup',
                title: 'swal-medieval-title',
                htmlContainer: 'swal-medieval-content',
                confirmButton: 'swal-medieval-confirm',
              },
              buttonsStyling: false,
              confirmButtonText:
                '<span style="font-family: \'Cinzel\', serif; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Aceptar</span>',
              confirmButtonColor: 'transparent',
              showClass: {
                popup: 'animate__animated animate__fadeInDown',
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp',
              },
            })
          }
        } catch (error) {
          console.error('Error al borrar usuario:', error)
          await Swal.fire({
            title:
              '<span style="font-family: \'Cinzel Decorative\', cursive; color: #d4af37; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">Error</span>',
            html: '<div style="font-family: \'MedievalSharp\', cursive; color: #c0c0c0;">Ocurrió un error al intentar borrar el personaje.</div>',
            icon: 'error',
            iconColor: '#e74c3c',
            background:
              'linear-gradient(135deg, rgba(61, 41, 20, 0.98) 0%, rgba(26, 26, 26, 0.98) 100%)',
            color: '#c0c0c0',
            customClass: {
              popup: 'swal-medieval-popup',
              title: 'swal-medieval-title',
              htmlContainer: 'swal-medieval-content',
              confirmButton: 'swal-medieval-confirm',
            },
            buttonsStyling: false,
            confirmButtonText:
              '<span style="font-family: \'Cinzel\', serif; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Aceptar</span>',
            confirmButtonColor: 'transparent',
            showClass: {
              popup: 'animate__animated animate__fadeInDown',
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp',
            },
          })
        }
      }
    },
  },

  created() {
    // hook de creación
  },
  mounted() {
    // hook de montaje
    this.obtenerUsuarios()
  },
  unmounted() {
    // hook de desmontaje
  },
}
