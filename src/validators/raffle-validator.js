import { cleanText, isPlainObject, isValidDate } from './helpers.js';

const EDITABLE_STATUSES = ['open', 'closed'];

export function validateRaffle(data) {
  if (!isPlainObject(data)) {
    return { errors: { body: 'Body must be a JSON object' } };
  }

  const title = cleanText(data.title);
  const description = cleanText(data.description);
  const prize = cleanText(data.prize);
  const imageUrl = cleanText(data.imageUrl);
  const status = data.status ?? 'open';
  const errors = {};

  if (title.length < 3 || title.length > 120) {
    errors.title = 'Field title must have between 3 and 120 characters';
  }

  if (description.length < 10 || description.length > 2000) {
    errors.description = 'Field description must have between 10 and 2000 characters';
  }

  if (prize.length < 2 || prize.length > 150) {
    errors.prize = 'Field prize must have between 2 and 150 characters';
  }

  if (typeof data.ticketPrice !== 'number' || !Number.isFinite(data.ticketPrice) || data.ticketPrice <= 0) {
    errors.ticketPrice = 'Field ticketPrice must be a positive number';
  }

  if (!Number.isInteger(data.totalTickets) || data.totalTickets < 10 || data.totalTickets > 10000) {
    errors.totalTickets = 'Field totalTickets must be an integer between 10 and 10000';
  }

  if (!isValidDate(data.drawDate)) {
    errors.drawDate = 'Field drawDate must be a valid date in the format YYYY-MM-DD';
  }

  if (imageUrl && (!imageUrl.startsWith('https://') || imageUrl.length > 500)) {
    errors.imageUrl = 'Field imageUrl must be an https address with up to 500 characters';
  }

  if (!EDITABLE_STATUSES.includes(status)) {
    errors.status = 'Field status must be open or closed';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    value: {
      title,
      description,
      prize,
      ticketPrice: Math.round(data.ticketPrice * 100) / 100,
      totalTickets: data.totalTickets,
      drawDate: data.drawDate,
      imageUrl: imageUrl || null,
      status,
    },
  };
}
