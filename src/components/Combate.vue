<template>
  <div class="combate-container">
    <h1>Arena de Combate</h1>
    <div class="character-selection">
      <div class="player-character">
        <h2>Tu Personaje</h2>
        <div v-if="isLoadingCharacters">Cargando personajes...</div>
        <div v-else-if="charactersError" class="error-message">{{ charactersError }}</div>
        <select v-else v-model="selectedPlayerCharacter" @change="loadPlayerCharacterStats">
          <option disabled value="">Selecciona tu personaje</option>
          <option v-for="char in characters" :key="char.id" :value="char.id">
            {{ char.name }} (HP: {{ char.hp || 0 }})
          </option>
        </select>
        <div v-if="selectedPlayerCharacter" class="character-stats">
          <div class="character-avatar-container">
            <img
              v-if="playerCharacter.avatar"
              :src="playerCharacter.avatar"
              :alt="playerCharacter.name"
              class="character-avatar-img"
              @error="$event.target.src='https://via.placeholder.com/80'"
            />
            <img
              v-else
              src="https://via.placeholder.com/80"
              :alt="playerCharacter.name"
              class="character-avatar-img"
            />
          </div>
          <h3>{{ playerCharacter.name }}</h3>
          <p>Vida: {{ playerCharacter.hp }}</p>
          <p>Escudo: {{ playerCharacter.shield }}</p>
        </div>
      </div>
      <div class="opponent-character">
        <h2>Oponente Online</h2>
        <div v-if="isLoadingUsuariosOnline">Cargando usuarios online...</div>
        <div v-else-if="usuariosOnlineError" class="error-message">{{ usuariosOnlineError }}</div>
        <template v-else>
          <div class="opponent-selectors">
            <select v-model="selectedOpponentUser" @change="loadOpponentCharacters" class="opponent-user-select">
              <option disabled value="">Selecciona un usuario oponente</option>
              <option v-for="usuario in usuariosOnline" :key="usuario.id" :value="usuario.id">
                {{ usuario.nombre || usuario.email }}
              </option>
            </select>
            <div v-if="selectedOpponentUser && isLoadingOpponentCharacters" class="loading-message">
              Cargando personajes del oponente...
            </div>
            <select v-else-if="selectedOpponentUser && opponentCharacters.length > 0" v-model="selectedOpponentCharacter" @change="loadOpponentCharacterStats" class="opponent-character-select">
              <option disabled value="">Selecciona un personaje</option>
              <option v-for="char in opponentCharacters" :key="char.id" :value="char.id">
                {{ char.name }} (HP: {{ char.hp }})
              </option>
            </select>
            <div v-else-if="selectedOpponentUser && opponentCharacters.length === 0" class="error-message">
              Este usuario no tiene personajes online disponibles
            </div>
          </div>
          <div v-if="selectedOpponentCharacter" class="character-stats">
            <div class="character-avatar-container">
              <img
                v-if="opponentCharacter.avatar"
                :src="opponentCharacter.avatar"
                :alt="opponentCharacter.name || 'Oponente'"
                class="character-avatar-img"
                @error="$event.target.src='https://via.placeholder.com/80'"
              />
              <img
                v-else
                src="https://via.placeholder.com/80"
                :alt="opponentCharacter.name || 'Oponente'"
                class="character-avatar-img"
              />
            </div>
            <h3>{{ opponentCharacter.name || 'Oponente' }}</h3>
            <p>Vida: {{ opponentCharacter.hp }}</p>
            <p v-if="opponentCharacter.shield !== undefined">Escudo: {{ opponentCharacter.shield }}</p>
          </div>
        </template>
      </div>
    </div>
    <button @click="startCombat" :disabled="!selectedPlayerCharacter || !selectedOpponentCharacter || isBattleLoading">
      <span v-if="isBattleLoading">Ejecutando batalla...</span>
      <span v-else>Iniciar Combate</span>
    </button>

    <div v-if="battleError" class="error-message battle-error">
      <strong>Error en la batalla:</strong> {{ battleError }}
    </div>

    <div v-if="battleResult" class="combat-log">
      <h2>Resultado del Combate</h2>
      <div class="battle-info">
        <p class="battle-id"><strong>ID de Batalla:</strong> {{ battleResult.battleId }}</p>
        <p class="battle-date"><strong>Fecha y Hora:</strong> {{ formatBattleDate(battleResult.dateTimePelea) }}</p>
      </div>
      
      <div class="battle-participants">
        <div class="participant retador">
          <div class="participant-avatar-container">
            <img
              v-if="getRetadorAvatar()"
              :src="getRetadorAvatar()"
              :alt="battleResult.retador.name"
              class="participant-avatar-img"
              @error="$event.target.src='https://via.placeholder.com/100'"
            />
            <img
              v-else
              src="https://via.placeholder.com/100"
              :alt="battleResult.retador.name"
              class="participant-avatar-img"
            />
          </div>
          <h3>Retador: {{ battleResult.retador.name }}</h3>
          <div class="participant-stats">
            <p><strong>HP Antes:</strong> {{ battleResult.retador.hpAntes }}</p>
            <p><strong>HP Después:</strong> {{ battleResult.retador.hpDespues }}</p>
            <p><strong>Dado Lanzado:</strong> {{ battleResult.retador.dado }}</p>
            <p><strong>Daño Recibido:</strong> {{ battleResult.retador.dañoRecibido }}</p>
          </div>
        </div>
        
        <div class="participant retado">
          <div class="participant-avatar-container">
            <img
              v-if="getRetadoAvatar()"
              :src="getRetadoAvatar()"
              :alt="battleResult.retado.name"
              class="participant-avatar-img"
              @error="$event.target.src='https://via.placeholder.com/100'"
            />
            <img
              v-else
              src="https://via.placeholder.com/100"
              :alt="battleResult.retado.name"
              class="participant-avatar-img"
            />
          </div>
          <h3>Retado: {{ battleResult.retado.name }}</h3>
          <div class="participant-stats">
            <p><strong>HP Antes:</strong> {{ battleResult.retado.hpAntes }}</p>
            <p><strong>HP Después:</strong> {{ battleResult.retado.hpDespues }}</p>
            <p><strong>Dado Lanzado:</strong> {{ battleResult.retado.dado }}</p>
            <p><strong>Daño Recibido:</strong> {{ battleResult.retado.dañoRecibido }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import servicioAuth from '../servicios/auth.js'
import servicioCharacters from '../servicios/characters.js'
import servicioUsuarios from '../servicios/usuarios.js'
import servicioBattle from '../servicios/battle.js'

export default {
  name: 'Combate',
  data() {
    return {
      selectedPlayerCharacter: '',
      selectedOpponentUser: '', // ID del usuario oponente
      selectedOpponentCharacter: '', // ID del personaje oponente
      playerCharacter: {
        name: '',
        health: 0,
        hp: 0,
        shield: 0,
        avatar: '',
      },
      opponentCharacter: {
        name: '',
        health: 0,
        hp: 0,
        shield: 0,
        avatar: '',
      },
      battleResult: null, // Resultado completo de la batalla
      battleError: null, // Error específico de la batalla
      isBattleLoading: false, // Estado de carga durante la batalla
      user: null, // Para almacenar el usuario autenticado
      characters: [], // Para almacenar los personajes del usuario
      isLoadingCharacters: false, // Estado de carga para personajes
      charactersError: null, // Errores al cargar personajes
      usuariosOnline: [], // Usuarios en línea para el dropdown de oponentes
      isLoadingUsuariosOnline: false, // Estado de carga para usuarios online
      usuariosOnlineError: null, // Errores al cargar usuarios online
      opponentCharacters: [], // Personajes del oponente seleccionado
      isLoadingOpponentCharacters: false, // Estado de carga para personajes del oponente
    };
  },
  async mounted() {
    await this.loadAuthenticatedUser();
    if (this.user) {
      await Promise.all([
        this.loadCharacters(),
        this.loadUsuariosOnline()
      ]);
    }
  },
  methods: {
    async loadAuthenticatedUser() {
      const servicio = new servicioAuth();
      this.user = servicio.getUser();
    },
    async loadCharacters() {
      const userId = this.user?.id || this.user?.userId || this.user?.data?.id;

      if (!this.user || !userId) {
        this.charactersError = 'No se puede cargar personajes: usuario no disponible.';
        return;
      }

      this.isLoadingCharacters = true;
      this.charactersError = null;

      try {
        const servicio = new servicioCharacters();
        const resultado = await servicio.getByUserId(userId);

        if (resultado.success) {
          const charactersData = resultado.data;
          if (Array.isArray(charactersData)) {
            this.characters = charactersData;
          } else if (charactersData && Array.isArray(charactersData.data)) {
            this.characters = charactersData.data;
          } else if (charactersData && charactersData.data) {
            this.characters = [charactersData.data];
          } else {
            this.characters = [];
          }
        } else {
          this.charactersError = resultado.error || 'Error al cargar los personajes';
          if (resultado.statusCode === 404) {
            this.characters = [];
            this.charactersError = null;
          }
        }
      } catch (error) {
        this.charactersError = 'Error al cargar los personajes';
        console.error('Error al obtener personajes (catch):', error);
      } finally {
        this.isLoadingCharacters = false;
      }
    },
    async loadUsuariosOnline() {
      this.isLoadingUsuariosOnline = true;
      this.usuariosOnlineError = null;

      try {
        const servicio = new servicioUsuarios();
        const resultado = await servicio.getOnlineUsers();

        if (resultado.success) {
          let usuarios = Array.isArray(resultado.data) ? resultado.data : [];
          
          // Filtrar el usuario autenticado de la lista de oponentes
          const userId = this.user?.id || this.user?.userId || this.user?.data?.id;
          if (userId) {
            this.usuariosOnline = usuarios.filter(usuario => {
              // Excluir el usuario autenticado comparando IDs
              const usuarioId = usuario.id || usuario.userId || usuario.data?.id;
              return usuarioId !== userId;
            });
          } else {
            // Si no hay userId, usar la lista completa
            this.usuariosOnline = usuarios;
          }
        } else {
          this.usuariosOnlineError = resultado.error || 'Error al cargar usuarios online';
          if (resultado.statusCode === 401) {
            // Si el token expiró, redirigir al login
            const authService = new servicioAuth();
            await authService.logout();
            this.$router.push('/login');
          }
        }
      } catch (error) {
        this.usuariosOnlineError = 'Error al cargar usuarios online';
        console.error('Error al obtener usuarios online (catch):', error);
      } finally {
        this.isLoadingUsuariosOnline = false;
      }
    },
    async loadPlayerCharacterStats() {
      if (!this.selectedPlayerCharacter) {
        this.playerCharacter = { name: '', health: 0, hp: 0, shield: 0, avatar: '' };
        return;
      }

      // Primero intentar obtener el personaje desde la lista local
      let selectedChar = this.characters.find(
        (char) => char.id === this.selectedPlayerCharacter
      );

      // Si no está en la lista local o queremos actualizar, obtener desde el servidor
      try {
        const servicio = new servicioCharacters();
        const resultado = await servicio.getById(this.selectedPlayerCharacter);
        if (resultado.success) {
          selectedChar = resultado.data;
        }
      } catch (error) {
        console.error('Error al actualizar personaje del jugador:', error);
        // Si falla, usar el de la lista local
      }

      if (selectedChar) {
        this.playerCharacter = {
          name: selectedChar.name || '',
          health: selectedChar.hp || selectedChar.health || 0,
          hp: selectedChar.hp || selectedChar.health || 0,
          shield: selectedChar.shield || 0,
          avatar: selectedChar.avatar || '',
        };
      } else {
        this.playerCharacter = { name: '', health: 0, hp: 0, shield: 0, avatar: '' };
      }
    },
    async loadOpponentCharacters() {
      // Limpiar selección previa
      this.selectedOpponentCharacter = '';
      this.opponentCharacter = { name: '', health: 0, hp: 0, shield: 0, avatar: '' };
      this.opponentCharacters = [];

      if (!this.selectedOpponentUser) {
        return;
      }

      this.isLoadingOpponentCharacters = true;

      try {
        const servicio = new servicioCharacters();
        const resultado = await servicio.getByUserId(this.selectedOpponentUser);

        if (resultado.success) {
          const personajesOponente = Array.isArray(resultado.data)
            ? resultado.data
            : resultado.data?.data
            ? resultado.data.data
            : resultado.data
            ? [resultado.data]
            : [];

          // Filtrar solo personajes online con HP >= 1
          this.opponentCharacters = personajesOponente.filter(
            (char) => char.isOnline === true && char.hp >= 1
          );
        } else {
          this.opponentCharacters = [];
        }
      } catch (error) {
        console.error('Error al cargar personajes del oponente:', error);
        this.opponentCharacters = [];
      } finally {
        this.isLoadingOpponentCharacters = false;
      }
    },
    loadOpponentCharacterStats() {
      if (!this.selectedOpponentCharacter) {
        this.opponentCharacter = { name: '', health: 0, hp: 0, shield: 0, avatar: '' };
        return;
      }

      const selectedChar = this.opponentCharacters.find(
        (char) => char.id === this.selectedOpponentCharacter
      );

      if (selectedChar) {
        this.opponentCharacter = {
          name: selectedChar.name || 'Oponente',
          health: selectedChar.hp || 0,
          hp: selectedChar.hp || 0,
          shield: selectedChar.shield || 0,
          avatar: selectedChar.avatar || '',
        };
      } else {
        this.opponentCharacter = { name: '', health: 0, hp: 0, shield: 0, avatar: '' };
      }
    },
    async startCombat() {
      // Validar que ambos personajes estén seleccionados
      if (!this.selectedPlayerCharacter || !this.selectedOpponentCharacter) {
        this.battleError = 'Debes seleccionar ambos personajes para iniciar la batalla';
        return;
      }

      // Validar que no se esté peleando contra el mismo personaje
      if (this.selectedPlayerCharacter === this.selectedOpponentCharacter) {
        this.battleError = 'No puedes pelear contra tu propio personaje';
        return;
      }

      // Limpiar resultados previos
      this.battleResult = null;
      this.battleError = null;
      this.isBattleLoading = true;

      try {
        const servicio = new servicioBattle();
        const resultado = await servicio.realizarBatalla(
          this.selectedPlayerCharacter,
          this.selectedOpponentCharacter
        );

        if (resultado.success) {
          // Guardar resultado completo de la batalla
          this.battleResult = resultado.data;

          // Recargar ambos personajes para obtener HP actualizados
          await Promise.all([
            this.loadPlayerCharacterStats(),
            this.loadOpponentCharacterStats(),
          ]);

          // También recargar la lista completa de personajes del oponente para actualizar HP
          if (this.selectedOpponentUser) {
            await this.loadOpponentCharacters();
            // Si el personaje seleccionado aún existe, recargar sus stats
            if (this.selectedOpponentCharacter) {
              this.loadOpponentCharacterStats();
            }
          }
        } else {
          // Manejar errores según el código
          let errorMessage = resultado.error || 'Error al realizar la batalla';

          switch (resultado.code) {
            case 'RETADOR_NOT_FOUND':
              errorMessage = 'Tu personaje no fue encontrado';
              break;
            case 'RETADO_NOT_FOUND':
              errorMessage = 'El personaje oponente no fue encontrado';
              break;
            case 'UNAUTHORIZED_RETADOR':
              errorMessage = 'No tienes permiso para usar este personaje';
              break;
            case 'RETADOR_OFFLINE':
              errorMessage = 'Tu personaje debe estar online para pelear';
              break;
            case 'RETADO_OFFLINE':
              errorMessage = 'El personaje oponente debe estar online para pelear';
              break;
            case 'RETADO_LOW_HP':
              errorMessage = 'El personaje oponente no tiene suficiente HP para pelear';
              break;
            default:
              if (resultado.statusCode === 401) {
                errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente';
                const authService = new servicioAuth();
                await authService.logout();
                this.$router.push('/login');
                return;
              }
          }

          this.battleError = errorMessage;
        }
      } catch (error) {
        console.error('Error en la batalla:', error);
        this.battleError = 'Error inesperado al realizar la batalla. Intenta nuevamente.';
      } finally {
        this.isBattleLoading = false;
      }
    },
    formatBattleDate(dateString) {
      if (!dateString) return 'Fecha no disponible';
      try {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      } catch {
        return dateString;
      }
    },
    getRetadorAvatar() {
      // Buscar el avatar del personaje retador en los personajes cargados
      if (this.battleResult && this.battleResult.retador) {
        // Primero buscar en los personajes del jugador
        const playerChar = this.characters.find(char => char.id === this.battleResult.retador.id);
        if (playerChar && playerChar.avatar) {
          return playerChar.avatar;
        }
        // Si no está en los personajes del jugador, buscar en los del oponente
        const opponentChar = this.opponentCharacters.find(char => char.id === this.battleResult.retador.id);
        if (opponentChar && opponentChar.avatar) {
          return opponentChar.avatar;
        }
      }
      return null;
    },
    getRetadoAvatar() {
      // Buscar el avatar del personaje retado en los personajes cargados
      if (this.battleResult && this.battleResult.retado) {
        // Primero buscar en los personajes del oponente
        const opponentChar = this.opponentCharacters.find(char => char.id === this.battleResult.retado.id);
        if (opponentChar && opponentChar.avatar) {
          return opponentChar.avatar;
        }
        // Si no está en los personajes del oponente, buscar en los del jugador
        const playerChar = this.characters.find(char => char.id === this.battleResult.retado.id);
        if (playerChar && playerChar.avatar) {
          return playerChar.avatar;
        }
      }
      return null;
    },
  },
};
</script>

<style scoped>
.combate-container {
  padding: 20px;
  max-width: 800px;
  margin: 20px auto;
  font-family: 'Cinzel', serif;
  background-color: #1a1a1a;
  border: 2px solid #d4af37;
  border-radius: 12px;
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.6),
    0 0 20px rgba(212, 175, 55, 0.4);
  color: #c0c0c0;
}

