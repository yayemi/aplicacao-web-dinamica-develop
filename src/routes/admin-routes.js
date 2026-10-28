import * as adminPage from '../controllers/admin-page-controller.js';

// Formulário HTML só envia GET e POST. Por isso editar, excluir e sortear
// usam POST em um endereço próprio, em vez de PUT e DELETE como na API.
export const adminRoutes = [
  { method: 'GET', path: '/admin', handler: adminPage.list },
  { method: 'GET', path: '/admin/raffles/new', handler: adminPage.showCreate },
  { method: 'POST', path: '/admin/raffles', handler: adminPage.create },
  { method: 'GET', path: '/admin/raffles/:id/edit', handler: adminPage.showEdit },
  { method: 'POST', path: '/admin/raffles/:id/edit', handler: adminPage.update },
  { method: 'GET', path: '/admin/raffles/:id/delete', handler: adminPage.confirmDelete },
  { method: 'POST', path: '/admin/raffles/:id/delete', handler: adminPage.remove },
  { method: 'GET', path: '/admin/raffles/:id/tickets', handler: adminPage.tickets },
  { method: 'POST', path: '/admin/tickets/:id/pay', handler: adminPage.pay },
  { method: 'GET', path: '/admin/raffles/:id/draw', handler: adminPage.confirmDraw },
  { method: 'POST', path: '/admin/raffles/:id/draw', handler: adminPage.draw },
].map((route) => ({ ...route, access: 'admin' }));
