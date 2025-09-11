import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { API_CONFIG, buildApiUrl, getEndpoint } from './config';
import { toast } from 'sonner';

// Interface pour l'utilisateur de l'application
export interface AppUser {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: string;
  lastLogin: string;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: 'fr' | 'en';
    notifications: boolean;
    defaultFormTheme: string;
  };
}

// Interface pour le contexte utilisateur
interface UserContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<Pick<AppUser, 'displayName' | 'photoURL'>>) => Promise<void>;
  updateUserPreferences: (preferences: Partial<AppUser['preferences']>) => Promise<void>;
}

// Création du contexte
const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte utilisateur
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser doit être utilisé dans un UserProvider');
  }
  return context;
};

// Props pour le provider
interface UserProviderProps {
  children: ReactNode;
}

// Fonction pour obtenir le token d'authentification
const getAuthToken = (): string | null => {
  return localStorage.getItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.AUTH_TOKEN)  || sessionStorage.getItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.AUTH_TOKEN); // || 
};

// Fonction pour définir le token d'authentification
const setAuthToken = (token: string, rememberMe: boolean = false): void => {
  if (rememberMe) {
    localStorage.setItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
  } else {
    sessionStorage.setItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
  }
};

// Fonction pour supprimer le token d'authentification
const clearAuthToken = (): void => {
  localStorage.removeItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  sessionStorage.removeItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
};

// Fonction pour faire des appels API authentifiés
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { [API_CONFIG.TOKEN_CONFIG.HEADER_NAME]: `${API_CONFIG.TOKEN_CONFIG.HEADER_PREFIX} ${token}` }),
    ...options.headers,
  };

  const response = await fetch(buildApiUrl(endpoint), {
    ...options,
    headers,
  });
 
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
    } else {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }
  }

  return response.json();
};

// Provider du contexte utilisateur
export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Convertir la réponse de l'API en AppUser
  const convertApiUser = (apiUser: any): AppUser => {
  if (!apiUser) throw new Error("Utilisateur API invalide");
    return {
      id: apiUser.id || apiUser._id,
      email: apiUser.email,
      displayName: apiUser.name || apiUser.displayName,
      photoURL: apiUser.avatar || apiUser.photoURL || null,
      role: apiUser.role || 'editor',
      createdAt: apiUser.createdAt || new Date().toISOString(),
      lastLogin: apiUser.lastLogin || new Date().toISOString(),
      preferences: {
        theme: apiUser.preferences?.theme || 'auto',
        language: apiUser.preferences?.language || 'fr',
        notifications: apiUser.preferences?.notifications ?? true,
        defaultFormTheme: apiUser.preferences?.defaultFormTheme || 'default',
      },
    };
  };
 

const checkAuthStatus = async () => {
  setLoading(true);
  try {
    const savedUser = getUserFromLocalStorage();
    if (savedUser) {
      setUser(savedUser);
    }

    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    // Appel API pour rafraîchir l'utilisateur, mais ne pas clear le localStorage si erreur
    try {
      const userData = await apiCall(getEndpoint('GET_CURRENT_USER'));
      if (userData) {
        const appUser = convertApiUser(userData);
        setUser(appUser);
        saveUserToLocalStorage(appUser);
      }
    } catch (error) {
      console.warn("Impossible de rafraîchir l'utilisateur depuis l'API:", error);
      // On garde le localStorage, on ne clear pas
    }
  } finally {
    setLoading(false);
  }
};


  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setLoading(true);

      const response = await fetch(buildApiUrl(getEndpoint('LOGIN')), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur de connexion');
        } else {
          throw new Error('Erreur de connexion');
        }
      }

      const data = await response.json();

      // Stocker le token
      if (data.token) {
        setAuthToken(data.token, rememberMe);

        // Sauvegarder le token dans localStorage ou sessionStorage
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.AUTH_TOKEN, data.token);
        
      }

      // Convertir et stocker l'utilisateur
      const appUser = convertApiUser(data.user || data);
      setUser(appUser);

      // Sauvegarder l'utilisateur dans le même storage
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(appUser));

    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  // Inscription
  const register = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast.error('Token d\'authentification manquant pour l\'inscription');
        throw new Error('Token d\'authentification manquant pour l\'inscription');
      }
      const response = await fetch(buildApiUrl(getEndpoint('REGISTER')), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: displayName,
          email,
          password,
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur d\'inscription');
        } else {
          throw new Error('Erreur d\'inscription');
        }
      }

      const data = await response.json();
      
      // Convertir et stocker l'utilisateur
      const appUser = convertApiUser(data.user || data);
      setUser(appUser);
      
      // Sauvegarder dans le localStorage
      localStorage.setItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(appUser));
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      setLoading(true);
      
      // Appel à l'API pour la déconnexion (si votre backend le supporte)
      try {
        await apiCall(getEndpoint('LOGOUT'), { method: 'POST' });
      } catch (error) {
        // Ignorer les erreurs de déconnexion côté serveur
        toast.error('Erreur lors de la déconnexion côté serveur, mais vous êtes déconnecté localement.');
        console.log('Déconnexion côté serveur non supportée', error);
      }
      
      // Nettoyer l'état local
      setUser(null);
      clearAuthToken();
      localStorage.removeItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      // Forcer la déconnexion même en cas d'erreur
      setUser(null);
      clearAuthToken();
      localStorage.removeItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_DATA);
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le profil utilisateur
  const updateUserProfile = async (data: Partial<Pick<AppUser, 'displayName' | 'photoURL'>>) => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Appel à l'API pour mettre à jour le profil
      await apiCall(getEndpoint('UPDATE_PROFILE'), {
        method: 'PUT',
        body: JSON.stringify({
          name: data.displayName,
          avatar: data.photoURL,
        }),
      });
      
      // Mettre à jour l'état local
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      
      // Sauvegarder dans le localStorage 
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour les préférences utilisateur
  const updateUserPreferences = async (preferences: Partial<AppUser['preferences']>) => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Appel à l'API pour mettre à jour les préférences
      await apiCall(getEndpoint('UPDATE_PREFERENCES'), {
        method: 'PUT',
        body: JSON.stringify({ preferences }),
      });
      
      // Mettre à jour l'état local
      const updatedUser = {
        ...user,
        preferences: { ...user.preferences, ...preferences }
      };
      setUser(updatedUser);
      
      // Sauvegarder dans le localStorage
      localStorage.setItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erreur de mise à jour des préférences:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Vérifier le statut d'authentification au chargement
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: UserContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    updateUserPreferences,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Fonctions utilitaires
export const getUserFromLocalStorage = (): AppUser | null => {
  try {
    const savedUser = localStorage.getItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_DATA);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error('Erreur de lecture du localStorage:', error);
    return null;
  }
};

export const saveUserToLocalStorage = (user: AppUser): void => {
  try {
    localStorage.setItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  } catch (error) {
    console.error('Erreur de sauvegarde dans le localStorage:', error);
  }
};

export const clearUserFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_DATA);
  } catch (error) {
    console.error('Erreur de suppression du localStorage:', error);
  }
};

// Fonction pour vérifier si l'utilisateur est connecté
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
