// Depois de um POST, o servidor redireciona com ?notice=codigo.
// A mensagem vem desta lista, nunca da URL, para ninguém conseguir
// escrever um texto qualquer na tela mudando o endereço.
const NOTICES = {
  'logged-in': 'Você entrou na sua conta.',
  registered: 'Conta criada. Agora é só escolher seus números.',
  'logged-out': 'Você saiu da sua conta.',
  'ticket-reserved': 'Número reservado. Ele entra no sorteio assim que o pagamento for confirmado.',
  'raffle-created': 'Rifa criada.',
  'raffle-updated': 'Rifa atualizada.',
  'raffle-deleted': 'Rifa excluída.',
  'ticket-paid': 'Pagamento confirmado. O número já está concorrendo.',
  'raffle-drawn': 'Sorteio realizado.',
};

export function notice(code) {
  const message = NOTICES[code];

  if (!message) {
    return '';
  }

  return `
    <div class="notice notice--success" role="status">
      <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
      <p>${message}</p>
    </div>
  `;
}
