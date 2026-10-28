const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatCurrency(value) {
  return currency.format(value);
}

// O banco devolve datas como '2026-12-20'. Na tela, o formato brasileiro.
export function formatDate(isoDate) {
  const [year, month, day] = isoDate.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

export function pluralize(count, singular, plural) {
  return `${count} ${count === 1 ? singular : plural}`;
}
