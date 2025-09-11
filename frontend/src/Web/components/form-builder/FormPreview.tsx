import React, { useState } from "react"; 
import type { Form, FormField } from "../../shared/form-types"; // Assure-toi d'importer tes types correctement

export function FormPreview({
  form,
  onSubmit,
}: {
  form: Form;
  onSubmit?: (responses: Record<string, unknown>) => void;
}) {
  const [responses, setResponses] = useState<Record<string, unknown>>({});
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentPage = form.pages?.[currentPageIndex];
  const { showProgressBar = true, pageNavigation: activeNavigation = true } = form.settings || {};

  const updateResponse = (fieldId: string, value: unknown) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(responses);  
  };

  
  const renderField = (field: FormField) => {
    const fieldId = field.id;
    const value = responses[fieldId];

    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "date":
        return (
          <input
            type={field.type}
            className="input input-bordered w-full"
            value={typeof value === "string" || typeof value === "number" ? value : ""}
            onChange={(e) => updateResponse(fieldId, e.target.value)}
            required={field.required}
          />
        );

      case "textarea":
        return (
          <textarea
            className="textarea textarea-bordered w-full"
            value={typeof value === "string" || typeof value === "number" ? value : ""}
            onChange={(e) => updateResponse(fieldId, e.target.value)}
            required={field.required}
            rows={4}
          />
        );

      case "select":
        return (
          <select
            className="select select-bordered w-full"
            value={typeof value === "string" || typeof value === "number" ? value : ""}
            onChange={(e) => updateResponse(fieldId, e.target.value)}
            required={field.required}
          >
            <option disabled value="">
              {field.placeholder || "Choisir une option"}
            </option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="space-y-1">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={fieldId}
                  value={option}
                  checked={value === option}
                  onChange={() => updateResponse(fieldId, option)}
                  className="radio radio-xs radio-primary"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox": {
        const checkboxValues: string[] = Array.isArray(value) ? (value as string[]) : [];
        return (
          <div className="space-y-1">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={checkboxValues.includes(option)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...checkboxValues, option]
                      : checkboxValues.filter((v) => v !== option);
                    updateResponse(fieldId, newValues);
                  }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      }


      case "file":
        return (
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            onChange={(e) => updateResponse(fieldId, e.target.files)}
            required={field.required}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {showProgressBar && (
        <div className="w-full absolute top-0 left-0 right-0 bg-base-200 h-1 rounded-full overflow-hidden mb-4">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${((currentPageIndex + 1) / form.pages.length) * 100}%` }}
          ></div>
        </div>
      )}
      <h2 className="card-title text-3xl">{form.title}</h2>
      {form.description && <p className="text-base-content/70">{form.description}</p>}
      {currentPage ? (
        <form onSubmit={handleSubmit} className="space-y-6 mt-4 mb-10">


          {currentPage.fields.map((field) => (
            <div key={field.id} className="form-control">
              <label className="label font-semibold">
                {field.label} {field.required && <span className="text-error ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}


          {activeNavigation && (
            <div className="flex justify-between items-center pt-4">
              <span className="text-sm text-base-content/60">
                Page {currentPageIndex + 1} sur {form.pages.length}
              </span>
              <div className="flex gap-2">
                {currentPageIndex > 0 && (
                  <button type="button" className="btn btn-outline" onClick={() => setCurrentPageIndex(i => i - 1)}>
                    Précédent
                  </button>
                )}


                
                {currentPageIndex < form.pages.length - 1 ? (
                  <button type="button" className="btn btn-primary" onClick={() => setCurrentPageIndex(i => i + 1)}>
                    Suivant
                  </button>
                ) : (
                  <button type="submit" className="btn btn-success">
                    Soumettre
                  </button>
                )}
              </div>
             
            </div>
          )}
          <p className="text-sm text-base-content/60">
            En soumettant ce formulaire, vous acceptez nos <a href="/terms" className="link">conditions d'utilisation</a>. <br />
            N'envoyez jamais de mots de passe via Forms Builder.
          </p>
        </form>
      ) : (
        <div className="text-center text-base-content/60 py-10">Aucun contenu à afficher.</div>
      )}
    </div>
  );
}
