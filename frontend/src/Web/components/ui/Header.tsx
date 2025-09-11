import React from 'react';
import { useUser } from '../../services/userService';

const Header: React.FC = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <header className="bg-base-200 p-4 flex justify-between items-center">
        <span className="loading loading-spinner loading-md"></span>
      </header>
    );
  }

  return (
    <header className=" border-b border-base-content/10  p-2 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold text-primary">Mon Application</div>
      {user ? (
        <div className="flex items-center gap-4">
          {user.photoURL ? (
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src={user.photoURL} alt={user.displayName || user.email} />
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary text-base-100 flex items-center justify-center">
              {user.displayName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
            </div>
          )}
          {/* <div className="flex flex-col">
            <span className="font-semibold">{user.displayName || user.email}</span>
            <span className="text-sm text-gray-500">{user.role}</span>
          </div>
          <button className="btn btn-sm btn-error" onClick={logout}>
            Déconnexion
          </button> */}
        </div>
      ) : (
        <div className="text-gray-500">Utilisateur non connecté</div>
      )}
    </header>
  );
};

export default Header;
