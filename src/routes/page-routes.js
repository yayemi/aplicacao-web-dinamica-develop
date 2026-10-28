import * as authPage from '../controllers/auth-page-controller.js';
import * as rafflePage from '../controllers/raffle-page-controller.js';
import { adminRoutes } from './admin-routes.js';

// access: 'guest' é só para quem não entrou, 'authenticated' para quem entrou
// e 'admin' só para administradores. Sem access, a tela é pública.
export const pageRoutes = [
  { method: 'GET', path: '/', handler: rafflePage.home },
  { method: 'GET', path: '/raffles/:id', handler: rafflePage.show },
  { method: 'POST', path: '/raffles/:id/tickets', handler: rafflePage.reserve, access: 'authenticated' },
  { method: 'GET', path: '/my-tickets', handler: rafflePage.myTickets, access: 'authenticated' },

  { method: 'GET', path: '/login', handler: authPage.showLogin, access: 'guest' },
  { method: 'POST', path: '/login', handler: authPage.login, access: 'guest' },
  { method: 'GET', path: '/register', handler: authPage.showRegister, access: 'guest' },
  { method: 'POST', path: '/register', handler: authPage.register, access: 'guest' },
  { method: 'POST', path: '/logout', handler: authPage.logout },

  ...adminRoutes,
];
