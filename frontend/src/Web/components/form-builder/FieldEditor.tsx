import type { FormField, FieldType } from "../../shared/form-types";
import { Button } from "../ui/button"; 
import { Label } from "../ui/label"; 
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Trash2, Plus, X, Copy } from "lucide-react";
import { useState } from "react";
import { fieldTypes } from "../form-builder/FieldTypeSelector"; // Ajuste le chemin si besoin

interface FieldEditorProps {
  field: FormField;
  onUpdate: (updatedField: FormField) => void;   
  onDelete: () => void;
  onDuplicate: () => void;
  onAddFieldAfter: (fieldId: string, type: FieldType) => void;
}

export function FieldEditor({
  field,
  onUpdate,
  onDelete,
  onDuplicate,
  onAddFieldAfter,
}: FieldEditorProps) {
  const [newOption, setNewOption] = useState("");
  const [showAddSelect, setShowAddSelect] = useState(false);
  const [selectedType, setSelectedType] = useState<FieldType | "">("");

  const updateField = (updates: Partial<FormField>) => {
    onUpdate({ ...field, ...updates });
  };

  const handleAddField = () => {
    if (selectedType) {
      onAddFieldAfter(field.id, selectedType);
      setSelectedType("");
      setShowAddSelect(false);
    }
  };

  const addOption = () => {
    if (newOption.trim()) {
      const options = [...(field.options || []), newOption.trim()];
      updateField({ options });
      setNewOption("");
    }
  };

  const removeOption = (index: number) => {
    const options = [...(field.options || [])];
    options.splice(index, 1);
    updateField({ options });
  };

  const needsOptions = ["select", "radio", "checkbox"].includes(field.type);

  const fieldTypeUI = fieldTypes.find((f) => f.type === field.type);

  return (
    <>
      <div
        className="mb-4 border rounded-box"
        id={field.id}
        style={{
          backgroundColor: fieldTypeUI?.bgColor || "transparent",
          color: fieldTypeUI?.textColor || "inherit",
          borderLeft: `4px solid ${fieldTypeUI?.textColor || "#000"}`,
        }}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{getFieldTypeLabel(field.type)}</CardTitle>
            <div className="flex items-center gap-2">
              <button className="btn btn-soft btn-sm" onClick={onDuplicate}>
                <Copy className="w-4 h-4" />
              </button>
              <button className="btn btn-soft btn-sm" onClick={onDelete}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label htmlFor={`label-${field.id}`}>Question</Label>
            <input
              className="input input-bordered w-full"
              id={`label-${field.id}`}
              value={field.label}
              onChange={(e) => updateField({ label: e.target.value })}
              placeholder="Enter your question"
            />
          </div>

          {field.type !== "checkbox" && (
            <div>
              <Label htmlFor={`placeholder-${field.id}`}>
                Espace réservé <span className="text-xs text-muted-foreground">(optionnel)</span>
              </Label>
              <input
                className="input input-bordered w-full"
                id={`placeholder-${field.id}`}
                value={field.placeholder || ""}
                onChange={(e) => updateField({ placeholder: e.target.value })}
                placeholder="Enter placeholder text"
              />
            </div>
          )}

          {needsOptions && (
            <div>
              <Label>Options</Label>
              <div className="space-y-2 mt-2">
                {field.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      value={option}
                      className="input input-bordered w-full"
                      onChange={(e) => {
                        const options = [...(field.options || [])];
                        options[index] = e.target.value;
                        updateField({ options });
                      }}
                      placeholder="Option text"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <input
                    value={newOption}
                    className="input input-bordered w-full"
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Add new option"
                    onKeyPress={(e) => e.key === "Enter" && addOption()}
                  />
                  <button
                    onClick={addOption}
                    className="btn-soft btn-sm btn"
                    disabled={!newOption.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              id={`required-${field.id}`}
              checked={field.required}
              onChange={(e) => updateField({ required: e.target.checked })}
            />
            <Label htmlFor={`required-${field.id}`}>Requis</Label>
          </div>
        </CardContent>
      </div>

      <div className="mt-4 opacity-0 hover:opacity-100 transition-opacity">
        {showAddSelect ? (
          <div className="flex items-center justify-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as FieldType)}
              className="select select-bordered border-base-content/10"
            >
              <option value="" disabled>
                Choisir un type de champ
              </option>
              <option value="text">Texte court</option>
              <option value="textarea">Texte long</option>
              <option value="email">Email</option>
              <option value="number">Nombre</option>
              <option value="select">Liste déroulante</option>
              <option value="radio">Choix unique</option>
              <option value="checkbox">Cases à cocher</option>
              <option value="date">Date</option>
              <option value="file">Téléversement de fichier</option>
            </select>
            <button
              className="btn btn-sm btn-primary"
              onClick={handleAddField}
              disabled={!selectedType}
            >
              Ajouter
            </button>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => {
                setShowAddSelect(false);
                setSelectedType("");
              }}
            >
              Annuler
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center gap-2 mx-4">
            <div className="h-1 border-b border-base-300/80 w-5/7 mb-1" />
            <button
              className="btn btn-ghost rounded-full btn-sm flex w-30 items-center justify-center tooltip tooltip-secondary"
              data-tip="Ajouter un champ"
              onClick={() => setShowAddSelect(true)}
            >
              <Plus className="h-4 w-4" /> Ajouter
            </button>
            <div className="h-1 border-b border-base-300/80 w-5/7 mb-1" />
          </div>
        )}
      </div>
    </>
  );
}

function getFieldTypeLabel(type: FieldType): string {
  const labels: Record<FieldType, string> = {
    text: "Texte court",
    textarea: "Texte long",
    email: "Email",
    number: "Nombre",
    select: "Liste déroulante",
    radio: "Choix unique",
    checkbox: "Cases à cocher",
    date: "Date",
    file: "Téléversement de fichier",
  };
  return labels[type];
}
