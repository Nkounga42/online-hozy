import { CheckCircle } from "lucide-react";
import { useState } from "react";
import Footer from "../../components/ui/Footer";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici tu appelles ton API backend pour envoyer le lien de reset
    console.log("Reset link envoyé à :", email);
    setSubmitted(true);
  };

  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="  w-96 ">
        <div className="">
          <h2 className="text-2xl font-bold text-center mb-4">Mot de passe oublié</h2>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="form-control space-y-4">
              <label className="label">
                <span className="label-text">Adresse email</span>
              </label>
              <input
                type="email"
                placeholder="exemple@email.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button type="submit" className="btn btn-primary w-full mt-4">
                Envoyer le lien de réinitialisation
              </button>

              <div className="text-sm text-center mt-2">
                <a href="/login" className="link link-hover text-primary">
                  Retour à la connexion
                </a>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4 flex flex-col items-center">
              <CheckCircle size={50} className="text-success my-5"/> 
              <div>

              <p className="mb-6">
                Si un compte existe avec <strong>{email}</strong>, un lien de
                réinitialisation a été envoyé.
              </p>
              <a href="/login" className="btn btn-outline w-full">
                Retour à la connexion
              </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
