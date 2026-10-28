// Resumo no topo do formulário, com um link para cada campo com erro.
// O role="alert" faz o leitor de tela anunciar o resumo assim que a página carrega.
export function errorSummary(messages) {
  const entries = Object.entries(messages);

  if (entries.length === 0) {
    return '';
  }

  const items = entries
    .map(([name, message]) => `<li><a href="#field-${name}">${message}</a></li>`)
    .join('');

  return `
    <div class="notice notice--error" role="alert">
      <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
      <div>
        <p><strong>Corrija ${entries.length === 1 ? 'o campo abaixo' : 'os campos abaixo'} para continuar.</strong></p>
        <ul>${items}</ul>
      </div>
    </div>
  `;
}

// Os controllers dizem só qual campo está errado e por quê ('invalid', 'taken').
// Cada tela tem o seu texto em português para cada caso.
export function translateErrors(errors, messages) {
  const translated = {};

  for (const [name, reason] of Object.entries(errors)) {
    translated[name] = messages[name]?.[reason] ?? messages[name]?.invalid ?? 'Confira este campo.';
  }

  return translated;
}
