import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { /*JsonSchemaComponentFactory, */ OpenApiContent, OpenApiForm, OpenApiQuery, OpenApiSchemaProvider, OpenApiSummary } from './lib/ewey';
// import { FACTORIES } from './lib/ewey/eweyFactory';
// import FieldSetFactory from './lib/ewey/eweyFactory/FieldSetFactory';
// import NamedFactory from './lib/ewey/eweyFactory/NamedFactory';
// import ReadOnlyFactory from './lib/ewey/eweyFactory/ReadOnlyFactory';

/*
const userSchema = {
  name: "user",
  type: "object",
  additionalProperties: false,
  properties: {
    id: {type: "string", format: "uuid"},
    email: {type: "string", format: "email"},
    name: {type: "string", maxLength: 255},
    date_of_birth: {type: "string", format: "date"},
    active: {type: "boolean"},
    high_score: {type: "integer"},
    average_score: {type: "number"},
    notes: {type: "string"},
    tags: {
      type: "array",
      items: {
        type: "string"
      }
    },
    created_at: {type: "string", format: "date-time"},
    updated_at: {type: "string", format: "date-time"},
  }
}

const user = {
  id: '6c9af759-5d23-4732-bef9-32c6fb187774',
  name: "Testy Tester",
  email: "test@test.com",
  date_of_birth: '2000-01-01',
  active: true,
  high_score: 200,
  average_score: 64.2,
  notes: "Some notes on this user",
  tags: ['foo', 'bar'],
  created_at: "2020-01-01T12:23:15+00:00",
  updated_at: "2023-01-05T16:11:08+00:00"
}
*/

const queryClient = new QueryClient()

/*
const Component = JsonSchemaComponentFactory(userSchema)
const CustomComponent = JsonSchemaComponentFactory(userSchema, [
  ...FACTORIES,
  new NamedFactory("user", new ReadOnlyFactory(new FieldSetFactory(true, ['name', 'email', 'date_of_birth', 'high_score', 'tags'])))
])
*/
// const Form = OpenApiForm('/openapi.json', '/foo', 'POST')

function App() {
  const [result, setResult] = useState(null)

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        {/*<Component value={value} onSetValue={setValue} />*/}
        {/*<CustomComponent value={value} onSetValue={setValue} />*/}
        {/*<Form onSuccess={alert} onError={alert} />*/}
        <OpenApiSchemaProvider url="http://localhost:8000/openapi.json">
          <Grid container padding={1} spacing={1} direction="column">
            <Grid item>
              <OpenApiForm
                path="/actions/say-hello"
                method="get"
                onSuccess={setResult}
              />
              <Dialog
                open={!!result}
                onClose={() => setResult(null)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                <DialogContent>
                  <OpenApiContent
                    path="/actions/say-hello"
                    method="get"
                    value={result} />
                </DialogContent>
              </Dialog>
            </Grid>
            <Grid item>
              <OpenApiQuery path="/actions/current-time" method="get" params={{}} />
            </Grid>
            <Grid item>
              <OpenApiSummary />
            </Grid>
          </Grid>
        </OpenApiSchemaProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
