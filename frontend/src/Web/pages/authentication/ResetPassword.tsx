import { useEffect, useState } from "react";
import { Lock, CheckCircle } from "lucide-react";
import Footer from "../../components/ui/Footer";

export default function ResetPassword () {
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    // Ici tu appelles ton API backend pour réinitialiser le mot de passe
    console.log("Nouveau mot de passe :", password);

    setError("");
    setSubmitted(true);
  };

  useEffect(() => {
    if (password.length >= 6 && confirmPassword.length >= 6) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [password, confirmPassword]);

  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-96 ">
        <div className=" ">
          <h2 className="text-2xl font-bold text-center mb-4">Réinitialiser le mot de passe</h2>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="form-control space-y-4">
              {/* Nouveau mot de passe */}
              <label className="label">
                <span className="label-text">Nouveau mot de passe</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="********"
                  className="input input-bordered w-full "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {/* Confirmation mot de passe */}
              <label className="label">
                <span className="label-text">Confirmer le mot de passe</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="********"
                  className="input input-bordered w-full "
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {/* Message d'erreur */}
              {error && <p className="text-error text-sm">{error}</p>}

              {/* Bouton valider */}
              <button type="submit" className="btn btn-primary w-full mt-4" disabled={disabled}>
                Réinitialiser le mot de passe
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-success mx-auto" />
              <p> Votre mot de passe a été réinitialisé avec succès.</p>
              <a href="/login" className="btn btn-outline w-full">
                Retour à la connexion
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer/>
</>
  );
}
