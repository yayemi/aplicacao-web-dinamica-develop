import { cleanText, isPlainObject } from './helpers.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Os validadores devolvem todos os erros de uma vez, campo por campo.
// A API responde o primeiro; as telas mostram cada um ao lado do seu campo.
export function validateRegistration(data) {
  if (!isPlainObject(data)) {
    return { errors: { body: 'Body must be a JSON object' } };
  }

  const name = cleanText(data.name);
  const email = cleanText(data.email).toLowerCase();
  const phone = cleanText(data.phone).replace(/\D/g, '');
  const password = typeof data.password === 'string' ? data.password : '';
  const errors = {};

  if (name.length < 2 || name.length > 100) {
    errors.name = 'Field name must have between 2 and 100 characters';
  }

  if (!EMAIL_PATTERN.test(email) || email.length > 150) {
    errors.email = 'Field email must be a valid email address';
  }

  if (phone.length < 10 || phone.length > 11) {
    errors.phone = 'Field phone must have 10 or 11 digits, area code included';
  }

  // O bcrypt só considera os primeiros 72 bytes da senha.
  if (password.length < 8 || password.length > 72) {
    errors.password = 'Field password must have between 8 and 72 characters';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return { value: { name, email, phone, password } };
}

export function validateLogin(data) {
  if (!isPlainObject(data)) {
    return { errors: { body: 'Body must be a JSON object' } };
  }

  const email = cleanText(data.email).toLowerCase();
  const password = typeof data.password === 'string' ? data.password : '';
  const errors = {};

  if (!email) {
    errors.email = 'Field email is required';
  }

  if (!password) {
    errors.password = 'Field password is required';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return { value: { email, password } };
}
