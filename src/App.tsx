import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { MessageDisplayProvider, OpenApiProvider, OpenApiSummary } from './lib/ewey';
const queryClient = new QueryClient()

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <MessageDisplayProvider>
          <OpenApiProvider url="http://localhost:8000/openapi.json">
            <OpenApiSummary />
          </OpenApiProvider>
        </MessageDisplayProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
