import React, { useState } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useUser } from '../../services/userService.tsx';

const UserProfile: React.FC = () => {
  const { user, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-base-300 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || user.email}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="w-4 h-4 text-primary-content" />
            </div>
          )}
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-base-content">
              {user.displayName || 'Utilisateur'}
            </div>
            <div className="text-xs text-base-content/70">
              {user.email}
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-base-100 rounded-lg shadow-lg border border-base-300 z-50">
          <div className="p-4 border-b border-base-300">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-content" />
                </div>
              )}
              <div>
                <div className="font-medium text-base-content">
                  {user.displayName || 'Utilisateur'}
                </div>
                <div className="text-sm text-base-content/70">
                  {user.email}
                </div>
                <div className="text-xs text-primary">
                  {user.role === 'admin' ? 'Administrateur' : 
                   user.role === 'editor' ? 'Éditeur' : 'Lecteur'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-2">
            <button
              onClick={() => {
                // TODO: Implémenter la navigation vers les paramètres
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-base-200 transition-colors duration-200"
            >
              <Settings className="w-4 h-4" />
              Paramètres
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-error/10 text-error transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </button>
          </div>
        </div>
      )}

      {/* Overlay pour fermer le menu en cliquant à l'extérieur */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;
