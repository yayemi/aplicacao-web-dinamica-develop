import { layout } from '../layout.js';
import { statusBadge } from '../components/raffle-parts.js';
import { escapeHtml } from '../../utils/escape-html.js';
import { formatDate } from '../../utils/format.js';

function actions(raffle) {
  const title = escapeHtml(raffle.title);
  const links = [
    `<a class="button button--small button--ghost" href="/admin/raffles/${raffle.id}/tickets">
      <i class="fa-solid fa-list-ol" aria-hidden="true"></i> Números<span class="sr-only"> da ${title}</span>
    </a>`,
  ];

  if (raffle.status !== 'drawn') {
    links.push(`<a class="button button--small button--ghost" href="/admin/raffles/${raffle.id}/edit">
      <i class="fa-solid fa-pen" aria-hidden="true"></i> Editar<span class="sr-only"> ${title}</span>
    </a>`);
  }

  if (raffle.soldTickets === 0) {
    links.push(`<a class="button button--small button--ghost" href="/admin/raffles/${raffle.id}/delete">
      <i class="fa-solid fa-trash" aria-hidden="true"></i> Excluir<span class="sr-only"> ${title}</span>
    </a>`);
  }

  return `<div class="button-row">${links.join('')}</div>`;
}

function raffleRow(raffle) {
  return `
    <tr>
      <th scope="row"><a href="/raffles/${raffle.id}">${escapeHtml(raffle.title)}</a></th>
      <td>${statusBadge(raffle.status)}</td>
      <td class="table__number">${raffle.soldTickets}/${raffle.totalTickets}</td>
      <td><time datetime="${raffle.drawDate}">${formatDate(raffle.drawDate)}</time></td>
      <td>${actions(raffle)}</td>
    </tr>
  `;
}

export function adminRafflesPage(context, { raffles }) {
  const table = raffles.length > 0
    ? `
      <div class="table-wrapper">
        <table class="table">
          <caption class="sr-only">Todas as rifas cadastradas</caption>
          <thead>
            <tr>
              <th scope="col">Rifa</th>
              <th scope="col">Situação</th>
              <th scope="col">Vendidos</th>
              <th scope="col">Sorteio</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>${raffles.map(raffleRow).join('')}</tbody>
        </table>
      </div>
    `
    : `
      <div class="empty-state">
        <i class="empty-state__icon fa-solid fa-ticket-simple" aria-hidden="true"></i>
        <p>Nenhuma rifa cadastrada ainda.</p>
      </div>
    `;

  return layout({
    context,
    title: 'Painel',
    content: `
      <div class="page-header">
        <div>
          <h1>Painel de rifas</h1>
          <p>Cadastre rifas, confirme pagamentos e faça os sorteios.</p>
        </div>
        <a class="button" href="/admin/raffles/new">
          <i class="fa-solid fa-plus" aria-hidden="true"></i>
          Nova rifa
        </a>
      </div>
      ${table}
    `,
  });
}
