import { FC } from "react";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import Box from "@mui/material/Box";

export interface CancelComponentProps {
  onCancel: () => void;
}

const CancelComponent: FC<CancelComponentProps> = ({ onCancel }) => {
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
