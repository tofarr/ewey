import { FC } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";

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
    <Fab
      color="primary"
      onClick={onSubmit}
      disabled={submitting || !valid}
    >
      {submitting ? <CircularProgress size={24} /> : <PlayArrowIcon />}
    </Fab>
  );
};

export default SubmitComponent;
