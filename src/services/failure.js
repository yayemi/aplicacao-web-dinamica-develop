// Os services não sabem se quem chamou foi a API ou uma tela.
// Eles só dizem o que deu errado: o status HTTP, um código e a mensagem.
// A API responde a mensagem; a tela usa o código para escolher o texto em português.
export function failure(status, code, message) {
  return { error: { status, code, message } };
}
