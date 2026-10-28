const HTML_CHARACTERS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

// Todo texto que vem do banco ou do usuário passa por aqui antes de entrar no HTML.
// Sem isso, um título de rifa com <script> viraria código rodando na página.
export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => HTML_CHARACTERS[character]);
}
