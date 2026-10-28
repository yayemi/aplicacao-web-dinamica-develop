import * as authService from '../services/auth-service.js';
import { validateLogin, validateRegistration } from '../validators/auth-validator.js';
import { readFormBody, redirect, sendHtml, withNotice } from '../utils/http.js';
import { clearSessionCookie, readSessionToken, setSessionCookie } from '../utils/cookies.js';
import { loginPage } from '../views/auth/login-page.js';
import { registerPage } from '../views/auth/register-page.js';

// Só aceita voltar para um caminho do próprio site.
// Sem isso, /login?next=https://site-falso.com mandaria o usuário para fora depois do login.
function safeNext(value) {
  const isLocalPath =
    typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\');
  return isLocalPath && !value.startsWith('/login') && !value.startsWith('/register') ? value : '/';
}

function markInvalid(errors) {
  return Object.fromEntries(Object.keys(errors).map((name) => [name, 'invalid']));
}

export function showLogin({ response, query, context }) {
  return sendHtml(response, 200, loginPage(context, { next: safeNext(query.get('next')) }));
}

export async function login({ request, response, context }) {
  const form = await readFormBody(request);
  const next = safeNext(form.next);
  const { errors, value } = validateLogin(form);

  if (errors) {
    return sendHtml(response, 400, loginPage(context, { values: form, errors: markInvalid(errors), next }));
  }

  const { error, token } = await authService.login(value);

  if (error) {
    return sendHtml(response, 401, loginPage(context, { values: form, invalidCredentials: true, next }));
  }

  setSessionCookie(response, token, authService.SESSION_DAYS);
  return redirect(response, withNotice(next, 'logged-in'));
}

export function showRegister({ response, query, context }) {
  return sendHtml(response, 200, registerPage(context, { next: safeNext(query.get('next')) }));
}

export async function register({ request, response, context }) {
  const form = await readFormBody(request);
  const next = safeNext(form.next);
  const { errors, value } = validateRegistration(form);

  if (errors) {
    return sendHtml(response, 400, registerPage(context, { values: form, errors: markInvalid(errors), next }));
  }

  const { error } = await authService.register(value);

  if (error) {
    return sendHtml(response, 409, registerPage(context, { values: form, errors: { email: 'taken' }, next }));
  }

  const { token } = await authService.login(value);

  setSessionCookie(response, token, authService.SESSION_DAYS);
  return redirect(response, withNotice(next, 'registered'));
}

export async function logout({ request, response }) {
  await authService.logout(readSessionToken(request));
  clearSessionCookie(response);
  return redirect(response, withNotice('/', 'logged-out'));
}
