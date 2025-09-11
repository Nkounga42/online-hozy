import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://online-hozy.onrender.com/api';

// Interface pour les réponses d'authentification
interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

interface ApiError {
  message: string;
  code?: string;
  redirectTo?: string;
}

class AuthService {
  private static instance: AuthService;
  
  private constructor() {}
  
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Vérifier si l'utilisateur est authentifié
  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  // Obtenir le token depuis localStorage
  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Obtenir les informations utilisateur
  public getUser(): { id: string; email: string; name: string } | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Sauvegarder les données d'authentification
  public saveAuthData(token: string, user: { id: string; email: string; name: string }): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Supprimer les données d'authentification
  public clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Connexion
  public async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      if (token && user) {
        this.saveAuthData(token, user);
      }
      
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: ApiError } };
      throw axiosError.response?.data || { message: 'Erreur de connexion' };
    }
  }

  // Inscription
  public async register(userData: { name: string; email: string; password: string }): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: ApiError } };
      throw axiosError.response?.data || { message: 'Erreur d\'inscription' };
    }
  }

  // Déconnexion
  public logout(): void {
    this.clearAuthData();
    window.location.href = '/login';
  }

  // Intercepteur pour les requêtes API
  public setupAxiosInterceptors(): void {
    // Intercepteur de requête - ajouter le token
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur de réponse - gérer les erreurs d'authentification
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          const errorData: ApiError = error.response.data;
          
          // Si le serveur indique une redirection
          if (errorData.redirectTo) {
            this.clearAuthData();
            window.location.href = errorData.redirectTo;
            return Promise.reject(error);
          }
          
          // Gestion des différents codes d'erreur
          switch (errorData.code) {
            case 'TOKEN_EXPIRED':
            case 'MISSING_TOKEN':
            case 'MALFORMED_TOKEN':
            case 'INVALID_TOKEN':
              this.clearAuthData();
              window.location.href = '/login';
              break;
            default:
              // Autres erreurs 401
              this.clearAuthData();
              window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Vérifier le token périodiquement
  public startTokenValidation(): void {
    setInterval(() => {
      if (!this.isAuthenticated()) {
        this.clearAuthData();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }, 60000); // Vérifier toutes les minutes
  }
}

export default AuthService.getInstance();