h1 {
  text-align: center;
  color: #d4af37;
  margin-bottom: 30px;
}

h2 {
  color: #d4af37;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-top: 20px;
}

.character-selection {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  gap: 20px;
}

.player-character,
.opponent-character {
  flex: 1;
  border: 2px solid #d4af37;
  padding: 20px;
  border-radius: 8px;
  background-color: #3d2914;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.7),
    0 0 15px rgba(212, 175, 55, 0.3);
}

select {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #d4af37;
  font-size: 16px;
  background-color: #5a3d22;
  color: #d4af37;
  appearance: none; /* Elimina estilos por defecto en algunos navegadores */
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23d4af37%22%20d%3D%22M287%2C197.3L159.9%2C69.8c-4.8-4.8-12.5-4.8-17.3%2C0L5.3%2C197.3c-4.8%2C4.8-4.8%2C12.5%2C0%2C17.3s12.5%2C4.8%2C17.3%2C0l130.8-130.8l130.8%2C130.8c4.8%2C4.8%2C12.5%2C4.8%2C17.3%2C0S291.9%2C202.1%2C287%2C197.3z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;
}

select:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.character-stats {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px dashed #eee;
}

.character-avatar-container {
  text-align: center;
  margin-bottom: 15px;
}

.character-avatar-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #d4af37;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.character-stats h3 {
  color: #d4af37;
  margin-bottom: 10px;
  text-align: center;
}

