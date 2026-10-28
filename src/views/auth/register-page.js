import { layout } from '../layout.js';
import { formField } from '../components/form-field.js';
import { errorSummary, translateErrors } from '../components/error-summary.js';
import { escapeHtml } from '../../utils/escape-html.js';

const MESSAGES = {
  name: { invalid: 'Informe seu nome, com pelo menos 2 letras.' },
  email: {
    invalid: 'Informe um email válido, como nome@email.com.',
    taken: 'Este email já tem conta. Entre com ele ou use outro email.',
  },
  phone: { invalid: 'Informe o celular com DDD, com 10 ou 11 números.' },
  password: { invalid: 'A senha precisa ter entre 8 e 72 caracteres.' },
};

export function registerPage(context, { values = {}, errors = {}, next = '/' }) {
  const messages = translateErrors(errors, MESSAGES);

  return layout({
    context,
    title: 'Criar conta',
    content: `
      <section class="auth-card" aria-labelledby="register-title">
        <h1 id="register-title">Criar conta</h1>
        <p class="auth-card__intro">Com a conta você reserva números e vê o resultado dos sorteios.</p>

        ${errorSummary(messages)}

        <form class="form" method="post" action="/register" novalidate>
          <input type="hidden" name="next" value="${escapeHtml(next)}">

          ${formField({
            name: 'name',
            label: 'Nome completo',
            value: values.name,
            error: messages.name,
            attributes: 'autocomplete="name" maxlength="100"',
          })}

          ${formField({
            name: 'email',
            label: 'Email',
            type: 'email',
            value: values.email,
            error: messages.email,
            attributes: 'autocomplete="email" inputmode="email" maxlength="150"',
          })}

          ${formField({
            name: 'phone',
            label: 'Celular',
            type: 'tel',
            value: values.phone,
            hint: 'Com DDD. Usamos para avisar se você ganhar.',
            error: messages.phone,
            attributes: 'autocomplete="tel" inputmode="tel" placeholder="(11) 98888-7777"',
          })}

          ${formField({
            name: 'password',
            label: 'Senha',
            type: 'password',
            hint: 'Entre 8 e 72 caracteres.',
            error: messages.password,
            attributes: 'autocomplete="new-password" minlength="8" maxlength="72"',
          })}

          <button class="button button--large" type="submit">
            <i class="fa-solid fa-user-plus" aria-hidden="true"></i>
            Criar conta
          </button>
        </form>

        <p class="auth-card__switch">
          Já tem conta? <a href="/login?next=${encodeURIComponent(next)}">Entre</a>
        </p>
      </section>
    `,
  });
}
