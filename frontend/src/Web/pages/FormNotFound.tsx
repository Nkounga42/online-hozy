import { useLocation } from "react-router-dom";
import Footer from "../components/ui/Footer";

const NotFound = () => {

  const params = new URLSearchParams(useLocation().pathname.split("/").pop() || "");
  const error = params.get("error") || "Formulaire introuvable.";

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-base-content">Erreur</h1>
          <p className="text-xl text-base-content/60 mb-4">Oops! {error}</p>
          <button onClick={() => window.history.back()} className="text-blue-500 hover:text-blue-700 underline" >
            Return to Home
          </button>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default NotFound;
