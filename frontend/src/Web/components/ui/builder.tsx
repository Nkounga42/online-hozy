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

  // Fonction de fallback pour copier dans le presse-papiers
  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      toast.success("Lien copié dans le presse-papiers!");
    } catch (fallbackErr) {
      console.error('Fallback copy failed:', fallbackErr);
      toast.error("Impossible de copier le lien. Voici l'URL : " + text);
    } finally {
      document.body.removeChild(textArea);
    }
  };

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

  const handleCheckboxChange = async (key: keyof typeof settings) => {
    const newValue = !settings[key];
    const baseSettings = {
      ...settings,
      [key]: newValue,
    };
    let newSettings = baseSettings;

    // Gestion des dépendances entre paramètres
    if (key === 'collectEmails' && !newValue) {
      // Si on désactive la collecte d'emails, désactiver aussi l'envoi de copie
      newSettings = {
        ...newSettings,
        sendResponseCopyToParticipants: false,
      };
      toast.info("L'envoi de copie aux participants a été désactivé car la collecte d'emails est désactivée");
    }

    if (key === 'requireLogin' && newValue) {
      // Si on active la connexion obligatoire, activer automatiquement la limitation à une réponse
      newSettings = {
        ...newSettings,
        limitToOneResponse: true,
      };
      toast.info("Limitation à une réponse activée automatiquement avec la connexion obligatoire");
    }

    if (key === 'limitToOneResponse' && !newValue && settings.requireLogin) {
      // Empêcher la désactivation de "limiter à une réponse" si la connexion est obligatoire
      toast.warning("Impossible de désactiver cette option tant que la connexion obligatoire est activée");
      return;
    }
    
    // Mettre à jour l'état local immédiatement
    updateFormDetails({
      settings: newSettings,
    });

    // // Envoyer au backend de manière asynchrone
    // try {
    //   await saveFormSettings(form.id!, newSettings);
    //   toast.success("Paramètres sauvegardés");
    // } catch (error) {
    //   console.error("Erreur lors de la sauvegarde des paramètres:", error);
    //   toast.error("Erreur lors de la sauvegarde des paramètres");
      
    //   // Revenir à l'état précédent en cas d'erreur
    //   updateFormDetails({
    //     settings: settings,
    //   });
    // }
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
            <h2 className="card-title  top-0 bg-base-100 py-4 z-10">Paramètres du formulaire</h2>
          {form && settings ? (
            <>
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
                      className="toggle toggle-primary"
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
                
                {responseSettings.map(({ key, label, desc }) => {
                  const isDisabled = 
                    (key === "sendResponseCopyToParticipants" && !settings.collectEmails) ||
                    (key === "limitToOneResponse" && settings.requireLogin);
                  
                  return (
                    <div key={key} className="flex items-center justify-between border-l-4 border-accent/20 pl-4">
                      <div>
                        <label className="label text-base-content">{label}</label>
                        <p className="text-sm text-base-content/70">{desc}</p>
                        {key === "sendResponseCopyToParticipants" && !settings.collectEmails && (
                          <p className="text-xs text-warning">⚠️ Collecter les adresses e-mail doit être activé</p>
                        )}
                        {key === "limitToOneResponse" && settings.requireLogin && (
                          <p className="text-xs text-info">ℹ️ Activé automatiquement avec la connexion obligatoire</p>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={!!settings[key]}
                        onChange={() => handleCheckboxChange(key)}
                        disabled={isDisabled}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Section: Partage du formulaire */}
              <div className="space-y-4 mb-10">
                <div>
                  <h3 className="text-lg font-semibold text-base-content">Partager votre formulaire</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    value={form.id ? `${window.location.origin}/form/${form.id}/view` : "Sauvegardez d'abord pour obtenir l'URL de partage"}
                    readOnly
                    className="input input-bordered flex-1"
                    placeholder={!form.id ? "Sauvegardez d'abord pour obtenir l'URL" : ""}
                  />
                  <button
                    className={`btn ${hasUnsavedChanges || !form.id ? 'btn-disabled' : 'btn-primary'}`}
                    disabled={hasUnsavedChanges || !form.id}
                    onClick={async () => {
                      if (hasUnsavedChanges) {
                        toast.error("Veuillez sauvegarder le formulaire avant de copier le lien de partage.");
                        return;
                      }
                      
                      if (!form.id) {
                        toast.error("Aucun ID de formulaire disponible. Sauvegardez d'abord le formulaire.");
                        return;
                      }
                      
                      const shareUrl = `${window.location.origin}/form/${form.id}/view`;
                      
                      // Vérifier si l'API Clipboard est disponible
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        try {
                          await navigator.clipboard.writeText(shareUrl);
                          toast.success("Lien copié dans le presse-papiers!");
                        } catch (error) {
                          console.error('Clipboard API failed:', error);
                          fallbackCopyToClipboard(shareUrl);
                        }
                      } else {
                        fallbackCopyToClipboard(shareUrl);
                      }
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
