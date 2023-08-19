import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Navigate,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import { MessageDisplayProvider, openApiSummaryRoute } from "./lib/ewey";
import OAuthBearerTokenProvider, {
  Storage,
} from "./lib/ewey/oauth/OAuthBearerTokenProvider";

const queryClient = new QueryClient();
const OPEN_API_URL = "http://localhost:8000/openapi.json";

const router = createBrowserRouter([{ path: "*", Component: Root }]);

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#318529',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f50057',
    },
  }
});

function Root() {
  return (
    <Routes>
      {openApiSummaryRoute("api", OPEN_API_URL)}
      <Route path="/" element={<Navigate to="api" />} />
      <Route path="*" element={<Navigate to="api" />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <OAuthBearerTokenProvider storage={new Storage()}>
            <MessageDisplayProvider>
              <RouterProvider router={router} />
            </MessageDisplayProvider>
          </OAuthBearerTokenProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
