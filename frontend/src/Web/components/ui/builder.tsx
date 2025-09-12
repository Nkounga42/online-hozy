import React from 'react';
import { toast } from 'sonner';
import type { Form as FormType } from "../../shared/form-types";

function BuilderSettings({
  form,
  updateFormDetails,
  hasUnsavedChanges = false,
}: {
  form: FormType;
  updateFormDetails: (updates: Partial<FormType>) => void;
  hasUnsavedChanges?: boolean;
}) {
  if (!form) return null;

  // Si settings est un tableau, on prend le premier élément
  const settings = form.settings || {
    collectEmails: false,
    allowMultipleResponses: false,
    showProgressBar: false,
    pageNavigation: true,
    makeQuestionsRequiredByDefault: false,
    sendResponseCopyToParticipants: false,
    allowResponseEditing: false,
    requireLogin: false,
    limitToOneResponse: false,
  };

  // console.log("Settings utilisés :", settings);

  const handleCheckboxChange = (key: keyof typeof settings) => {
    updateFormDetails({
      settings: {
        ...settings,
        [key]: !settings[key],
      },
    });
  };
// Paramètres organisés par sections
const defaultFormSettings: { key: keyof typeof settings; label: string; desc: string }[] = [
  { key: "collectEmails", label: "Collecter les adresses e-mail par défaut", desc: "Paramètres appliqués à ce formulaire et aux nouveaux formulaires" },
  { key: "showProgressBar", label: "Afficher la barre de progression", desc: "Affiche une barre de progression aux utilisateurs" },
  { key: "pageNavigation", label: "Navigation des pages", desc: "Affiche un indicateur pour naviguer entre les pages" },
];

const defaultQuestionSettings: { key: keyof typeof settings; label: string; desc: string }[] = [
  { key: "makeQuestionsRequiredByDefault", label: "Rendre les questions obligatoires par défaut", desc: "Paramètres appliqués à toutes les nouvelles questions" },
];

const responseSettings: { key: keyof typeof settings; label: string; desc: string }[] = [
  { key: "collectEmails", label: "Collecter les adresses e-mail", desc: "Gérez la façon dont les réponses sont collectées et protégées" },
  { key: "sendResponseCopyToParticipants", label: "Envoyer aux participants une copie de leur réponse", desc: "Collecter les adresses e-mail doit être activé" },
  { key: "allowResponseEditing", label: "Autoriser la modification des réponses", desc: "Les réponses peuvent être modifiées après leur envoi" },
  { key: "requireLogin", label: "Connexion obligatoire", desc: "Les personnes répondant doivent se connecter à leur compte" },
  { key: "limitToOneResponse", label: "Limiter à une réponse", desc: "Une seule réponse par utilisateur" },
];


  return (
    <div className="h-full overflow-y-auto h-screen pb-30">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-base-100">
          <div className="space-y-6">
            <h2 className="card-title sticky top-0 bg-base-100 py-4 z-10">Paramètres du formulaire</h2>

         

          {form && settings ? (
            <>
              {/* Section: Valeurs par défaut */}
              <div className="space-y-4 mb-10">
                <div>
                  <h3 className="text-lg font-semibold text-base-content">Valeurs par défaut</h3>
                  <p className="text-sm text-base-content/70">Paramètres par défaut des formulaires</p>
                  <p className="text-xs text-base-content/50">Paramètres appliqués à ce formulaire et aux nouveaux formulaires</p>
                </div>
                
                {defaultFormSettings.map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between border-l-4 border-primary/20 pl-4">
                    <div>
                      <label className="label text-base-content">{label}</label>
                      <p className="text-sm text-base-content/70">{desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={!!settings[key]}
                      onChange={() => handleCheckboxChange(key)}
                    />
                  </div>
                ))}
              </div>

              {/* Section: Paramètres par défaut des questions */}
              <div className="space-y-4 mb-10">
                <div>
                  <h3 className="text-lg font-semibold text-base-content">Paramètres par défaut des questions</h3>
                  <p className="text-sm text-base-content/70">Paramètres appliqués à toutes les nouvelles questions</p>
                </div>
                
                {defaultQuestionSettings.map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between border-l-4 border-secondary/20 pl-4">
                    <div>
                      <label className="label text-base-content">{label}</label>
                      <p className="text-sm text-base-content/70">{desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-secondary"
                      checked={!!settings[key]}
                      onChange={() => handleCheckboxChange(key)}
                    />
                  </div>
                ))}
              </div>

              {/* Section: Réponses */}
              <div className="space-y-4 mb-10">
                <div>
                  <h3 className="text-lg font-semibold text-base-content">Réponses</h3>
                  <p className="text-sm text-base-content/70">Gérez la façon dont les réponses sont collectées et protégées</p>
                </div>
                
                {responseSettings.map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between border-l-4 border-accent/20 pl-4">
                    <div>
                      <label className="label text-base-content">{label}</label>
                      <p className="text-sm text-base-content/70">{desc}</p>
                      {key === "sendResponseCopyToParticipants" && !settings.collectEmails && (
                        <p className="text-xs text-warning">⚠️ Collecter les adresses e-mail doit être activé</p>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-accent"
                      checked={!!settings[key]}
                      onChange={() => handleCheckboxChange(key)}
                      disabled={key === "sendResponseCopyToParticipants" && !settings.collectEmails}
                    />
                  </div>
                ))}
              </div>

              {/* Section: Partage du formulaire */}
              <div className="space-y-4 mb-10">
                <div>
                  <h3 className="text-lg font-semibold text-base-content">Partager votre formulaire</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    value={`${window.location.origin}/form/${form.id}/view`}
                    readOnly
                    className="input input-bordered flex-1"
                  />
                  <button
                    className={`btn ${hasUnsavedChanges ? 'btn-disabled' : 'btn-primary'}`}
                    disabled={hasUnsavedChanges}
                    onClick={() => {
                      if (hasUnsavedChanges) {
                        alert("Veuillez sauvegarder le formulaire avant de copier le lien de partage.");
                        return;
                      }
                      navigator.clipboard.writeText(
                        `${window.location.origin}/form/${form.id}/view`
                      ).then(() => {
                        toast.success("Lien copié dans le presse-papiers!");
                      }).catch(() => {
                        toast.error("Erreur lors de la copie du lien");
                      });
                    }}
                  >
                    {hasUnsavedChanges ? 'Sauvegardez d\'abord' : 'Copier'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>Les settings sont indéfinis</div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuilderSettings;
