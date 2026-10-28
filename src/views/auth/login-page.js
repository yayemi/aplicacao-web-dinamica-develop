import { layout } from '../layout.js';
import { formField } from '../components/form-field.js';
import { errorSummary, translateErrors } from '../components/error-summary.js';
import { escapeHtml } from '../../utils/escape-html.js';

const MESSAGES = {
  email: { invalid: 'Informe o email da sua conta.' },
  password: { invalid: 'Informe a sua senha.' },
};

export function loginPage(context, { values = {}, errors = {}, invalidCredentials = false, next = '/' }) {
  const messages = translateErrors(errors, MESSAGES);

  const credentialsError = invalidCredentials
    ? `
      <div class="notice notice--error" role="alert">
        <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
        <p>Email ou senha incorretos. Confira os dois e tente de novo.</p>
      </div>
    `
    : '';

  return layout({
    context,
    title: 'Entrar',
    content: `
      <section class="auth-card" aria-labelledby="login-title">
        <h1 id="login-title">Entrar</h1>
        <p class="auth-card__intro">Entre para escolher seus números e acompanhar os sorteios.</p>

        ${errorSummary(messages)}
        ${credentialsError}

        <form class="form" method="post" action="/login" novalidate>
          <input type="hidden" name="next" value="${escapeHtml(next)}">

          ${formField({
            name: 'email',
            label: 'Email',
            type: 'email',
            value: values.email,
            error: messages.email,
            attributes: 'autocomplete="email" inputmode="email"',
          })}

          ${formField({
            name: 'password',
            label: 'Senha',
            type: 'password',
            error: messages.password,
            attributes: 'autocomplete="current-password"',
          })}

          <button class="button button--large" type="submit">
            <i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i>
            Entrar
          </button>
        </form>

        <p class="auth-card__switch">
          Ainda não tem conta? <a href="/register?next=${encodeURIComponent(next)}">Crie a sua</a>
        </p>
      </section>
    `,
  });
}
