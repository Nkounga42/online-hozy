import type { Form as FormType } from "../../shared/form-types";

function BuilderSettings({
  form,
  updateFormDetails,
}: {
  form: FormType;
  updateFormDetails: (updates: Partial<FormType>) => void;
}) {
  if (!form) return null;

  // Si settings est un tableau, on prend le premier élément
  const settings = form.settings || {
    collectEmails: false,
    allowMultipleResponses: false,
    showProgressBar: false,
    pageNavigation: true,
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
const options: { key: keyof typeof settings; label: string; desc: string }[] = [
  { key: "collectEmails", label: "Collecter les emails", desc: "Demande aux utilisateurs de fournir leur email" },
  { key: "allowMultipleResponses", label: "Autoriser plusieurs réponses", desc: "Permet aux utilisateurs de soumettre plus d'une réponse" },
  { key: "showProgressBar", label: "Afficher la barre de progression", desc: "Affiche une barre de progression aux utilisateurs" },
  { key: "pageNavigation", label: "Navigation des pages", desc: "Affiche un indicateur pour naviguer entre les pages" },
];


  return (
    <div className="max-w-2xl mx-auto mh-auto">
      <div className="bg-base-100 mt-30">
        <div className="space-y-6">
          <h2 className="card-title">Paramètres du formulaire</h2>

         

          {form && settings ? (
            <>
              {options.map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between  ">
                  <div>
                    <label className="label text-base-content">{label}</label>
                    <p className="text-sm text-base-content/70">{desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={!!settings[key]}
                    onChange={() => handleCheckboxChange( key)}
                  />
                </div>
              ))}

              <div>
                <label className="label text-base-content">Share your form</label>
                <div className="flex gap-2">
                  <input
                    value={`${window.location.origin}/form/${form.id}/view`}
                    readOnly
                    className="input input-bordered flex-1"
                  />
                  <button
                    className="btn btn-soft"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/form/${form.id}/view`
                      );
                      alert("Link copied to clipboard!");
                    }}
                  >
                    Copy
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
  );
}

export default BuilderSettings;
