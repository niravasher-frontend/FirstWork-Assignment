import { useEffect, useState } from "react";
import { Container, Paper } from "@mui/material";
import { QuestionAccordion } from "./QuestionAccordion";
import { QuestionFormModal } from "./QuestionFormModal";
import Toast from "../shared/Toast";
import { FormSchema, Question, DragState, ToastProps } from "../../types/types";
import { saveFormSchema, getFormSchema } from "../../api/apis";
import { LoaderComponent } from "../shared/Loader";

export const FormBuilder = () => {
  const [formSchema, setFormSchema] = useState<FormSchema>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [allFieldsValid, setAllFieldsValid] = useState(true);

  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    null
  );
  const [dragState, setDragState] = useState<DragState>({
    draggedId: null,
    targetId: null,
    direction: null,
  });
  const [loading, setLoading] = useState(false);
  const [previousSchema, setPreviousSchema] = useState<FormSchema>([]);
  const [isUnsaved, setIsUnsaved] = useState(false);

  useEffect(() => {
    const loadSchema = async () => {
      try {
        setLoading(true);
        const schema = await getFormSchema();
        if (schema) setFormSchema(schema);
      } catch (e) {
        console.log(e);
        setToast({ message: "Error loading form", severity: "error" });
      } finally {
        setLoading(false);
      }
    };
    loadSchema();
  }, []);

  useEffect(() => {
    if (
      !isUnsaved ||
      JSON.stringify(formSchema) === JSON.stringify(previousSchema) ||
      !allFieldsValid
    ) {
      return;
    }
    const autoSave = async () => {
      try {
        await saveFormSchema(formSchema);
        setToast({ message: "Form auto-saved", severity: "success" });
        setPreviousSchema(formSchema);
        setIsModalOpen(false);
        setIsUnsaved(false);
      } catch (e) {
        console.log(e);
        setToast({ message: "Error auto-saving form", severity: "error" });
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(autoSave, 1000);
    return () => clearTimeout(timeoutId);
  }, [formSchema, isUnsaved, previousSchema, allFieldsValid]);

  const handleDragStart = (questionId: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", questionId);
    setDragState({ ...dragState, draggedId: questionId });
    (e.currentTarget as HTMLElement).style.opacity = "0.5";
  };

  const handleDragOver = (questionId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragState.draggedId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const direction =
      e.clientY < rect.top + rect.height / 2 ? "above" : "below";
    setDragState({ ...dragState, targetId: questionId, direction });
  };

  const handleDragEnd = () => {
    if (!dragState.draggedId || !dragState.targetId) return;

    const oldIndex = formSchema.findIndex((q) => q.id === dragState.draggedId);
    const newIndex = formSchema.findIndex((q) => q.id === dragState.targetId);
    const adjustedIndex =
      dragState.direction === "below" ? newIndex + 1 : newIndex;

    const newSchema = [...formSchema];
    const [movedItem] = newSchema.splice(oldIndex, 1);
    newSchema.splice(adjustedIndex, 0, movedItem);

    setFormSchema(newSchema);
    setIsUnsaved(true); // Add this line to mark as dirty
    setDragState({ draggedId: null, targetId: null, direction: null });
  };

  const handleAddQuestion = (question: Omit<Question, "id">) => {
    const newQuestion = {
      ...question,
      id: Math.floor(Math.random() * 100).toString(),
    };
    setFormSchema([...formSchema, newQuestion]); // Updates form schema
    setIsUnsaved(true);
  };

  const handleQuestionChange = (
    questionId: string,
    updatedFields: Partial<Question>
  ) => {
    setFormSchema(
      formSchema.map((question) =>
        question.id === questionId
          ? { ...question, ...updatedFields }
          : question
      )
    );
    setIsUnsaved(true);
  };
  const deleteQuestion = (questionId: string) => {
    const newSchema = formSchema.filter(
      (question) => question.id.toString() !== questionId.toString()
    );
    setFormSchema(newSchema);
    setIsUnsaved(true);
  };

  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <Container maxWidth="lg" sx={{ pt: 2 }}>
      {formSchema?.length > 0 && (
        <Paper sx={{ pt: 1, pl: 1, pr: 1, background: "#eee" }}>
          {formSchema.map((question) => (
            <QuestionAccordion
              key={question.id}
              question={question}
              expanded={expandedQuestionId === question.id}
              onExpand={setExpandedQuestionId}
              onDelete={deleteQuestion}
              onChange={handleQuestionChange}
              dragHandlers={{
                onDragStart: handleDragStart(question.id),
                onDragOver: handleDragOver(question.id),
                onDragEnd: handleDragEnd,
              }}
              dragState={dragState}
              setAllFieldsValid={setAllFieldsValid}
            />
          ))}
        </Paper>
      )}

      <QuestionFormModal
        open={isModalOpen}
        editingQuestion={editingQuestion}
        onClose={() => {
          setIsModalOpen(false);
          setEditingQuestion(null);
          setIsUnsaved(false);
        }}
        onSubmit={handleAddQuestion}
        setIsUnsaved={setIsUnsaved}
        isUnsaved={isUnsaved}
        setIsModalOpen={setIsModalOpen}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </Container>
  );
};
