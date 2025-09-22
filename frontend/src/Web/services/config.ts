export const API_CONFIG = {
  // URL de base de votre backend
  BASE_URL: import.meta.env.VITE_API_URL || 'https://online-hozy.onrender.com',
  
  // Endpoints de l'API
  ENDPOINTS: {

    LOGIN: '/api/users/login',
    REGISTER: '/api/users/register',
    LOGOUT: '/api/users/logout',
    
    GET_CURRENT_USER: '/api/users/me',
    UPDATE_PROFILE: '/api/users/profile',
    UPDATE_PREFERENCES: '/api/users/preferences',
    CHANGE_PASSWORD: '/api/users/change-password',
    DELETE_ACCOUNT: '/api/users/delete',

    GET_USERS: '/api/users',
    DELETE_USER: '/api/users',

    GET_FORMS: '/api/forms', 
    GET_FORM: '/api/forms/:id',
    GET_USER_STATS: '/api/forms/stats/user',
    // SUBMIT_FORM: '/api/forms/submit',
  },
  
  // Configuration des requêtes
  REQUEST_CONFIG: {
    TIMEOUT: 10000, 
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, 
  },
  
  // Configuration des tokens
  TOKEN_CONFIG: {
    STORAGE_KEYS: {
      AUTH_TOKEN: 'authToken',
      USER_DATA: 'user_data',
    },
    HEADER_NAME: 'Authorization',
    HEADER_PREFIX: 'Bearer',
  },
} as const;


export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};


export const getBaseUrl = (): string => {
  return API_CONFIG.BASE_URL;
};


export const getEndpoint = (key: keyof typeof API_CONFIG.ENDPOINTS): string => {
  return API_CONFIG.ENDPOINTS[key];
};


// Helper function to get auth token dynamically
export const getAuthToken = (): string | null => {
  return localStorage.getItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.AUTH_TOKEN) ||
         sessionStorage.getItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
};