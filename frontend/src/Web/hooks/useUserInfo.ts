import { useUser } from '../services/userService.tsx';

// Hook personnalisé pour obtenir des informations spécifiques sur l'utilisateur
export const useUserInfo = () => {
  const { user, loading } = useUser();

  return {
    // Informations de base
    isLoggedIn: !!user,
    userId: user?.id,
    email: user?.email,
    displayName: user?.displayName,
    photoURL: user?.photoURL,
    role: user?.role,
    
    // Informations de profil
    createdAt: user?.createdAt,
    lastLogin: user?.lastLogin,
    
    // Préférences
    theme: user?.preferences.theme,
    language: user?.preferences.language,
    notifications: user?.preferences.notifications,
    defaultFormTheme: user?.preferences.defaultFormTheme,
    
    // États
    loading,
    
    // Vérifications de permissions
    isAdmin: user?.role === 'admin',
    isEditor: user?.role === 'editor' || user?.role === 'admin',
    isViewer: user?.role === 'viewer' || user?.role === 'editor' || user?.role === 'admin',
    
    // Informations formatées
    userInitials: user?.displayName 
      ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
      : user?.email?.[0]?.toUpperCase() || 'U',
    
    // Vérifications de sécurité
    canEditForms: user?.role === 'editor' || user?.role === 'admin',
    canDeleteForms: user?.role === 'admin',
    canManageUsers: user?.role === 'admin',
    canViewAnalytics: user?.role === 'editor' || user?.role === 'admin',
  };
};

// Hook pour obtenir uniquement les informations de base
export const useUserBasic = () => {
  const { user } = useUser();
  
  return {
    isLoggedIn: !!user,
    displayName: user?.displayName || 'Utilisateur',
    email: user?.email,
    role: user?.role,
  };
};

// Hook pour les permissions
export const useUserPermissions = () => {
  const { user } = useUser();
  
  return {
    canEdit: user?.role === 'editor' || user?.role === 'admin',
    canDelete: user?.role === 'admin',
    canManage: user?.role === 'admin',
    canView: true, // Tout le monde peut voir
  };
};
