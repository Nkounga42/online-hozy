import { X, AlertTriangle } from "lucide-react";

interface ExitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSave: () => void;
  hasUnsavedChanges: boolean;
}

const ExitConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  onSave, 
  hasUnsavedChanges 
}: ExitConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-base-100/50 backdrop-blur-xl z-50 flex items-center justify-center">
      <div className="bg-base-100 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-warning" />
              <h3 className="text-lg font-semibold">Quitter le builder</h3>
            </div>
            <button
              onClick={onClose}
              className="btn btn-sm btn-ghost btn-circle"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-6">
            {hasUnsavedChanges ? (
              <div>
                <p className="text-base-content mb-2">
                  Vous avez des modifications non sauvegardées.
                </p>
                <p className="text-base-content/70 text-sm">
                  Que souhaitez-vous faire avant de quitter ?
                </p>
              </div>
            ) : (
              <p className="text-base-content">
                Êtes-vous sûr de vouloir quitter le builder ?
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="btn btn-ghost hidden"
            >
              Annuler
            </button>
            
            {hasUnsavedChanges && (
              <button
                onClick={onSave}
                className="btn btn-primary"
              >
                Sauvegarder 
              </button>
            )}
            
            <button
              onClick={onConfirm}
              className="btn btn-error"
            >
              {hasUnsavedChanges ? "Quitter sans sauvegarder" : "Quitter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmModal;
