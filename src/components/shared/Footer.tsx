import { Box, Button } from "@mui/material";
import { FooterProps } from "../../types/types";

export const Footer = ({
  variant,
  text,
  onBtnClick,
  fullWidth,
}: FooterProps) => {
  return (
    <Box mt={4} display="flex" justifyContent="flex-end">
      <Button
        type="submit"
        fullWidth={fullWidth}
        variant={variant}
        size="large"
        onClick={onBtnClick}
      >
        {text}
      </Button>
    </Box>
  );
};
