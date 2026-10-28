const SESSION_COOKIE = 'session';

export function readCookies(request) {
  const header = request.headers.cookie ?? '';
  const cookies = {};

  for (const pair of header.split(';')) {
    const [name, ...rest] = pair.trim().split('=');

    if (name) {
      cookies[name] = decodeURIComponent(rest.join('='));
    }
  }

  return cookies;
}

export function readSessionToken(request) {
  return readCookies(request)[SESSION_COOKIE] ?? null;
}

// HttpOnly: o JavaScript da página não consegue ler o token.
// SameSite=Lax: outro site não consegue enviar um formulário usando a sessão de quem está logado.
// Secure: em produção, o cookie só viaja por HTTPS.
export function setSessionCookie(response, token, days) {
  const attributes = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${days * 24 * 60 * 60}`,
  ];

  if (process.env.NODE_ENV === 'production') {
    attributes.push('Secure');
  }

  response.setHeader('Set-Cookie', attributes.join('; '));
}

export function clearSessionCookie(response) {
  response.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}
