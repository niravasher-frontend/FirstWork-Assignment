import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { QuestionForm } from "./QuestionForm";
import {
  FieldType,
  QuestionFormModalProps,
  Validations,
} from "../../types/types";
import { useState } from "react";
import { Footer } from "../shared/Footer";

export const QuestionFormModal = ({
  open,
  editingQuestion,
  onClose,
  onSubmit,
  isUnsaved,
  setIsModalOpen,
}: QuestionFormModalProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [label, setLabel] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [type, setType] = useState<FieldType>(FieldType.Text);
  const [value, setValue] = useState("");
  const [validations, setValidations] = useState<Validations>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!label.trim()) newErrors.label = "Label is required";
    if (type === FieldType.Select && options.length === 0) {
      newErrors.options = "At least one option is required";
    }
    if (type === FieldType.Number) {
      if (!value.trim()) {
        return true;
      }
      if (value && isNaN(Number(value))) {
        newErrors.value = "Value must be a number";
      } else if (
        Number(value) < Number(validations.min) ||
        Number(value) > Number(validations.max)
      ) {
        newErrors.range = `Value must be between ${validations.min} and ${validations.max}`;
      }
    }
    if (type === FieldType.Select && options.length === 0) {
      newErrors.options = "At least one option is required";
    } else if (type === FieldType.Select) {
      if (value && !options.includes(value)) {
        newErrors.options = "Value must be one of the options";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({ label, options, type, value, validations });
  };

  return (
    <>
      <Footer
        variant="contained"
        text="Add New Question"
        fullWidth={true}
        onBtnClick={() => {
          setIsModalOpen(true);
          setErrors({});
          setLabel("");
          setOptions([]);
          setType(FieldType.Text);
          setValue("");
          setValidations({});
        }}
      />
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingQuestion ? "Edit Question" : "Add New Question"}
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
            disabled={isUnsaved}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <QuestionForm
            initialQuestion={editingQuestion}
            errors={errors}
            setLabel={setLabel}
            setOptions={setOptions}
            options={options}
            label={label}
            type={type}
            setType={setType}
            value={value}
            setValue={setValue}
            validations={validations}
            setValidations={setValidations}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isUnsaved}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="question-form"
            variant="contained"
            onClick={(e) => handleSubmit(e)}
            disabled={isUnsaved}
          >
            {isUnsaved ? "Saving" : "Save Question"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
