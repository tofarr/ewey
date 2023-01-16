import React, { Fragment, useState } from 'react';
import EditComponent from './lib/ewey/edit'

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

function App() {
  const [value, setValue] = useState(user)

  return (
    <div className="App">
      <EditComponent value={value} schema={userSchema} path={[]} setValue={setValue} />
    </div>
  );
}

export default App;
