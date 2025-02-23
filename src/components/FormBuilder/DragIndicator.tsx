import { DragIndicatorProps } from "../../types/types";

export const DragIndicator = ({
  questionId,
  dragState,
}: DragIndicatorProps) => {
  if (dragState.targetId !== questionId) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        height: "2px",
        backgroundColor: "#2196f3",
        top: dragState.direction === "above" ? "-1px" : "auto",
        bottom: dragState.direction === "below" ? "-1px" : "auto",
      }}
    />
  );
};
