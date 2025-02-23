// FormRenderer.tsx
import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
  Typography,
} from "@mui/material";
import { FormSchema, Question, FieldType, ToastProps } from "../../types/types";
import { getFormSchema } from "../../api/apis";
import Toast from "../../components/shared/Toast";
import { LoaderComponent } from "../shared/Loader";
import { Footer } from "../shared/Footer";

export const FormRenderer = () => {
  const [formSchema, setFormSchema] = useState<FormSchema>([]);
  const [formData, setFormData] = useState<Record<string, string | number>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchema = async () => {
      try {
        const schema = await getFormSchema();
        if (schema) {
          setFormSchema(schema);
          const initialData = schema.reduce(
            (acc: Record<string, string | number>, question: Question) => {
              acc[question.id] = question.value || "";
              return acc;
            },
            {} as Record<string, string | number>
          );
          setFormData(initialData);
        }
      } catch (e) {
        console.log(e);
        setToast({ message: "Error loading form", severity: "error" });
      } finally {
        setLoading(false);
      }
    };
    loadSchema();
  }, []);

  const validateField = (
    question: Question,
    value: string | number
  ): string[] => {
    const errorMessages: string[] = [];
    if (question.validations.required && !value) {
      errorMessages.push("This field is required");
    }

    if (question.type === FieldType.Number) {
      const numValue = Number(value);
      if (
        question.validations.min !== undefined &&
        numValue < question.validations.min
      ) {
        errorMessages.push(`Minimum value is ${question.validations.min}`);
      }
      if (
        question.validations.max !== undefined &&
        numValue > question.validations.max
      ) {
        errorMessages.push(`Maximum value is ${question.validations.max}`);
      }
    }

    return errorMessages;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string[]> = {};

    formSchema.forEach((question) => {
      const fieldErrors = validateField(question, formData[question.id]);
      if (fieldErrors.length > 0) {
        newErrors[question.id] = fieldErrors;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setToast({
        message: "Form submitted successfully!",
        severity: "success",
      });
    } else {
      setToast({
        message: "Please fix the errors in the form",
        severity: "error",
      });
    }
  };

  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h5">Form Renderer</Typography>
        {formSchema.map((question) => (
          <div key={question.id}>
            {question.type === FieldType.Text && (
              <TextField
                label={question.label}
                value={formData[question.id] ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, [question.id]: e.target.value })
                }
                fullWidth
                margin="normal"
                error={!!errors[question.id]}
                helperText={errors[question.id]?.join(" • ")}
                required={question.validations.required}
              />
            )}

            {question.type === FieldType.Number && (
              <TextField
                label={question.label}
                type="number"
                value={formData[question.id] ?? 0}
                onChange={(e) =>
                  setFormData({ ...formData, [question.id]: e.target.value })
                }
                fullWidth
                margin="normal"
                error={!!errors[question.id]}
                helperText={errors[question.id]?.join(" • ")}
                required={question.validations.required}
                inputProps={{
                  min: question.validations.min,
                  max: question.validations.max,
                }}
              />
            )}

            {question.type === FieldType.Select && (
              <FormControl
                fullWidth
                margin="normal"
                error={!!errors[question.id]}
              >
                <InputLabel>{question.label}</InputLabel>
                <Select
                  value={formData[question.id] ?? ""}
                  label={question.label}
                  onChange={(e) =>
                    setFormData({ ...formData, [question.id]: e.target.value })
                  }
                  required={question.validations.required}
                >
                  <MenuItem value="">
                    <em>Select an option</em>
                  </MenuItem>
                  {question.options?.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors[question.id] && (
                  <FormHelperText>
                    {errors[question.id]?.join(" • ")}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          </div>
        ))}

        <Footer
          variant="contained"
          text="Submit Form"
          fullWidth={false}
          onBtnClick={() => handleSubmit}
        />
      </Paper>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </Container>
  );
};
