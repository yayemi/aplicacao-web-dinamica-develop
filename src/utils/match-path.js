// Compara o padrão da rota com o caminho pedido.
// matchPath('/raffles/:id', '/raffles/7') devolve { id: '7' }.
export function matchPath(pattern, path) {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params = {};

  for (let index = 0; index < patternParts.length; index++) {
    const patternPart = patternParts[index];
    const pathPart = pathParts[index];

    if (patternPart.startsWith(':')) {
      params[patternPart.slice(1)] = pathPart;
    } else if (patternPart !== pathPart) {
      return null;
    }
  }

  return params;
}

export function findRoute(routes, method, path) {
  const allowedMethods = [];

  for (const route of routes) {
    const params = matchPath(route.path, path);

    if (!params) {
      continue;
    }

    if (route.method === method) {
      return { route, params };
    }

    allowedMethods.push(route.method);
  }

  return { allowedMethods };
}
