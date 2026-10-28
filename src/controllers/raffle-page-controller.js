import * as raffleModel from '../models/raffle-model.js';
import * as ticketModel from '../models/ticket-model.js';
import * as ticketService from '../services/ticket-service.js';
import { readFormBody, redirect, sendHtml, withNotice } from '../utils/http.js';
import { parseId } from '../utils/parse-id.js';
import { notFoundPage } from '../views/errors/error-page.js';
import { homePage } from '../views/raffles/home-page.js';
import { rafflePage } from '../views/raffles/raffle-page.js';
import { myTicketsPage } from '../views/tickets/my-tickets-page.js';

export async function home({ response, query, context }) {
  const search = query.get('search')?.trim() ?? '';
  const raffles = await raffleModel.findAll({ search });

  return sendHtml(response, 200, homePage(context, { raffles, search }));
}

async function loadRafflePage(raffleId, user) {
  const raffle = await raffleModel.findById(raffleId);

  if (!raffle) {
    return null;
  }

  const takenNumbers = await ticketModel.findTakenNumbers(raffleId);
  const winner = raffle.winnerTicketId ? await ticketModel.findWinner(raffle.winnerTicketId) : null;
  const myTickets = user
    ? (await ticketModel.findByUser(user.id)).filter((ticket) => ticket.raffle.id === raffleId)
    : [];

  return { raffle, takenNumbers, winner, myTickets };
}

export async function show({ response, params, context }) {
  const id = parseId(params.id);
  const data = id && (await loadRafflePage(id, context.user));

  if (!data) {
    return sendHtml(response, 404, notFoundPage(context));
  }

  return sendHtml(response, 200, rafflePage(context, data));
}

export async function reserve({ request, response, params, context, user }) {
  const raffleId = parseId(params.id);

  if (!raffleId) {
    return sendHtml(response, 404, notFoundPage(context));
  }

  const form = await readFormBody(request);
  const number = Number(form.number);

  const { error } = await ticketService.reserveTicket({ raffleId, userId: user.id, data: { number } });

  if (!error) {
    return redirect(response, withNotice(`/raffles/${raffleId}`, 'ticket-reserved'));
  }

  const data = await loadRafflePage(raffleId, user);

  if (!data) {
    return sendHtml(response, 404, notFoundPage(context));
  }

  return sendHtml(
    response,
    error.status,
    rafflePage(context, { ...data, reserveError: error.code, selectedNumber: number })
  );
}

export async function myTickets({ response, context, user }) {
  const tickets = await ticketModel.findByUser(user.id);
  return sendHtml(response, 200, myTicketsPage(context, { tickets }));
}
