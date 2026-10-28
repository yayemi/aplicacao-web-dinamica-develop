import { layout } from '../layout.js';
import { escapeHtml } from '../../utils/escape-html.js';
import { formatDate } from '../../utils/format.js';
import { formatTicketNumber } from '../components/raffle-parts.js';

function result(ticket) {
  if (ticket.raffle.status !== 'drawn') {
    return `Sorteio em <time datetime="${ticket.raffle.drawDate}">${formatDate(ticket.raffle.drawDate)}</time>`;
  }

  if (ticket.isWinner) {
    return '<strong class="ticket-result ticket-result--won"><i class="fa-solid fa-trophy" aria-hidden="true"></i> Você ganhou!</strong>';
  }

  return '<span class="ticket-result">Não foi dessa vez</span>';
}

function ticketRow(ticket) {
  const status = ticket.status === 'paid' ? 'Pago' : 'Aguardando pagamento';

  return `
    <tr>
      <th scope="row"><a href="/raffles/${ticket.raffle.id}">${escapeHtml(ticket.raffle.title)}</a></th>
      <td class="table__number">${formatTicketNumber(ticket.number, ticket.raffle.totalTickets)}</td>
      <td><span class="badge badge--${ticket.status}">${status}</span></td>
      <td>${result(ticket)}</td>
    </tr>
  `;
}

export function myTicketsPage(context, { tickets }) {
  const content = tickets.length > 0
    ? `
      <div class="table-wrapper">
        <table class="table">
          <caption class="sr-only">Seus números em todas as rifas</caption>
          <thead>
            <tr>
              <th scope="col">Rifa</th>
              <th scope="col">Número</th>
              <th scope="col">Pagamento</th>
              <th scope="col">Resultado</th>
            </tr>
          </thead>
          <tbody>${tickets.map(ticketRow).join('')}</tbody>
        </table>
      </div>
    `
    : `
      <div class="empty-state">
        <i class="empty-state__icon fa-solid fa-ticket-simple" aria-hidden="true"></i>
        <p>Você ainda não reservou nenhum número.</p>
        <a class="button" href="/">Escolher uma rifa</a>
      </div>
    `;

  return layout({
    context,
    title: 'Meus números',
    content: `
      <div class="page-header">
        <div>
          <h1>Meus números</h1>
          <p>Acompanhe o pagamento e o resultado de cada número que você reservou.</p>
        </div>
      </div>
      ${content}
    `,
  });
}
