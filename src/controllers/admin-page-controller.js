import * as raffleModel from '../models/raffle-model.js';
import * as ticketModel from '../models/ticket-model.js';
import * as raffleService from '../services/raffle-service.js';
import { validateRaffle } from '../validators/raffle-validator.js';
import { readFormBody, redirect, sendHtml, withNotice } from '../utils/http.js';
import { parseId } from '../utils/parse-id.js';
import { notFoundPage } from '../views/errors/error-page.js';
import { adminRafflesPage } from '../views/admin/admin-raffles-page.js';
import { raffleFormPage } from '../views/admin/raffle-form-page.js';
import { deleteRafflePage, drawRafflePage } from '../views/admin/confirm-page.js';
import { raffleTicketsPage } from '../views/admin/raffle-tickets-page.js';

// Tudo que vem de um formulário chega como texto.
// Aqui o preço e a quantidade viram número antes de passar pelo mesmo validador da API.
function readRaffleForm(form) {
  const typed = String(form.ticketPrice ?? '').trim();
  const price = typed.includes(',') ? typed.replace(/\./g, '').replace(',', '.') : typed;

  return {
    title: form.title,
    prize: form.prize,
    description: form.description,
    ticketPrice: price === '' ? NaN : Number(price),
    totalTickets: form.totalTickets === '' ? NaN : Number(form.totalTickets),
    drawDate: form.drawDate,
    imageUrl: form.imageUrl,
    status: form.status,
  };
}

function markInvalid(errors) {
  return Object.fromEntries(Object.keys(errors).map((name) => [name, 'invalid']));
}

async function findRaffle(params) {
  const id = parseId(params.id);
  return id ? raffleModel.findById(id) : undefined;
}

export async function list({ response, context }) {
  const raffles = await raffleModel.findAll({});
  return sendHtml(response, 200, adminRafflesPage(context, { raffles }));
}

export function showCreate({ response, context }) {
  return sendHtml(response, 200, raffleFormPage(context, {}));
}

export async function create({ request, response, context }) {
  const form = await readFormBody(request);
  const { errors, value } = validateRaffle(readRaffleForm(form));

  if (errors) {
    return sendHtml(response, 400, raffleFormPage(context, { values: form, errors: markInvalid(errors) }));
  }

  await raffleModel.create(value);
  return redirect(response, withNotice('/admin', 'raffle-created'));
}

export async function showEdit({ response, params, context }) {
  const raffle = await findRaffle(params);

  if (!raffle) {
    return sendHtml(response, 404, notFoundPage(context));
  }

  const formError = raffle.status === 'drawn' ? 'raffle-drawn' : null;
  return sendHtml(response, 200, raffleFormPage(context, { raffle, values: raffle, formError }));
}

export async function update({ request, response, params, context }) {
  const raffle = await findRaffle(params);

  if (!raffle) {
    return sendHtml(response, 404, notFoundPage(context));
  }

  const form = await readFormBody(request);
  const { errors, value } = validateRaffle(readRaffleForm(form));

  if (errors) {
    return sendHtml(response, 400, raffleFormPage(context, { raffle, values: form, errors: markInvalid(errors) }));
  }

  const { error } = await raffleService.updateRaffle(raffle.id, value);

  if (error?.code === 'total-below-taken') {
    return sendHtml(response, 409, raffleFormPage(context, { raffle, values: form, errors: { totalTickets: 'belowTaken' } }));
  }

  if (error) {
    return sendHtml(response, error.status, raffleFormPage(context, { raffle, values: form, formError: error.code }));
  }

  return redirect(response, withNotice('/admin', 'raffle-updated'));
}

export async function confirmDelete({ response, params, context }) {
  const raffle = await findRaffle(params);

  if (!raffle) {
    return sendHtml(response, 404, notFoundPage(context));
  }

  return sendHtml(response, 200, deleteRafflePage(context, { raffle, blocked: raffle.soldTickets > 0 }));
}

export async function remove({ response, params, context }) {
  const raffle = await findRaffle(params);

  if (!raffle) {
    return sendHtml(response, 404, notFoundPage(context));
  }

  const { error } = await raffleService.removeRaffle(raffle.id);

  if (error) {
    return sendHtml(response, error.status, deleteRafflePage(context, { raffle, blocked: true }));
  }

  return redirect(response, withNotice('/admin', 'raffle-deleted'));
}

export async function tickets({ response, params, context }) {
  const raffle = await findRaffle(params);

  if (!raffle) {
    return sendHtml(response, 404, notFoundPage(context));
  }

  const raffleTickets = await ticketModel.findByRaffle(raffle.id);
  return sendHtml(response, 200, raffleTicketsPage(context, { raffle, tickets: raffleTickets }));
}

export async function pay({ response, params, context }) {
  const id = parseId(params.id);
  const ticket = id && (await ticketModel.findById(id));

  if (!ticket) {
    return sendHtml(response, 404, notFoundPage(context));
  }

  await ticketModel.markAsPaid(ticket.id);
  return redirect(response, withNotice(`/admin/raffles/${ticket.raffleId}/tickets`, 'ticket-paid'));
}

async function drawPageData(raffle) {
  const paidCount = (await ticketModel.findPaidIds(raffle.id)).length;

  if (raffle.status === 'drawn') {
    return { raffle, paidCount, blockedReason: 'already-drawn' };
  }

  return { raffle, paidCount, blockedReason: paidCount === 0 ? 'no-paid-tickets' : null };
}

export async function confirmDraw({ response, params, context }) {
  const raffle = await findRaffle(params);

  if (!raffle) {
    return sendHtml(response, 404, notFoundPage(context));
  }

  return sendHtml(response, 200, drawRafflePage(context, await drawPageData(raffle)));
}

export async function draw({ response, params, context }) {
  const raffle = await findRaffle(params);

  if (!raffle) {
    return sendHtml(response, 404, notFoundPage(context));
  }

  const { error } = await raffleService.drawRaffle(raffle.id);

  if (error) {
    const data = await drawPageData(raffle);
    return sendHtml(response, error.status, drawRafflePage(context, { ...data, blockedReason: error.code }));
  }

  return redirect(response, withNotice(`/raffles/${raffle.id}`, 'raffle-drawn'));
}
