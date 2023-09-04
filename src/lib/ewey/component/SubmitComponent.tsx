import { FC } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Box from "@mui/material/Box";

export interface SubmitComponentProps {
  valid: boolean;
  submitting: boolean;
  onSubmit: () => void;
}

const SubmitComponent: FC<SubmitComponentProps> = ({
  valid,
  submitting,
  onSubmit,
}) => {
  return (
    <Box display="flex" justifyContent="flex-end" padding={2}>
      <Button
        onClick={onSubmit}
        variant="contained"
        disabled={submitting || !valid}
      >
        {submitting ? <CircularProgress size={24} /> : <PlayArrowIcon />}
      </Button>
    </Box>
  );
};

export default SubmitComponent;
