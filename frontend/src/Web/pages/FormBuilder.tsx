import { useRef, useState, useEffect } from "react";
import type {
  Form as FormType,
  FormField,
  FieldType,
  Page,
} from "../shared/form-types";
import { FormPreview } from "../components/form-builder/FormPreview";
import { useDrop } from "react-dnd";
import { useParams, useSearchParams } from "react-router-dom";
import Builderheader from "../components/ui/builderheader";
import BuilderEdit from "../components/ui/builderEdit";
import BuilderSettings from "../components/ui/builder";
import { v4 as uuidv4 } from "uuid";
import { useUser } from '../services/userService';
import { toast } from 'sonner'
import { API_CONFIG, Token } from "../services/config";
import FormAnswers from "../components/form-builder/FormAnswer";
import { getFieldTypeLabel, needsOptions } from "../lib/utils";

export function FormBuilder() {
  const { user } = useUser();
  const { id } = useParams<{ id: string }>();
  const [ activePageIndex, setActivePageIndex] = useState(0);
  const [ showFormDetails, setShowFormDetails] = useState(false);
  const [ loading, setLoading] = useState(true);
  const [ error, setError] = useState("");
  const [ showNavigator, setShowNavigator] = useState(true);
  const [ showFieldTypeSelector, setShowFieldTypeSelector] = useState(true);
   

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

const [form, setForm] = useState<FormType>(() => {
    return {
      theme: "default",
      groupId: 0,
      title: initialTitle,
      description: template,
      pages: [
        {
          id: `page-${Date.now()}`,
          order: 1,
          title: "Page 1",
          fields: [],
        },
      ],
      settings: {
        pageNavigation: false,
        showProgressBar: false,
        collectEmails: true,
        allowMultipleResponses: false,
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
      const updatedForm = updater(prevForm);
      return updatedForm;
    });
  };

  const undo = () => {
    if (undoStack.current.length > 0) {
      const previous = undoStack.current.pop()!;
      redoStack.current.push(form);
      setForm(previous);
    }
  };

  const redo = () => {
    if (redoStack.current.length > 0) {
      const next = redoStack.current.pop()!;
      undoStack.current.push(form);
      setForm(next);
    }
  };

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
        ? `http://localhost:5000/api/forms/${id}`
        : "http://localhost:5000/api/forms";
//  const url = isEditMode
//         ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_FORM.replace(":id", id!)}`
//         : "http://localhost:5000/api/forms";
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
        const response = await fetch(`http://localhost:5000/api/forms/${id}`,{
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
        onSave={handleSave}
        showNavigator={showNavigator}
        setShowNavigator={setShowNavigator}
        showFieldTypeSelector={showFieldTypeSelector}
        setShowFieldTypeSelector={setShowFieldTypeSelector}
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

          {activeTab === "preview" && <div className="relative"><FormPreview form={form} /></div>}

          {activeTab === "settings" && (
            <BuilderSettings
              updateFormDetails={updateFormDetails}
              form={form}
            />
          )}

          {activeTab === "reponse" && (
            <FormAnswers 
              form={form}
            />
          )}
        </div>
      </div>  
    </div>
  );


}


