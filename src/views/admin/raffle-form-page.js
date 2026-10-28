import { layout } from '../layout.js';
import { formField } from '../components/form-field.js';
import { errorSummary, translateErrors } from '../components/error-summary.js';
import { escapeHtml } from '../../utils/escape-html.js';

const MESSAGES = {
  title: { invalid: 'Use entre 3 e 120 caracteres no nome da rifa.' },
  prize: { invalid: 'Informe o prêmio, com pelo menos 2 caracteres.' },
  description: { invalid: 'Descreva a rifa com pelo menos 10 caracteres.' },
  ticketPrice: { invalid: 'Informe um valor maior que zero, como 5,00.' },
  totalTickets: {
    invalid: 'Use um número inteiro entre 10 e 10.000.',
    belowTaken: 'Já existem números vendidos acima desse total. Use uma quantidade maior.',
  },
  drawDate: { invalid: 'Informe uma data válida para o sorteio.' },
  imageUrl: { invalid: 'Use um endereço de imagem que comece com https://.' },
  status: { invalid: 'Escolha se as vendas estão abertas ou encerradas.' },
};

const FORM_ERRORS = {
  'raffle-drawn': 'Esta rifa já foi sorteada e não pode mais ser alterada.',
};

// Os campos chegam do banco como número; do formulário com erro, como texto digitado.
// Por isso o preço só é convertido para "5,00" quando ainda é número.
function priceValue(value) {
  return typeof value === 'number' ? value.toFixed(2).replace('.', ',') : value;
}

export function raffleFormPage(context, { raffle = null, values = {}, errors = {}, formError = null }) {
  const isEditing = Boolean(raffle);
  const title = isEditing ? `Editar ${raffle.title}` : 'Nova rifa';
  const action = isEditing ? `/admin/raffles/${raffle.id}/edit` : '/admin/raffles';
  const messages = translateErrors(errors, MESSAGES);

  return layout({
    context,
    title,
    content: `
      <p class="back-link">
        <a href="/admin"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Painel de rifas</a>
      </p>

      <div class="page-header">
        <h1>${escapeHtml(title)}</h1>
      </div>

      ${errorSummary(messages)}
      ${FORM_ERRORS[formError] ? `
        <div class="notice notice--error" role="alert">
          <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
          <p>${FORM_ERRORS[formError]}</p>
        </div>
      ` : ''}

      <form class="form form-card" method="post" action="${action}" novalidate>
        ${formField({
          name: 'title',
          label: 'Nome da rifa',
          value: values.title,
          error: messages.title,
          attributes: 'maxlength="120"',
        })}

        ${formField({
          name: 'prize',
          label: 'Prêmio',
          value: values.prize,
          hint: 'Como aparece no destaque da página inicial, por exemplo "Honda CG 160 Start".',
          error: messages.prize,
          attributes: 'maxlength="150"',
        })}

        ${formField({
          name: 'description',
          label: 'Descrição',
          type: 'textarea',
          value: values.description,
          hint: 'Detalhes do prêmio, entrega e como acontece o sorteio.',
          error: messages.description,
          attributes: 'maxlength="2000"',
        })}

        <div class="form__row">
          ${formField({
            name: 'ticketPrice',
            label: 'Valor de cada número (R$)',
            value: priceValue(values.ticketPrice),
            error: messages.ticketPrice,
            attributes: 'inputmode="decimal" placeholder="5,00"',
          })}

          ${formField({
            name: 'totalTickets',
            label: 'Quantidade de números',
            type: 'number',
            value: values.totalTickets,
            error: messages.totalTickets,
            attributes: 'min="10" max="10000" step="1"',
          })}
        </div>

        <div class="form__row">
          ${formField({
            name: 'drawDate',
            label: 'Data do sorteio',
            type: 'date',
            value: values.drawDate,
            error: messages.drawDate,
          })}

          ${formField({
            name: 'status',
            label: 'Vendas',
            type: 'select',
            value: values.status ?? 'open',
            error: messages.status,
            options: [
              { value: 'open', label: 'Abertas' },
              { value: 'closed', label: 'Encerradas' },
            ],
          })}
        </div>

        ${formField({
          name: 'imageUrl',
          label: 'Foto do prêmio',
          type: 'url',
          value: values.imageUrl,
          hint: 'Endereço de uma imagem que comece com https://. Sem foto, a rifa usa a imagem padrão.',
          error: messages.imageUrl,
          required: false,
          attributes: 'maxlength="500" placeholder="https://"',
        })}

        <div class="button-row">
          <button class="button button--large" type="submit">
            <i class="fa-solid fa-floppy-disk" aria-hidden="true"></i>
            ${isEditing ? 'Salvar alterações' : 'Criar rifa'}
          </button>
          <a class="button button--large button--ghost" href="/admin">Cancelar</a>
        </div>
      </form>
    `,
  });
}
