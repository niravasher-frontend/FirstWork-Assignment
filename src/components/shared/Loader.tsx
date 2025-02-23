import { CircularProgress, Container } from "@mui/material";

export const LoaderComponent = () => {
  return (
    <Container
      maxWidth="md"
      sx={{ display: "flex", justifyContent: "center", mt: 4 }}
    >
      <CircularProgress />
    </Container>
  );
};
