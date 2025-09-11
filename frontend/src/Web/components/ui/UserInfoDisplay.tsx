import React from 'react';
import { useUserInfo } from '../../hooks/useUserInfo';
import { User, Calendar, Settings, Shield } from 'lucide-react';

const UserInfoDisplay: React.FC = () => {
  const userInfo = useUserInfo();

  if (!userInfo.isLoggedIn) {
    return (
      <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex items-center gap-2 text-warning">
          <User className="w-5 h-5" />
          <span className="font-medium">Non connecté</span>
        </div>
        <p className="text-sm text-warning/80 mt-1">
          Connectez-vous pour voir vos informations et préférences.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-base-100 border border-base-300 rounded-lg shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        {userInfo.photoURL ? (
          <img
            src={userInfo.photoURL}
            alt={userInfo.displayName}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold text-lg">
            {userInfo.userInitials}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-lg">{userInfo.displayName}</h3>
          <p className="text-sm text-base-content/70">{userInfo.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs text-primary font-medium">
              {userInfo.role === 'admin' ? 'Administrateur' : 
               userInfo.role === 'editor' ? 'Éditeur' : 'Lecteur'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h4 className="font-medium text-base-content flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Informations de compte
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-base-content/70">Créé le :</span>
              <span>{new Date(userInfo.createdAt || '').toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/70">Dernière connexion :</span>
              <span>{new Date(userInfo.lastLogin || '').toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-base-content flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Préférences
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-base-content/70">Thème :</span>
              <span className="capitalize">{userInfo.theme}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/70">Langue :</span>
              <span className="uppercase">{userInfo.language}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/70">Notifications :</span>
              <span>{userInfo.notifications ? 'Activées' : 'Désactivées'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-base-300">
        <h4 className="font-medium text-base-content mb-3">Permissions</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className={`flex items-center gap-2 ${userInfo.canEditForms ? 'text-success' : 'text-base-content/50'}`}>
            <div className={`w-2 h-2 rounded-full ${userInfo.canEditForms ? 'bg-success' : 'bg-base-content/30'}`} />
            Éditer les formulaires
          </div>
          <div className={`flex items-center gap-2 ${userInfo.canDeleteForms ? 'text-success' : 'text-base-content/50'}`}>
            <div className={`w-2 h-2 rounded-full ${userInfo.canDeleteForms ? 'bg-success' : 'bg-base-content/30'}`} />
            Supprimer les formulaires
          </div>
          <div className={`flex items-center gap-2 ${userInfo.canManageUsers ? 'text-success' : 'text-base-content/50'}`}>
            <div className={`w-2 h-2 rounded-full ${userInfo.canManageUsers ? 'bg-success' : 'bg-base-content/30'}`} />
            Gérer les utilisateurs
          </div>
          <div className={`flex items-center gap-2 ${userInfo.canViewAnalytics ? 'text-success' : 'text-base-content/50'}`}>
            <div className={`w-2 h-2 rounded-full ${userInfo.canViewAnalytics ? 'bg-success' : 'bg-base-content/30'}`} />
            Voir les analyses
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoDisplay;
