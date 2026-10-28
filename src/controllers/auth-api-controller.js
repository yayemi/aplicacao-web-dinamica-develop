import * as authService from '../services/auth-service.js';
import { validateLogin, validateRegistration } from '../validators/auth-validator.js';
import { firstError } from '../validators/helpers.js';
import { readJsonBody, sendError, sendJson, sendNoContent } from '../utils/http.js';
import { readBearerToken } from '../utils/token.js';

export async function register({ request, response }) {
  const data = await readJsonBody(request);

  if (data === null) {
    return sendError(response, 400, 'Invalid JSON body');
  }

  const { errors, value } = validateRegistration(data);

  if (errors) {
    return sendError(response, 400, firstError(errors));
  }

  const { error, user } = await authService.register(value);

  if (error) {
    return sendError(response, error.status, error.message);
  }

  return sendJson(response, 201, user);
}

export async function login({ request, response }) {
  const data = await readJsonBody(request);

  if (data === null) {
    return sendError(response, 400, 'Invalid JSON body');
  }

  const { errors, value } = validateLogin(data);

  if (errors) {
    return sendError(response, 400, firstError(errors));
  }

  const { error, token, user } = await authService.login(value);

  if (error) {
    return sendError(response, error.status, error.message);
  }

  return sendJson(response, 200, { token, user });
}

export async function logout({ request, response }) {
  await authService.logout(readBearerToken(request));
  return sendNoContent(response);
}

export function me({ response, user }) {
  return sendJson(response, 200, user);
}
