import { FC, FormEvent, useContext, useState } from "react";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Box from "@mui/material/Box";
import JsonSchemaFieldFactory from "../JsonSchemaFieldFactory";
import { EweyLayoutHint, EweyLayoutHintProvider } from "../providers/EweyLayoutHint";
import {
  OAuthBearerTokenContext,
  BearerToken,
} from "./OAuthBearerTokenProvider";
import { useMessageBroker } from "../message/MessageBrokerContext";
import AutoFocusProvider from "../providers/AutoFocusProvider";
import Fab from "@mui/material/Fab";

interface OAuthLoginFormProps {
  url: string;
}

const FormComponent = JsonSchemaFieldFactory(
  {
    type: "object",
    name: "Login",
    properties: {
      username: { type: "string", maxLength: 255 },
      password: { type: "string", maxLength: 255 },
    },
    required: ['username', 'password']
  },
  {},
);

const OAuthLoginForm: FC<OAuthLoginFormProps> = ({ url }) => {
  const [login, setLogin] = useState({ username: "", password: "" });
  const bearerToken = useContext(OAuthBearerTokenContext) as BearerToken;
  const messageBroker = useMessageBroker();

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("username", login.username);
    formData.append("password", login.password);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      if (response.status !== 200) {
        const content = await response.text();
        messageBroker.triggerError(content);
        return;
      }
      const content = await response.json();
      bearerToken.setToken(content.access_token);
    } catch (e) {
      messageBroker.triggerError(e);
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <Box pt={2} pr={2} pb={2} pl={4}>
        <EweyLayoutHintProvider hint={EweyLayoutHint.LABELS_ALWAYS_ABOVE}>
          <AutoFocusProvider autoFocusPath={["username"]}>
            <FormComponent value={login} onSetValue={setLogin} />
          </AutoFocusProvider>
        </EweyLayoutHintProvider>
      </Box>
      <Box display="flex" justifyContent="flex-end" padding={2}>
        <Fab color="primary" type="submit">
          <LockOpenIcon />
        </Fab>
      </Box>
    </form>
  );
};

export default OAuthLoginForm;
