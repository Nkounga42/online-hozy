// Exemple de configuration pour votre API
// Copiez ce fichier vers config.ts et modifiez les valeurs selon votre backend

export const API_CONFIG = {
  // URL de base de votre backend
  BASE_URL: import.meta.env.VITE_API_URL || 'https://online-hozy.onrender.com',
  
  // Endpoints de l'API
  ENDPOINTS: {
    // Authentification
    LOGIN: '/api/users/login',
    REGISTER: '/api/users/register',
    LOGOUT: '/api/users/logout',
    
    // Gestion des utilisateurs
    GET_CURRENT_USER: '/api/users/me',
    UPDATE_PROFILE: '/api/users/profile',
    UPDATE_PREFERENCES: '/api/users/preferences',
    
    // Autres endpoints que vous pourriez ajouter
    GET_USERS: '/api/users',
    DELETE_USER: '/api/users',
  },
  
  // Configuration des requêtes
  REQUEST_CONFIG: {
    TIMEOUT: 10000, // 10 secondes
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 seconde
  },
  
  // Configuration des tokens
  TOKEN_CONFIG: {
    STORAGE_KEYS: {
      AUTH_TOKEN: 'authToken',
      USER_DATA: 'app_user',
    },
    HEADER_NAME: 'Authorization',
    HEADER_PREFIX: 'Bearer',
  },
} as const;

// Fonction pour construire l'URL complète
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Fonction pour obtenir l'URL de base
export const getBaseUrl = (): string => {
  return API_CONFIG.BASE_URL;
};

// Fonction pour obtenir un endpoint spécifique
export const getEndpoint = (key: keyof typeof API_CONFIG.ENDPOINTS): string => {
  return API_CONFIG.ENDPOINTS[key];
};

/*
INSTRUCTIONS D'INSTALLATION :

1. Copiez ce fichier vers config.ts :
   cp config.example.ts config.ts

2. Modifiez l'URL de base dans config.ts selon votre backend :
   - Développement local : https://online-hozy.onrender.com
   - Production : https://api.votre-domaine.com
   - Autre port : http://localhost:3000

3. Ajustez les endpoints si votre API utilise des chemins différents :
   - Si votre API est à la racine : '/users/login' au lieu de '/api/users/login'
   - Si vous utilisez une version : '/v1/users/login'

4. Créez un fichier .env à la racine de votre projet :
   VITE_API_URL=https://online-hozy.onrender.com

5. Redémarrez votre application React après les modifications
*/
