const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}


// Desktop-only contact modal. On phones/tablets the original tel: and mailto: links work normally.
const contactModal = document.querySelector('#contact-modal');
const modalDialog = contactModal?.querySelector('.contact-modal-dialog');
const modalIcon = document.querySelector('#contact-modal-icon');
const modalKicker = document.querySelector('#contact-modal-kicker');
const modalTitle = document.querySelector('#contact-modal-title');
const modalText = document.querySelector('#contact-modal-text');
const modalValue = document.querySelector('#contact-modal-value');
const modalCopy = document.querySelector('#contact-modal-copy');
const modalAction = document.querySelector('#contact-modal-action');
let lastModalTrigger = null;
let modalCopyValue = '';

const isDesktopContactMode = () => window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)').matches;

const modalContent = {
  phone: {
    icon: '☎',
    kicker: 'Susisiekime',
    title: 'Paskambinkite',
    text: 'Mielai atsakysiu į klausimus dėl Jūsų objekto ir sertifikavimo.',
    value: '+370 673 129 18',
    copy: '+37067312918',
    copyLabel: 'Kopijuoti numerį',
    actionLabel: 'Skambinti',
    href: 'tel:+37067312918'
  },
  email: {
    icon: '@',
    kicker: 'Siųsti užklausą',
    title: 'Parašykite el. paštu',
    text: 'Atsiųskite objekto adresą, paskirtį, plotą ir turimus dokumentus.',
    value: 'zalatoriene@inbox.lt',
    copy: 'zalatoriene@inbox.lt',
    copyLabel: 'Kopijuoti el. paštą',
    actionLabel: 'Rašyti el. laišką',
    href: 'mailto:zalatoriene@inbox.lt?subject=Užklausa%20dėl%20energinio%20naudingumo%20sertifikato'
  }
};

function openContactModal(type, trigger) {
  if (!contactModal || !modalContent[type]) return;
  const data = modalContent[type];
  lastModalTrigger = trigger || null;
  modalCopyValue = data.copy;
  modalIcon.textContent = data.icon;
  modalKicker.textContent = data.kicker;
  modalTitle.textContent = data.title;
  modalText.textContent = data.text;
  modalValue.textContent = data.value;
  modalValue.href = data.href;
  modalCopy.textContent = data.copyLabel;
  modalAction.textContent = data.actionLabel;
  modalAction.href = data.href;
  contactModal.classList.add('is-open');
  contactModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => modalDialog?.focus());
}

function closeContactModal() {
  if (!contactModal) return;
  contactModal.classList.remove('is-open');
  contactModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  lastModalTrigger?.focus?.();
}

document.querySelectorAll('[data-contact-modal]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (!isDesktopContactMode()) return;
    event.preventDefault();
    openContactModal(link.dataset.contactModal, link);
  });
});

contactModal?.querySelectorAll('[data-modal-close]').forEach((el) => el.addEventListener('click', closeContactModal));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && contactModal?.classList.contains('is-open')) closeContactModal();
});

modalCopy?.addEventListener('click', async () => {
  if (!modalCopyValue) return;
  const original = modalCopy.textContent;
  try {
    await navigator.clipboard.writeText(modalCopyValue);
    modalCopy.textContent = 'Nukopijuota ✓';
  } catch (_) {
    const input = document.createElement('textarea');
    input.value = modalCopyValue;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
    modalCopy.textContent = 'Nukopijuota ✓';
  }
  setTimeout(() => { modalCopy.textContent = original; }, 1600);
});
