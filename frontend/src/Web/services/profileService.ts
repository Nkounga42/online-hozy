import authService from './authService';

export interface UserProfileData {
  name: string;
  email: string;
}

export interface UserSettings {
  emailNotifications: boolean;
  formNotifications: boolean;
  defaultFormTheme: string;
  autoSave: boolean;
  showPreviewByDefault: boolean;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

class ProfileService {
  private static instance: ProfileService;
  private baseUrl = 'https://online-hozy.onrender.com/api';

  private constructor() {}

  public static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  // Mettre à jour le profil utilisateur
  public async updateProfile(profileData: UserProfileData): Promise<void> {
    const response = await fetch(`${this.baseUrl}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authService.getToken()}`
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur lors de la mise à jour du profil' }));
      throw new Error(error.message);
    }

    return response.json();
  }

  // Changer le mot de passe
  public async changePassword(passwordData: PasswordChangeData): Promise<void> {
    const response = await fetch(`${this.baseUrl}/users/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authService.getToken()}`
      },
      body: JSON.stringify(passwordData)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur lors du changement de mot de passe' }));
      throw new Error(error.message);
    }

    return response.json();
  }

  // Mettre à jour les paramètres utilisateur
  public async updateSettings(settings: UserSettings): Promise<void> {
    const response = await fetch(`${this.baseUrl}/users/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authService.getToken()}`
      },
      body: JSON.stringify(settings)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur lors de la mise à jour des paramètres' }));
      throw new Error(error.message);
    }

    return response.json();
  }

  // Récupérer les paramètres utilisateur
  public async getSettings(): Promise<UserSettings> {
    const response = await fetch(`${this.baseUrl}/users/settings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur lors de la récupération des paramètres' }));
      throw new Error(error.message);
    }

    return response.json();
  }

  // Supprimer le compte utilisateur
  public async deleteAccount(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/users/delete`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur lors de la suppression du compte' }));
      throw new Error(error.message);
    }

    // Déconnecter l'utilisateur après suppression
    authService.logout();
  }

  // Récupérer les informations du profil utilisateur
  public async getProfile(): Promise<UserProfileData> {
    const response = await fetch(`${this.baseUrl}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur lors de la récupération du profil' }));
      throw new Error(error.message);
    }

    return response.json();
  }
}

export default ProfileService.getInstance();
