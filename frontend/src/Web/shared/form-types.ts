import type { LucideProps } from "lucide-react";

export type FieldType =
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "file";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, radio, checkbox
  icon?: React.ComponentType<{ className?: string }> ;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export type Form = {
  id?: string;
  groupId: number;
  theme: string;
  title: string;
  description: string;
  pages: Array<{
    id?: string;
    order: number;
    title: string;
    fields: FormField[];
  }>;
  settings: {
    // Valeurs par défaut - Paramètres par défaut des formulaires
    collectEmails: boolean;
    allowMultipleResponses: boolean;
    showProgressBar: boolean;
    pageNavigation: boolean;
    
    // Paramètres par défaut des questions
    makeQuestionsRequiredByDefault: boolean;
    
    // Réponses - Gérez la façon dont les réponses sont collectées et protégées
    sendResponseCopyToParticipants: boolean;
    allowResponseEditing: boolean;
    requireLogin: boolean;
    limitToOneResponse: boolean;
  };
};


export interface FormResponse {
  id: string;
  formId: string;
  responses: Record<string, string | number | boolean | string[]>;
  submittedAt: Date;
}


export interface Page { 
  id?: string | undefined;
    order: number;
    title: string;
    fields: FormField[];
};

export interface PageEditorProps {
  pageIndex: number;
  page: Page;
  onInsertFieldAt: (type: FieldType, index: number, pageIndex: number) => void;
  onUpdateField: (fieldId: string, updatedField: FormField) => void;
  onDeleteField: (fieldId: string) => void;
  onDuplicateField: (fieldId: string) => void;
  onAddFieldAfter: (afterFieldId: string, type: FieldType) => void;
}

export interface BuilderEditProps {
  addPage: () => void;
  goToPage: (pageIndex: number) => void;
  onAddFieldAfter: (afterFieldId: string, type: FieldType) => void;
  setShowFormDetails: (show: boolean | ((prev: boolean) => boolean)) => void;
  insertFieldAt: (type: FieldType, index: number, pageIndex: number) => void;
  dropRef: (el: HTMLDivElement | null) => void;
  addFieldAfter: (afterFieldId: string, type: FieldType) => void;
  duplicateField: (fieldId: string) => void;
  deleteField: (fieldId: string) => void;
  activePage:  {
    id?: string | undefined;
    order: number;
    title: string;
    fields: FormField[];
  };
  updateField: (fieldId: string, updatedField: FormField) => void;
  form: Form;
  updateFormDetails: (details: Partial<Form>) => void;
  addField: (type: FieldType) => void;
  activePageIndex: number;
  showFormDetails: boolean;
  dropContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  setFormWithHistory: (updater: (prev: Form) => Form) => void;
  showNavigator: boolean;
  setShowNavigator: (show: boolean) => void;
  showFieldTypeSelector: boolean;
  setShowFieldTypeSelector: (show: boolean) => void;

}

export interface FieldTypeSelectorProps {
  onSelectType: (type: FieldType) => void;
}

export type FieldTypeUI = {
  type: FieldType;
  name: string;
  icon: React.ComponentType<LucideProps>;
  description: string;
  bgColor: string;
  textColor: string;
};
export interface BuilderHeaderProps {
  form: Form;
  setForm: (form: Form) => void;
  onSave: () => void;
  updateFormDetails: (updates: Partial<Form>) => void;
  activeTab: "edit" | "preview" | "settings" | "reponse";
  setActiveTab: (tab: BuilderHeaderProps["activeTab"]) => void;
  setActivePageIndex: (index: number) => void;
  undoStack: React.MutableRefObject<Form[]>;
  redoStack: React.MutableRefObject<Form[]>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  showNavigator: boolean;
  setShowNavigator: (show: boolean) => void;
  showFieldTypeSelector: boolean;
  setShowFieldTypeSelector: (show: boolean) => void;
  hasUnsavedChanges?: boolean;
}


export type AnswerValue = string | number | boolean | string[];

export interface Submission {
  userId?: string;
  timestamp: string;
  answers: Record<string, AnswerValue>;
}