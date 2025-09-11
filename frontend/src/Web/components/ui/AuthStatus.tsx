import React from 'react';
import { useUser } from '../../services/userService.tsx';
import { isAuthenticated } from '../../services/userService.tsx';
import { User, Shield, Calendar, Settings } from 'lucide-react';

const AuthStatus: React.FC = () => {
  const { user, loading } = useUser();
  const hasToken = isAuthenticated();

  if (loading) {
    return (
      <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
        <div className="flex items-center gap-2 text-info">
          <div className="loading loading-spinner loading-sm"></div>
          <span>Vérification de l'authentification...</span>
        </div>
      </div>
    );
  }

  if (!user && !hasToken) {
    return (
      <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex items-center gap-2 text-warning">
          <User className="w-5 h-5" />
          <span className="font-medium">Non connecté</span>
        </div>
        <p className="text-sm text-warning/80 mt-1">
          Aucun token d'authentification trouvé. Connectez-vous pour continuer.
        </p>
      </div>
    );
  }

  if (!user && hasToken) {
    return (
      <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
        <div className="flex items-center gap-2 text-error">
          <Shield className="w-5 h-5" />
          <span className="font-medium">Token invalide</span>
        </div>
        <p className="text-sm text-error/80 mt-1">
          Un token d'authentification est présent mais invalide. Veuillez vous reconnecter.
        </p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
        <div className="flex items-center gap-2 text-success mb-3">
          <Shield className="w-5 h-5" />
          <span className="font-medium">Connecté avec succès</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || user.email}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold text-lg">
                {user.displayName 
                  ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
                  : user.email[0].toUpperCase()
                }
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg">{user.displayName || 'Utilisateur'}</h3>
              <p className="text-sm text-base-content/70">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="w-3 h-3 text-primary" />
                <span className="text-xs text-primary font-medium">
                  {user.role === 'admin' ? 'Administrateur' : 
                   user.role === 'editor' ? 'Éditeur' : 'Lecteur'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Informations de compte
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Créé le :</span>
                  <span>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Dernière connexion :</span>
                  <span>{new Date(user.lastLogin).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Préférences
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Thème :</span>
                  <span className="capitalize">{user.preferences.theme}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Langue :</span>
                  <span className="uppercase">{user.preferences.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Notifications :</span>
                  <span>{user.preferences.notifications ? 'Activées' : 'Désactivées'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-success/20">
            <div className="flex items-center gap-2 text-success text-sm">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              Token d'authentification valide
            </div>
            <div className="flex items-center gap-2 text-success text-sm">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              Données utilisateur synchronisées
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthStatus;
