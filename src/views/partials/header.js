import { escapeHtml } from '../../utils/escape-html.js';

function navLink({ href, label, icon }, currentPath) {
  const isCurrent = href === '/' ? currentPath === '/' : currentPath.startsWith(href);
  const current = isCurrent ? ' aria-current="page"' : '';

  return `
    <li>
      <a class="site-nav__link" href="${href}"${current}>
        <i class="fa-solid ${icon}" aria-hidden="true"></i>
        ${label}
      </a>
    </li>
  `;
}

function accountArea(user) {
  if (!user) {
    return `
      <div class="site-nav__account">
        <a class="site-nav__link" href="/login">
          <i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i>
          Entrar
        </a>
        <a class="button button--small" href="/register">Criar conta</a>
      </div>
    `;
  }

  const firstName = user.name.split(' ')[0];

  return `
    <div class="site-nav__account">
      <span class="site-nav__greeting">
        <i class="fa-solid fa-circle-user" aria-hidden="true"></i>
        Olá, ${escapeHtml(firstName)}
      </span>
      <form method="post" action="/logout">
        <button class="button button--small button--ghost" type="submit">
          <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
          Sair
        </button>
      </form>
    </div>
  `;
}

export function header({ user, currentPath }) {
  const links = [{ href: '/', label: 'Rifas', icon: 'fa-ticket' }];

  if (user) {
    links.push({ href: '/my-tickets', label: 'Meus números', icon: 'fa-list-ol' });
  }

  if (user?.role === 'admin') {
    links.push({ href: '/admin', label: 'Painel', icon: 'fa-gauge' });
  }

  return `
    <header class="site-header">
      <div class="site-header__inner container">
        <a class="brand" href="/">
          <img src="/public/images/logo.svg" alt="" width="44" height="30">
          <span>Rifa Online</span>
        </a>

        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
          <i class="fa-solid fa-bars" aria-hidden="true"></i>
          <span class="menu-toggle__label">Menu</span>
        </button>

        <nav id="site-nav" class="site-nav" aria-label="Principal">
          <ul class="site-nav__links" role="list">
            ${links.map((link) => navLink(link, currentPath)).join('')}
          </ul>
          ${accountArea(user)}
        </nav>
      </div>
    </header>
  `;
}
