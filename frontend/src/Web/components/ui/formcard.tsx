import { useState } from "react";
import { Link } from "react-router-dom";

export interface FormCardProps {
  form: {
    theme: any;
    id: number;
    title: string;
    description: string;
    createdAt: string;
    pages: {
      order: number;
      title: string;
      fields: {
        id: string;
        type: string;
        label: string;
        required: boolean;
      }[];
    }[];
    settings?: {
      collectEmails: boolean;
      allowMultipleResponses: boolean;
      showProgressBar: boolean;
      pageNavigation: boolean;
    };
  };
  onRename?: (newTitle: string) => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onExport?: () => void;
  isChildren?: boolean;
  href: string;
}

export default function FormCard({
  form,
  onRename,
  onDuplicate,
  onDelete,
  onShare,
  onExport,
  isChildren,
  href,
}: FormCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newTitle, setNewTitle] = useState(form.title);

  const handleDeleteClick = () => setShowDeleteModal(true);
  const handleRenameClick = () => setShowRenameModal(true);

  const confirmDelete = () => {
    onDelete?.();
    setShowDeleteModal(false);
  };

  const confirmRename = () => {
    if (newTitle.trim() !== "") {
      onRename?.(newTitle.trim());
    }
    setShowRenameModal(false);
  };

  const cancelDelete = () => setShowDeleteModal(false);
  const cancelRename = () => {
    setNewTitle(form.title);
    setShowRenameModal(false);
  };

  return (
    <div className="relative group h-40 w-40 cursor-pointer">
      {!isChildren && (
        <div className="absolute right-2 z-50 group-hover:top-2 -top-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
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
                <Link to={`/form/preview/${form.id}`}>Preview</Link>
              </li>
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
              <li>
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
                  className="flex items-center gap-2 text-red-500"
                  onClick={handleDeleteClick}
                >
                  Supprimer
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      <Link
        to={href}
        className={`${
          !isChildren && "group-hover:bg-primary/10 group-hover:border-primary"
        } folder border-base-content/10 flex border m-auto justify-start items-end h-40 w-40 mb-4 bg-base-100 relative rounded-box 3xl overflow-hidden hover:shadow-xl transition-all duration-100`}


      >
        {(() => {
          const createdAt = new Date(form.createdAt);
          const now = new Date();
          const diffDays =
            (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays < 7) {
            return (
              <div
                className={`${
                  !isChildren && "group-hover:bg-primary/30"
                } absolute top-0 left-0 bg-success/30  text-base-content text-xs px-3 py-2 rounded-br-lg z-20 `}
              >
                Nouveau 
              </div>
            );
          }
          return null;
        })()}
          <div style={{ backgroundColor: form.theme }} className="absolute left-4 right-4 -bottom-1 h-2 rounded-2xl ">__</div>
        <div className="p-3 flex flex-col w-full ">
          <span className="text-lg text-base-content/50">
            Pages: {form.pages.length}
          </span>
          <h3 className="text-xl font-bold mb-2 truncate" title={form.title}>
            {form.title}
          </h3>
          {form.description && (
            <p
              className="text-sm mb-2 truncate text-base-content/80"
              title={form.description}
            >
              {form.description}
            </p>
          )}
        </div>
      </Link>

      {/* Modal suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-200/50 backdrop-blur-xl">
          <div className="bg-base-100 p-6 rounded-xl border border-base-content/10 shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Confirmer la suppression</h2>
            <p className="mb-6 text-base-content/70">
              Êtes-vous sûr de vouloir supprimer ce formulaire ?
            </p>
            <div className="flex justify-end gap-4">
              <button className="btn btn-ghost" onClick={cancelDelete}>
                Annuler
              </button>
              <button className="btn btn-error" onClick={confirmDelete}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal renommage */}
      {showRenameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-200/50 backdrop-blur-xl">
          <div className="bg-base-100 p-6 rounded-xl border border-base-content/10 shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Renommer le formulaire</h2>
            <input
              type="text"
              className="input w-full mb-4"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button className="btn btn-ghost" onClick={cancelRename}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={confirmRename}>
                Renommer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
