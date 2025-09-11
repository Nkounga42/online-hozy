import { useState } from "react";
import FormCard, { type FormCardProps } from "./formcard";
// import { Link } from "react-router-dom";

interface FolderCardProps {
  title: string;
  description: string;
  badge?: string;
  formList: Array<FormCardProps["form"]>;
  formCount: number;

  onRename?: (newTitle: string) => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onExport?: () => void;
  selectedFolder?: () => void;
}

export default function FolderCard({
  title,
  description,
  formCount,
  formList,
  onRename,
  onDuplicate,
  onDelete,
  onShare,
  onExport,
  selectedFolder,
}: FolderCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  // ----- SUPPRESSION -----
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    onDelete?.();
    setShowDeleteModal(false);
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  // ----- RENOMMAGE -----
  const handleRenameClick = () => {
    setNewTitle(title);
    setShowRenameModal(true);
  };
  const confirmRename = () => {
    if (newTitle.trim() !== "") {
      onRename?.(newTitle.trim());
    }
    setShowRenameModal(false);
  };
  const cancelRename = () => {
    setShowRenameModal(false);
  };

  return (
    <>
      <div className="relative group folder h-52 w-52 cursor-pointer">
        {/* Menu d’options */}
        <div className="absolute right-2 z-50 group-hover:top-3 -top-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-xs mr-2 rounded-full">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="2" fill="currentColor" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="19" cy="12" r="2" fill="currentColor" />
              </svg>
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-xl w-40"
            >
              <li>
                <button onClick={handleRenameClick}>Renommer</button>
              </li>
              <li>
                <button
                  className="flex items-center gap-2"
                  onClick={onDuplicate}
                >
                  Dupliquer
                </button>
              </li>
              <li hidden>
                <button className="flex items-center gap-2" onClick={onShare}>
                  Partager
                </button>
              </li>
              <li>
                <button className="flex items-center gap-2" onClick={onExport}>
                  Exporter
                </button>
              </li>
              <li>
                <button
                  className="flex items-center gap-2 text-error"
                  onClick={handleDeleteClick}
                >
                  Supprimer
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Contenu du dossier */}
        <div onClick={selectedFolder}>
          <div className="group-hover:bg-primary/10 group-hover:border-primary bg-base-100 border-base-content/10 border m-auto h-52 w-52 mb-4 relative rounded-box 3xl overflow-hidden hover:shadow-xl transition-all duration-100">
            {/* Infos */}
            <div className="absolute bottom-0 group-hover:-bottom-full bottom-0 transition-all duration-300 left-0 right-0 content_ z-20 bg-base-100/50 backdrop-blur-3xl shadow-xl border-base-content/10 border-t pt-2">
              <div className="w-full h-full p-4 pt-0 flex gap-3">
                <span>
                  <h1 className="text-xl font-bold">{formCount}</h1>
                </span>
                <span>
                  <h1 className="text-sm font-bold">{title}</h1>
                  <p className="text-xs opacity-50">{description}</p>
                </span>
              </div>
            </div>

            {/* FormCards */}
            <div className="relative p-2 -left-5.5 top-1 grid grid-cols-2 grid-rows-2 items-center transform duration-300 justify-center h-full w-full ">
              {formList.slice(0, 4).map((form, index) => (
                <div key={index} className="scale-40">
                  <FormCard
                    isChildren={true}
                    form={{
                      id: form.id ?? 0,
                      title: form.title || "Formulaire sans titre",
                      description: form.description || "",
                      createdAt: form.createdAt || "",
                      pages: form.pages || [],
                      settings: {
                        collectEmails: form.settings?.collectEmails || false,
                        allowMultipleResponses:
                          form.settings?.allowMultipleResponses || false,
                        showProgressBar:
                          form.settings?.showProgressBar || false,
                        pageNavigation: form.settings?.pageNavigation || false,
                      },
                      theme: form.theme,
                    }}
                    href={`/form/builder/edit/${form.id}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 top-0  bottom-0 flex items-center justify-center bg-base-200/50 backdrop-blur-lg ">
          <div className="bg-base-100 border-base-content/10 border p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Confirmer la suppression</h2>
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer ce dossier ?
            </p>
            <div className="flex justify-end gap-4">
              <button className="btn btn-ghost " onClick={cancelDelete}>
                Annuler
              </button>
              <button className="btn btn-error" onClick={confirmDelete}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de renommage */}
      {showRenameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-200/50 backdrop-blur-xl ">
          <div className="bg-base-100 border-base-content/10 border p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Renommer le dossier</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="input input-bordered w-full mb-6"
              placeholder="Nouveau nom"
            />
            <div className="flex justify-end gap-4">
              <button className="btn btn-ghost  " onClick={cancelRename}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={confirmRename}>
                Renommer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
