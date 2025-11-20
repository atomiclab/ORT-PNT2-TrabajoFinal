export default {
  // Navigation
  nav: {
    home: 'Kingdom',
    createCharacter: 'Create Character',
    guildMasters: 'Guild Masters',
    assignment: 'Assignment',
    statistics: 'Statistics',
    profile: 'Profile',
    combat: 'Combat',
    logout: 'Logout',
    login: 'Login',
    register: 'Register'
  },

  // Character form
  character: {
    form: {
      title: 'Create New Character',
      name: 'Character Name',
      race: 'Race',
      class: 'Class',
      guild: 'Guild',
      kingdom: 'Kingdom',
      avatar: 'Select an Avatar',
      create: 'Create Character',
      cancel: 'Cancel',
      placeholders: {
        name: 'Enter character name',
        selectRace: 'Select a race',
        selectYourCharacter: 'Select your Character',
        selectClass: 'Select a class', 
        selectGuild: 'Select a guild',
        selectKingdom: 'Select a kingdom'
      },
      validations: {
        nameRequired: 'Name is required',
        nameMinLength: 'Name must have at least 2 characters',
        avatarRequired: 'You must select an avatar',
        raceRequired: 'Race is required',
        classRequired: 'Class is required',
        guildRequired: 'Guild is required',
        kingdomRequired: 'Kingdom is required'
      },
      note: {
        title: 'Note',
        description: 'Health (HP) will be automatically generated between 50 and 100 points. Shield between 10 and 30 points, and initial level will be 1.'
      },
      creating: 'Creating',
      createCharacter: 'Create Character',
      clear: 'Clear',
      reset: 'Reset'
    },
    validation: {
      nameRequired: 'Name is required',
      nameMinLength: 'Name must be at least 2 characters',
      raceRequired: 'Race is required',
      classRequired: 'Class is required',
      guildRequired: 'Guild is required',
      kingdomRequired: 'Kingdom is required',
      avatarRequired: 'Avatar is required'
    },
    races: ['Human', 'Elf', 'Orc', 'Dwarf', 'Half-elf', 'Tiefling'],
    classes: ['Warrior', 'Mage', 'Paladin', 'Archer', 'Rogue', 'Barbarian'],
    info: 'Health (HP) will be automatically generated between 50 and 100 points. Shield between 10 and 30 points, and initial level will be 1.',
    success: 'Character created successfully!',
    characterCreated: 'Character created!',
    characterCreatedText: 'has been created successfully.',
    authRequired: 'You must log in to create a character.',
    notAuthenticated: 'Not authenticated',
    goToLogin: 'Go to Login',
    creating: 'Creating character...',
    errorCreating: 'Error creating character',
    // Additional fields for statistics
    name: 'Name',
    race: 'Race',
    class: 'Class',
    guild: 'Guild',
    level: 'Level',
    hp: 'HP',
    shield: 'Shield',
    life: 'Life',
    status: 'Status',
    online: 'Online',
    offline: 'Offline',
    notSpecified: 'Not specified',
    noGuild: 'No guild'
  },

  // Login
  login: {
    title: 'Login',
    email: 'Email',
    password: 'Password',
    submit: 'Login',
    register: 'Register',
    noAccount: "Don't have an account?",
    success: 'Login successful!',
    welcome: 'Welcome',
    loggingIn: 'Logging in...',
    errors: {
      incomplete: 'Incomplete fields',
      incompleteText: 'Please complete both fields correctly.',
      invalidCredentials: 'Invalid credentials. Please verify your email and password.',
      accountDisabled: 'Your account is disabled. Contact administrator.',
      invalidData: 'Incomplete data. Please verify that all fields are complete.',
      unexpected: 'An unexpected error occurred. Please try again.',
      loginError: 'Login error',
      generic: 'Login error'
    }
  },

  // Profile
  profile: {
    title: 'My Profile',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    age: 'Age',
    registrationDate: 'Registration Date',
    myCharacters: 'My Characters',
    charactersCount: 'Total: {count}',
    loading: 'Loading profile...',
    loadingCharacters: 'Loading characters...',
    refreshCharacters: 'Refresh characters',
    noCharacters: "You don't have any characters created yet.",
    createFirst: 'Create my first character',
    updateProfile: 'Update profile',
    character: {
      online: 'Online',
      offline: 'Offline'
    },
    errors: {
      loadProfile: 'Error loading profile',
      loadCharacters: 'Error loading characters',
      sessionExpired: 'Session expired',
      sessionExpiredText: 'Your session has expired. Please login again.',
      unexpectedError: 'An unexpected error occurred while loading profile',
      cannotLoadCharacters: 'Cannot load characters: user or userId not available'
    },
    actions: {
      retry: 'Retry',
      goToLogin: 'Go to Login',
      refreshCharacters: 'Refresh characters',
      createCharacter: 'Create Character',
      createFirstCharacter: 'Create your first character',
      prevCharacter: 'Previous character',
      nextCharacter: 'Next character',
      goToCharacter: 'Go to character {number}',
      logout: 'Logout'
    },
    logout: {
      confirm: 'Logout?',
      message: 'Are you sure you want to logout?',
      yes: 'Yes, logout',
      cancel: 'Cancel',
      success: 'Session closed',
      successText: 'You have logged out successfully.'
    }
  },

  // Guild
  guild: {
    title: 'Guild Masters',
    description: 'Guild RPG characters',
    loading: 'Loading...',
    noCharacters: 'No characters available',
    update: 'Update',
    showOffline: 'Show offline',
    character: {
      online: 'Online',
      offline: 'Offline'
    },
    actions: {
      moreInfo: 'More Info',
      edit: 'Edit',
      delete: 'Delete'
    },
    stats: {
      hp: 'HP',
      shield: 'Shield',
      level: 'Level',
      race: 'Race',
      class: 'Class',
      guild: 'Guild',
      kingdom: 'Kingdom'
    },
    pagination: {
      label: 'Character pagination',
      previous: 'Previous',
      next: 'Next',
      showing: 'Showing {start} - {end} of {total} characters'
    },
    errors: {
      mustLogin: 'You must login to view characters',
      sessionExpired: 'Your session has expired. Please login again.',
      loadCharacters: 'Error loading characters'
    }
  },

  // Statistics
  statistics: {
    title: 'Statistics',
    loading: 'Loading statistics...',
    noData: 'No data available',
    character: {
      selectCharacter: 'Select a character',
      selectToView: 'Select a character to view their statistics',
      generalInfo: 'General Information',
      attributes: 'Attributes',
      health: 'Health'
    },
    battle: {
      searching: 'Searching...',
      lastBattle: 'Last Battle',
      lastBattleResults: 'Last battle results',
      error: 'Error getting battle',
      unknownError: 'Unknown error'
    },
    errors: {
      loadError: 'Error loading statistics'
    },
    totals: {
      title: 'General Totals',
      users: 'Users',
      characters: 'Characters',
      battles: 'Battles'
    },
    metrics: {
      title: 'Game Metrics',
      averageLevel: 'Average Level',
      charactersOnline: 'Characters Online',
      charactersOffline: 'Characters Offline'
    },
    leaderboards: {
      title: 'Leaderboards',
      mostBattles: 'Users with Most Battles',
      mostCharacters: 'Users with Most Characters',
      battles: 'battles',
      characters: 'characters'
    },
    distributions: {
      title: 'Distributions',
      races: 'Races',
      classes: 'Classes',
      kingdoms: 'Kingdoms',
      guilds: 'Guilds'
    }
  },

  // Battle
  battle: {
    title: 'Combat Arena',
    selectYourCharacter: 'Select Your Character',
    selectOpponent: 'Select an opponent',
    selectOpponentCharacter: 'Select opponent character',
    loadingCharacters: 'Loading characters...',
    loadingOpponentCharacters: 'Loading opponent characters...',
    onlineOpponent: 'Online Opponent',
    loadingOnlineUsers: 'Loading online users...',
    noCharactersAvailable: 'This user has no online characters available',
    health: 'Health',
    shield: 'Shield',
    executingBattle: 'Executing battle',
    startCombat: 'Start Combat',
    combatResult: 'Combat Result',
    battleId: 'Battle ID',
    dateTime: 'Date & Time',
    challenger: 'Challenger',
    challenged: 'Challenged',
    hpBefore: 'HP Before',
    hpAfter: 'HP After',
    diceRolled: 'Dice Rolled',
    damageReceived: 'Damage Received',
    fight: 'Fight',
    lastBattleResult: 'Last battle result',
    win: 'Victory',
    lose: 'Defeat',
    draw: 'Draw',
    errors: {
      perform: 'Error performing battle',
      loadResult: 'Error getting last battle result',
      notAuthenticated: 'You must login to access combat mode.',
      userNotAvailable: 'Cannot load characters: user not available.',
      loadingCharacters: 'Error loading characters'
    }
  },

  // Services - Error messages
  services: {
    characters: {
      createSuccess: 'Character created successfully',
      createError: 'Error creating character',
      updateSuccess: 'Character updated successfully', 
      updateError: 'Error updating character',
      deleteSuccess: 'Character deleted successfully',
      deleteError: 'Error deleting character'
    }
  },

  // Home page
  home: {
    title: 'Realm of Dice',
    subtitle: 'Create your character and venture into an epic world',
    welcome: {
      title: 'Welcome, Adventurer',
      paragraph1: 'In this fantasy realm, your destiny is in your hands. Create your unique character, choose their abilities and characteristics, and prepare to live incredible adventures where each dice roll can change the course of your story.',
      paragraph2: 'Each character you create will be unique, with their own strengths and weaknesses. Luck and strategy will combine to create epic stories that you will remember forever.'
    },
    features: {
      title: 'What can you do?',
      createCharacters: {
        title: 'Create Characters',
        description: 'Design your custom hero with unique attributes and abilities'
      },
      diceSystem: {
        title: 'Dice System',
        description: 'Use the dice system to determine the fate of your actions'
      },
      exploreWorlds: {
        title: 'Explore Worlds',
        description: 'Live adventures in a world rich in stories and challenges'
      }
    }
  },

  // Assignment
  assignment: {
    title: 'Final Project',
    description: 'Below you can access the final project assignment.',
    openInNewTab: 'Open assignment in new tab'
  },

  // Register
  register: {
    title: 'User Registration',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    phone: 'Phone (optional)',
    age: 'Age (optional)',
    submit: 'Register',
    registering: 'Registering',
    hasAccount: 'Already have an account?',
    loginLink: 'Sign in here',
    validations: {
      nameRequired: 'Name is required',
      nameMinLength: 'Name must be at least 2 characters long',
      emailRequired: 'Email is required',
      emailInvalid: 'Please enter a valid email format',
      passwordRequired: 'Password is required',
      passwordMinLength: 'Password must be at least 6 characters long',
      ageInvalid: 'Age must be between 1 and 120 years'
    },
    messages: {
      fieldsIncomplete: 'Incomplete fields',
      completeFields: 'Please complete all required fields correctly.',
      registrationSuccess: 'Registration successful!',
      welcomeMessage: 'Welcome, {name}. Your account has been created successfully.',
      registrationError: 'Registration error',
      emailExists: 'This email is already registered. Please use another email or sign in.',
      invalidData: 'Incomplete or invalid data. Please verify that all required fields are complete.',
      unexpectedError: 'An unexpected error occurred. Please try again.'
    }
  },

  // 404 Error Page
  notFound: {
    title: 'Page Not Found',
    message: 'Sorry, the page you are looking for does not exist or has been moved.',
    goHome: 'Go Home'
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    accept: 'Accept',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    notSpecified: 'Not specified',
    years: 'years',
    characters: 'characters',
    selectLanguage: 'Select language',
    updating: 'Updating...',
    retry: 'Retry'
  }
}