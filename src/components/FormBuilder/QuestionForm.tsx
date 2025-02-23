// QuestionForm.tsx
import { useEffect } from "react";
import {
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import { FieldType, QuestionFormProps } from "../../types/types";

export const QuestionForm = ({
  initialQuestion,
  errors = {},
  setLabel,
  setOptions,
  setType,
  setValue,
  setValidations,
  options,
  label,
  type,
  value,
  validations,
}: QuestionFormProps) => {
  useEffect(() => {
    if (initialQuestion) {
      setType(initialQuestion.type);
      setLabel(initialQuestion.label);
      setOptions(initialQuestion.options || []);
      setValidations(initialQuestion.validations);
      setValue(String(initialQuestion.value) || "");
    }
  }, [
    initialQuestion,
    setLabel,
    setOptions,
    setType,
    setValue,
    setValidations,
  ]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          label="Question Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          fullWidth
          error={!!errors.label}
          helperText={errors.label}
          required
        />
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth error={!!errors.type}>
          <InputLabel>Question Type</InputLabel>
          <Select
            value={type}
            label="Question Type"
            onChange={(e) => setType(e.target.value as FieldType)}
          >
            <MenuItem value={FieldType.Text}>Text</MenuItem>
            <MenuItem value={FieldType.Number}>Number</MenuItem>
            <MenuItem value={FieldType.Select}>Dropdown</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Default Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.range}
          helperText={
            errors.range
              ? errors.range
              : "Optional default value for this field"
          }
        />
      </Grid>

      {type === FieldType.Select && (
        <Grid item xs={12}>
          <TextField
            label="Options (comma separated)"
            value={options.join(",")}
            onChange={(e) =>
              setOptions(e.target.value.split(",").map((o) => o.trim()))
            }
            fullWidth
            error={!!errors.options}
            helperText={errors.options || "Separate options with commas"}
          />
        </Grid>
      )}

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={validations.required || false}
              onChange={(e) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setValidations((v: any) => ({
                  ...v,
                  required: e.target.checked,
                }))
              }
            />
          }
          label="Required"
        />
      </Grid>

      {type === FieldType.Number && (
        <>
          <Grid item xs={6}>
            <TextField
              label="Minimum Value"
              type="number"
              value={validations.min || ""}
              onChange={(e) =>
                setValidations((v) => ({ ...v, min: Number(e.target.value) }))
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Maximum Value"
              type="number"
              value={validations.max || ""}
              onChange={(e) =>
                setValidations((v) => ({ ...v, max: Number(e.target.value) }))
              }
              fullWidth
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};
