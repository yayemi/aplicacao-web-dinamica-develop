// Sem JavaScript, o menu aparece aberto e tudo funciona.
// Com JavaScript, ele vira um botão que abre e fecha no celular.
document.documentElement.classList.add('has-js');

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');

  if (!toggle) {
    return;
  }

  const setOpen = (isOpen) => {
    toggle.setAttribute('aria-expanded', String(isOpen));
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
});
