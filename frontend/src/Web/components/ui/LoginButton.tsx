import React, { useState } from 'react';
import { useUser } from '../../services/userService.tsx';
// import { toast } from 'sonner'

const LoginButton: React.FC = () => {
  const { user, login, register, /*logout*/ } = useUser();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginMode) {
        await login(email, password, rememberMe);
      } else {
        await register(email, password, displayName);
      }
      setIsFormOpen(false);
      setEmail('');
      setPassword('');
      setDisplayName('');
      setRememberMe(false);
    } catch  {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    // toast.success(`Connecté en tant que ${user.displayName || user.email}`);
    return
    //   <div className="flex items-center gap-2">
    //     <span className="text-sm text-base-content/70">
    //       Connecté en tant que {user.displayName || user.email}
    //     </span>
    //     <button
    //       onClick={logout}
    //       className="btn btn-sm btn-outline"
    //       disabled={loading}
    //     >
    //       {loading ? 'Déconnexion...' : 'Déconnexion'}
    //     </button>
    //   </div>
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsFormOpen(!isFormOpen)}
        className="btn btn-sm btn-primary"
      >
        {isLoginMode ? 'Connexion' : 'Inscription'}
      </button>

      {isFormOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-base-100 rounded-lg shadow-lg border border-base-300 z-50 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {isLoginMode ? 'Connexion' : 'Inscription'}
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-base-content/70 hover:text-base-content"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nom d'affichage
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input input-bordered w-full"
                  required={!isLoginMode}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            {isLoginMode && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox checkbox-sm"
                />
                <label htmlFor="rememberMe" className="text-sm text-base-content/70">
                  Se souvenir de moi
                </label>
              </div>
            )}

            {error && (
              <div className="text-error text-sm">{error}</div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={loading}
              >
                {loading ? 'Chargement...' : (isLoginMode ? 'Se connecter' : 'S\'inscrire')}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setError('');
                  setRememberMe(false);
                }}
                className="text-sm text-primary hover:underline"
              >
                {isLoginMode 
                  ? 'Pas encore de compte ? S\'inscrire' 
                  : 'Déjà un compte ? Se connecter'
                }
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Overlay pour fermer le formulaire en cliquant à l'extérieur */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default LoginButton;
