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
          cancelButton: 'swal-medieval-edit',
        },
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText:
          '<span style="font-family: \'Cinzel\', serif; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Cerrar</span>',
        cancelButtonText:
          '<span style="font-family: \'Cinzel\', serif; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Editar</span>',
        confirmButtonColor: 'transparent',
        cancelButtonColor: 'transparent',
        reverseButtons: true,
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          this.editarUsuario(usuario)
        }
      })
    },
    editarUsuario(usuario) {
      // Guardar los valores originales para comparar
      const valoresOriginales = {
        name: usuario.name || '',
        race: usuario.race || '',
        class: usuario.class || '',
        guild: usuario.guild || '',
        hp: usuario.hp || 0,
        kingdom: usuario.kingdom || '',
        avatar: usuario.avatar || '',
        isOnline: usuario.isOnline || false,
      }

      // Crear el HTML del formulario
      const formHtml = `
        <form id="formEditarUsuario" style="font-family: 'MedievalSharp', cursive; color: #c0c0c0;">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <img id="avatarPreview" src="${valoresOriginales.avatar}" alt="${valoresOriginales.name}" 
                 style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid #d4af37; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.5);"
                 onerror="this.src='https://via.placeholder.com/120'">
          </div>
          
          <div style="background: rgba(26, 26, 26, 0.6); padding: 1rem; border-radius: 8px; border: 2px solid #b8941f; margin-bottom: 1rem;">
            <div style="margin-bottom: 1rem;">
              <label style="display: block; color: #d4af37; font-family: 'Cinzel', serif; margin-bottom: 0.5rem; font-weight: 600;">Nombre</label>
              <input type="text" id="editName" value="${valoresOriginales.name}" 
                     style="width: 100%; padding: 0.5rem; background: rgba(13, 13, 13, 0.8); border: 2px solid #b8941f; border-radius: 4px; color: #c0c0c0; font-family: 'MedievalSharp', cursive;"
                     class="swal-form-input">
            </div>
            
            <div style="margin-bottom: 1rem;">
              <label style="display: block; color: #d4af37; font-family: 'Cinzel', serif; margin-bottom: 0.5rem; font-weight: 600;">Avatar URL</label>
              <input type="text" id="editAvatar" value="${valoresOriginales.avatar}" 
                     style="width: 100%; padding: 0.5rem; background: rgba(13, 13, 13, 0.8); border: 2px solid #b8941f; border-radius: 4px; color: #c0c0c0; font-family: 'MedievalSharp', cursive;"
                     class="swal-form-input">
            </div>
            
            <div style="margin-bottom: 1rem;">
              <label style="display: block; color: #d4af37; font-family: 'Cinzel', serif; margin-bottom: 0.5rem; font-weight: 600;">Raza</label>
              <input type="text" id="editRace" value="${valoresOriginales.race}" 
                     style="width: 100%; padding: 0.5rem; background: rgba(13, 13, 13, 0.8); border: 2px solid #b8941f; border-radius: 4px; color: #c0c0c0; font-family: 'MedievalSharp', cursive;"
                     class="swal-form-input">
            </div>
            
            <div style="margin-bottom: 1rem;">
              <label style="display: block; color: #d4af37; font-family: 'Cinzel', serif; margin-bottom: 0.5rem; font-weight: 600;">Clase</label>
              <input type="text" id="editClass" value="${valoresOriginales.class}" 
                     style="width: 100%; padding: 0.5rem; background: rgba(13, 13, 13, 0.8); border: 2px solid #b8941f; border-radius: 4px; color: #c0c0c0; font-family: 'MedievalSharp', cursive;"
                     class="swal-form-input">
            </div>
            
            <div style="margin-bottom: 1rem;">
              <label style="display: block; color: #d4af37; font-family: 'Cinzel', serif; margin-bottom: 0.5rem; font-weight: 600;">Gremio</label>
              <input type="text" id="editGuild" value="${valoresOriginales.guild}" 
                     style="width: 100%; padding: 0.5rem; background: rgba(13, 13, 13, 0.8); border: 2px solid #b8941f; border-radius: 4px; color: #c0c0c0; font-family: 'MedievalSharp', cursive;"
                     class="swal-form-input">
            </div>
          </div>
          
          <div style="background: rgba(26, 26, 26, 0.6); padding: 1rem; border-radius: 8px; border: 2px solid #b8941f; margin-bottom: 1rem;">
            <div style="margin-bottom: 1rem;">
              <label style="display: block; color: #d4af37; font-family: 'Cinzel', serif; margin-bottom: 0.5rem; font-weight: 600;">HP</label>
              <input type="number" id="editHp" value="${valoresOriginales.hp}" min="0" max="100"
                     style="width: 100%; padding: 0.5rem; background: rgba(13, 13, 13, 0.8); border: 2px solid #b8941f; border-radius: 4px; color: #c0c0c0; font-family: 'MedievalSharp', cursive;"
                     class="swal-form-input">
            </div>
            
            <div style="margin-bottom: 1rem;">
              <label style="display: block; color: #d4af37; font-family: 'Cinzel', serif; margin-bottom: 0.5rem; font-weight: 600;">Reino</label>
              <input type="text" id="editKingdom" value="${valoresOriginales.kingdom}" 
                     style="width: 100%; padding: 0.5rem; background: rgba(13, 13, 13, 0.8); border: 2px solid #b8941f; border-radius: 4px; color: #c0c0c0; font-family: 'MedievalSharp', cursive;"
                     class="swal-form-input">
            </div>
            
            <div style="margin-bottom: 1rem;">
              <label style="display: block; color: #d4af37; font-family: 'Cinzel', serif; margin-bottom: 0.5rem; font-weight: 600;">Estado</label>
              <select id="editIsOnline" 
                      style="width: 100%; padding: 0.5rem; background: rgba(13, 13, 13, 0.8); border: 2px solid #b8941f; border-radius: 4px; color: #c0c0c0; font-family: 'MedievalSharp', cursive;"
                      class="swal-form-input">
                <option value="true" ${valoresOriginales.isOnline ? 'selected' : ''}>En línea</option>
                <option value="false" ${!valoresOriginales.isOnline ? 'selected' : ''}>Offline</option>
              </select>
            </div>
          </div>
        </form>
      `

      Swal.fire({
        title:
          '<span style="font-family: \'Cinzel Decorative\', cursive; color: #d4af37; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">Editar Personaje</span>',
        html: formHtml,
        width: '700px',
        background:
          'linear-gradient(135deg, rgba(61, 41, 20, 0.98) 0%, rgba(26, 26, 26, 0.98) 100%)',
        color: '#c0c0c0',
        backdrop: 'rgba(0,0,0,0.8)',
        customClass: {
          popup: 'swal-medieval-popup',
          title: 'swal-medieval-title',
          htmlContainer: 'swal-medieval-content',
          confirmButton: 'swal-medieval-confirm-edit',
          cancelButton: 'swal-medieval-cancel',
        },
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText:
          '<span style="font-family: \'Cinzel\', serif; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Guardar</span>',
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
        didOpen: () => {
          // Función para verificar si hay cambios (estado dirty)
          const checkDirty = () => {
            const currentValues = {
              name: document.getElementById('editName').value.trim(),
              race: document.getElementById('editRace').value.trim(),
              class: document.getElementById('editClass').value.trim(),
              guild: document.getElementById('editGuild').value.trim(),
              hp: parseInt(document.getElementById('editHp').value) || 0,
              kingdom: document.getElementById('editKingdom').value.trim(),
              avatar: document.getElementById('editAvatar').value.trim(),
              isOnline: document.getElementById('editIsOnline').value === 'true',
            }

            // Comparar valores actuales con originales
            const isDirty =
              currentValues.name !== valoresOriginales.name ||
              currentValues.race !== valoresOriginales.race ||
              currentValues.class !== valoresOriginales.class ||
              currentValues.guild !== valoresOriginales.guild ||
              currentValues.hp !== valoresOriginales.hp ||
              currentValues.kingdom !== valoresOriginales.kingdom ||
              currentValues.avatar !== valoresOriginales.avatar ||
              currentValues.isOnline !== valoresOriginales.isOnline

            // Habilitar/deshabilitar botón guardar
            const confirmButton = Swal.getConfirmButton()
            if (confirmButton) {
              if (isDirty) {
                confirmButton.disabled = false
                confirmButton.style.opacity = '1'
                confirmButton.style.cursor = 'pointer'
              } else {
                confirmButton.disabled = true
                confirmButton.style.opacity = '0.5'
                confirmButton.style.cursor = 'not-allowed'
              }
            }
          }

          // Agregar event listeners a todos los campos del formulario
          const inputs = document.querySelectorAll('.swal-form-input')
          inputs.forEach((input) => {
            input.addEventListener('input', checkDirty)
            input.addEventListener('change', checkDirty)
          })

          // Actualizar preview del avatar cuando cambie la URL
          const avatarInput = document.getElementById('editAvatar')
          const avatarPreview = document.getElementById('avatarPreview')
          if (avatarInput && avatarPreview) {
            avatarInput.addEventListener('input', (e) => {
              avatarPreview.src = e.target.value || 'https://via.placeholder.com/120'
              checkDirty()
            })
          }

          // Inicialmente deshabilitar el botón guardar
          checkDirty()
        },
        preConfirm: async () => {
          const name = document.getElementById('editName').value.trim()
          const race = document.getElementById('editRace').value.trim()
          const classValue = document.getElementById('editClass').value.trim()
          const guild = document.getElementById('editGuild').value.trim()
          const hp = parseInt(document.getElementById('editHp').value) || 0
          const kingdom = document.getElementById('editKingdom').value.trim()
          const avatar = document.getElementById('editAvatar').value.trim()
          const isOnline = document.getElementById('editIsOnline').value === 'true'

          // Validación básica
          if (!name || !race || !classValue || !guild || !kingdom) {
            Swal.showValidationMessage('Por favor completa todos los campos requeridos')
            return false
          }

          if (hp < 0 || hp > 100) {
            Swal.showValidationMessage('El HP debe estar entre 0 y 100')
            return false
          }

          try {
            const servicio = new servicioProductos()
            const datosActualizados = {
              name,
              race,
              class: classValue,
              guild,
              hp,
              kingdom,
              avatar: avatar || 'https://via.placeholder.com/120',
              isOnline,
            }

            const usuarioActualizado = await servicio.put(usuario.id, datosActualizados)
            return usuarioActualizado
          } catch (err) {
            console.error('Error al actualizar usuario:', err)
            Swal.showValidationMessage('Error al actualizar el personaje')
            return false
          }
        },
      }).then(async (result) => {
        if (result.isConfirmed && result.value) {
          // Actualizar el usuario en la lista local
          const index = this.usuarios.findIndex((u) => u.id === usuario.id)
          if (index !== -1) {
            this.usuarios[index] = { ...this.usuarios[index], ...result.value }
          }

          await Swal.fire({
            title:
              '<span style="font-family: \'Cinzel Decorative\', cursive; color: #d4af37; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">¡Actualizado!</span>',
            html: '<div style="font-family: \'MedievalSharp\', cursive; color: #c0c0c0;">El personaje ha sido actualizado exitosamente.</div>',
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
        }
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
