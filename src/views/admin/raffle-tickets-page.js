import { layout } from '../layout.js';
import { formatTicketNumber, statusBadge } from '../components/raffle-parts.js';
import { escapeHtml } from '../../utils/escape-html.js';
import { formatCurrency } from '../../utils/format.js';

function payButton(ticket) {
  if (ticket.status === 'paid') {
    return '<span class="badge badge--paid"><i class="fa-solid fa-check" aria-hidden="true"></i> Pago</span>';
  }

  return `
    <form method="post" action="/admin/tickets/${ticket.id}/pay">
      <button class="button button--small" type="submit">
        <i class="fa-solid fa-check" aria-hidden="true"></i>
        Confirmar pagamento<span class="sr-only"> do número ${ticket.number}</span>
      </button>
    </form>
  `;
}

function ticketRow(ticket, raffle) {
  const isWinner = raffle.winnerTicketId === ticket.id;

  return `
    <tr${isWinner ? ' class="table__row--winner"' : ''}>
      <th scope="row" class="table__number">
        ${formatTicketNumber(ticket.number, raffle.totalTickets)}
        ${isWinner ? '<span class="badge badge--drawn"><i class="fa-solid fa-trophy" aria-hidden="true"></i> Sorteado</span>' : ''}
      </th>
      <td>${escapeHtml(ticket.buyer.name)}</td>
      <td>
        <a href="mailto:${escapeHtml(ticket.buyer.email)}">${escapeHtml(ticket.buyer.email)}</a><br>
        <span class="table__muted">${escapeHtml(ticket.buyer.phone)}</span>
      </td>
      <td>${raffle.status === 'drawn' && ticket.status !== 'paid' ? '<span class="badge badge--reserved">Não pago</span>' : payButton(ticket)}</td>
    </tr>
  `;
}

export function raffleTicketsPage(context, { raffle, tickets }) {
  const paid = tickets.filter((ticket) => ticket.status === 'paid');
  const collected = paid.length * raffle.ticketPrice;

  const drawAction = raffle.status === 'drawn'
    ? ''
    : `<a class="button button--ticket" href="/admin/raffles/${raffle.id}/draw">
        <i class="fa-solid fa-trophy" aria-hidden="true"></i>
        Sortear
      </a>`;

  const table = tickets.length > 0
    ? `
      <div class="table-wrapper">
        <table class="table">
          <caption class="sr-only">Números vendidos da ${escapeHtml(raffle.title)}</caption>
          <thead>
            <tr>
              <th scope="col">Número</th>
              <th scope="col">Comprador</th>
              <th scope="col">Contato</th>
              <th scope="col">Pagamento</th>
            </tr>
          </thead>
          <tbody>${tickets.map((ticket) => ticketRow(ticket, raffle)).join('')}</tbody>
        </table>
      </div>
    `
    : `
      <div class="empty-state">
        <i class="empty-state__icon fa-solid fa-ticket-simple" aria-hidden="true"></i>
        <p>Nenhum número reservado nesta rifa ainda.</p>
      </div>
    `;

  return layout({
    context,
    title: `Números da ${raffle.title}`,
    content: `
      <p class="back-link">
        <a href="/admin"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Painel de rifas</a>
      </p>

      <div class="page-header">
        <div>
          ${statusBadge(raffle.status)}
          <h1>${escapeHtml(raffle.title)}</h1>
        </div>
        ${drawAction}
      </div>

      <dl class="stats">
        <div class="stats__item">
          <dt>Reservados</dt>
          <dd>${tickets.length} de ${raffle.totalTickets}</dd>
        </div>
        <div class="stats__item">
          <dt>Pagos</dt>
          <dd>${paid.length}</dd>
        </div>
        <div class="stats__item">
          <dt>Arrecadado</dt>
          <dd>${formatCurrency(collected)}</dd>
        </div>
      </dl>

      ${table}
    `,
  });
}
