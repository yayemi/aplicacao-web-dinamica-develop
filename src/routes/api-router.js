import { apiRoutes } from './api-routes.js';
import { findUserByToken } from '../services/auth-service.js';
import { findRoute } from '../utils/match-path.js';
import { sendError } from '../utils/http.js';
import { handleError } from '../utils/handle-error.js';
import { readBearerToken } from '../utils/token.js';

export async function apiRouter(request, response, url) {
  try {
    const { route, params, allowedMethods } = findRoute(apiRoutes, request.method, url.pathname);

    if (!route && allowedMethods.length > 0) {
      response.setHeader('Allow', allowedMethods.join(', '));
      return sendError(response, 405, 'Method not allowed');
    }

    if (!route) {
      return sendError(response, 404, 'Route not found');
    }

    const user = route.access ? await findUserByToken(readBearerToken(request)) : null;

    if (route.access && !user) {
      return sendError(response, 401, 'Authentication required');
    }

    if (route.access === 'admin' && user.role !== 'admin') {
      return sendError(response, 403, 'Only admins can do this');
    }

    return await route.handler({ request, response, params, query: url.searchParams, user });
  } catch (error) {
    return handleError(response, error);
  }
}
