import { randomInt } from 'node:crypto';
import * as raffleModel from '../models/raffle-model.js';
import * as ticketModel from '../models/ticket-model.js';
import { failure } from './failure.js';

export async function updateRaffle(id, data) {
  const current = await raffleModel.findById(id);

  if (!current) {
    return failure(404, 'raffle-not-found', 'Raffle not found');
  }

  if (current.status === 'drawn') {
    return failure(409, 'raffle-drawn', 'A drawn raffle cannot be changed');
  }

  const highestNumber = await ticketModel.findHighestNumber(id);

  if (data.totalTickets < highestNumber) {
    return failure(
      409,
      'total-below-taken',
      `Total tickets cannot be lower than ${highestNumber}, a number already taken`
    );
  }

  await raffleModel.update(id, data);
  return { raffle: await raffleModel.findById(id) };
}

export async function removeRaffle(id) {
  try {
    const deleted = await raffleModel.remove(id);

    if (!deleted) {
      return failure(404, 'raffle-not-found', 'Raffle not found');
    }

    return {};
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return failure(409, 'raffle-has-tickets', 'Raffle has tickets and cannot be deleted');
    }

    throw error;
  }
}

export async function drawRaffle(id) {
  const raffle = await raffleModel.findById(id);

  if (!raffle) {
    return failure(404, 'raffle-not-found', 'Raffle not found');
  }

  if (raffle.status === 'drawn') {
    return failure(409, 'already-drawn', 'Raffle has already been drawn');
  }

  const paidTicketIds = await ticketModel.findPaidIds(id);

  if (paidTicketIds.length === 0) {
    return failure(409, 'no-paid-tickets', 'There are no paid tickets to draw');
  }

  // randomInt usa o gerador criptográfico do Node. Math.random seria previsível.
  const winnerTicketId = paidTicketIds[randomInt(paidTicketIds.length)];
  const drawn = await raffleModel.markAsDrawn(id, winnerTicketId);

  if (!drawn) {
    return failure(409, 'already-drawn', 'Raffle has already been drawn');
  }

  return { winner: await ticketModel.findWinner(winnerTicketId) };
}
