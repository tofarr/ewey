import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export const LoadingComponent = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      padding={3}
      height="100%"
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingComponent;
