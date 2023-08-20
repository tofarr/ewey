# Ewey - A DRY Approach to building User Interfaces

Ewey (You-ee) is a component oriented user interface framework with the goal of
using the information provided in JSON Schemas as the basis for a UI, with the
ability to fine tune specific sections as required.

Ewey is built on top of:
* [ReactJs](https://react.dev/)
* [I18Next](https://react.i18next.com/)
* [Material UI](https://mui.com/core/)
* [React Query](https://tanstack.com/query/v3/).

## Example 1: A Simple Component based on a JSON Schema

The example below demonstrates creating a component for displaying a user
from a JSON schema:

```
import { useState } from "react"
import { JsonSchemaComponentFactory } from "ewey";

const myJsonSchema = {
  name: "User",
  type: "object",
  properties: {
    email: {type: "string", format: "email"},
    name: {type: "string", maxLength: 255},
    address: {type: "string"},
    member: {type: "boolean"}
  }
};

const MyComponent = JsonSchemaComponentFactory(myJsonSchema);

function App() {
  const [user, setUser] = useState({
    email: "some@user.com",
    name: "Some User",
    address: "123 Fake Street,\nSometown, Some Country",
    member: true
  })

  return (
    <div className="App">
      <MyComponent value={user} onSetValue={setUser} />
    </div>
  );
}

export default App;

```

This results in the following form...
![A form](images/form1.png)

Which is responsive to different screen sizes...
![Same form, narrower screen](images/form2.png)

And internationalizable using i18next ([You will need to add an i18n.ts file
with translations for name, email, address and
member](https://react.i18next.com/guides/quick-start))...
![Same form, but in badly translated Spanish](images/form3.png)

Omitting `onSetValue` yields a static display element instead of a form:
![A Static Display Element](images/form4.png)

## Example 2: Customizing your Component

Imagine the automatically produced component does not quite meet your needs -
the `Member` checkbox should be a select dropdown with values 'Yes' / 'No'.
Internally, Ewey uses a collection of
[Factory Objects](src/lib/ewey/eweyFactory/EweyFactory.ts) to produce Components based
on schemas. Factories are placed in an array sorted by descending priority.
The `create` method is called for each factory against a schema / subschema,
which will either return a component or null. Once a component is created,
it is returned. [The default factories are specified
here](src/lib/ewey/eweyFactory/index.ts).

So to customize our field, we need a factory with a higher priority than the
default ones that will produce a component for the circumstances we require:

```
import { useState } from "react"
import { useTranslation } from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { JsonSchemaComponentFactory } from "./lib/ewey";
import EweyFactory from "./lib/ewey/eweyFactory/EweyFactory";
import { FACTORIES } from "./lib/ewey/eweyFactory";
import { AnySchemaObject } from "./lib/ewey/schemaCompiler";
import EweyProps from "./lib/ewey/eweyField/EweyProps";

const myJsonSchema = {
  name: "User",
  type: "object",
  properties: {
    email: {type: "string", format: "email"},
    name: {type: "string", maxLength: 255},
    address: {type: "string"},
    member: {type: "boolean"}
  }
};

// We define a custom select component
function MySelect({value, onSetValue} : EweyProps<boolean>) {
  const { t } = useTranslation()
  const valueStr = value ? 'yes' : ''
  return (
    <Select
      value={valueStr}
      fullWidth
      disabled={!onSetValue}
      onChange={onSetValue ? (event => onSetValue(!!event.target.value)) : undefined}
    >
      <MenuItem value={''}>{t('No')}</MenuItem>
      <MenuItem value={'yes'}>{t('Yes')}</MenuItem>
    </Select>
  )
}

// We define our own Factory for boolean schema components, with a higher priority than the existing factories
class MyFactory implements EweyFactory {
  priority: number = 200;

  create(
    schema: AnySchemaObject,
    components: any,
    currentPath: string[],
    factories: EweyFactory[],
  ) {
    if (schema?.type !== "boolean") {
      return null;
    }
    return MySelect;
  }
}

// When creating our component, we include our custom factory
const myFactories = [...FACTORIES, new MyFactory()]
const MyComponent = JsonSchemaComponentFactory(myJsonSchema, {}, [], myFactories);

function App() {
  const [user, setUser] = useState({
    email: "some@user.com",
    name: "Some User",
    address: "123 Fake Street,\nSometown, Some Country",
    member: true
  })

  return (
    <div className="App">
      <MyComponent value={user} onSetValue={setUser} />
    </div>
  );
}

export default App

```

![A custom component](images/form5.png)


## Example 3: Using OpenAPI

TODO: Show the OpenAPIProvider, OpenAPIForm, and OpenAPIResults


#TODOS:

* Add project to npmjs.org
* Add code quality workflows for this project
* See about adding this as a hosted package

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
