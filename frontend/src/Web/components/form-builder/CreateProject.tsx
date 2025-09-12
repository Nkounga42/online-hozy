import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji ou nom d'icône
}

const templates: Template[] = [
  {
    id: "blank",
    name: "Formulaire vierge",
    description: "Commencer à partir de zéro",
    icon: "📝",
  },
  {
    id: "quiz",
    name: "Quiz",
    description: "Évaluer les connaissances avec des questions",
    icon: "🎓",
  },
  {
    id: "survey",
    name: "Sondage",
    description: "Collecter des avis rapidement",
    icon: "📊",
  },
  {
    id: "registration",
    name: "Inscription à un événement",
    description: "Créer un formulaire d'inscription",
    icon: "📅",
  },
];

export function CreateProject({ callBack }: { callBack?: () => void }) {
  const [title, setTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("blank");
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!title.trim()) return;
    
    // Idéalement : créer dans la base de données ici
    console.log("Création du projet :", { title, selectedTemplate });

    // Redirection vers un builder avec un nouvel ID
    navigate(
      `/form/builder/create?template=${selectedTemplate}&title=${encodeURIComponent(
        title
      )}`
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <div className=" p-10  absolute top-0 right-0 bottom-0 left-0 bg-base-200/50 backdrop-blur-xl shadow-lg rounded-lg   z-100">
      <div className=" mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-primary">
          Créer un nouveau projet
        </h1>

        <div className="mb-6">
          <label className="label">
            <span className="label-text font-medium">Nom du projet</span>
          </label>
          <input
            type="text"
            placeholder="Nom du projet"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <h2 className="text-xl font-semibold mb-4">Choisissez un modèle</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`card cursor-pointer border  border-base-content/10  hover:shadow-xl transition ${
                selectedTemplate === template.id
                  ? "border-primary bg-primary/10 backdrop-blur"
                  : "bg-base-100/80"
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="card-body flex">
                <div className="flex h-full flex-col gap-3">
                  <span className="text-5xl">{template.icon}</span>
                  <div className="align-bottom">
                    <h3 className="card-title">{template.name}</h3>
                    <p className="text-sm text-base-content/70">
                      {template.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          {callBack && (
            <Link to="/projects" className="btn btn-ghost" onClick={() => callBack?.()}>
              Annuler
            </Link>
          )}
          <button
            className="btn btn-primary"
            disabled={!title.trim()}
            onClick={handleCreate}
          >
            Créer le projet
          </button>
        </div>
      </div>
    </div>
  );
}
