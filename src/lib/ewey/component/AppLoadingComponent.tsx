import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";

export const AppLoadingComponent = () => {
  return (
    <Box
      position="absolute"
      left={0}
      top={0}
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress size={64} />
    </Box>
  );
};

export default AppLoadingComponent;
