// Toast.tsx
import { Snackbar, Alert } from "@mui/material";

export default function Toast({
  toast,
  onClose,
}: {
  toast: { message: string; severity: "success" | "error" } | null;
  onClose: () => void;
}) {
  return (
    <Snackbar
      open={!!toast}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={onClose}
        severity={toast?.severity}
        sx={{ width: "100%" }}
      >
        {toast?.message}
      </Alert>
    </Snackbar>
  );
}
