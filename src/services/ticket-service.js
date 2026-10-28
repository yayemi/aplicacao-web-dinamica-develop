import * as raffleModel from '../models/raffle-model.js';
import * as ticketModel from '../models/ticket-model.js';
import { validateTicketNumber } from '../validators/ticket-validator.js';
import { firstError } from '../validators/helpers.js';
import { failure } from './failure.js';

export async function reserveTicket({ raffleId, userId, data }) {
  const raffle = await raffleModel.findById(raffleId);

  if (!raffle) {
    return failure(404, 'raffle-not-found', 'Raffle not found');
  }

  if (raffle.status !== 'open') {
    return failure(409, 'raffle-not-open', 'Raffle is not open for new tickets');
  }

  const { errors, value } = validateTicketNumber(data, raffle.totalTickets);

  if (errors) {
    return failure(400, 'invalid-number', firstError(errors));
  }

  try {
    const ticket = await ticketModel.create({ raffleId, userId, number: value.number });
    return { ticket };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return failure(409, 'number-taken', `Number ${value.number} is already taken`);
    }

    throw error;
  }
}
