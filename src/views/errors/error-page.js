import { layout } from '../layout.js';

function errorPage(context, { icon, title, message, action }) {
  return layout({
    context,
    title,
    content: `
      <section class="error-page">
        <i class="error-page__icon fa-solid ${icon}" aria-hidden="true"></i>
        <h1>${title}</h1>
        <p>${message}</p>
        <a class="button" href="${action.href}">${action.label}</a>
      </section>
    `,
  });
}

export function notFoundPage(context) {
  return errorPage(context, {
    icon: 'fa-ticket-simple',
    title: 'Página não encontrada',
    message: 'O endereço pode estar errado, ou a rifa que você procurava foi removida.',
    action: { href: '/', label: 'Ver rifas abertas' },
  });
}

export function forbiddenPage(context) {
  return errorPage(context, {
    icon: 'fa-lock',
    title: 'Acesso restrito',
    message: 'Esta área é só para administradores. Entre com uma conta de administrador para continuar.',
    action: { href: '/', label: 'Voltar para as rifas' },
  });
}

export function serverErrorPage(context) {
  return errorPage(context, {
    icon: 'fa-triangle-exclamation',
    title: 'Algo deu errado do nosso lado',
    message: 'Não foi possível concluir o pedido agora. Tente de novo em alguns minutos.',
    action: { href: '/', label: 'Voltar para o início' },
  });
}
