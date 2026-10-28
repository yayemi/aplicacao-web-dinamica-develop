import { escapeHtml } from '../../utils/escape-html.js';

const STATUS = {
  open: { label: 'Vendas abertas', icon: 'fa-circle-dot' },
  closed: { label: 'Vendas encerradas', icon: 'fa-lock' },
  drawn: { label: 'Sorteada', icon: 'fa-trophy' },
};

export function statusBadge(status) {
  const { label, icon } = STATUS[status];

  return `
    <span class="badge badge--${status}">
      <i class="fa-solid ${icon}" aria-hidden="true"></i>
      ${label}
    </span>
  `;
}

export function raffleImage(raffle, className = '') {
  const source = raffle.imageUrl ? escapeHtml(raffle.imageUrl) : '/public/images/raffle-placeholder.svg';
  const alt = raffle.imageUrl ? `Foto do prêmio: ${escapeHtml(raffle.prize)}` : '';

  return `<img class="${className}" src="${source}" alt="${alt}" loading="lazy" width="400" height="260">`;
}

// Rifa de 100 números vai de 001 a 100; de 50 números, de 01 a 50.
export function formatTicketNumber(number, totalTickets) {
  return String(number).padStart(String(totalTickets).length, '0');
}

export function salesProgress(raffle) {
  const id = `sales-${raffle.id}`;
  const available = raffle.totalTickets - raffle.soldTickets;

  return `
    <div class="sales">
      <p class="sales__label" id="${id}">
        <span><strong>${raffle.soldTickets}</strong> de ${raffle.totalTickets} números vendidos</span>
        <span class="sales__available">${available === 0 ? 'Esgotada' : `${available} livres`}</span>
      </p>
      <progress class="sales__bar" max="${raffle.totalTickets}" value="${raffle.soldTickets}" aria-labelledby="${id}"></progress>
    </div>
  `;
}
