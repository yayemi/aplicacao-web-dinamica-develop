import { layout } from '../layout.js';
import { escapeHtml } from '../../utils/escape-html.js';

// Excluir e sortear não têm volta, então as duas ações passam por uma tela de confirmação.
function confirmPage(context, { title, icon, question, details, action, button, blocked }) {
  const body = blocked
    ? `
      <div class="notice notice--error" role="alert">
        <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
        <p>${blocked}</p>
      </div>
      <a class="button button--ghost" href="/admin">Voltar para o painel</a>
    `
    : `
      <p>${details}</p>
      <form class="button-row" method="post" action="${action}">
        <button class="button ${button.className}" type="submit">
          <i class="fa-solid ${button.icon}" aria-hidden="true"></i>
          ${button.label}
        </button>
        <a class="button button--ghost" href="/admin">Cancelar</a>
      </form>
    `;

  return layout({
    context,
    title,
    content: `
      <section class="confirm" aria-labelledby="confirm-title">
        <i class="confirm__icon fa-solid ${icon}" aria-hidden="true"></i>
        <h1 id="confirm-title">${question}</h1>
        ${body}
      </section>
    `,
  });
}

export function deleteRafflePage(context, { raffle, blocked = false }) {
  return confirmPage(context, {
    title: `Excluir ${raffle.title}`,
    icon: 'fa-trash',
    question: `Excluir a ${escapeHtml(raffle.title)}?`,
    details: 'A rifa sai do site e não pode ser recuperada.',
    action: `/admin/raffles/${raffle.id}/delete`,
    button: { label: 'Excluir rifa', icon: 'fa-trash', className: 'button--danger' },
    blocked: blocked
      ? 'Esta rifa já tem números vendidos e não pode ser excluída. Para parar as vendas, edite a rifa e marque as vendas como encerradas.'
      : null,
  });
}

const DRAW_BLOCKED = {
  'already-drawn': 'Esta rifa já foi sorteada.',
  'no-paid-tickets': 'Ainda não há números pagos. Confirme pelo menos um pagamento antes de sortear.',
};

export function drawRafflePage(context, { raffle, paidCount, blockedReason = null }) {
  return confirmPage(context, {
    title: `Sortear ${raffle.title}`,
    icon: 'fa-trophy',
    question: `Sortear a ${escapeHtml(raffle.title)} agora?`,
    details: `O sorteio é feito entre os ${paidCount} números pagos. Depois do sorteio, a rifa não aceita mais reservas nem alterações.`,
    action: `/admin/raffles/${raffle.id}/draw`,
    button: { label: 'Sortear agora', icon: 'fa-trophy', className: 'button--ticket' },
    blocked: DRAW_BLOCKED[blockedReason] ?? null,
  });
}
