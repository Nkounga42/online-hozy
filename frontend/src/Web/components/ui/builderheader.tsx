import {
  Edit,
  Eye,
  PanelLeft,
  PanelLeftClose,
  PanelRight,
  PanelRightClose,
  Redo2,
  Settings,
  Undo2,
  FileText,
  Share2,
  CornerDownLeft,
  CornerDownRight,
  Save,
  Download,
  Upload,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { BuilderHeaderProps } from "../../shared/form-types";
import UserProfile from "./UserProfile";
import LoginButton from "./LoginButton";

const Builderheader = ({
  onSave,
  // updateFormDetails,
  activeTab,
  setActiveTab,
  setActivePageIndex,
  undoStack,
  setForm,
  form,
  undo,
  redoStack,
  redo,
  canUndo,
  canRedo,
  showNavigator,
  setShowNavigator,
  showFieldTypeSelector,
  setShowFieldTypeSelector,
}: BuilderHeaderProps) => {
  const handleExport = () => {
    const dataStr = JSON.stringify(form, null, 2);
    const blob = new Blob([dataStr], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.title || "formulaire"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <header className="border-b border-base-100 bg-base-200">
      <div className="mx-auto px-4  ">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-5">
            <div className="flex items-center justify-start gap-4 group min-w-[180px] ">
              <Link
                className="text-2xl hover:text-primary group-hover:hidden"
                to={"/"}
              >
                Form Builder
              </Link>
              
              <Link
                className="text-2xl   text-primary hidden group-hover:block"
                to={"/"}
              ><div className="flex justify-center items-center gap-2.5 w-full">
                <ArrowLeft />
                <span>Home</span>
              </div>
              </Link>
            </div>

            
          </div>
<div className="flex items-center justify-center">
              <div className="dropdown  ">
                <div tabIndex={0} role="button" className="btn btn-ghost m-1">
                  Édition
                </div>
                <ul className="dropdown-content menu bg-base-100/30 backdrop-blur-2xl rounded-box z-10 w-52 p-2 shadow-sm border border-base-300/70">
                  <li onClick={() => setActiveTab("edit")}>
                    <a>
                      <Edit className="inline mr-2" size={16} />
                      Modifier
                    </a>
                  </li>

                  <li onClick={() => setActiveTab("preview")}>
                    <a>
                      <Eye className="inline mr-2" size={16} />
                      Aperçu
                    </a>
                  </li>

                  <li onClick={() => setActiveTab("settings")}>
                    <a>
                      <Settings className="inline mr-2" size={16} />
                      Paramètres
                    </a>
                  </li>

                  <li onClick={() => setActiveTab("reponse")}>
                    <a>
                      <FileText className="inline mr-2" size={16} />
                      Réponses
                    </a>
                  </li>

                  <li>
                    <Link to={`/form/preview/${form.id}`} target="_blank">
                      <Share2 className="inline mr-2" size={16} />
                      Partager
                    </Link>
                  </li>

                  <li onClick={() => console.log("Annuler")}>
                    <a>
                      <CornerDownLeft className="inline mr-2" size={16} />
                      Annuler
                    </a>
                  </li>

                  <li onClick={() => console.log("Rétablir")}>
                    <a>
                      <CornerDownRight className="inline mr-2" size={16} />
                      Rétablir
                    </a>
                  </li>

                  <li onClick={onSave}>
                    <a>
                      <Save className="inline mr-2" size={16} />
                      Enregistrer
                    </a>
                  </li>

                  <li onClick={handleExport}>
                    <a>
                      <Download className="inline mr-2" size={16} />
                      Exporter
                    </a>
                  </li>

                  <li>
                    <input
                      type="file"
                      accept="application/json"
                      className="hidden"
                      id="form-import"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const importedForm = JSON.parse(
                              event.target?.result as string
                            );
                            if (
                              importedForm.pages &&
                              Array.isArray(importedForm.pages)
                            ) {
                              setForm(importedForm);
                              undoStack.current = [];
                              redoStack.current = [];
                              setActivePageIndex(0);
                              alert("Formulaire importé avec succès !");
                            } else {
                              alert("Le fichier JSON n'est pas valide.");
                            }
                          } catch (err) {
                            alert("Erreur lors de l'importation : " + err);
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                    <label htmlFor="form-import" className="cursor-pointer">
                      <Upload className="inline mr-2" size={16} />
                      Importer
                    </label>
                  </li>
                </ul>
              </div>

              <div role="tablist " className="join ">
                <div
                  role="tab"
                  className={`tab ${
                    activeTab === "edit"
                      ? "tab-active py-2 px-3 join-item bg-primary/10 hover:text-primary "
                      : ""
                  }`}
                  onClick={() => setActiveTab("edit")}
                >
                  <Edit className="w-4 h-4 " />  
                </div>
                <div
                  role="tab"
                  className={`tab ${
                    activeTab === "preview"
                      ? "tab-active py-2 px-3 join-item bg-primary/10 hover:text-primary "
                      : ""
                  }`}
                  onClick={() => setActiveTab("preview")}
                >
                  <Eye className="w-4 h-4 " />  
                </div>
                <div
                  role="tab"
                  className={`tab ${
                    activeTab === "settings"
                      ? "tab-active py-2 px-3 join-item bg-primary/10 hover:text-primary "
                      : ""
                  }`}
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="w-4 h-4 " />  
                </div>
              </div>

              {/* Boutons Undo/Redo */}
              <div className="join ml-2">
                <button
                  className={`btn btn-sm btn-ghost join-item tooltip tooltip-bottom ${!canUndo ? 'btn-disabled' : ''}`}
                  onClick={undo}
                  disabled={!canUndo}
                  data-tip="Annuler (Ctrl+Z)"
                >
                  <Undo2 className="w-4 h-4" />
                </button>

                <button
                  className={`btn btn-sm btn-ghost join-item tooltip tooltip-bottom ${!canRedo ? 'btn-disabled' : ''}`}
                  onClick={redo}
                  disabled={!canRedo}
                  data-tip="Rétablir (Ctrl+Y)"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div> 
              {/* <button
                className="btn btn-sm btn-ghost join-item"
                onClick={undo}
                disabled={undoStack.current.length === 0}
              >
                <Undo2 className="w-4 h-4" />
              </button>

              <button
                className="btn btn-sm btn-ghost join-item"
                onClick={redo}
                disabled={redoStack.current.length === 0}
              >
                <Redo2 className="w-4 h-4 " />
              </button>  */}

              {activeTab === "edit" &&
              <div className="join">

              
              <button
                className="btn btn-sm btn-ghost join-item tooltip-secondary tooltip tooltip-bottom"
                onClick={() => setShowFieldTypeSelector(!showFieldTypeSelector)}
                data-tip={
                  showFieldTypeSelector
                    ? " fermer le panneau de gauche"
                    : "ouvrir le panneau de gauche"
                }
              >
                {showFieldTypeSelector ? <PanelLeftClose  className="w-4 h-4 " /> : <PanelLeft className="w-4 h-4 "  />}
              </button>
              <button
                className="btn btn-sm btn-ghost join-item tooltip-secondary tooltip tooltip-bottom"
                onClick={() => setShowNavigator(!showNavigator)}
                data-tip={
                  showNavigator
                    ? " fermer le panneau de droite"
                    : "ouvrir le panneau de droite"
                }
              >
                {showNavigator ? <PanelRightClose  className="w-4 h-4 " /> : <PanelRight className="w-4 h-4 "  />}
              </button>
              </div>}
            </div>

              <button
                className="btn btn-soft btn-sm hidden"
                onClick={() => {
                  const dataStr = JSON.stringify(form, null, 2);
                  const blob = new Blob([dataStr], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${form.title || "formulaire"}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Exporter
              </button>
          <div className="flex flex-col align-center">
            <UserProfile />
            <LoginButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Builderheader;
