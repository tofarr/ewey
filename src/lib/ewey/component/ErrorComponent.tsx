import { FC } from "react";
import ErrorIcon from "@mui/icons-material/Error";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export interface ErrorComponentProps {
  message?: string;
}

const ErrorComponent: FC<ErrorComponentProps> = ({ message }) => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      spacing={1}
      padding={3}
    >
      <Grid item>
        <ErrorIcon color="error" fontSize="large" />
      </Grid>
      {message && (
        <Grid item>
          <Typography>{message}</Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default ErrorComponent;
