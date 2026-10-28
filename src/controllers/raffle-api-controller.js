import * as raffleModel from '../models/raffle-model.js';
import * as ticketModel from '../models/ticket-model.js';
import * as raffleService from '../services/raffle-service.js';
import { validateRaffle } from '../validators/raffle-validator.js';
import { firstError } from '../validators/helpers.js';
import { readJsonBody, sendError, sendJson, sendNoContent } from '../utils/http.js';
import { parseId } from '../utils/parse-id.js';

const STATUSES = ['open', 'closed', 'drawn'];

export async function list({ response, query }) {
  const status = query.get('status');

  if (status !== null && !STATUSES.includes(status)) {
    return sendError(response, 400, 'Query status must be open, closed or drawn');
  }

  const raffles = await raffleModel.findAll({
    status,
    search: query.get('search')?.trim(),
  });

  return sendJson(response, 200, raffles);
}

export async function show({ response, params }) {
  const id = parseId(params.id);

  if (!id) {
    return sendError(response, 400, 'Id must be a positive integer');
  }

  const raffle = await raffleModel.findById(id);

  if (!raffle) {
    return sendError(response, 404, 'Raffle not found');
  }

  const takenNumbers = await ticketModel.findTakenNumbers(id);
  const winner = raffle.winnerTicketId ? await ticketModel.findWinner(raffle.winnerTicketId) : null;

  return sendJson(response, 200, { ...raffle, takenNumbers, winner });
}

export async function create({ request, response }) {
  const data = await readJsonBody(request);

  if (data === null) {
    return sendError(response, 400, 'Invalid JSON body');
  }

  const { errors, value } = validateRaffle(data);

  if (errors) {
    return sendError(response, 400, firstError(errors));
  }

  const raffle = await raffleModel.create(value);

  response.setHeader('Location', `/api/raffles/${raffle.id}`);
  return sendJson(response, 201, raffle);
}

export async function update({ request, response, params }) {
  const id = parseId(params.id);

  if (!id) {
    return sendError(response, 400, 'Id must be a positive integer');
  }

  const data = await readJsonBody(request);

  if (data === null) {
    return sendError(response, 400, 'Invalid JSON body');
  }

  const { errors, value } = validateRaffle(data);

  if (errors) {
    return sendError(response, 400, firstError(errors));
  }

  const { error, raffle } = await raffleService.updateRaffle(id, value);

  if (error) {
    return sendError(response, error.status, error.message);
  }

  return sendJson(response, 200, raffle);
}

export async function remove({ response, params }) {
  const id = parseId(params.id);

  if (!id) {
    return sendError(response, 400, 'Id must be a positive integer');
  }

  const { error } = await raffleService.removeRaffle(id);

  if (error) {
    return sendError(response, error.status, error.message);
  }

  return sendNoContent(response);
}

export async function draw({ response, params }) {
  const id = parseId(params.id);

  if (!id) {
    return sendError(response, 400, 'Id must be a positive integer');
  }

  const { error, winner } = await raffleService.drawRaffle(id);

  if (error) {
    return sendError(response, error.status, error.message);
  }

  return sendJson(response, 200, { raffleId: id, winner });
}
