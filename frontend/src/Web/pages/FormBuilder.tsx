import { useRef, useState, useEffect, useCallback } from "react";
import type {
  Form as FormType,
  FormField,
  FieldType,
  Page,
} from "../shared/form-types";
import { FormPreview } from "../components/form-builder/FormPreview";
import { useDrop } from "react-dnd";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Builderheader from "../components/ui/builderheader";
import BuilderEdit from "../components/ui/builderEdit";
import BuilderSettings from "../components/ui/builder";
import ExitConfirmModal from "../components/ui/ExitConfirmModal";
import { v4 as uuidv4 } from "uuid";
import { useUser } from '../services/userService';
import { toast } from 'sonner'
import { API_CONFIG, Token } from "../services/config";
import FormAnswers from "../components/form-builder/FormAnswer";
import { getFieldTypeLabel, needsOptions } from "../lib/utils";

export function FormBuilder() {
  const { user } = useUser();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ activePageIndex, setActivePageIndex] = useState(0);
  const [ showFormDetails, setShowFormDetails] = useState(false);
  const [ loading, setLoading] = useState(true);
  const [ error, setError] = useState("");
  const [ showNavigator, setShowNavigator] = useState(true);
  const [ showFieldTypeSelector, setShowFieldTypeSelector] = useState(true);
  const [ showExitModal, setShowExitModal] = useState(false);
  const [ hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [ pendingNavigation, setPendingNavigation] = useState<string | null>(null);
   

  const [, drop] = useDrop(() => ({
    accept: "FIELD_TYPE",
    drop: (item: { type: FieldType }, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const container = dropContainerRef.current;
      if (!container) return;

      const children = Array.from(container.children);
      const fieldElements = children.filter((el) =>
        el.hasAttribute("data-field-id")
      );

      let closestIndex = activePage.fields.length;
      for (let i = 0; i < fieldElements.length; i++) {
        const el = fieldElements[i] as HTMLElement;
        const rect = el.getBoundingClientRect();
        const middleY = rect.top + rect.height / 2;

        if (clientOffset.y < middleY) {
          closestIndex = i;
          break;
        }
      }

      insertFieldAt(item.type, closestIndex, activePageIndex);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const dropContainerRef = useRef<HTMLDivElement>(null);
  const undoStack = useRef<FormType[]>([]);
  const redoStack = useRef<FormType[]>([]);

 
  const [searchParams] = useSearchParams();  

  const isEditMode = Boolean(id);     
const template = searchParams.get("template") || "blank template";
  const initialTitle = searchParams.get("title") || "Nouveau formulaire";

const getTemplateFields = (templateType: string): FormField[] => {
  switch (templateType) {
    case "quiz":
      return [
        {
          id: `field-${Date.now()}-1`,
          type: "radio",
          label: "Quelle est la capitale de la France ?",
          required: true,
          options: ["Paris", "Lyon", "Marseille", "Toulouse"]
        },
        {
          id: `field-${Date.now()}-2`,
          type: "radio",
          label: "Combien font 2 + 2 ?",
          required: true,
          options: ["3", "4", "5", "6"]
        },
        {
          id: `field-${Date.now()}-3`,
          type: "text",
          label: "Votre nom complet",
          required: true
        }
      ];
    
    case "survey":
      return [
        {
          id: `field-${Date.now()}-1`,
          type: "select",
          label: "Comment évaluez-vous notre service ?",
          required: true,
          options: ["Excellent", "Très bien", "Bien", "Moyen", "Mauvais"]
        },
        {
          id: `field-${Date.now()}-2`,
          type: "radio",
          label: "Recommanderiez-vous notre service ?",
          required: true,
          options: ["Oui, certainement", "Probablement", "Peut-être", "Probablement pas", "Non, jamais"]
        },
        {
          id: `field-${Date.now()}-3`,
          type: "textarea",
          label: "Commentaires supplémentaires",
          required: false
        }
      ];
    
    case "registration":
      return [
        {
          id: `field-${Date.now()}-1`,
          type: "text",
          label: "Nom complet",
          required: true
        },
        {
          id: `field-${Date.now()}-2`,
          type: "email",
          label: "Adresse email",
          required: true
        },
        {
          id: `field-${Date.now()}-3`,
          type: "text",
          label: "Numéro de téléphone",
          required: true
        },
        {
          id: `field-${Date.now()}-4`,
          type: "select",
          label: "Type de participation",
          required: true,
          options: ["Participant", "Accompagnateur", "VIP", "Presse"]
        },
        {
          id: `field-${Date.now()}-5`,
          type: "checkbox",
          label: "Options supplémentaires",
          required: false,
          options: ["Repas végétarien", "Accès PMR", "Newsletter", "Certificat de participation"]
        }
      ];
    
    default:
      return [];
  }
};

const getTemplateDescription = (templateType: string): string => {
  switch (templateType) {
    case "quiz":
      return "Quiz interactif pour évaluer les connaissances";
    case "survey":
      return "Sondage pour collecter des avis et opinions";
    case "registration":
      return "Formulaire d'inscription à un événement";
    default:
      return "Formulaire personnalisé";
  }
};

const [form, setForm] = useState<FormType>(() => {
    const templateFields = getTemplateFields(template);
    
    return {
      theme: "default",
      groupId: 0,
      title: initialTitle,
      description: getTemplateDescription(template),
      pages: [
        {
          id: `page-${Date.now()}`,
          order: 1,
          title: "Page 1",
          fields: templateFields,
        },
      ],
      settings: {
        pageNavigation: true,
        showProgressBar: template === "quiz",
        collectEmails: template !== "quiz",
        allowMultipleResponses: template === "survey",
        makeQuestionsRequiredByDefault: false,
        sendResponseCopyToParticipants: false,
        allowResponseEditing: false,
        requireLogin: false,
        limitToOneResponse: false,
      },
    };
  });

  const goToPage = (index: number) => {
    if (index >= 0 && index < form.pages.length) {
      setActivePageIndex(index);
    }
  };

  const setFormWithHistory = (updater: (prev: FormType) => FormType) => {
    setForm((prevForm) => {
      // Sauvegarder l'état actuel dans l'historique avant la modification
      undoStack.current.push(JSON.parse(JSON.stringify(prevForm)));
      
      // Limiter la taille de l'historique à 50 actions
      if (undoStack.current.length > 50) {
        undoStack.current.shift();
      }
      
      // Vider la pile redo car on fait une nouvelle action
      redoStack.current = [];
      
      // Marquer comme ayant des changements non sauvegardés
      setHasUnsavedChanges(true);
      
      const updatedForm = updater(prevForm);
      return updatedForm;
    });
  };

  // Fonction pour gérer la navigation avec confirmation
  const handleNavigation = (path: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(path);
      setShowExitModal(true);
    } else {
      navigate(path);
    }
  };

  // Fonction pour confirmer la sortie sans sauvegarder
  const handleConfirmExit = () => {
    setShowExitModal(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
    setPendingNavigation(null);
  };

  // Fonction pour sauvegarder et sortir
  const handleSaveAndExit = async () => {
    await handleSave();
    setHasUnsavedChanges(false);
    setShowExitModal(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
    setPendingNavigation(null);
  };

  // Fonction pour fermer le modal
  const handleCloseModal = () => {
    setShowExitModal(false);
    setPendingNavigation(null);
  };

  const undo = useCallback(() => {
    if (undoStack.current.length > 0) {
      const previous = undoStack.current.pop()!;
      redoStack.current.push(JSON.parse(JSON.stringify(form)));
      setForm(previous);
      toast.success("Action annulée");
    }
  }, [form]);

  const redo = useCallback(() => {
    if (redoStack.current.length > 0) {
      const next = redoStack.current.pop()!;
      undoStack.current.push(JSON.parse(JSON.stringify(form)));
      setForm(next);
      toast.success("Action rétablie");
    }
  }, [form]);

  // Raccourcis clavier pour undo/redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      } else if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
        event.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);


  const [activeTab, setActiveTab] = useState<
    "edit" | "preview" | "settings" | "reponse" 
  >("edit");

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      label: `${getFieldTypeLabel(type)} Question`,
      required: false,
      ...(needsOptions(type) && { options: ["Option 1", "Option 2"] }),
    };

    setFormWithHistory((prevForm) => {
      const newPages = [...prevForm.pages];
      const fields = [...newPages[activePageIndex].fields, newField];

      newPages[activePageIndex] = {
        ...newPages[activePageIndex],
        fields,
      };

      return { ...prevForm, pages: newPages };
    });
  };

  const deleteField = (fieldId: string) => {
    setFormWithHistory((prevForm) => {
      const newPages = [...prevForm.pages];
      const fields = newPages[activePageIndex].fields.filter(
        (f) => f.id !== fieldId
      );

      newPages[activePageIndex] = {
        ...newPages[activePageIndex],
        fields,
      };

      return { ...prevForm, pages: newPages };
    });
  };

  const duplicateField = (fieldId: string) => {
    const fieldToDuplicate = form.pages[activePageIndex].fields.find(
      (field) => field.id === fieldId
    );
    if (fieldToDuplicate) {
      const duplicatedField: FormField = {
        ...fieldToDuplicate,
        id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        label: `${fieldToDuplicate.label} (Copy)`,
      };
      setFormWithHistory((prevForm) => {
        const newPages = [...prevForm.pages];
        const newFields = [
          ...newPages[activePageIndex].fields,
          duplicatedField,
        ];
        newPages[activePageIndex] = {
          ...newPages[activePageIndex],
          fields: newFields,
        };
        return { ...prevForm, pages: newPages };
      });
    }
  };

  const updateField = (fieldId: string, updatedField: FormField) => {
    setFormWithHistory((prevForm) => {
      const newPages = prevForm.pages.map((page, i) => {
        if (i === activePageIndex) {
          return {
            ...page,
            fields: page.fields.map((f) =>
              f.id === fieldId ? updatedField : f
            ),
          };
        }
        return page;
      });
      return { ...prevForm, pages: newPages };
    });
  };

  const addPage = () => {
    const newPage = {
      id: `page-${Date.now()}`,
      order: form.pages.length + 1,
      title: `Page ${form.pages.length + 1}`,
      fields: [],
    };

    setFormWithHistory((prevForm) => ({
      ...prevForm,
      pages: [...prevForm.pages, newPage],
    }));

    setActivePageIndex(form.pages.length);
  };

  const addFieldAfter = (afterFieldId: string, type: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `${getFieldTypeLabel(type)} Question`,
      required: false,
      ...(needsOptions(type) && { options: ["Option 1", "Option 2"] }),
    };

    setFormWithHistory((prevForm) => {
      const newPages = [...prevForm.pages];
      const currentFields = [...newPages[activePageIndex].fields];

      const idx = currentFields.findIndex((f) => f.id === afterFieldId);

      if (idx === -1) {
        currentFields.push(newField);
      } else {
        currentFields.splice(idx + 1, 0, newField);
      }

      newPages[activePageIndex] = {
        ...newPages[activePageIndex],
        fields: currentFields,
      };

      return { ...prevForm, pages: newPages };
    });
  };

  const insertFieldAt = (
    type: FieldType,
    index: number,
    pageIndex: number = activePageIndex
  ) => {
    const newField: FormField = {
      id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      label: `${getFieldTypeLabel(type)} Question`,
      required: false,
      ...(needsOptions(type) && { options: ["Option 1", "Option 2"] }),
    };

    setFormWithHistory((prevForm) => {
      const newPages = [...prevForm.pages];

      if (!newPages[pageIndex]) {
        console.warn(`Page index ${pageIndex} is invalid`);
        return prevForm;
      }

      const fields = [...newPages[pageIndex].fields];

      const insertIndex = Math.max(0, Math.min(index, fields.length));
      fields.splice(insertIndex, 0, newField);

      newPages[pageIndex] = {
        ...newPages[pageIndex],
        fields,
      };

      return { ...prevForm, pages: newPages };
    });
  };

  const updateFormDetails = (updates: Partial<FormType>) => {
    setFormWithHistory((prev) => ({ ...prev, ...updates }));
  };

  const activePage = form.pages[activePageIndex];
  
  function generateRandomColor(): string {
    const r = Math.floor(Math.random() * 256); // 0-255
    const g = Math.floor(Math.random() * 256); // 0-255
    const b = Math.floor(Math.random() * 256); // 0-255
    const a = Math.random().toFixed(2);       // 0.00-1.00
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  const handleSave = async () => {
    if (!form) return;

    const formToSave = {
      createById: user.id,
      ...form,
      groupId: form.groupId,
      updateAt: new Date(),
      theme: isEditMode?  form.theme : generateRandomColor(),
      id: isEditMode? form.id : uuidv4(),
      settings: form.settings,
    };
    console.log(formToSave)
    
    try {
      const url = isEditMode
        ? `https://online-hozy.onrender.com/api/forms/${id}`
        : "https://online-hozy.onrender.com/api/forms";
//  const url = isEditMode
//         ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_FORM.replace(":id", id!)}`
//         : "https://online-hozy.onrender.com/api/forms";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" ,  "Authorization": `Bearer ${Token}`},
        body: JSON.stringify(formToSave),

      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || `Erreur HTTP ${response.status}`);
      }

      const savedForm = await response.json();
      console.log("✅ Form sauvegardé :", savedForm);
      toast.success(isEditMode ? "Formulaire mis à jour" : "Formulaire créé");
      
      // Marquer comme sauvegardé
      setHasUnsavedChanges(false);

    } catch (err) {
      console.error("❌=>", err);
      toast.error("Erreur de sauvegarde: " + err);
    }
  };

  useEffect(() => {
    if (!isEditMode) {
      setLoading(false); 
      return;
    } 

    const fetchForm = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_FORM.replace(":id", id!)}`,{
           headers: { "Content-Type": "application/json" ,  "Authorization": `Bearer ${Token}`,},}
        );

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.message || `Erreur HTTP ${response.status}`);
        }
        const data = await response.json();

        const formWithPageIds = {
          ...data,
          pages: data.pages.map((page: Page, index: number) => ({
            ...page,
            id: page.id || `page-${Date.now()}-${index}`,
          })),
        };
        setForm(formWithPageIds); 
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erreur lors du chargement du formulaire";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id, isEditMode]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchForm = async () => {
      try {
        const response = await fetch(`https://online-hozy.onrender.com/api/forms/${id}`,{
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Token}` },
        });
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.message || `Erreur HTTP ${response.status}`);
        }
        const data = await response.json();
        // Ensure all pages have an ID
        const formWithPageIds = {
          ...data,
          pages: data.pages.map((page: Page, index: number) => ({
            ...page,
            id: page.id || `page-${Date.now()}-${index}`,
          })),
        };
        setForm(formWithPageIds);
        // console.log(formWithPageIds);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement du formulaire";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  return (
    <div className="overflow-hidden bg-background" style={{ height: "calc(100vh )" }}>
 
        <Builderheader
        updateFormDetails={updateFormDetails}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setActivePageIndex={setActivePageIndex}
        undoStack={undoStack}
        setForm={setForm}
        form={form}
        undo={undo}
        redoStack={redoStack}
        redo={redo}
        canUndo={undoStack.current.length > 0}
        canRedo={redoStack.current.length > 0}
        onSave={handleSave}
        showNavigator={showNavigator}
        setShowNavigator={setShowNavigator}
        showFieldTypeSelector={showFieldTypeSelector}
        setShowFieldTypeSelector={setShowFieldTypeSelector}
        onNavigate={handleNavigation}
        hasUnsavedChanges={hasUnsavedChanges}
      />   
      <div className="" >

        <div className="">
          {activeTab === "edit" && (
            <>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <span className="loading loading-spinner text-primary text-4xl"></span>
                  <span className="ml-2 text-lg">Chargement...</span>
                </div>
              ) : error ? (
                <div className="alert alert-error shadow-lg my-4">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              ) : !form ? (
                <div className="alert alert-warning shadow-lg my-4">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M12 6v.01M12 18h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Formulaire introuvable</span>
                  </div>
                </div>
              ) : (
                <BuilderEdit
                        addPage={addPage}
                        goToPage={goToPage}
                        setShowFormDetails={setShowFormDetails}
                        onAddFieldAfter={addFieldAfter}
                        insertFieldAt={insertFieldAt}
                        dropRef={drop}
                        addFieldAfter={addFieldAfter}
                        duplicateField={duplicateField}
                        deleteField={deleteField}
                        activePage={activePage}
                        updateField={updateField}
                        form={form}
                        updateFormDetails={updateFormDetails}
                        addField={addField}
                        activePageIndex={activePageIndex}
                        showFormDetails={showFormDetails}
                        showNavigator={showNavigator}
                        showFieldTypeSelector={showFieldTypeSelector}
                        dropContainerRef={dropContainerRef}
                        setFormWithHistory={setFormWithHistory} 
                        setShowNavigator={function (): void {
                          throw new Error("Function not implemented.");
                        } } setShowFieldTypeSelector={function (): void {
                          throw new Error("Function not implemented.");
                        } }                        />
              )}
            </>
          )}

          {activeTab === "preview" && <div className="relative"><FormPreview form={form} onSubmit={toast("Formulaire soumis")}/></div>}

          {activeTab === "settings" && (
            <BuilderSettings 
              form={form} 
              updateFormDetails={updateFormDetails} 
              hasUnsavedChanges={hasUnsavedChanges}
            />
          )}

          {activeTab === "reponse" && (
            <FormAnswers 
              form={form}
            />
          )}
        </div>
      </div>  
      
      {/* Modal de confirmation de sortie */}
      <ExitConfirmModal
        isOpen={showExitModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmExit}
        onSave={handleSaveAndExit}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    </div>
  );


}


