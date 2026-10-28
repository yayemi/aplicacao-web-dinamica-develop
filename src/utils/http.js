const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };
const HTML_HEADERS = { 'Content-Type': 'text/html; charset=utf-8' };

export function sendJson(response, status, data) {
  response.writeHead(status, JSON_HEADERS);
  response.end(JSON.stringify(data));
}

export function sendError(response, status, message) {
  sendJson(response, status, { error: message });
}

export function sendNoContent(response) {
  response.writeHead(204);
  response.end();
}

export function sendHtml(response, status, html) {
  response.writeHead(status, HTML_HEADERS);
  response.end(html);
}

// 303 em vez de 302: depois de um POST, o navegador sempre volta com GET.
export function redirect(response, location) {
  response.writeHead(303, { Location: location });
  response.end();
}

// withNotice('/raffles/7', 'ticket-reserved') devolve '/raffles/7?notice=ticket-reserved'.
export function withNotice(path, notice) {
  const url = new URL(path, 'http://localhost');
  url.searchParams.set('notice', notice);
  return `${url.pathname}${url.search}`;
}

export function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

// Corpo vazio vira objeto vazio, para o validador apontar os campos que faltam.
// JSON malformado vira null, e quem chamou responde 400.
export async function readJsonBody(request) {
  const body = await readBody(request);

  if (!body.trim()) {
    return {};
  }

  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

export async function readFormBody(request) {
  const body = await readBody(request);
  return Object.fromEntries(new URLSearchParams(body));
}
