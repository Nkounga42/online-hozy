// src/pages/FormViewer.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Form } from "../../shared/form-types";
import { FormPreview } from "./index";
import Footer from "../ui/Footer";

import { API_CONFIG, getAuthToken } from '../../services/config';
import { toast } from "sonner";

export function FormViewer() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  //  Détecte la vue publique
  const isPublicView = window.location.pathname.endsWith("/view");

  const apiEndpoint = isPublicView
  ? `${API_CONFIG.BASE_URL}/api/forms/${id}/view`
  : `${API_CONFIG.BASE_URL}/api/forms/${id}`;

  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (!isPublicView) headers["Authorization"] = `Bearer ${getAuthToken()}`;

  // console.log(isPublicView, apiEndpoint )

  //  Fetch formulaire + enregistrement de la vue
  useEffect(() => {
    if (!id) return;
    const fetchForm = async () => {
      try {
        const res = await fetch(apiEndpoint, { method: "GET" , headers });
        if (!res.ok) throw new Error(`Erreur serveur: ${res.status}`);

        const data: Form = await res.json();
        setForm(data);

        // //  Envoi de la vue
        // await fetch(`${API_CONFIG.BASE_URL}/api/forms/${id}`, {
        //   method: "POST",
        //   headers,
        //   body: JSON.stringify({ userId: null }), // tu peux mettre l'ID connecté
        // });
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement du formulaire _");
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  //  Callback pour les réponses
  const handleSubmit = async (answers: any) => {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      // Ajouter le token seulement s'il existe
      const token = getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_CONFIG.BASE_URL}/api/forms/${id}/submit`, {
        method: "POST",
        headers,
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) {
        throw new Error(`Erreur serveur: ${res.status}`);
      }

      const data = await res.json();
      console.log("Réponse envoyée :", data);
      toast.success('Réponse envoyée avec succès !');
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      toast.error('Erreur lors de l\'envoi de la réponse');
    }
  };

  if (error) {
    window.location.href = `/form-not-found/${error}`;
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-base-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {isLoading ? <span className="loading loading-spinner loading-md"></span> : <FormPreview form={form} onSubmit={handleSubmit} />}
          {!form && !isLoading && <p>Formulaire introuvable.</p>}
        </div>
      </div>
      <Footer />
    </>
  );
}
