import * as userModel from '../models/user-model.js';
import * as sessionModel from '../models/session-model.js';
import { checkPassword, hashPassword } from '../utils/password.js';
import { createToken, hashToken } from '../utils/token.js';
import { failure } from './failure.js';

export const SESSION_DAYS = Number(process.env.SESSION_DAYS) || 7;

export async function register({ name, email, phone, password }) {
  const passwordHash = await hashPassword(password);

  try {
    const user = await userModel.create({ name, email, phone, passwordHash });
    return { user };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return failure(409, 'email-taken', 'Email is already registered');
    }

    throw error;
  }
}

export async function login({ email, password }) {
  const credentials = await userModel.findCredentialsByEmail(email);
  const passwordMatches = credentials && (await checkPassword(password, credentials.passwordHash));

  // A mesma resposta para email inexistente e senha errada,
  // para ninguém descobrir quais emails estão cadastrados.
  if (!passwordMatches) {
    return failure(401, 'invalid-credentials', 'Invalid email or password');
  }

  const token = createToken();
  await sessionModel.create(credentials.id, hashToken(token), SESSION_DAYS);

  const user = await userModel.findById(credentials.id);
  return { token, user };
}

export async function logout(token) {
  if (token) {
    await sessionModel.remove(hashToken(token));
  }
}

export async function findUserByToken(token) {
  return token ? sessionModel.findUserByTokenHash(hashToken(token)) : null;
}
