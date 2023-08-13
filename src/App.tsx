import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { OpenApiSchemaProvider, OpenApiSummary } from './lib/ewey';
import AnimatedHeightResizer from './lib/ewey/component/AnimatedHeightResizer';
const queryClient = new QueryClient()

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <OpenApiSchemaProvider url="http://localhost:8000/openapi.json">
          <OpenApiSummary />
        </OpenApiSchemaProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
