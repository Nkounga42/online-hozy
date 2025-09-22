// src/pages/FormViewer.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import type { Form } from "../../shared/form-types";
import { FormPreview } from "./index";
import Footer from "../ui/Footer";

import { API_CONFIG } from '../../services/config';
import { toast } from "sonner";

export function FormViewer() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  // Fonction pour obtenir le token d'authentification
  const getAuthToken = (): string | null => {
    return localStorage.getItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.AUTH_TOKEN) || sessionStorage.getItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  };

  //  Détecte la vue publique
  const isPublicView = window.location.pathname.endsWith("/view");

  const apiEndpoint = isPublicView
  ? `${API_CONFIG.BASE_URL}/api/forms/${id}/view`
  : `${API_CONFIG.BASE_URL}/api/forms/${id}`;

  const getHeaders = useCallback((): HeadersInit => {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (!isPublicView) {
      const token = getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return headers;
  }, [isPublicView]);

  // console.log(isPublicView, apiEndpoint )

  //  Fetch formulaire + enregistrement de la vue
  useEffect(() => {
    if (!id) return;
    const fetchForm = async () => {
      try {
        const headers = getHeaders();
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
  }, [id, apiEndpoint, getHeaders]);

  //  Callback pour les réponses
  const handleSubmit = async (answers: Record<string, string | number | boolean | string[]>) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_CONFIG.BASE_URL}/api/forms/${id}/submit`, {
    method: "POST",
    headers,
    body: JSON.stringify({ answers }),
  });

  const data = await res.json();
  console.log("Réponse envoyée :", data);
  toast.success('Réponse envoyée')
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
