import { layout } from '../layout.js';
import { raffleCard } from '../components/raffle-card.js';
import { raffleImage, salesProgress } from '../components/raffle-parts.js';
import { escapeHtml } from '../../utils/escape-html.js';
import { formatCurrency, formatDate } from '../../utils/format.js';

function featuredRaffle(raffle) {
  return `
    <section class="hero" aria-labelledby="featured-title">
      <div class="hero__ticket">
        ${raffleImage(raffle, 'hero__image')}

        <div class="hero__body">
          <p class="hero__date">
            <i class="fa-regular fa-calendar" aria-hidden="true"></i>
            Próximo sorteio: <time datetime="${raffle.drawDate}">${formatDate(raffle.drawDate)}</time>
          </p>
          <h1 class="hero__title" id="featured-title">${escapeHtml(raffle.prize)}</h1>
          <p class="hero__description">${escapeHtml(raffle.description)}</p>
          ${salesProgress(raffle)}
        </div>

        <div class="hero__stub">
          <p class="hero__price">
            <span class="hero__price-value">${formatCurrency(raffle.ticketPrice)}</span>
            <span>por número</span>
          </p>
          <a class="button button--ticket button--large" href="/raffles/${raffle.id}">
            <i class="fa-solid fa-hand-pointer" aria-hidden="true"></i>
            Escolher números
          </a>
        </div>
      </div>
    </section>
  `;
}

function searchForm(search) {
  return `
    <form class="search" method="get" action="/" role="search">
      <label class="sr-only" for="search">Buscar rifa pelo nome ou prêmio</label>
      <input class="field__control search__input" type="search" id="search" name="search"
        value="${escapeHtml(search)}" placeholder="Buscar por nome ou prêmio">
      <button class="button" type="submit">
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        Buscar
      </button>
    </form>
  `;
}

function raffleGrid(raffles) {
  return `
    <ul class="ticket-grid" role="list">
      ${raffles.map((raffle) => `<li>${raffleCard(raffle)}</li>`).join('')}
    </ul>
  `;
}

function emptyState(message, action = '') {
  return `
    <div class="empty-state">
      <i class="empty-state__icon fa-solid fa-ticket-simple" aria-hidden="true"></i>
      <p>${message}</p>
      ${action}
    </div>
  `;
}

function searchResults(raffles, search) {
  const content = raffles.length > 0
    ? raffleGrid(raffles)
    : emptyState(
        `Nenhuma rifa com "${escapeHtml(search)}" no nome ou no prêmio.`,
        '<a class="button button--ghost" href="/">Ver todas as rifas</a>'
      );

  return `
    <section class="section" aria-labelledby="results-title">
      <div class="page-header">
        <div>
          <h1 id="results-title">Resultados para "${escapeHtml(search)}"</h1>
        </div>
        ${searchForm(search)}
      </div>
      ${content}
    </section>
  `;
}

export function homePage(context, { raffles, search }) {
  if (search) {
    return layout({ context, title: `Busca: ${search}`, content: searchResults(raffles, search) });
  }

  const available = raffles.filter((raffle) => raffle.status !== 'drawn');
  const drawn = raffles.filter((raffle) => raffle.status === 'drawn');
  const featured = available.find((raffle) => raffle.status === 'open');

  const heading = featured
    ? '<h2 class="section__title" id="available-title">Rifas abertas</h2>'
    : '<h1 class="section__title" id="available-title">Rifas abertas</h1>';

  return layout({
    context,
    title: 'Rifas abertas',
    content: `
      ${featured ? featuredRaffle(featured) : ''}

      <section class="section" aria-labelledby="available-title">
        <div class="page-header">
          ${heading}
          ${searchForm('')}
        </div>
        ${available.length > 0 ? raffleGrid(available) : emptyState('Nenhuma rifa aberta agora. Volte em breve para conferir as próximas.')}
      </section>

      ${drawn.length > 0 ? `
        <section class="section" aria-labelledby="drawn-title">
          <h2 class="section__title" id="drawn-title">Já sorteadas</h2>
          ${raffleGrid(drawn)}
        </section>
      ` : ''}
    `,
  });
}
