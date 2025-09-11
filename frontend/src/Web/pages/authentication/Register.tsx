import { useState } from "react";
import { guid } from "../../lib/Guid";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/ui/Footer";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });
};


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Vérifications basiques
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          id: guid(), // génération d’UUID côté client
        }),
      });

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        throw new Error(
          textResponse.includes('<!DOCTYPE')
            ? "Le backend n'est pas démarré ou l'URL est incorrecte."
            : `Erreur serveur: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        // Gestion spécifique pour email déjà utilisé
        if (data.code === 11000 || data.message?.includes("duplicate key")) {
          throw new Error("Cet email est déjà enregistré. Veuillez vous connecter.");
        }
        throw new Error(data.message || `Erreur HTTP ${response.status}`);
      }

      setSuccess("Inscription réussie ! 🎉");
      console.log("✅ Réponse API :", data);

      // Redirection après succès
      setTimeout(() => {
        navigate("/login");
      }, 500);

      // Reset du formulaire après succès
      setTimeout(() => {
        setForm({ name: "", email: "", password: "", confirmPassword: "" });
        setSuccess("");
      }, 3000);

    } catch (err: any) {
      console.error("❌ Erreur complète:", err);

      // Messages d'erreur plus spécifiques
      if (err.message.includes('Failed to fetch')) {
        setError("Impossible de contacter le serveur. Vérifiez que votre backend est démarré sur http://localhost:5000");
      } else if (err.message.includes("duplicate key")) {
        setError("Cet email est déjà enregistré. Veuillez vous connecter.");
      } else {
        setError(err.message || "Une erreur inattendue s'est produite.");
      }
    } finally {
      setLoading(false);
    }
  }; 


  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="  w-full max-w-md  ">
        <div className=" ">
          <h2 className="text-2xl font-bold text-center mb-4">Créer un compte</h2>


          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
            {/* Nom complet */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nom complet</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Votre nom"
                className="input input-bordered w-full"
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="exemple@email.com"
                className="input input-bordered w-full"
                required
                disabled={loading}
              />
            </div>

            {/* Mot de passe */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Mot de passe</span>
                <span className="label-text-alt">Min. 6 caractères</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                className="input input-bordered w-full"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            {/* Confirmation du mot de passe */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirmez le mot de passe</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="********"
                className="input input-bordered w-full"
                required
                disabled={loading}
              />
            </div>

            {/* Messages d'erreur et succès */}
            {error && (
              <div className="alert alert-solt alert-error">
                <svg xmlns="http:// www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg> 
                <span className="te xt-sm">{error}</span>
              </div> 
            )} 
             
            {success && ( 
              <div className="alert alert-solt alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* Bouton */}
            <div className="form-control mt-6">
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading || !form.name || !form.email || !form.password || !form.confirmPassword}
              >
                {loading && <span className="loading loading-spinner loading-sm"></span>}
                {loading ? "Inscription..." : "S'inscrire"}
              </button>
            </div>
            </div>
          </form>

          <div className="divider">Déjà inscrit ?</div>
          
          <p className="text-center text-sm">
            <a href="/login" className="link link-primary">
              Se connecter à votre compte
            </a>
          </p>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}