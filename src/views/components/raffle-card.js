import { escapeHtml } from '../../utils/escape-html.js';
import { formatCurrency, formatDate } from '../../utils/format.js';
import { raffleImage, salesProgress, statusBadge } from './raffle-parts.js';

// Cada rifa aparece como um bilhete: a parte de cima com o prêmio
// e o canhoto, separado pela linha picotada, com o preço e a data.
export function raffleCard(raffle) {
  const action = raffle.status === 'drawn' ? 'Ver resultado' : 'Ver números';

  return `
    <article class="ticket-card" aria-labelledby="raffle-${raffle.id}-title">
      ${raffleImage(raffle, 'ticket-card__image')}

      <div class="ticket-card__body">
        ${statusBadge(raffle.status)}
        <h3 class="ticket-card__title" id="raffle-${raffle.id}-title">
          <a href="/raffles/${raffle.id}">${escapeHtml(raffle.title)}</a>
        </h3>
        <p class="ticket-card__prize">
          <i class="fa-solid fa-gift" aria-hidden="true"></i>
          ${escapeHtml(raffle.prize)}
        </p>
        ${raffle.status === 'drawn' ? '' : salesProgress(raffle)}
      </div>

      <div class="ticket-card__stub">
        <p class="ticket-card__price">
          ${formatCurrency(raffle.ticketPrice)}
          <span>por número</span>
        </p>
        <p class="ticket-card__date">
          <i class="fa-regular fa-calendar" aria-hidden="true"></i>
          Sorteio em <time datetime="${raffle.drawDate}">${formatDate(raffle.drawDate)}</time>
        </p>
        <span class="ticket-card__action" aria-hidden="true">
          ${action}
          <i class="fa-solid fa-arrow-right"></i>
        </span>
      </div>
    </article>
  `;
}
