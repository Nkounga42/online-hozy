import type { FieldType, FieldTypeSelectorProps, FieldTypeUI } from "../../shared/form-types";
import {
  Type,
  Mail,
  Hash,
  AlignLeft,
  ChevronDown,
  Circle,
  CheckSquare,
  Calendar,
  Upload, 
} from "lucide-react";
import { useRef, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { useDrag } from "react-dnd";
import { cn } from "../../lib/utils";



const fieldTypes: FieldTypeUI[] = [
  {
    type: "text",
    name: "Texte court",
    icon: Type,
    description: "Champ texte sur une seule ligne",
    bgColor: "rgba(59, 130, 246, .1)",   
    textColor: "rgba(59, 130, 246, 0.9)",  
  },
  {
    type: "textarea",
    name: "Texte long",
    icon: AlignLeft,
    description: "Champ texte sur plusieurs lignes",
    bgColor: "rgba(34, 197, 94, .1)",
    textColor: "rgba(34, 197, 94, 0.9)",
  },
  {
    type: "email",
    name: "Email",
    icon: Mail,
    description: "Saisie d'adresse email",
    bgColor: "rgba(239, 68, 68, .1)",
    textColor: "rgba(239, 68, 68, 0.9)",
  },
  {
    type: "number",
    name: "Nombre",
    icon: Hash,
    description: "Champ de saisie numérique",
    bgColor: "rgba(245, 158, 11, .1)",
    textColor: "rgba(245, 158, 11, 0.9)",
  },
  {
    type: "select",
    name: "Liste déroulante",
    icon: ChevronDown,
    description: "Choix unique dans une liste déroulante",
    bgColor: "rgba(99, 102, 241, .1)",
    textColor: "rgba(99, 102, 241, 0.9)",
  },
  {
    type: "radio",
    name: "Choix unique",
    icon: Circle,
    description: "Sélection d'une seule option parmi plusieurs",
    bgColor: "rgba(236, 72, 153, .1)",
    textColor: "rgba(236, 72, 153, 0.9)",
  },
  {
    type: "checkbox",
    name: "Cases à cocher",
    icon: CheckSquare,
    description: "Sélections multiples",
    bgColor: "rgba(102, 41, 99, 0.1)",
    textColor: "rgba(102, 41, 99, 0.9)",
  },
  {
    type: "date",
    name: "Date",
    icon: Calendar,
    description: "Sélecteur de date",
    bgColor: "rgba(20, 184, 166, .1)",
    textColor: "rgba(20, 184, 166, 0.9)",
  },
  {
    type: "file",
    name: "Téléversement de fichier",
    icon: Upload,
    description: "Pièce jointe",
    bgColor: "rgba(96, 163, 175, .1)",
    textColor: "rgba(96, 163, 175, 0.9)",
  },
];




  function FieldTypeSelector({ onSelectType }: FieldTypeSelectorProps) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const filteredFieldTypes = fieldTypes.filter((fieldType) =>
    `${fieldType.name} ${fieldType.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="relative" style={{ height: "calc(100vh - 6rem)" }}>
      <div className="mb-4 space-y-3 sticky left-0 top-0 right-0 bg-base-200/10 backdrop-blur-xl p-4 pb-2">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Ajouter un champ</h3>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`btn btn-sm btn-ghost ${
                viewMode === "list" ? "btn-active" : ""
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`btn btn-sm btn-ghost ${
                viewMode === "grid" ? "btn-active" : ""
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Search field types..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="mb-4 px-4 pb-4">
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 gap-2"
              : "flex flex-col gap-2"
          }
        >
          {filteredFieldTypes.map((fieldType) => (
            <DraggableFieldType
              key={fieldType.type}
              fieldType={fieldType}
              viewMode={viewMode}
              onSelectType={onSelectType}
            />
          ))}

          {filteredFieldTypes.length === 0 && (
            <p className="text-sm text-base-content/50">
              No field types found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface DraggableFieldTypeProps {
  fieldType: FieldTypeUI;
  viewMode: "grid" | "list";
  onSelectType: (type: FieldType) => void;
}

function DraggableFieldType({
  fieldType,
  viewMode,
  onSelectType,
}: DraggableFieldTypeProps) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "FIELD_TYPE",
    item: { type: fieldType.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  const [hover, setHover] = useState(false);
  const Icon = fieldType.icon;
  const ref = useRef<HTMLDivElement>(null);
  dragRef(ref) 

  return (
    <div 
      ref={ref}
      onClick={() => onSelectType(fieldType.type)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "p-2 rounded-lg border cursor-pointer group",
        isDragging
          ? "border-dashed border-blue-500 opacity-50"
          : "border-transparent hover:bg-base-200 /10 hover:border-base-content/10 " ,
        viewMode === "grid" ? "flex flex-col items-center text-center" : "flex items-center gap-4"
      )}
      style={{
         backgroundColor: hover ? fieldType.bgColor : ""
      }}
    >
      <div
        className={cn(
          "min-w-12 h-12 rounded-lg flex items-center justify-center"
        )}
        style={{
          backgroundColor: fieldType.bgColor,
        }}
      >
        <Icon className={cn("w-6 h-6")} 
          style={{
            color: fieldType.textColor
          }}
        />
      </div>
      <div className={viewMode === "grid" ? "mt-2" : ""}>
        <h3 className="font-semibold text-sm">{fieldType.name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {fieldType.description}
        </p>
      </div>
    </div>
  );
}



export {FieldTypeSelector, fieldTypes}
