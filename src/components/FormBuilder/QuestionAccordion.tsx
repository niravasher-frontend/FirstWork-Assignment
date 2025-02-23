import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { QuestionEditableFields } from "./QuestionEditableFields";
import { QuestionAccordionProps } from "../../types/types";
import { DragIndicator } from "./DragIndicator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const QuestionAccordion = ({
  question,
  expanded,
  onExpand,
  onDelete,
  onChange,
  dragHandlers,
  dragState,
  setAllFieldsValid,
}: QuestionAccordionProps) => {
  const [localExpanded, setLocalExpanded] = useState(expanded);

  const handleChange = (_: React.SyntheticEvent, isExpanded: boolean) => {
    setLocalExpanded(isExpanded);
    onExpand(isExpanded ? question.id : "");
  };

  return (
    <div
      draggable
      {...dragHandlers}
      style={{
        position: "relative",
        opacity: dragState.draggedId === question.id ? 0.5 : 1,
        paddingBottom: "0.5rem",
      }}
    >
      <DragIndicator questionId={question.id} dragState={dragState} />

      <Accordion expanded={localExpanded} onChange={handleChange}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <DragHandleIcon
            sx={{ mr: 2, cursor: "move", display: "flex", alignSelf: "center" }}
            onMouseDown={(e) => e.stopPropagation()}
          />
          <Typography
            sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          >
            {question.label || "Untitled Question"}
          </Typography>
          <img
            src="https://cdn-alabaster.wishlink.com/creator-master/delete.svg"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(question.id);
            }}
          />
        </AccordionSummary>

        <AccordionDetails>
          <QuestionEditableFields
            question={question}
            onChange={onChange}
            setAllFieldsValid={setAllFieldsValid}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
