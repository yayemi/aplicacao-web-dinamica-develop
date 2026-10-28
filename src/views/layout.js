import { escapeHtml } from '../utils/escape-html.js';
import { header } from './partials/header.js';
import { footer } from './partials/footer.js';
import { notice } from './partials/notice.js';

const STYLESHEETS = ['reset', 'variables', 'base', 'layout', 'components', 'forms', 'tickets', 'admin'];

// Estrutura que se repete em todas as telas. Cada view entrega só o título e o miolo.
// O context vem do roteador: usuário logado, caminho atual e aviso a mostrar.
export function layout({ context, title, content, description = '' }) {
  const stylesheets = STYLESHEETS
    .map((name) => `<link rel="stylesheet" href="/public/css/${name}.css">`)
    .join('\n    ');

  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)} | Rifa Online</title>
    <meta name="description" content="${escapeHtml(description || 'Escolha seus números e concorra a prêmios nas rifas abertas.')}">
    <link rel="icon" href="/public/images/favicon.svg" type="image/svg+xml">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Bricolage+Grotesque:opsz,wght@12..96,500..800&display=swap">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer">
    ${stylesheets}
    <script src="/public/js/menu.js" defer></script>
  </head>
  <body>
    <a class="skip-link" href="#content">Pular para o conteúdo</a>
    ${header(context)}
    <main id="content" class="site-main" tabindex="-1">
      <div class="container">
        ${notice(context.notice)}
        ${content}
      </div>
    </main>
    ${footer()}
  </body>
</html>`;
}
