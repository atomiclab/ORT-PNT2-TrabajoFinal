/* eslint-disable no-useless-escape */
import servicioCharacters from '../../../servicios/characters.js'
import servicioUsuarios from '../../../servicios/usuarios.js'
import Swal from 'sweetalert2'
import { mapStores } from 'pinia'
import { useAuthStore } from '../../../stores/auth.js'

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
      usuariosOnline: [],
      cargando: false,
      error: null,
      paginaActual: 1,
      usuariosPorPagina: 9,
      mostrarOffline: false,
    }
  },

  computed: {
    ...mapStores(useAuthStore),
    totalPaginas() {
      return Math.ceil(this.usuarios.length / this.usuariosPorPagina)
    },
    usuariosPaginados() {
      const inicio = (this.paginaActual - 1) * this.usuariosPorPagina
      const fin = inicio + this.usuariosPorPagina
      return this.usuarios.slice(inicio, fin)
    },
  },

  methods: {
    async obtenerUsuarios() {
      this.cargando = true
      this.error = null
      try {
        // Verificar autenticación
        if (!this.authStore.isAuthenticated) {
          this.error = 'Debes iniciar sesión para ver los personajes'
          this.cargando = false
          return
        }

        // Obtener usuarios online
        const servicioUsuariosOnline = new servicioUsuarios()
        const resultadoUsuariosOnline = await servicioUsuariosOnline.getOnlineUsers()

        if (resultadoUsuariosOnline.success) {
          this.usuariosOnline = Array.isArray(resultadoUsuariosOnline.data)
            ? resultadoUsuariosOnline.data
            : []
        }

        // Obtener todos los personajes
        const servicio = new servicioCharacters()
        const resultado = await servicio.getAll()
        if (resultado.success) {
          // El endpoint puede devolver un array directamente o dentro de data
          let todosLosPersonajes = Array.isArray(resultado.data) ? resultado.data : []

          // Filtrar personajes según la opción mostrarOffline
          if (this.mostrarOffline) {
            // Si mostrarOffline está activado, mostrar todos los personajes
            this.usuarios = todosLosPersonajes
          } else {
            // Filtrar personajes: solo mostrar aquellos de usuarios online
            // Si el personaje tiene un campo userId o usuarioId, filtrar por eso
            // Si no, filtrar por isOnline === true (personajes que están online)
            if (this.usuariosOnline.length > 0) {
              // Obtener IDs de usuarios online
              const idsUsuariosOnline = this.usuariosOnline.map((u) => u.id)

              // Filtrar personajes: mostrar solo si el personaje pertenece a un usuario online
              // o si el personaje está marcado como online
              this.usuarios = todosLosPersonajes.filter((personaje) => {
                // Si el personaje tiene userId o usuarioId, verificar que esté en la lista de online
                if (personaje.userId && idsUsuariosOnline.includes(personaje.userId)) {
                  return true
                }
                if (personaje.usuarioId && idsUsuariosOnline.includes(personaje.usuarioId)) {
                  return true
                }
                // Si no tiene userId pero tiene isOnline === true, también incluirlo
                if (personaje.isOnline === true) {
                  return true
                }
                return false
              })
            } else {
              // Si no hay usuarios online, mostrar solo personajes marcados como online
              this.usuarios = todosLosPersonajes.filter((personaje) => personaje.isOnline === true)
            }
          }

          this.paginaActual = 1
        } else {
          // Si es un error 401, probablemente el token expiró
          if (resultado.statusCode === 401) {
            this.error = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
            await this.authStore.logout()
          } else {
            this.error = resultado.error || 'Error al cargar los personajes'
          }
          console.error('Error al obtener personajes:', resultado.error)
        }
      } catch (error) {
        this.error = 'Error al cargar los personajes'
        console.error('Error al obtener personajes:', error)
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
                   onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\'%3E%3Crect fill=\'%23ddd\' width=\'120\' height=\'120\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%23999\' font-family=\'Arial\' font-size=\'11\'%3E120x120%3C/text%3E%3C/svg%3E'">
            </div>
            <div style="background: rgba(26, 26, 26, 0.6); padding: 1rem; border-radius: 8px; border: 2px solid #b8941f; margin-bottom: 0.5rem;">
              <p style="margin: 0.5rem 0;"><strong style="color: #d4af37; font-family: 'Cinzel', serif;">Raza:</strong> <span style="color: #c0c0c0;">${usuario.race}</span></p>
              <p style="margin: 0.5rem 0;"><strong style="color: #d4af37; font-family: 'Cinzel', serif;">Clase:</strong> <span style="color: #c0c0c0;">${usuario.class}</span></p>
              <p style="margin: 0.5rem 0;"><strong style="color: #d4af37; font-family: 'Cinzel', serif;">Gremio:</strong> <span style="color: #c0c0c0;">${usuario.guild}</span></p>
            </div>
            <div style="background: rgba(26, 26, 26, 0.6); padding: 1rem; border-radius: 8px; border: 2px solid #b8941f; margin-bottom: 0.5rem;">
              <p style="margin: 0.5rem 0;"><strong style="color: #d4af37; font-family: 'Cinzel', serif;">HP:</strong>
                <span class="badge ${usuario.hp > 50 ? 'bg-success' : usuario.hp > 20 ? 'bg-warning' : 'bg-danger'}"
                      style="padding: 0.35rem 0.7rem; font-weight: 700;">${usuario.hp || 0}</span>
              </p>
              ${
                usuario.shield !== undefined
                  ? `<p style="margin: 0.5rem 0;"><strong style="color: #d4af37; font-family: 'Cinzel', serif;">Escudo:</strong>
                <span class="badge bg-info"
                      style="padding: 0.35rem 0.7rem; font-weight: 700;">${usuario.shield}</span>
              </p>`
                  : ''
              }
              ${
                usuario.level !== undefined
                  ? `<p style="margin: 0.5rem 0;"><strong style="color: #d4af37; font-family: 'Cinzel', serif;">Nivel:</strong>
                <span class="badge bg-primary"
                      style="padding: 0.35rem 0.7rem; font-weight: 700;">${usuario.level}</span>
              </p>`
                  : ''
              }
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
        shield: usuario.shield || 0,
        level: usuario.level || 1,
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
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\'%3E%3Crect fill=\'%23ddd\' width=\'120\' height=\'120\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%23999\' font-family=\'Arial\' font-size=\'11\'%3E120x120%3C/text%3E%3C/svg%3E'">
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
              <label style="display: block; color: #d4af37; font-family: 'Cinzel', serif; margin-bottom: 0.5rem; font-weight: 600;">Escudo</label>
              <input type="number" id="editShield" value="${valoresOriginales.shield}" min="0" max="100"
                     style="width: 100%; padding: 0.5rem; background: rgba(13, 13, 13, 0.8); border: 2px solid #b8941f; border-radius: 4px; color: #c0c0c0; font-family: 'MedievalSharp', cursive;"
                     class="swal-form-input">
            </div>

            <div style="margin-bottom: 1rem;">
              <label style="display: block; color: #d4af37; font-family: 'Cinzel', serif; margin-bottom: 0.5rem; font-weight: 600;">Nivel</label>
              <input type="number" id="editLevel" value="${valoresOriginales.level}" min="1" max="100"
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
              shield: parseInt(document.getElementById('editShield').value) || 0,
              level: parseInt(document.getElementById('editLevel').value) || 1,
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
              currentValues.shield !== valoresOriginales.shield ||
              currentValues.level !== valoresOriginales.level ||
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
              avatarPreview.src =
                e.target.value ||
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect fill='%23ddd' width='120' height='120'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='Arial' font-size='11'%3E120x120%3C/text%3E%3C/svg%3E"
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
          const shield = parseInt(document.getElementById('editShield').value) || 0
          const level = parseInt(document.getElementById('editLevel').value) || 1
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

          if (shield < 0 || shield > 100) {
            Swal.showValidationMessage('El Escudo debe estar entre 0 y 100')
            return false
          }

          if (level < 1 || level > 100) {
            Swal.showValidationMessage('El Nivel debe estar entre 1 y 100')
            return false
          }

          try {
            const servicio = new servicioCharacters()
            const datosActualizados = {
              name,
              race,
              class: classValue,
              guild,
              hp,
              shield,
              level,
              kingdom,
              avatar:
                avatar ||
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect fill='%23ddd' width='120' height='120'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='Arial' font-size='11'%3E120x120%3C/text%3E%3C/svg%3E",
              isOnline,
            }

            const resultado = await servicio.update(usuario.id, datosActualizados)
            if (resultado.success) {
              return resultado.data
            } else {
              Swal.showValidationMessage(resultado.error || 'Error al actualizar el personaje')
              return false
            }
          } catch (err) {
            console.error('Error al actualizar personaje:', err)
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
          const servicio = new servicioCharacters()
          const resultadoDelete = await servicio.delete(id)
          if (resultadoDelete.success) {
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
