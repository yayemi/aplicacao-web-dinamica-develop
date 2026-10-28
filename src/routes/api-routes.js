import * as authApi from '../controllers/auth-api-controller.js';
import * as raffleApi from '../controllers/raffle-api-controller.js';
import * as ticketApi from '../controllers/ticket-api-controller.js';

export const apiRoutes = [
  { method: 'POST', path: '/api/auth/register', handler: authApi.register },
  { method: 'POST', path: '/api/auth/login', handler: authApi.login },
  { method: 'POST', path: '/api/auth/logout', handler: authApi.logout, access: 'authenticated' },
  { method: 'GET', path: '/api/auth/me', handler: authApi.me, access: 'authenticated' },

  { method: 'GET', path: '/api/raffles', handler: raffleApi.list },
  { method: 'GET', path: '/api/raffles/:id', handler: raffleApi.show },
  { method: 'POST', path: '/api/raffles', handler: raffleApi.create, access: 'admin' },
  { method: 'PUT', path: '/api/raffles/:id', handler: raffleApi.update, access: 'admin' },
  { method: 'DELETE', path: '/api/raffles/:id', handler: raffleApi.remove, access: 'admin' },
  { method: 'POST', path: '/api/raffles/:id/draw', handler: raffleApi.draw, access: 'admin' },

  { method: 'GET', path: '/api/raffles/:id/tickets', handler: ticketApi.listByRaffle, access: 'admin' },
  { method: 'POST', path: '/api/raffles/:id/tickets', handler: ticketApi.reserve, access: 'authenticated' },
  { method: 'GET', path: '/api/me/tickets', handler: ticketApi.listMine, access: 'authenticated' },
  { method: 'PATCH', path: '/api/tickets/:id/pay', handler: ticketApi.pay, access: 'admin' },
];
