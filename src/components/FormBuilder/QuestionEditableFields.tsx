import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { FieldType, QuestionEditableFieldsProps } from "../../types/types";
import { useEffect, useState } from "react";

export const QuestionEditableFields = ({
  question,
  onChange,
  setAllFieldsValid,
}: QuestionEditableFieldsProps) => {
  const [labelerror, setLabelError] = useState("");
  const [rangeError, setRangeError] = useState("");

  useEffect(() => {
    if (!labelerror && !rangeError) setAllFieldsValid(true);
    else setAllFieldsValid(false);
  }, [labelerror, rangeError, setAllFieldsValid]);

  const onChangeInputLabel = (id: string, value: string) => {
    if (value === "") setLabelError("Label is required");
    else setLabelError("");
    onChange(id, { label: value });
  };

  const onChangeDefaultValue = (id: string, value: string) => {
    if (question.type === FieldType.Select) {
      if (question.options && !question.options.includes(value)) {
        setRangeError("Value must be one of the options");
      } else setRangeError("");
    } else if (question.type === FieldType.Number) {
      if (
        Number(value) < Number(question.validations.min) ||
        Number(value) > Number(question.validations.max)
      ) {
        setRangeError("Value must be between min and max");
      } else setRangeError("");
    } else {
      setRangeError("");
    }
    onChange(id, { value });
  };

  return (
    <>
      <TextField
        fullWidth
        label="Question Label"
        value={question.label}
        error={labelerror !== ""}
        helperText={labelerror || ""}
        onChange={(e) => onChangeInputLabel(question.id, e.target.value)}
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Question Type</InputLabel>
        <Select
          value={question.type}
          label="Question Type"
          disabled={true}
          onChange={(e) =>
            onChange(question.id, {
              type: e.target.value as FieldType,
              options: e.target.value === FieldType.Select ? [] : undefined,
            })
          }
        >
          <MenuItem value={FieldType.Text}>Text</MenuItem>
          <MenuItem value={FieldType.Number}>Number</MenuItem>
          <MenuItem value={FieldType.Select}>Dropdown</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Default Value"
        type={question.type === FieldType.Number ? "number" : "text"}
        value={question.value || ""}
        error={rangeError !== ""}
        helperText={
          rangeError || "This will be pre-filled when the form is rendered"
        }
        onChange={(e) => onChangeDefaultValue(question.id, e.target.value)}
        margin="normal"
      />

      {question.type === FieldType.Select && (
        <TextField
          fullWidth
          label="Options (comma separated)"
          value={question.options?.join(", ") || ""}
          onChange={(e) =>
            onChange(question.id, {
              options: e.target.value.split(",").map((o) => o.trim()),
            })
          }
          margin="normal"
          helperText="Separate options with commas"
        />
      )}
      <FormControlLabel
        control={
          <Checkbox
            checked={question.validations.required || false}
            onChange={(e) =>
              onChange(question.id, {
                validations: {
                  ...question.validations,
                  required: e.target.checked,
                },
              })
            }
          />
        }
        label="Required"
        sx={{ mt: 2 }}
      />
      {question.type === FieldType.Number && (
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          <TextField
            label="Min Value"
            type="number"
            value={question.validations.min || ""}
            onChange={(e) =>
              onChange(question.id, {
                validations: {
                  ...question.validations,
                  min: Number(e.target.value),
                },
              })
            }
          />
          <TextField
            label="Max Value"
            type="number"
            value={question.validations.max || ""}
            onChange={(e) =>
              onChange(question.id, {
                validations: {
                  ...question.validations,
                  max: Number(e.target.value),
                },
              })
            }
          />
        </div>
      )}
    </>
  );
};
