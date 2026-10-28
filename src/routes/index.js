import { apiRouter } from './api-router.js';
import { pageRouter } from './page-router.js';
import { serveStaticFile } from '../utils/static-files.js';

// Três tipos de requisição chegam no mesmo servidor:
// arquivos prontos da pasta public, a API em JSON e as telas em HTML.
export async function router(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (url.pathname.startsWith('/public/')) {
    return serveStaticFile(request, response, url.pathname);
  }

  if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
    return apiRouter(request, response, url);
  }

  return pageRouter(request, response, url);
}
