import { FC } from "react";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import Box from "@mui/material/Box";

export interface CancelComponentProperties {
  onCancel: () => void;
}

const CancelComponent: FC<CancelComponentProperties> = ({ onCancel }) => {
  return (
    <Box display="flex" justifyContent="flex-end" padding={2}>
      <Button
        onClick={onCancel}
        variant="outlined"
      >
       <CancelIcon />
      </Button>
    </Box>
  );
};

export default CancelComponent;
