import { OpenApiOperation } from "../openApi/model/OpenApiOperation";
import { BearerToken } from "./OAuthBearerTokenProvider";


export function isLocked(operation: OpenApiOperation, token: BearerToken) {
  const isLocked = operation.requiresAuth && !token?.token;
  return isLocked
}