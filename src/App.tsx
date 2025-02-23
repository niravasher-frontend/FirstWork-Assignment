// src/App.tsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Container,
  CssBaseline,
  Typography,
  Button,
} from "@mui/material";
import { FormBuilder } from "./components/FormBuilder/FormBuilder";
import { FormRenderer } from "./components/FormRenderer/FormRenderer";
import Toast from "./components/shared/Toast";
import { useState } from "react";

function App() {
  const [toast, setToast] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  return (
    <BrowserRouter>
      <CssBaseline />
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Form Builder App
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/builder"
              sx={{ mr: 1 }}
              color="info"
            >
              Builder
            </Button>
            <Button
              variant="contained"
              component={Link}
              to="/renderer"
              color="info"
            >
              Renderer
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ pl: 0, pr: 0 }}>
          <Routes>
            <Route path="/builder" element={<FormBuilder />} />
            <Route path="/renderer" element={<FormRenderer />} />
            <Route path="/" element={<FormBuilder />} />
          </Routes>
        </Container>

        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </BrowserRouter>
  );
}

export default App;