.character-stats p {
  margin: 5px 0;
  font-size: 1.1em;
  color: #c0c0c0;
}

button {
  display: block;
  width: 100%;
  padding: 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 30px;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

button:disabled {
  background-color: #443222;
  color: #888888;
  cursor: not-allowed;
}

.combat-log {
  margin-top: 40px;
  padding: 20px;
  border: 2px solid #5a3d22;
  background-color: #3d2914;
  border-radius: 8px;
  color: #c0c0c0;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.5),
    0 0 10px rgba(90, 61, 34, 0.5);
}

.combat-log h2 {
  color: #d4af37;
  text-align: center;
  margin-bottom: 15px;
}

.combat-log p {
  font-size: 1.2em;
  line-height: 1.6;
  text-align: center;
  color: #c0c0c0;
}

.error-message {
  color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
  font-size: 0.9em;
}

.battle-error {
  margin-top: 20px;
  font-size: 1em;
}

.opponent-selectors {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.opponent-user-select,
.opponent-character-select {
  flex: 1;
  min-width: 0; /* Permite que se reduzcan si es necesario */
}

.loading-message {
  color: #d4af37;
  padding: 10px;
  text-align: center;
  font-style: italic;
  flex: 1;
}

.error-message {
  flex: 1;
}

.battle-info {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #d4af37;
}

.battle-info p {
  margin: 8px 0;
  font-size: 0.95em;
}

.battle-id,
.battle-date {
  color: #d4af37;
}

.battle-participants {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.participant {
  flex: 1;
  padding: 15px;
  border-radius: 8px;
  background-color: #2a1f0f;
  border: 2px solid #5a3d22;
}

.participant.retador {
  border-color: #4CAF50;
}

.participant.retado {
  border-color: #e74c3c;
}

.participant-avatar-container {
  text-align: center;
  margin-bottom: 15px;
}

.participant-avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #d4af37;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.participant.retador .participant-avatar-img {
  border-color: #4CAF50;
}

.participant.retado .participant-avatar-img {
  border-color: #e74c3c;
}

.participant h3 {
  color: #d4af37;
  margin-bottom: 15px;
  text-align: center;
  font-size: 1.1em;
}

.participant-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.participant-stats p {
  margin: 0;
  padding: 5px 0;
  font-size: 0.95em;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.participant-stats p:last-child {
  border-bottom: none;
}

.participant-stats strong {
  color: #d4af37;
  margin-right: 8px;
}

@media (max-width: 768px) {
  .battle-participants {
    flex-direction: column;
  }
  
  .character-selection {
    flex-direction: column;
  }
  
  .opponent-selectors {
    flex-direction: column;
  }
  
  .opponent-user-select,
  .opponent-character-select,
  .loading-message,
  .error-message {
    width: 100%;
  }
}
</style>
