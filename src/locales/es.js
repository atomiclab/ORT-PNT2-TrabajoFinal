export default {
  // Navegación
  nav: {
    home: 'Reino',
    createCharacter: 'Crear Personaje',
    guildMasters: 'Guild Masters',
    assignment: 'Consigna',
    statistics: 'Estadísticas',
    profile: 'Perfil',
    combat: 'Combate',
    logout: 'Cerrar Sesión',
    login: 'Iniciar Sesión',
    register: 'Registrarse'
  },

  // Formulario de personaje
  character: {
    form: {
      title: 'Crear Nuevo Personaje',
      name: 'Nombre del Personaje',
      race: 'Raza',
      class: 'Clase',
      guild: 'Gremio',
      kingdom: 'Reino',
      avatar: 'Selecciona un Avatar',
      create: 'Crear Personaje',
      cancel: 'Cancelar',
      placeholders: {
        name: 'Ingresa el nombre del personaje',
        selectRace: 'Selecciona una raza',
        selectYourCharacter: 'Selecciona tu Personaje',
        selectClass: 'Selecciona una clase',
        selectGuild: 'Selecciona un gremio',
        selectKingdom: 'Selecciona un reino'
      },
      validations: {
        nameRequired: 'El nombre es requerido',
        nameMinLength: 'El nombre debe tener al menos 2 caracteres',
        avatarRequired: 'Debes seleccionar un avatar',
        raceRequired: 'La raza es requerida',
        classRequired: 'La clase es requerida',
        guildRequired: 'El gremio es requerido',
        kingdomRequired: 'El reino es requerido'
      },
      note: {
        title: 'Nota',
        description: 'La vida (HP) se generará automáticamente entre 50 y 100 puntos. El escudo (Shield) entre 10 y 30 puntos, y el nivel inicial será 1.'
      },
      creating: 'Creando',
      createCharacter: 'Crear Personaje',
      clear: 'Limpiar',
      reset: 'Reiniciar'
    },
    validation: {
      nameRequired: 'El nombre es requerido',
      nameMinLength: 'El nombre debe tener al menos 2 caracteres',
      raceRequired: 'La raza es requerida',
      classRequired: 'La clase es requerida',
      guildRequired: 'El gremio es requerido',
      kingdomRequired: 'El reino es requerido',
      avatarRequired: 'El avatar es requerido'
    },
    races: ['Humano', 'Elfo', 'Orco', 'Enano', 'Semielfo', 'Tiefling'],
    classes: ['Guerrero', 'Mago', 'Paladin', 'Arquero', 'Ladrón', 'Bárbaro'],
    info: 'La vida (HP) se generará automáticamente entre 50 y 100 puntos. El escudo (Shield) entre 10 y 30 puntos, y el nivel inicial será 1.',
    success: '¡Personaje creado exitosamente!',
    characterCreated: '¡Personaje creado!',
    characterCreatedText: 'ha sido creado exitosamente.',
    authRequired: 'Debes iniciar sesión para crear un personaje.',
    notAuthenticated: 'No autenticado',
    goToLogin: 'Ir al Login',
    creating: 'Creando personaje...',
    errorCreating: 'Error al crear el personaje',
    // Campos adicionales para estadísticas
    name: 'Nombre',
    race: 'Raza',
    class: 'Clase',
    guild: 'Gremio',
    level: 'Nivel',
    hp: 'HP',
    shield: 'Escudo',
    life: 'Vida',
    status: 'Estado',
    online: 'En línea',
    offline: 'Offline',
    notSpecified: 'No especificada',
    noGuild: 'Sin gremio'
  },

  // Login
  login: {
    title: 'Iniciar Sesión',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    submit: 'Iniciar Sesión',
    register: 'Registrarse',
    noAccount: '¿No tienes una cuenta?',
    success: '¡Inicio de sesión exitoso!',
    welcome: 'Bienvenido',
    loggingIn: 'Iniciando sesión...',
    errors: {
      incomplete: 'Campos incompletos',
      incompleteText: 'Por favor, completa ambos campos correctamente.',
      invalidCredentials: 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.',
      accountDisabled: 'Tu cuenta está desactivada. Contacta al administrador.',
      invalidData: 'Datos incompletos. Por favor, verifica que todos los campos estén completos.',
      unexpected: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
      loginError: 'Error al iniciar sesión',
      generic: 'Error al iniciar sesión'
    }
  },

  // Perfil
  profile: {
    title: 'Mi Perfil',
    name: 'Nombre',
    email: 'Email',
    phone: 'Teléfono',
    age: 'Edad',
    registrationDate: 'Fecha de Registro',
    myCharacters: 'Mis Personajes',
    charactersCount: 'Total: {count}',
    loading: 'Cargando perfil...',
    loadingCharacters: 'Cargando personajes...',
    refreshCharacters: 'Actualizar personajes',
    noCharacters: 'No tienes personajes creados aún.',
    createFirst: 'Crear mi primer personaje',
    updateProfile: 'Actualizar perfil',
    character: {
      online: 'En línea',
      offline: 'Offline'
    },
    errors: {
      loadProfile: 'Error al cargar el perfil',
      loadCharacters: 'Error al cargar los personajes',
      sessionExpired: 'Sesión expirada',
      sessionExpiredText: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      unexpectedError: 'Ocurrió un error inesperado al cargar el perfil',
      cannotLoadCharacters: 'No se puede cargar personajes: usuario o userId no disponible'
    },
    actions: {
      retry: 'Reintentar',
      goToLogin: 'Ir al Login',
      refreshCharacters: 'Actualizar personajes',
      createCharacter: 'Crear Personaje',
      createFirstCharacter: 'Crea tu primer personaje',
      prevCharacter: 'Personaje anterior',
      nextCharacter: 'Siguiente personaje',
      goToCharacter: 'Ir al personaje {number}',
      logout: 'Cerrar Sesión'
    },
    logout: {
      confirm: '¿Cerrar sesión?',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      yes: 'Sí, cerrar sesión',
      cancel: 'Cancelar',
      success: 'Sesión cerrada',
      successText: 'Has cerrado sesión correctamente.'
    }
  },

  // Guild
  guild: {
    title: 'Guild Masters',
    description: 'Personajes RPG del gremio',
    loading: 'Cargando...',
    noCharacters: 'No hay personajes disponibles',
    update: 'Actualizar',
    showOffline: 'Mostrar offline',
    character: {
      online: 'En línea',
      offline: 'Offline'
    },
    actions: {
      moreInfo: 'Más Info',
      edit: 'Editar',
      delete: 'Borrar'
    },
    stats: {
      hp: 'HP',
      shield: 'Escudo',
      level: 'Nivel',
      race: 'Raza',
      class: 'Clase',
      guild: 'Gremio',
      kingdom: 'Reino'
    },
    pagination: {
      label: 'Paginación de personajes',
      previous: 'Anterior',
      next: 'Siguiente',
      showing: 'Mostrando {start} - {end} de {total} personajes'
    },
    errors: {
      mustLogin: 'Debes iniciar sesión para ver los personajes',
      sessionExpired: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      loadCharacters: 'Error al cargar los personajes'
    }
  },

  // Estadísticas
  statistics: {
    title: 'Estadísticas',
    loading: 'Cargando estadísticas...',
    noData: 'No hay datos disponibles',
    character: {
      selectCharacter: 'Selecciona un personaje',
      selectToView: 'Selecciona un personaje para ver sus estadísticas',
      generalInfo: 'Información General',
      attributes: 'Atributos',
      health: 'Salud'
    },
    battle: {
      searching: 'Buscando...',
      lastBattle: 'Última Batalla',
      lastBattleResults: 'Resultados de la última batalla',
      error: 'Error al obtener batalla',
      unknownError: 'Error desconocido'
    },
    errors: {
      loadError: 'Error al cargar las estadísticas'
    },
    totals: {
      title: 'Totales Generales',
      users: 'Usuarios',
      characters: 'Personajes',
      battles: 'Batallas'
    },
    metrics: {
      title: 'Métricas del Juego',
      averageLevel: 'Promedio de Nivel',
      charactersOnline: 'Personajes Online',
      charactersOffline: 'Personajes Offline'
    },
    leaderboards: {
      title: 'Leaderboards',
      mostBattles: 'Usuarios con más Batallas',
      mostCharacters: 'Usuarios con más Personajes',
      battles: 'batallas',
      characters: 'personajes'
    },
    distributions: {
      title: 'Distribuciones',
      races: 'Razas',
      classes: 'Clases',
      kingdoms: 'Reinos',
      guilds: 'Gremios'
    }
  },

  // Batalla
  battle: {
    title: 'Arena de Combate',
    selectYourCharacter: 'Selecciona tu Personaje',
    selectOpponent: 'Selecciona un oponente',
    selectOpponentCharacter: 'Selecciona el personaje del oponente',
    loadingCharacters: 'Cargando personajes...',
    loadingOpponentCharacters: 'Cargando personajes del oponente...',
    onlineOpponent: 'Oponente Online',
    loadingOnlineUsers: 'Cargando usuarios online...',
    noCharactersAvailable: 'Este usuario no tiene personajes online disponibles',
    health: 'Vida',
    shield: 'Escudo',
    executingBattle: 'Ejecutando batalla',
    startCombat: 'Iniciar Combate',
    combatResult: 'Resultado del Combate',
    battleId: 'ID de Batalla',
    dateTime: 'Fecha y Hora',
    challenger: 'Retador',
    challenged: 'Retado',
    hpBefore: 'HP Antes',
    hpAfter: 'HP Después',
    diceRolled: 'Dado Lanzado',
    damageReceived: 'Daño Recibido',
    fight: 'Luchar',
    lastBattleResult: 'Resultado de la última batalla',
    win: 'Victoria',
    lose: 'Derrota',
    draw: 'Empate',
    errors: {
      perform: 'Error al realizar la batalla',
      loadResult: 'Error al obtener el resultado de la última batalla',
      notAuthenticated: 'Debes iniciar sesión para acceder al modo combate.',
      userNotAvailable: 'No se puede cargar personajes: usuario no disponible.',
      loadingCharacters: 'Error al cargar los personajes'
    }
  },

  // Servicios - Mensajes de error  
  services: {
    characters: {
      createSuccess: 'Personaje creado exitosamente',
      createError: 'Error al crear personaje',
      updateSuccess: 'Personaje actualizado exitosamente', 
      updateError: 'Error al actualizar personaje',
      deleteSuccess: 'Personaje eliminado exitosamente',
      deleteError: 'Error al eliminar personaje'
    }
  },

  // Página de inicio
  home: {
    title: 'Reino de los Dados',
    subtitle: 'Crea tu personaje y aventúrate en un mundo épico',
    welcome: {
      title: 'Bienvenido, Aventurero',
      paragraph1: 'En este reino de fantasía, tu destino está en tus manos. Crea tu personaje único, elige sus habilidades y características, y prepárate para vivir increíbles aventuras donde cada lanzamiento de dados puede cambiar el curso de tu historia.',
      paragraph2: 'Cada personaje que crees será único, con sus propias fortalezas y debilidades. La suerte y la estrategia se combinarán para crear historias épicas que recordarás para siempre.'
    },
    features: {
      title: '¿Qué puedes hacer?',
      createCharacters: {
        title: 'Crear Personajes',
        description: 'Diseña tu héroe personalizado con atributos y habilidades únicas'
      },
      diceSystem: {
        title: 'Sistema de Dados',
        description: 'Utiliza el sistema de dados para determinar el destino de tus acciones'
      },
      exploreWorlds: {
        title: 'Explorar Mundos',
        description: 'Vive aventuras en un mundo rico en historias y desafíos'
      }
    }
  },

  // Consigna
  assignment: {
    title: 'TP Final',
    description: 'Debajo se podrá acceder a la consigna del trabajo práctico final.',
    openInNewTab: 'Abrir consigna en nueva pestaña'
  },

  // Register
  register: {
    title: 'Registro de Usuario',
    name: 'Nombre',
    email: 'Email',
    password: 'Contraseña',
    phone: 'Teléfono (opcional)',
    age: 'Edad (opcional)',
    submit: 'Registrarse',
    registering: 'Registrando',
    hasAccount: '¿Ya tienes una cuenta?',
    loginLink: 'Inicia sesión aquí',
    validations: {
      nameRequired: 'El nombre es requerido',
      nameMinLength: 'El nombre debe tener al menos 2 caracteres',
      emailRequired: 'El email es requerido',
      emailInvalid: 'Por favor, introduce un formato de email válido',
      passwordRequired: 'La contraseña es requerida',
      passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
      ageInvalid: 'La edad debe estar entre 1 y 120 años'
    },
    messages: {
      fieldsIncomplete: 'Campos incompletos',
      completeFields: 'Por favor, completa todos los campos requeridos correctamente.',
      registrationSuccess: '¡Registro exitoso!',
      welcomeMessage: 'Bienvenido, {name}. Tu cuenta ha sido creada exitosamente.',
      registrationError: 'Error al registrar',
      emailExists: 'Este email ya está registrado. Por favor, usa otro email o inicia sesión.',
      invalidData: 'Datos incompletos o inválidos. Por favor, verifica que todos los campos requeridos estén completos.',
      unexpectedError: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.'
    }
  },

  // Página de error 404
  notFound: {
    title: 'Página No Encontrada',
    message: 'Lo sentimos, la página que estás buscando no existe o ha sido movida.',
    goHome: 'Volver al Inicio'
  },

  // Generales
  common: {
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    warning: 'Advertencia',
    info: 'Información',
    accept: 'Aceptar',
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
    back: 'Volver',
    next: 'Siguiente',
    previous: 'Anterior',
    notSpecified: 'No especificado',
    years: 'años',
    characters: 'personajes',
    selectLanguage: 'Seleccionar idioma',
    updating: 'Actualizando...',
    retry: 'Reintentar'
  }
}