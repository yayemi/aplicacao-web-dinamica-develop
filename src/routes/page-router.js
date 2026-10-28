import { pageRoutes } from './page-routes.js';
import { findUserByToken } from '../services/auth-service.js';
import { findRoute } from '../utils/match-path.js';
import { redirect, sendHtml } from '../utils/http.js';
import { readSessionToken } from '../utils/cookies.js';
import { forbiddenPage, notFoundPage, serverErrorPage } from '../views/errors/error-page.js';

// Depois do login, a pessoa volta para a tela onde estava.
// Um POST não pode ser repetido por um link, então volta para a página que enviou o formulário.
function returnPath(request, url) {
  if (request.method === 'GET') {
    return `${url.pathname}${url.search}`;
  }

  try {
    const referer = new URL(request.headers.referer);
    return referer.host === url.host ? referer.pathname : '/';
  } catch {
    return '/';
  }
}

export async function pageRouter(request, response, url) {
  const context = {
    user: null,
    currentPath: url.pathname,
    notice: url.searchParams.get('notice'),
  };

  try {
    // Toda tela precisa saber quem está logado, nem que seja só para montar o menu.
    context.user = await findUserByToken(readSessionToken(request));

    const { route, params, allowedMethods } = findRoute(pageRoutes, request.method, url.pathname);

    if (!route) {
      if (allowedMethods.length > 0) {
        response.setHeader('Allow', allowedMethods.join(', '));
      }

      return sendHtml(response, allowedMethods.length > 0 ? 405 : 404, notFoundPage(context));
    }

    if (route.access === 'guest' && context.user) {
      return redirect(response, '/');
    }

    if ((route.access === 'authenticated' || route.access === 'admin') && !context.user) {
      const next = encodeURIComponent(returnPath(request, url));
      return redirect(response, `/login?next=${next}`);
    }

    if (route.access === 'admin' && context.user.role !== 'admin') {
      return sendHtml(response, 403, forbiddenPage(context));
    }

    return await route.handler({
      request,
      response,
      params,
      query: url.searchParams,
      context,
      user: context.user,
    });
  } catch (error) {
    // O detalhe técnico fica só no terminal. Para quem usa o site, uma página genérica.
    console.error(error);

    if (response.headersSent) {
      return response.end();
    }

    return sendHtml(response, 500, serverErrorPage(context));
  }
}
