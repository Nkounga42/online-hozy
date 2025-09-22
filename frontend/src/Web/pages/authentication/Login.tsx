import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../../components/ui/Footer";
import { useUser } from "../../services/userService"; // <-- importer le contexte
import { toast } from "sonner";

const Login = () => {
  const { login, user, loading: userLoading } = useUser(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (!userLoading && user) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, userLoading, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Utiliser uniquement le service utilisateur
      await login(email, password, rememberMe);

      setSuccess("Connexion réussie 🎉");
      toast("Connexion réussie 🎉");

      // Rediriger vers la page d'origine ou la page d'accueil
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
      
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Erreur de connexion");
      toast.error(error.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    } 
  };


  const handleSocialLogin = (provider: string) => {
    toast(`Connexion avec ${provider}`);
    window.location.href = `https://online-hozy.onrender.com/auth/${provider.toLowerCase()}`;
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="w-full max-w-md  ">
          <div className=" ">
            <h2 className="text-2xl font-bold text-center mb-4">
              Se connecter
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="exemple@email.com"
                  className="input input-bordered w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Mot de passe */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Mot de passe</span>
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="input input-bordered w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label className="label">
                  <a
                    href="/forgotpassword"
                    className="label-text-alt link link-hover"
                  >
                    Mot de passe oublié ?
                  </a>
                </label>
              </div>

              {/* Se souvenir de moi */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="label-text">Se souvenir de moi</span>
                </label>
              </div>

              {/* Messages */}
              {error && <p className="text-error text-sm">{error}</p>}
              {success && <p className="text-success text-sm">{success}</p>}

              {/* Bouton */}
              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!email || !password || loading}
                >
                  {loading && (
                    <span className="loading loading-spinner loading-sm"></span>
                  )}
                  {loading ? "Connexion..." : "Se connecter"}
                </button>
              </div>
            </form>

            <p className="text-center mt-4 text-sm">
              Pas encore de compte ? 
              <a href="/register" className="ml-2 link link-primary">
                S'inscrire
              </a>
            </p>
          </div>
          {/* Divider */}
          <div className="divider hidden">ou</div>
          {/* Connexion sociale */}
          <div className="space-y-3 mb-6 hidden">
            <button
              onClick={() => handleSocialLogin("Google")}
              className="btn btn-ghost btn-error w-full flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuer avec Google
            </button>
            <button
              onClick={() => handleSocialLogin("Facebook")}
              className="btn btn-ghost w-full flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continuer avec Facebook
            </button>
            <button
              onClick={() => handleSocialLogin("Apple")}
              className="btn btn-ghost btn-neutral w-full flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Continuer avec Apple
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
