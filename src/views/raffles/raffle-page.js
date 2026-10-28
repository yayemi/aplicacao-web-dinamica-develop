import { layout } from '../layout.js';
import { formatTicketNumber, raffleImage, salesProgress, statusBadge } from '../components/raffle-parts.js';
import { escapeHtml } from '../../utils/escape-html.js';
import { formatCurrency, formatDate } from '../../utils/format.js';

const RESERVE_ERRORS = {
  'number-taken': 'Esse número acabou de ser reservado por outra pessoa. Escolha outro.',
  'invalid-number': 'Escolha um número livre na cartela antes de reservar.',
  'raffle-not-open': 'Esta rifa não está mais recebendo reservas.',
};

// Na tela do sorteio aparece só o primeiro nome e a inicial do sobrenome.
function shortName(fullName) {
  const [first, ...rest] = fullName.trim().split(/\s+/);
  const last = rest.at(-1);
  return last ? `${first} ${last[0]}.` : first;
}

function winnerPanel(raffle, winner) {
  return `
    <section class="result" aria-labelledby="result-title">
      <i class="result__icon fa-solid fa-trophy" aria-hidden="true"></i>
      <div>
        <h2 id="result-title">Número sorteado</h2>
        <p class="result__number">${formatTicketNumber(winner.number, raffle.totalTickets)}</p>
        <p>Quem levou o prêmio foi <strong>${escapeHtml(shortName(winner.name))}</strong>.</p>
      </div>
    </section>
  `;
}

function myNumbers(raffle, tickets) {
  if (tickets.length === 0) {
    return '';
  }

  const items = tickets
    .map((ticket) => {
      const status = ticket.status === 'paid' ? 'Pago, concorrendo' : 'Aguardando pagamento';
      return `
        <li class="my-numbers__item">
          <span class="my-numbers__number">${formatTicketNumber(ticket.number, raffle.totalTickets)}</span>
          <span class="badge badge--${ticket.status}">${status}</span>
        </li>
      `;
    })
    .join('');

  return `
    <section class="my-numbers" aria-labelledby="my-numbers-title">
      <h2 id="my-numbers-title">Seus números nesta rifa</h2>
      <ul class="my-numbers__list" role="list">${items}</ul>
      <p class="my-numbers__note">O pagamento é confirmado pelo organizador. Até lá, o número fica reservado no seu nome.</p>
    </section>
  `;
}

function numberCell(number, raffle, { taken, mine, selectable, checked }) {
  const label = formatTicketNumber(number, raffle.totalTickets);
  const state = mine ? 'mine' : taken ? 'taken' : 'free';
  const description = mine ? 'seu número' : taken ? 'vendido' : 'livre';

  if (!selectable || taken) {
    return `
      <li class="number number--${state}">
        <span class="number__label">${label}<span class="sr-only">, ${description}</span></span>
      </li>
    `;
  }

  return `
    <li class="number number--free">
      <input class="number__input" type="radio" name="number" id="number-${number}" value="${number}"${checked ? ' checked' : ''} required>
      <label class="number__label" for="number-${number}">${label}</label>
    </li>
  `;
}

function numberGrid(raffle, { takenNumbers, myTicketNumbers, user, selectedNumber, reserveError }) {
  const taken = new Set(takenNumbers);
  const mine = new Set(myTicketNumbers);
  const selectable = Boolean(user) && raffle.status === 'open';

  const cells = Array.from({ length: raffle.totalTickets }, (_, index) => {
    const number = index + 1;
    return numberCell(number, raffle, {
      taken: taken.has(number),
      mine: mine.has(number),
      selectable,
      checked: number === selectedNumber,
    });
  }).join('');

  const key = `
    <ul class="number-key" role="list">
      <li><span class="number-key__sample number--free"></span> Livre</li>
      <li><span class="number-key__sample number--taken"></span> Vendido</li>
      ${user ? '<li><span class="number-key__sample number--mine"></span> Seu número</li>' : ''}
    </ul>
  `;

  if (!selectable) {
    const reason = raffle.status !== 'open'
      ? '<p class="cartela__note">As vendas desta rifa estão encerradas.</p>'
      : `<p class="cartela__note">
          <a class="button button--ticket" href="/login?next=${encodeURIComponent(`/raffles/${raffle.id}`)}">
            <i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i>
            Entrar para escolher um número
          </a>
        </p>`;

    return `
      <section class="cartela" aria-labelledby="cartela-title">
        <h2 id="cartela-title">Cartela</h2>
        ${key}
        <ol class="number-grid" role="list">${cells}</ol>
        ${reason}
      </section>
    `;
  }

  const errorMessage = RESERVE_ERRORS[reserveError];

  return `
    <section class="cartela" aria-labelledby="cartela-title">
      <h2 id="cartela-title">Cartela</h2>
      <form method="post" action="/raffles/${raffle.id}/tickets">
        <fieldset class="cartela__fieldset"${errorMessage ? ' aria-describedby="reserve-error"' : ''}>
          <legend class="cartela__legend">Escolha um número livre</legend>
          ${key}
          ${errorMessage ? `
            <p class="field__error" id="reserve-error" role="alert">
              <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
              ${errorMessage}
            </p>
          ` : ''}
          <ol class="number-grid" role="list">${cells}</ol>
        </fieldset>

        <div class="cartela__submit">
          <p>Cada número custa <strong>${formatCurrency(raffle.ticketPrice)}</strong>.</p>
          <button class="button button--ticket button--large" type="submit">
            <i class="fa-solid fa-ticket" aria-hidden="true"></i>
            Reservar número
          </button>
        </div>
      </form>
    </section>
  `;
}

export function rafflePage(context, data) {
  const { raffle, winner, myTickets } = data;

  return layout({
    context,
    title: raffle.title,
    description: `${raffle.prize}. ${formatCurrency(raffle.ticketPrice)} por número, sorteio em ${formatDate(raffle.drawDate)}.`,
    content: `
      <p class="back-link">
        <a href="/"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Todas as rifas</a>
      </p>

      <article class="raffle" aria-labelledby="raffle-title">
        <header class="raffle__header">
          ${raffleImage(raffle, 'raffle__image')}
          <div class="raffle__summary">
            ${statusBadge(raffle.status)}
            <h1 id="raffle-title">${escapeHtml(raffle.title)}</h1>
            <p class="raffle__prize">
              <i class="fa-solid fa-gift" aria-hidden="true"></i>
              ${escapeHtml(raffle.prize)}
            </p>
            <dl class="raffle__facts">
              <div>
                <dt>Valor do número</dt>
                <dd>${formatCurrency(raffle.ticketPrice)}</dd>
              </div>
              <div>
                <dt>Sorteio</dt>
                <dd><time datetime="${raffle.drawDate}">${formatDate(raffle.drawDate)}</time></dd>
              </div>
            </dl>
            ${raffle.status === 'drawn' ? '' : salesProgress(raffle)}
          </div>
        </header>

        <p class="raffle__description">${escapeHtml(raffle.description)}</p>

        ${winner ? winnerPanel(raffle, winner) : ''}
        ${myNumbers(raffle, myTickets)}
        ${numberGrid(raffle, { ...data, user: context.user, myTicketNumbers: myTickets.map((ticket) => ticket.number) })}
      </article>
    `,
  });
}
