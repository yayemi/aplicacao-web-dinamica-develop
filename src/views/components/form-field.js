import { escapeHtml } from '../../utils/escape-html.js';

// Monta label, campo, dica e erro já ligados entre si.
// O aria-describedby faz o leitor de tela ler a dica e o erro junto com o campo.
export function formField({
  name,
  label,
  value = '',
  type = 'text',
  hint = '',
  error = '',
  required = true,
  attributes = '',
  options = [],
}) {
  const id = `field-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ');

  const sharedAttributes = [
    `id="${id}"`,
    `name="${name}"`,
    required ? 'required' : '',
    describedBy ? `aria-describedby="${describedBy}"` : '',
    error ? 'aria-invalid="true"' : '',
    attributes,
  ]
    .filter(Boolean)
    .join(' ');

  let control;

  if (type === 'textarea') {
    control = `<textarea class="field__control" rows="5" ${sharedAttributes}>${escapeHtml(value)}</textarea>`;
  } else if (type === 'select') {
    const choices = options
      .map((option) => {
        const selected = option.value === value ? ' selected' : '';
        return `<option value="${escapeHtml(option.value)}"${selected}>${escapeHtml(option.label)}</option>`;
      })
      .join('');

    control = `<select class="field__control" ${sharedAttributes}>${choices}</select>`;
  } else {
    control = `<input class="field__control" type="${type}" value="${escapeHtml(value)}" ${sharedAttributes}>`;
  }

  return `
    <div class="field${error ? ' field--invalid' : ''}">
      <label class="field__label" for="${id}">
        ${label}
        ${required ? '' : '<span class="field__optional">(opcional)</span>'}
      </label>
      ${hint ? `<p class="field__hint" id="${id}-hint">${hint}</p>` : ''}
      ${control}
      ${error ? `<p class="field__error" id="${id}-error"><i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> ${error}</p>` : ''}
    </div>
  `;
}
