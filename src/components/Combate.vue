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
          <option v-for="char in characters" :key="char.id" :value="char.id">{{ char.name }}</option>
        </select>
        <div v-if="selectedPlayerCharacter" class="character-stats">
          <h3>{{ playerCharacter.name }}</h3>
          <p>Vida: {{ playerCharacter.hp }}</p>
          <p>Escudo: {{ playerCharacter.shield }}</p>
        </div>
      </div>
      <div class="opponent-character">
        <h2>Oponente Online</h2>
        <select v-model="selectedOpponentCharacter" @change="loadOpponentCharacterStats">
          <option disabled value="">Selecciona un oponente</option>
          <!-- Por ahora, los oponentes siguen siendo simulados -->
          <option value="opponent1">Oponente Online 1</option>
          <option value="opponent2">Oponente Online 2</option>
        </select>
        <div v-if="selectedOpponentCharacter" class="character-stats">
          <h3>{{ opponentCharacter.name }}</h3>
          <p>Vida: {{ opponentCharacter.health }}</p>
          <p>Escudo: {{ opponentCharacter.shield }}</p>
        </div>
      </div>
    </div>
    <button @click="startCombat" :disabled="!selectedPlayerCharacter || !selectedOpponentCharacter">Iniciar Combate</button>

    <div v-if="combatResult" class="combat-log">
      <h2>Resultado del Combate</h2>
      <p>{{ combatResult }}</p>
      <!-- Detalles de la tirada de dados, ganador, perdedor, daño, etc. -->
    </div>
  </div>
</template>

<script>
import servicioAuth from '../servicios/auth.js'
import servicioCharacters from '../servicios/characters.js'

export default {
  name: 'Combate',
  data() {
    return {
      selectedPlayerCharacter: '',
      selectedOpponentCharacter: '',
      playerCharacter: {
        name: '',
        health: 0,
        shield: 0,
      },
      opponentCharacter: {
        name: '',
        health: 0,
        shield: 0,
      },
      combatResult: null,
      user: null, // Para almacenar el usuario autenticado
      characters: [], // Para almacenar los personajes del usuario
      isLoadingCharacters: false, // Estado de carga para personajes
      charactersError: null, // Errores al cargar personajes
    };
  },
  async mounted() {
    await this.loadAuthenticatedUser();
    if (this.user) {
      await this.loadCharacters();
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
    loadPlayerCharacterStats() {
      const selectedChar = this.characters.find(char => char.id === this.selectedPlayerCharacter);
      if (selectedChar) {
        this.playerCharacter = { ...selectedChar };
      } else {
        this.playerCharacter = { name: '', health: 0, shield: 0 };
      }
    },
    loadOpponentCharacterStats() {
      // Lógica para cargar las estadísticas del personaje oponente
      // Esto simulará la carga de datos de un oponente online
      if (this.selectedOpponentCharacter === 'opponent1') {
        this.opponentCharacter = { name: 'Goblin Astuto', health: 80, shield: 15 };
      } else if (this.selectedOpponentCharacter === 'opponent2') {
        this.opponentCharacter = { name: 'Orco Brutal', health: 150, shield: 40 };
      }
    },
    startCombat() {
      this.combatResult = 'El combate ha comenzado!';
      // Lógica de combate aquí
      // Simulación de tirada de dados
      const opponentRoll = Math.floor(Math.random() * 20) + 1;
      const playerRoll = Math.floor(Math.random() * 20) + 1;

      let winner = '';
      let loser = '';
      let damage = 0;

      if (opponentRoll > playerRoll) {
        winner = this.opponentCharacter.name;
        loser = this.playerCharacter.name;
        damage = opponentRoll - playerRoll;
        if (this.playerCharacter.shield < 20) {
          this.playerCharacter.health -= damage;
        } else {
          this.playerCharacter.health -= Math.floor(damage / 2);
        }
      } else if (playerRoll > opponentRoll) {
        winner = this.playerCharacter.name;
        loser = this.opponentCharacter.name;
        damage = playerRoll - opponentRoll;
        if (this.opponentCharacter.shield < 20) {
          this.opponentCharacter.health -= damage;
        } else {
          this.opponentCharacter.health -= Math.floor(damage / 2);
        }
      } else {
        this.combatResult = `Ambos personajes tiraron un ${playerRoll}. ¡Es un empate!`;
        return;
      }

      this.combatResult = `¡${winner} ha ganado el combate! ${loser} ha recibido ${damage} de daño.`;
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

.character-stats h3 {
  color: #d4af37;
  margin-bottom: 10px;
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
</style>
