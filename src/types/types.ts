// types.ts (remains the same)
export enum FieldType {
  Text = "text",
  Number = "number",
  Select = "select",
}

export type Validations = {
  required?: boolean;
  min?: number;
  max?: number;
};

export type Question = {
  id: string;
  type: FieldType;
  label: string;
  validations: Validations;
  options?: string[];
  value?: string | number;
};

export type FormSchema = Question[];

export interface QuestionAccordionProps {
  question: Question;
  expanded: boolean;
  onExpand: (id: string) => void;
  onDelete: (id: string) => void;
  onChange: (id: string, updatedFields: Partial<Question>) => void;
  dragHandlers: {
    onDragStart: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragEnd: () => void;
  };
  dragState: DragState;
  setAllFieldsValid: React.Dispatch<React.SetStateAction<boolean>>;
}

export type DragState = {
  draggedId: string | null;
  targetId: string | null;
  direction: "above" | "below" | null;
};

export interface QuestionFormModalProps {
  open: boolean;
  editingQuestion: Question | null;
  onClose: () => void;
  onSubmit: (question: Omit<Question, "id">) => void;
  isUnsaved: boolean;
  setIsUnsaved: (unsaved: boolean) => void;
  setIsModalOpen: (open: boolean) => void;
}

export interface DragIndicatorProps {
  questionId: string;
  dragState: {
    targetId: string | null;
    direction: "above" | "below" | null;
  };
}

export interface QuestionEditableFieldsProps {
  question: Question;
  onChange: (id: string, updatedFields: Partial<Question>) => void;
  setAllFieldsValid: React.Dispatch<React.SetStateAction<boolean>>;
}

export type ToastProps = {
  message: string;
  severity: "success" | "error";
};

export interface FooterProps {
  variant: "text" | "outlined" | "contained";
  text: string;
  fullWidth: boolean;
  onBtnClick: () => void;
}

export interface QuestionFormProps {
  initialQuestion?: Question | null;
  errors?: Record<string, string>;
  options: string[];
  label: string;
  type: FieldType;
  value: string;
  validations: Validations;
  setValidations: React.Dispatch<React.SetStateAction<Validations>>;
  setType: (type: FieldType) => void;
  setOptions: (options: string[]) => void;
  setLabel: (label: string) => void;
  setValue: (value: string) => void;
}
